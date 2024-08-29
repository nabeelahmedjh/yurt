import express from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { generatePassword } from "../utils/generate-pass.utils.js";

const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        return res.status(400).json({
          error: { message: info.message },
        });
      }

      if (err) {
        throw new Error(err);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: user._id,
          email: user.email,
          username: user.username,
          serversJoined: user.serversJoined,
        };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.status(200).json({ token });
      });
    } catch (error) {
      return res.status(400).json({
        error: {
          message: error.message,
        }
      });
    }
  })(req, res, next);
};

const signUp = async (req, res) => {
  const { email, password, username } = req.body;
  const interests = req.body.interests || [];
  const avatar = req.file ? {
    name: req.fileoriginalname,
    size: req.filesize,
    type: req.filemimetype,
    source: req.filepath,
  } : null;

  if (!email || !password || !username) {
    return res.status(400).json({
      error: {
        message: "email, password and username are required"
      },
    });
  }
  try {
    const passwordHash = await generatePassword(password);
    const user = await User.create({
      username,
      email,
      password: passwordHash,
      interests: interests,
      avatar: avatar,
    });
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    if (error.code === 11000 && error.keyValue && error.keyValue.email) {
      return res.status(409).json({
          error: { message: 'Email already exists. Please use a different email address.' },
      });
  } else {

      return res.status(500).json({
          error: { message: error.message },
      });
  }
  }
};

const updateUser = async (req, res) => {

  const { id } = req.params;
  let interests = req.body.interests || [];
  const avatar = req.file ? {
    name: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
    source: req.file.path,
  } : null;

  if (id !== req.user.user._id.toString()) {
    return res.status(403).json({
      error: {
        message: "Forbidden"
      },
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: {
        message: "Invalid user id"
      },
    });
  }

  if (typeof interests === 'string') {
    interests = JSON.parse(interests);
  }


  try {
    const user = await User.findByIdAndUpdate(id, { interests: interests, avatar: avatar }, { new: true }).populate("interests");

    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found"
        },
      });
    }
    return res.status(200).json({
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message
      },
    });
  }

};

const getProfile = async (req, res) => {
  res.status(200).json({
    data: req.user
  });
};

export default {
  login,
  signUp,
  getProfile,
  updateUser,
};

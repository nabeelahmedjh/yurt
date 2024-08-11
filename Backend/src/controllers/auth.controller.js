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

  if (!email || !password  || !username) {
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
    });


    res.status(200).json({
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
};

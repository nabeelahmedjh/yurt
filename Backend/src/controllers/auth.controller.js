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
          message: info.message,
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

        return res.json({ token });
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  })(req, res, next);
};

const signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }
  try {
    const passwordHash = await generatePassword(password);
    const user = await User.create({
      email,
      password: passwordHash,
    });


    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

export default {
  login,
  signUp,
  getProfile,
};

import express from "express";
// import authService from '../services/auth.service.js';
import mongoose from "mongoose";
import User from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";

const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        res.status(404).json({
          message: "Provided Credentials are wrong",
        });
      }

      if (err) {
        res.status(400).json({
          message: err,
        });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  login,
  signUp,
};

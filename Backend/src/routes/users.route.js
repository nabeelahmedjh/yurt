import express from "express";
import authController from "../controllers/auth.controller.js";
import passport from "passport";

// import "../strategy/local-strategy.js";

const router = express.Router();

// router.post("/login", authController.login);
// router.post("/register", authController.registerUser);

router.post("/signup", authController.signUp);

router.post("/login", authController.login);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authController.getProfile
);
export default router;

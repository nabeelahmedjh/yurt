import express from "express";
import authController from "../controllers/auth.controller.js";
import passport from "passport";
import "../strategy/google-strategy.js";
import jwt from 'jsonwebtoken';
import upload from "../config/multerConfig.js";




const router = express.Router();

router.post("/signup", authController.signUp);
router.put("/users/:id", passport.authenticate("jwt", { session: false }), upload.single('avatar'), authController.updateUser);
router.post("/login", authController.login);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authController.getProfile
);
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    const body = {
      _id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      serversJoined: req.user.serversJoined,
    };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

    res.send(`
      <script>
      window.opener.postMessage({ token: '${token}' }, '*');
      window.close();
      </script>
    `);
  });

export default router;

import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import authRoute from "./auth.route.js";
import serversRoute from "./servers.route.js";
import spacesRoute from "./spaces.route.js";
import passport from "passport";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/spaces", passport.authenticate("jwt", { session: false }), spacesRoute);
router.use("/servers", passport.authenticate("jwt", { session: false }), serversRoute);
export default router;

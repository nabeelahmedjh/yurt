import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import usersRoute from "./users.route.js";
import serversRoute from "./servers.route.js";
// import {auth} from ""
import spacesRoute from "./spaces.route.js";
import passport from "passport";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(import.meta.filename.split("/routes")[0]);

const router = express.Router();

// router.use('/space', require('./space.routes.js'));
// router.use('/user', require('./user.routes.js'));
// router.use('/message', require('./message.routes.js'));
router.use("/auth", usersRoute);
router.use("/spaces", passport.authenticate("jwt", { session: false }), spacesRoute);
router.use("/servers", passport.authenticate("jwt", { session: false }), serversRoute);
export default router;

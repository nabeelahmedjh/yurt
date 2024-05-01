import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import usersRoute from "./users.route.js";
// import {auth} from ""
import spacesRoute from "./spaces.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(import.meta.filename.split("/routes")[0]);

const router = express.Router();

// router.use('/space', require('./space.routes.js'));
// router.use('/user', require('./user.routes.js'));
// router.use('/message', require('./message.routes.js'));
router.use("/auth", usersRoute);
router.use("/spaces", spacesRoute);
router.get("/", (req, res) => {
  console.log(req.session);
  if (req.session.authenticated) {
    res.sendFile(path.join(__dirname, "src/public/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "src/public/login.html"));
  }
});
export default router;

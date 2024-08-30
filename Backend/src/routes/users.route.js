import express from "express";
import { usersController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";
import multerErrorHandler from "../utils/multerErrorHandler.js";

const router = express.Router();


router.get("/", usersController.getAllUsers);
router.get("/profile", usersController.getUser);
router.put("/profile", usersController.updateUser);
router.patch("/profile/avatar", upload.single("avatar"), multerErrorHandler , usersController.updateAvatar);
router.delete("/profile", usersController.deleteUser);


export default router;
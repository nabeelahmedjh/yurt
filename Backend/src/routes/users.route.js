import express from "express";
import { usersController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";
import multerErrorHandler from "../utils/multerErrorHandler.js";

const router = express.Router();


router.get("/", usersController.getAllUsers);
router.get("/me/profile", usersController.getCurrentUser);
router.put("/me/profile", usersController.updateUser);
router.patch("/me/profile/avatar", upload.single("avatar"), multerErrorHandler , usersController.updateAvatar);
router.delete("/me/profile", usersController.deleteUser);


export default router;
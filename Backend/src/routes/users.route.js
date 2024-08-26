import express from "express";
import { usersController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";

const router = express.Router();


router.get("/", usersController.getAllUsers);

export default router;
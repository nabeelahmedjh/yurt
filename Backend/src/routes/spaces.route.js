import express from "express";
import { spacesController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from space route");
});

router.post("/", spacesController.createSpace);
router.post("/:spaceId/messages", upload.array("attachment", 5), spacesController.sendMessageInSpace);
router.get("/:spaceId/messages", spacesController.getMessagesInSpace);
export default router;

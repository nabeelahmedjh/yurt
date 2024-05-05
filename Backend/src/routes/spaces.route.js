import express from "express";
import { spacesController } from "../controllers/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from space route");
});

router.post("/", spacesController.createSpace);
router.post("/:spaceId/messages", spacesController.sendMessageInSpace);

export default router;

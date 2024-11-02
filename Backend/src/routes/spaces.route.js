import express from "express";
import { spacesController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";
import  multerErrorHandler from "../utils/multerErrorHandler.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from space route");
});

router.post("/",upload.single("spaceImage"), multerErrorHandler, spacesController.createSpace);
router.put("/:spaceId", upload.single("spaceImage"), multerErrorHandler, spacesController.updateSpace)
router.post("/:spaceId/messages", upload.array("attachment", 5), multerErrorHandler, spacesController.sendMessageInSpace);
router.get("/:spaceId/messages", spacesController.getMessagesInSpace);
router.get("/:spaceId/botMessages", spacesController.getBotMessagesInSpace);
router.delete("/:spaceId", spacesController.deleteSpace);
router.delete("/:spaceId/clear", spacesController.clearBotSpace);
router.post("/:spaceId/join", spacesController.generateMeetingToken)
// router.delete("/messages/:Id");
// // spaces/meassages/:Id

export default router;

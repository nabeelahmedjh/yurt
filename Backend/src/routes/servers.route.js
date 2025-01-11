import express from "express";
import { serversController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";
import multerErrorHandler from "../utils/multerErrorHandler.js";
const router = express.Router();

router.get("/", serversController.getServers);
router.post("/", upload.fields([{name: 'banner', maxCount: 1}, {name: 'serverImage', maxCount: 1}]),multerErrorHandler, serversController.createServer);
router.put("/:serverId", upload.fields([{name: 'banner', maxCount: 1}, {name: 'serverImage', maxCount: 1}]) ,multerErrorHandler ,serversController.updateServer);
router.delete("/:serverId", serversController.deleteServer);
router.get("/:serverId",serversController.getServer);
router.post("/:serverId/spaces", upload.single("spaceImage"), multerErrorHandler , serversController.createSpace);
router.put("/:serverId/join", serversController.joinServer);
router.put("/join/:inviteCode", serversController.joinServerWithInviteCode);
router.put("/:serverId/leave", serversController.leaveServer);
router.post("/:serverId/invite", serversController.generateInviteCode);
// router.get("/invite/invitecode", serversController.generateInviteCode);

router.get("/:serverId/members", serversController.getMembers);

export default router;

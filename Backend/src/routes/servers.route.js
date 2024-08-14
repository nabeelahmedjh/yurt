import express from "express";
import { serversController } from "../controllers/index.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

router.get("/", serversController.getServers);
router.post("/", upload.single('banner'), serversController.createServer);
// router.put("/:serverId", serversController.updateServer);
// router.delete("/:serverId", serversController.deleteServer);
// router.get("/:serverId", serversController.getServer);
router.post("/:serverId/spaces", serversController.createSpace);
router.put("/:serverId/join", serversController.joinServer);
router.get("/:serverId/members", serversController.getMembers);

export default router;

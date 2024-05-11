import express from "express";
import { serversController } from "../controllers/index.js";
const router = express.Router();

router.get("/", serversController.getServers);
router.post("/", serversController.createServer);
router.post("/:serverId/spaces", serversController.createSpace);

export default router;

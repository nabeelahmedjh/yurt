import express from "express";
import { whiteboardController } from "../controllers/index.js";
import { makeOrLoadRoom } from "../whiteboard/rooms.js";

const router = express.Router();

// router.get("/", whiteboardController.getAllWhiteboards);
router.get("/:id", whiteboardController.getWhiteboardById);
// router.post("/", whiteboardController.createWhiteboard);
router.put("/:id", whiteboardController.updateWhiteboard);
router.get("/unfurl", whiteboardController.handleUnFurl);
// router.delete("/:id", whiteboardController.deleteWhiteboard);

// router.get("/connect/:id", {websocket: true}, async(req, res) => {
//     const roomId = req.params.roomId
// 		// The sessionId is passed from the client as a query param,
// 		// you need to extract it and pass it to the room.
// 		const sessionId = req.query.sessionId

// 		// Here we make or get an existing instance of TLSocketRoom for the given roomId
// 		const room = await makeOrLoadRoom(roomId)
// 		// and finally connect the socket to the room
// 		room.handleSocketConnect({ sessionId, socket })
// });


export default router;

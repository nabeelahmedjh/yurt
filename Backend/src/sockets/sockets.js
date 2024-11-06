import Space from "../models/space.model.js";
import User from "../models/user.model.js";
import { spacesService } from "../services/index.js";
import { botService } from "../services/index.js";
import { makeOrLoadRoom } from "../whiteboard/rooms.js";
class WebSockets {
  users = [];
  connection = (socket) => {
    console.log("Socket io socket ID", socket.id);
    // console.log("socket instance: ", socket.user.user._id);


    // event fired when the chat room is disconnected
    // socket.on("disconnect", () => {
    //   this.users = this.users.filter((user) => user.socketId !== socket.id);
    // });
    // add identity of user mapped to the socket id
    console.log("hello");


   const subscribeToUsersSpacesOnSocketConnection = async  (userId) => {
      this.users.push({
        socketId: socket.id,
        userId: userId,
      });
      console.log("hello");
      console.log(this.users, "From the identity event");
      this.subscribeToSpacesOfJoinedServers(userId);
      this.subscribeToBotSpace(userId);
      // socket.emit("subscribeToSpacesOfJoinedServers", userId);
    }


    subscribeToUsersSpacesOnSocketConnection(socket.user.user._id);


    // subscribe person to chat & other user as well
    // in our case we will be subscribing a user to a space
    socket.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      socket.join(room);
    });

    socket.on("subscribeToSpace", (spaceId) => {
      socket.join(spaceId);
    });

    socket.on("subscribeToSpacesOfJoinedServers", (userId) => {

      console.log("herhehrhere")

      const spaces = spacesService.getJoinedSpacesIds(userId);
      const userSockets = this.users.filter(
        (user) => user.userId === userId
      );
      userSockets.map((userInfo) => {
        const socketConn = global.io.sockets.connected(userInfo.socketId);
        if (socketConn) {
          spaces.map((space) => {
            socketConn.join(space);
          })

        }
      });
    });

    // mute a chat room
    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });

    socket.on("logout", (userId) => {
      this.users = this.users.filter((user) => user.userId !== userId);
    });


    // ----------------- Whiteboard -----------------
    // Handle the /connect/:roomId WebSocket connection
    socket.on("join-room", async ({ roomId, sessionId }) => {
      try {
        if (!roomId || !sessionId) {
          socket.emit("error", { message: "Invalid roomId or sessionId" });
          return;
        }
  
        // Create or load room
        const room = await makeOrLoadRoom(roomId);
        // Connect socket to the room
        room.handleSocketConnect({ sessionId, socket });
  
        console.log(`User with sessionId ${sessionId} joined room ${roomId}`);
        // Emit a success response or room data
        socket.emit("joined-room", { roomId, sessionId });
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join the room" });
      }
    });

    socket.on('BOT_MESSAGE', async(eventPayload) => {
      console.log(eventPayload);
      if (typeof eventPayload === 'string') {
        try {
            eventPayload = JSON.parse(eventPayload);  
        } catch (error) {
            console.error("Error parsing eventPayload:", error);
            return; 
        }
    }
      console.log(eventPayload.spaceId);

      try {
        
        const resp = await botService.processBotMessage(eventPayload, socket.user.user._id);
        // console.log("Bot response:", resp);
        // console.log("Space ID:", eventPayload.spaceId);
        if (eventPayload.spaceId) {
          global.io.to(eventPayload.spaceId).emit("BOT_RESPONSE", resp);
          console.log(resp)
          console.log("Event emitted to room:", eventPayload.spaceId);
        } else {
          console.log("Invalid spaceId");
        }
      } catch (error) {
        console.log("Error processing bot message", error);
      }
    })

    socket.on("DELETE_MESSAGE", async (eventPayload) => {
      const messageId = eventPayload.messageId;
      console.log("messageObject", eventPayload);
      try {
        const deletedMessage = await spacesService.deleteMessageInSpace(messageId, socket.user.user._id);
        global.io.to(deletedMessage.spaceId.toString()).emit("DELETED_MESSAGE", deletedMessage);
      } catch (error) {
        console.log("unable to delete message", error)
      }
    });

    socket.on("NEW_MESSAGE", (eventPayload) => {
      console.log("received a new message: ", eventPayload);
    })
  }



  subscribeToSpacesOfJoinedServers = async (userId) => {

    let spaces;
    try {
      spaces = await spacesService.getJoinedSpacesIds(userId);
    } catch (error) {
      console.log(error)
    }
    console.log(spaces)
    const userSockets = this.users.filter(
      (user) => user.userId === userId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.sockets.get(userInfo.socketId);
      if (socketConn) {
        spaces.map((space) => {
          socketConn.join(space.toString());
          console.log("Joined", space, socketConn.id, userInfo.socketId)
        })

      }
    });
  }


  subscribeToBotSpace = async (userId) => {

    const user = await User.findById({_id: userId})
    console.log("===============USER HERE========================")
    console.log(user);
    const botSpace = user.botSpace.toString();
    console.log(botSpace);

    const userSockets = this.users.filter(
      (user) => user.userId === userId
    );

    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.sockets.get(userInfo.socketId);
      if (socketConn) {
        socketConn.join(botSpace)
        console.log("Joined bot space: ", botSpace, socketConn.id, userInfo.socketId);
      }
    });


  }





  // subscribeOtherUser(room, otherUserId) {
  //   const userSockets = this.users.filter(
  //     (user) => user.userId === otherUserId
  //   );
  //   userSockets.map((userInfo) => {
  //     const socketConn = global.io.sockets.connected(userInfo.socketId);
  //     if (socketConn) {
  //       socketConn.join(room);
  //     }
  //   });
  // }

}
export default new WebSockets();

import { spacesService } from "../services/index.js";
import { makeOrLoadRoom } from "../whiteboard/rooms.js";
class WebSockets {
  users = [];
  connection = (socket) => {
    console.log("Socket io socket ID", socket.id);
    // event fired when the chat room is disconnected
    // socket.on("disconnect", () => {
    //   this.users = this.users.filter((user) => user.socketId !== socket.id);
    // });
    // add identity of user mapped to the socket id
    socket.on("identity", (userId) => {
      this.users.push({
        socketId: socket.id,
        userId: userId,
      });
      console.log(this.users, "From the identity event");
      this.subscribeToSpacesOfJoinedServers(userId);
      // socket.emit("subscribeToSpacesOfJoinedServers", userId);
    });
    // subscribe person to chat & other user as well
    // in our case we will be subscribing a user to a space
    socket.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      socket.join(room);
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

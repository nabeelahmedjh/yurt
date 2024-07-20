import { spacesService } from "../services/index.js";
class WebSockets {
  users = [];
  connection(socket) {
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

      socket.emit("subscribeToSpacesOfJoinedServers", userId);
    });
    // subscribe person to chat & other user as well
    // in our case we will be subscribing a user to a space
    socket.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      socket.join(room);
    });


    socket.on("subscribeToSpacesOfJoinedServers", (userId) => {

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

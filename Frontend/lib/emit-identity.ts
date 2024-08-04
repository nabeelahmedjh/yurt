import { getCookie } from "cookies-next";
import { USER_ID } from "@/constants";
import SocketService from "@/services/SocketService";

export const emitIdentity = () => {
  const userId = getCookie(USER_ID);

  if (userId) {
    const socket = SocketService.connect();
    console.log("Emitting identity", userId);
    socket.emit("identity", userId);
  }
};

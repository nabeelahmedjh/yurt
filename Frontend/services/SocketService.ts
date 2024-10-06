import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { TOKEN } from "@/constants";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private readonly SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://127.0.0.1:3000";
  private readonly token = getCookie(TOKEN);
  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.SOCKET_URL, {
        auth: {
          token: this.token,
        },
      });
    }
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default SocketService.getInstance();

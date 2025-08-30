// utils/socket.ts
import { io, Socket } from "socket.io-client";
import localStorageService from "@/utils/localStorageService";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  const token = localStorageService.getItem("accessToken");

  if (!socket || !socket.connected) {
    socket = io(import.meta.env.VITE_SOCKET_API_BASE_URL, {
      transports: ["websocket"],
      query: {
        authorization: `Bearer ${token}`,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });
  }

  return socket;
};

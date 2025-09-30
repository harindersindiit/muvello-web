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
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false, // Don't force new connection if one exists
    });

    // Add connection error handling
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);

      // If it's an authentication error, try to refresh token
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        console.log("Authentication error, attempting to refresh token...");
        // You might want to trigger a token refresh here
        // or redirect to login
      }
    });

    // Add disconnect handling
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);

      // If disconnected due to server issues, try to reconnect
      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        socket.connect();
      }
    });
  }

  return socket;
};

// Function to manually reconnect if needed
export const reconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket.connect();
  }
};

// Function to check if socket is connected
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

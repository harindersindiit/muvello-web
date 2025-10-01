// utils/socket.ts
import { io, Socket } from "socket.io-client";
import localStorageService from "@/utils/localStorageService";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  const token = localStorageService.getItem("accessToken");

  console.log("getSocket called with token:", token ? "present" : "null");

  // If no token is available, don't create a socket connection
  if (!token) {
    console.warn(
      "No access token available, cannot establish socket connection"
    );
    return null;
  }

  // If socket exists and is connected, return it
  if (socket && socket.connected) {
    console.log("Returning existing connected socket");
    return socket;
  }

  // If socket exists but is disconnected, try to reconnect it
  if (socket && !socket.connected) {
    console.log("Socket exists but disconnected, attempting to reconnect");
    socket.connect();
    return socket;
  }

  // Create new socket if none exists
  console.log("Creating new socket connection");
  if (!socket) {
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
        // Disconnect and clear socket to prevent further attempts
        disconnectSocket();
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

// Function to disconnect and clear socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Function to manually reconnect if needed
export const reconnectSocket = (): Socket | null => {
  const token = localStorageService.getItem("accessToken");

  console.log("reconnectSocket called with token:", token ? "present" : "null");

  if (!token) {
    console.warn("No access token available, cannot reconnect socket");
    return null;
  }

  // Always disconnect and recreate on manual reconnect
  if (socket) {
    console.log("Disconnecting existing socket for manual reconnection");
    socket.disconnect();
    socket = null;
  }

  return getSocket();
};

// Function to check if socket is connected
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

// Function to check if socket is available (has token and socket instance)
export const isSocketAvailable = (): boolean => {
  const token = localStorageService.getItem("accessToken");
  return !!(token && socket);
};

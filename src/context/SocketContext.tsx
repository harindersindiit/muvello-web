// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket, reconnectSocket } from "../socket";
import { Socket } from "socket.io-client";
import localStorageService from "@/utils/localStorageService";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAvailable: boolean;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAvailable: false,
  reconnect: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Monitor token changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorageService.getItem("accessToken");
      setToken(currentToken);
    };

    // Check immediately
    checkToken();

    // Set up an interval to check for token changes
    // This is a fallback in case localStorage changes aren't detected
    const tokenCheckInterval = setInterval(checkToken, 1000);

    // Listen for storage events (when localStorage changes in another tab)
    window.addEventListener("storage", checkToken);

    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  // Initialize or reinitialize socket when token becomes available
  useEffect(() => {
    const initializeSocket = () => {
      console.log(
        "SocketContext: Attempting to initialize socket with token:",
        token ? "present" : "null"
      );

      const socket = getSocket();
      console.log(
        "SocketContext: getSocket returned:",
        socket ? "socket instance" : "null"
      );

      setSocketInstance(socket);

      // If no socket is available, don't set up event listeners
      if (!socket) {
        console.log(
          "SocketContext: No socket available, not setting up event listeners"
        );
        setIsConnected(false);
        setIsAvailable(false);
        return;
      }

      // Socket is available
      setIsAvailable(true);

      // Track connection state
      const handleConnect = () => {
        console.log("Socket connected:", socket.id);
        setIsConnected(true);
      };

      const handleDisconnect = (reason: string) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      };

      const handleConnectError = (error: Error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      };

      const handleReconnect = (attemptNumber: number) => {
        console.log("Socket reconnecting, attempt:", attemptNumber);
      };

      const handleReconnectError = (error: Error) => {
        console.error("Socket reconnection error:", error);
      };

      // Set up event listeners only if socket exists
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("reconnect", handleReconnect);
      socket.on("reconnect_error", handleReconnectError);

      // Example: Global notifications
      socket.on("global_notification", (data) => {
        console.log("Global Notification:", data);
        // You can show toast or update global state here
      });

      // Set initial connection state
      setIsConnected(socket.connected);

      return () => {
        // Remove event listeners but don't disconnect the socket
        // as it might be used by other components
        if (socket) {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("connect_error", handleConnectError);
          socket.off("reconnect", handleReconnect);
          socket.off("reconnect_error", handleReconnectError);
          socket.off("global_notification");
        }
      };
    };

    // Only initialize socket if we have a token
    if (token) {
      initializeSocket();
    } else {
      console.log("SocketContext: No token available, waiting for token...");
      // Clean up existing socket if token is removed
      setSocketInstance(null);
      setIsConnected(false);
      setIsAvailable(false);
    }
  }, [token]); // Depend on token changes

  // Manual reconnect function
  const reconnect = () => {
    console.log("SocketContext: Manual reconnect requested");
    const newSocket = reconnectSocket();
    const currentToken = localStorageService.getItem("accessToken");
    setToken(currentToken);
    if (newSocket) {
      setSocketInstance(newSocket);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketInstance, isConnected, isAvailable, reconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

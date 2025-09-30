// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../socket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setSocketInstance(socket);

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

    // Set up event listeners
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
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("reconnect_error", handleReconnectError);
      socket.off("global_notification");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

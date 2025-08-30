// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../socket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    setSocketInstance(socket);

    // Example: Global notifications
    socket.on("global_notification", (data) => {
      console.log("Global Notification:", data);
      // You can show toast or update global state here
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

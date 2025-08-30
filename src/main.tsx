import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "@/context/UserContext";
import { SocketProvider } from "@/context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SocketProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </SocketProvider>
  // </StrictMode>
);

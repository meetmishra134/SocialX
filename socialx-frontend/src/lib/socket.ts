import { io } from "socket.io-client";
export const socket = io("/", {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  transports: ["websocket", "polling"],
});

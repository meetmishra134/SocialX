import { io } from "socket.io-client";
export const socket = io("/", {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

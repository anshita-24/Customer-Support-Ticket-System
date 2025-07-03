// src/socket.js
import { io } from "socket.io-client";

console.log("📡 Socket connecting..."); // 👈 add this

const socket = io("http://localhost:5050", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 2000,
});

socket.on("connect", () => {
  console.log("✅ Socket connected from socket.js:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;

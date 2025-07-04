import { io } from "socket.io-client";

console.log("📡 Socket connecting...");

const socket = io("http://localhost:5050", {
  reconnectionAttempts: 5,
  timeout: 2000,
  // ⚠️ Do not force transports here — allow fallback to polling
});

socket.on("connect", () => {
  console.log("✅ Socket connected from socket.js:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;

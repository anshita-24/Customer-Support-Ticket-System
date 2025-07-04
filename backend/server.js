const dotenv = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const http = require("http"); // ✅ Needed for socket.io
const { Server } = require("socket.io");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON
app.use("/uploads", express.static("uploads"));



// Routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Customer Support Ticket System is running 🚀");
});

// ✅ Setup HTTP server
const server = http.createServer(app);

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// ✅ Store connected users and handle socket events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Join room based on ticket ID
  socket.on("joinRoom", (ticketId) => {
    socket.join(ticketId);
    console.log(`Socket ${socket.id} joined room ${ticketId}`);
  });

  // Handle sending a new message
  socket.on("sendMessage", ({ ticketId, message }) => {
    console.log("📨 Message received:", message);

    // Broadcast to others in the same room
    io.to(ticketId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

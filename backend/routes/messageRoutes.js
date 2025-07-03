const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// POST: Send a message
router.post("/", protect, async (req, res) => {
  try {
    const { ticketId, message } = req.body;
    const newMessage = await Message.create({
      ticketId,
      sender: req.user._id,
      message,
    });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// GET: Get all messages for a ticket
router.get("/:ticketId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId }).populate("sender", "name email");
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

module.exports = router;

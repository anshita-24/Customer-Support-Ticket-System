const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// Get messages for a ticket
router.get("/:ticketId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId }).populate("sender", "name role");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error getting messages" });
  }
});

// Save new message
router.post("/", protect, async (req, res) => {
  const { ticketId, message } = req.body;

  try {
    const newMessage = new Message({
      ticketId,
      sender: req.user._id,
      message,
    });

    const saved = await newMessage.save();
    const populated = await saved.populate("sender", "name role");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Error saving message" });
  }
});

module.exports = router;

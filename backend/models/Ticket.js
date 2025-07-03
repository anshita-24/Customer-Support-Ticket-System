const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true
  },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null // not assigned yet
},

  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved", "closed"],
    default: "open"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  tags: {
    type: [String], // e.g., ["payment", "bug"]
    default: []
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Ticket", ticketSchema);

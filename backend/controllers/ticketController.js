const Ticket = require("../models/Ticket");
const User = require("../models/User"); // Needed to verify agent
const { sendTicketConfirmation } = require("../utils/email"); // ✅ added

// Create Ticket
exports.createTicket = async (req, res) => {
  const { subject, message, priority, tags } = req.body;
  const attachment = req.file?.filename; // ✅ get uploaded file name if exists

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required" });
  }

  try {
    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      message,
      priority,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      attachment, // ✅ Save uploaded file name
    });

    // ✅ Send confirmation email via Ethereal
    const user = await User.findById(req.user._id);
    await sendTicketConfirmation(user.email, subject);

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Tickets for Customer
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Assigned Tickets (Agent)
exports.getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Tickets (Admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign Ticket to Agent (Admin)
exports.assignTicket = async (req, res) => {
  const { ticketId, agentId } = req.body;

  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Invalid agent ID or not an agent" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.assignedTo = agentId;
    ticket.status = "in-progress";

    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      message: "✅ Ticket assigned successfully",
      ticket: populatedTicket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Ticket Status or Priority
exports.updateTicketStatus = async (req, res) => {
  const { ticketId } = req.params;
  const { status, priority } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

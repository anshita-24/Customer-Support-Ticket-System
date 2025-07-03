const express = require("express");
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicket,
  getAssignedTickets,
  updateTicketStatus
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// CUSTOMER ROUTES
router.post("/", protect, createTicket);           // Create ticket
router.get("/", protect, getMyTickets);            // Get own tickets

// AGENT ROUTES
router.get("/assigned", protect, authorizeRoles("agent"), getAssignedTickets); // Agent views assigned tickets
router.put("/:ticketId", protect, authorizeRoles("agent", "admin"), updateTicketStatus); // Update status/priority

// ADMIN ROUTES
router.get("/admin/all", protect, authorizeRoles("admin"), getAllTickets); // View all tickets
router.post("/assign", protect, authorizeRoles("admin"), assignTicket);    // Assign ticket to agent

module.exports = router;

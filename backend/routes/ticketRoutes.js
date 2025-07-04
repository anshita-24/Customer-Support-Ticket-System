const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicket,
  getAssignedTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const Ticket = require("../models/Ticket"); // ✅ For rating

// 📁 Setup Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------ CUSTOMER ROUTES ------------------ //
router.post("/", protect, upload.single("attachment"), createTicket); // ✅ Updated to support file upload
router.get("/", protect, getMyTickets);

// ✅ Rate a ticket
router.put("/rate/:ticketId", protect, authorizeRoles("customer"), async (req, res) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (!ticket.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to rate this ticket" });
    }

    if (ticket.status !== "resolved" && ticket.status !== "closed") {
      return res.status(400).json({ message: "Can only rate resolved or closed tickets" });
    }

    ticket.rating = rating;
    await ticket.save();
    res.json({ message: "Rating submitted", ticket });
  } catch (err) {
    res.status(500).json({ message: "Error submitting rating" });
  }
});

// ------------------ AGENT ROUTES ------------------ //
router.get("/assigned", protect, authorizeRoles("agent"), getAssignedTickets);
router.put("/:ticketId", protect, authorizeRoles("agent", "admin"), updateTicketStatus);

// ------------------ ADMIN ROUTES ------------------ //
router.get("/admin/all", protect, authorizeRoles("admin"), getAllTickets);
router.post("/assign", protect, authorizeRoles("admin"), assignTicket);

module.exports = router;

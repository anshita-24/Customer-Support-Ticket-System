const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllAgents
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin-only route to get agents
router.get("/agents", protect, authorizeRoles("admin"), getAllAgents);

module.exports = router;

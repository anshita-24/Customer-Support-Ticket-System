
const express = require("express");
const router = express.Router();
const { getAllAgents } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// userRoutes.js
router.get("/agents", protect, authorizeRoles("admin"), getAllAgents);


module.exports = router;

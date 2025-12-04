const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// GET /api/dashboard - Get user dashboard
router.get("/", authenticateToken, getDashboard);

module.exports = router;

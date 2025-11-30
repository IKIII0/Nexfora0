const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  createNewOrder,
  getUserOrders,
  getOrder
} = require("../controllers/orderController");

const router = express.Router();

// Apply authentication middleware to all user order routes
router.use(authenticateToken);

// POST /api/orders - Create new order (user)
router.post("/", createNewOrder);

// GET /api/orders - Get current user's orders (user)
router.get("/", getUserOrders);

// GET /api/orders/:id - Get specific order by ID (user)
router.get("/:id", getOrder);

module.exports = router;

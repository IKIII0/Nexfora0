const express = require("express");
const {
  createNewOrder,
  getUserOrders,
  getOrder,
  updateStatus,
  getAllOrdersController,
  cancelOrderController,
  authenticateToken
} = require("../controllers/orderController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/orders - Create new order
router.post("/", createNewOrder);

// GET /api/orders - Get current user's orders
router.get("/", getUserOrders);

// GET /api/orders/all - Get all orders (admin only)
router.get("/all", getAllOrdersController);

// GET /api/orders/:id - Get specific order by ID
router.get("/:id", getOrder);

// PUT /api/orders/:id/status - Update order status (admin only)
router.put("/:id/status", updateStatus);

// PUT /api/orders/:id/cancel - Cancel order
router.put("/:id/cancel", cancelOrderController);

module.exports = router;

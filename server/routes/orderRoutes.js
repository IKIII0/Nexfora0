const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  checkout,
  getUserOrders,
  getOrder,
  uploadPaymentProof,
  cancelUserOrder,
  getOrderStats
} = require("../controllers/orderController");

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authenticateToken);

// POST /api/orders/checkout - Process checkout
router.post("/checkout", checkout);

// GET /api/orders - Get current user's orders
router.get("/", getUserOrders);

// GET /api/orders/stats - Get user order statistics
router.get("/stats", getOrderStats);

// GET /api/orders/:id - Get specific order by ID
router.get("/:id", getOrder);

// PUT /api/orders/:id/payment - Upload payment proof
router.put("/:id/payment", uploadPaymentProof);

// PUT /api/orders/:id/cancel - Cancel order
router.put("/:id/cancel", cancelUserOrder);

module.exports = router;

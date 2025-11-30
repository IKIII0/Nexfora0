const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllOrders, verifyOrder, cancelOrder } = require('../controllers/adminController');

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// GET /api/admin/orders - Get all orders (admin only)
router.get('/orders', getAllOrders);

// PUT /api/admin/orders/:orderId/verify - Verify order (admin only)
router.put('/orders/:orderId/verify', verifyOrder);

// PUT /api/admin/orders/:orderId/cancel - Cancel order (admin only)
router.put('/orders/:orderId/cancel', cancelOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllOrders, verifyOrder, cancelOrder } = require('../controllers/adminController');

// Get all orders (admin only)
router.get('/orders', authenticateToken, getAllOrders);

// Verify order (admin only)
router.put('/orders/:orderId/verify', authenticateToken, verifyOrder);

// Cancel order (admin only)
router.put('/orders/:orderId/cancel', authenticateToken, cancelOrder);

module.exports = router;

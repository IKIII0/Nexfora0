const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getOrders,
  verifyOrder,
  cancelOrder,
  getSalesReport,
  getRevenue
} = require('../controllers/adminController');

// Apply authentication and admin middleware to all admin routes
router.use(authenticateToken);
router.use(isAdmin);

// GET /api/admin/dashboard - Get admin dashboard
router.get('/dashboard', getDashboard);

// GET /api/admin/orders - Get all orders
router.get('/orders', getOrders);

// PUT /api/admin/orders/:orderId/verify - Verify order
router.put('/orders/:orderId/verify', verifyOrder);

// PUT /api/admin/orders/:orderId/cancel - Cancel order
router.put('/orders/:orderId/cancel', cancelOrder);

// GET /api/admin/sales-report - Get product sales report
router.get('/sales-report', getSalesReport);

// GET /api/admin/revenue - Get revenue report
router.get('/revenue', getRevenue);

module.exports = router;

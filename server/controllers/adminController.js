const pool = require('../db');

// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
    console.log('=== Admin Controller Debug ===');
    console.log('req.user:', req.user);
    console.log('req.user.email:', req.user?.email);
    console.log('req.user.role:', req.user?.role);
    
    // Check if user is admin
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: 'Authentication required'
      });
    }
    
    if (req.user.email !== 'admin@nexfora.com') {
      console.log('Access denied for email:', req.user.email);
      return res.status(403).json({
        status: "error",
        code: 403,
        message: 'Access denied. Admin only.'
      });
    }

    console.log('Admin access granted for:', req.user.email);

    const query = `
      SELECT id_pesanan, nama_lengkap, email, tipe_pemesanan, nama_paket, total, catatan, status, created_at, updated_at
      FROM pemesanan 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Orders retrieved successfully",
      orders: result.rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Failed to fetch orders"
    });
  }
};

// Verify order (mark as completed)
const verifyOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: 'Authentication required'
      });
    }
    
    if (req.user.email !== 'admin@nexfora.com') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: 'Access denied. Admin only.'
      });
    }

    const { orderId } = req.params;
    
    // Check if order exists
    const orderCheck = await pool.query(
      'SELECT id_pesanan, status FROM pemesanan WHERE id_pesanan = $1',
      [orderId]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderCheck.rows[0];
    
    if (order.status !== 'Dalam Proses') {
      return res.status(400).json({ error: 'Order can only be verified if status is pending' });
    }

    // Update order status to completed
    const updateQuery = `
      UPDATE pemesanan 
      SET status = 'Selesai', updated_at = CURRENT_TIMESTAMP 
      WHERE id_pesanan = $1 
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [orderId]);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: 'Order verified successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: 'Failed to verify order'
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: 'Authentication required'
      });
    }
    
    if (req.user.email !== 'admin@nexfora.com') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: 'Access denied. Admin only.'
      });
    }

    const { orderId } = req.params;
    
    // Check if order exists
    const orderCheck = await pool.query(
      'SELECT id_pesanan, status FROM pemesanan WHERE id_pesanan = $1',
      [orderId]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderCheck.rows[0];
    
    if (order.status !== 'Dalam Proses') {
      return res.status(400).json({ error: 'Order can only be cancelled if status is pending' });
    }

    // Update order status to cancelled
    const updateQuery = `
      UPDATE pemesanan 
      SET status = 'Dibatalkan', updated_at = CURRENT_TIMESTAMP 
      WHERE id_pesanan = $1 
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [orderId]);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: 'Order cancelled successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: 'Failed to cancel order'
    });
  }
};

module.exports = {
  getAllOrders,
  verifyOrder,
  cancelOrder,
};

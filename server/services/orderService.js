const pool = require("../db");

// Create new order
async function createOrder(userId, orderData) {
  const { tipe_pemesanan, nama_paket, total, catatan, nama_lengkap, email } = orderData;
  
  const query = `
    INSERT INTO pemesanan (user_id, tipe_pemesanan, nama_paket, total, catatan, nama_lengkap, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  
  const values = [userId, tipe_pemesanan, nama_paket, total, catatan, nama_lengkap, email];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Get all orders for a specific user
async function getOrdersByUserId(userId) {
  const query = `
    SELECT id_pesanan, tipe_pemesanan, nama_paket, total, status, 
           DATE(tanggal) as tanggal, catatan, nama_lengkap, email, created_at
    FROM pemesanan 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Get order by ID
async function getOrderById(orderId) {
  const query = `
    SELECT id_pesanan, user_id, tipe_pemesanan, nama_paket, total, status, 
           DATE(tanggal) as tanggal, catatan, nama_lengkap, email, created_at, updated_at
    FROM pemesanan 
    WHERE id_pesanan = $1
  `;
  
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
}

// Update order status
async function updateOrderStatus(orderId, status) {
  const query = `
    UPDATE pemesanan 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id_pesanan = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [status, orderId]);
  return result.rows[0];
}

// Get all orders (for admin)
async function getAllOrders() {
  const query = `
    SELECT p.*, u.nama_lengkap as user_name, u.email as user_email
    FROM pemesanan p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Delete order (soft delete by changing status to cancelled)
async function cancelOrder(orderId) {
  const query = `
    UPDATE pemesanan 
    SET status = 'Dibatalkan', updated_at = CURRENT_TIMESTAMP
    WHERE id_pesanan = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
}

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
};

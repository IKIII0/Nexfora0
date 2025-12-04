const pool = require("../db");

// Process checkout using stored procedure
async function processCheckout(checkoutData) {
  const {
    user_id,
    product_ids,
    quantities,
    nama_lengkap,
    email,
    phone,
    payment_method,
    catatan
  } = checkoutData;

  const query = `
    CALL process_checkout($1, $2, $3, $4, $5, $6, $7, $8, NULL, NULL)
  `;

  const values = [
    user_id,
    product_ids,
    quantities,
    nama_lengkap,
    email,
    phone,
    payment_method,
    catatan || null
  ];

  const result = await pool.query(query, values);
  
  // Get the created order
  const orderQuery = `
    SELECT * FROM pemesanan 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  const orderResult = await pool.query(orderQuery, [user_id]);
  return orderResult.rows[0];
}

// Get all orders for a specific user
async function getOrdersByUserId(userId) {
  const query = `
    SELECT * FROM v_order_summary
    WHERE user_id = $1 
    ORDER BY tanggal DESC
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Get order by ID with items
async function getOrderById(orderId) {
  const orderQuery = `
    SELECT * FROM v_order_summary
    WHERE id_pesanan = $1
  `;
  
  const itemsQuery = `
    SELECT * FROM order_items
    WHERE order_id = $1
  `;
  
  const orderResult = await pool.query(orderQuery, [orderId]);
  const itemsResult = await pool.query(itemsQuery, [orderId]);
  
  if (orderResult.rows.length === 0) {
    return null;
  }
  
  return {
    ...orderResult.rows[0],
    items: itemsResult.rows
  };
}

// Update order status
async function updateOrderStatus(orderId, status, paymentProof = null) {
  let query = `
    UPDATE pemesanan 
    SET status = $1
  `;
  
  const values = [status, orderId];
  
  if (paymentProof) {
    query += `, payment_proof = $3`;
    values.splice(2, 0, paymentProof);
  }
  
  query += ` WHERE id_pesanan = $2 RETURNING *`;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Get all orders (for admin) using view
async function getAllOrders() {
  const query = `
    SELECT * FROM v_order_summary
    ORDER BY tanggal DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Cancel order
async function cancelOrder(orderId) {
  const query = `
    UPDATE pemesanan 
    SET status = 'Dibatalkan'
    WHERE id_pesanan = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
}

// Get user order statistics
async function getUserOrderStats(userId) {
  const query = `SELECT * FROM get_user_order_stats($1)`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

module.exports = {
  processCheckout,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  getUserOrderStats
};

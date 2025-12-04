const pool = require("../db");

// Get reviews for a product
async function getProductReviews(productId) {
  const query = `
    SELECT 
      r.*,
      u.nama_lengkap as user_name,
      u.email as user_email
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `;
  
  const result = await pool.query(query, [productId]);
  return result.rows;
}

// Get user reviews
async function getUserReviews(userId) {
  const query = `
    SELECT 
      r.*,
      p.nama_produk,
      p.id as product_id
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Create review
async function createReview(reviewData) {
  const { product_id, user_id, order_id, rating, comment } = reviewData;
  
  // Check if user already reviewed this product for this order
  const checkQuery = `
    SELECT id FROM reviews 
    WHERE product_id = $1 AND user_id = $2 AND order_id = $3
  `;
  const checkResult = await pool.query(checkQuery, [product_id, user_id, order_id]);
  
  if (checkResult.rows.length > 0) {
    throw new Error('You have already reviewed this product for this order');
  }
  
  // Check if order is completed and contains this product
  const orderCheckQuery = `
    SELECT p.id_pesanan
    FROM pemesanan p
    JOIN order_items oi ON p.id_pesanan = oi.order_id
    WHERE p.id_pesanan = $1 
      AND p.user_id = $2 
      AND p.status = 'Selesai'
      AND oi.product_id = $3
  `;
  const orderCheckResult = await pool.query(orderCheckQuery, [order_id, user_id, product_id]);
  
  const is_verified = orderCheckResult.rows.length > 0;
  
  const query = `
    INSERT INTO reviews (product_id, user_id, order_id, rating, comment, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const result = await pool.query(query, [
    product_id,
    user_id,
    order_id || null,
    rating,
    comment || null,
    is_verified
  ]);
  
  return result.rows[0];
}

// Update review
async function updateReview(reviewId, userId, reviewData) {
  const { rating, comment } = reviewData;
  
  // Check if review belongs to user
  const checkQuery = `SELECT user_id FROM reviews WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [reviewId]);
  
  if (checkResult.rows.length === 0) {
    throw new Error('Review not found');
  }
  
  if (checkResult.rows[0].user_id !== userId) {
    throw new Error('You can only update your own reviews');
  }
  
  const query = `
    UPDATE reviews 
    SET rating = $1, comment = $2
    WHERE id = $3
    RETURNING *
  `;
  
  const result = await pool.query(query, [rating, comment, reviewId]);
  return result.rows[0];
}

// Delete review
async function deleteReview(reviewId, userId) {
  // Check if review belongs to user
  const checkQuery = `SELECT user_id FROM reviews WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [reviewId]);
  
  if (checkResult.rows.length === 0) {
    throw new Error('Review not found');
  }
  
  if (checkResult.rows[0].user_id !== userId) {
    throw new Error('You can only delete your own reviews');
  }
  
  const query = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [reviewId]);
  return result.rows[0];
}

module.exports = {
  getProductReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview
};

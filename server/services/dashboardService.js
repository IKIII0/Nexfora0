const pool = require("../db");

// Get admin dashboard statistics
async function getAdminDashboard() {
  // Total revenue
  const revenueQuery = `SELECT calculate_total_revenue() as total_revenue`;
  const revenueResult = await pool.query(revenueQuery);
  
  // Monthly revenue
  const monthlyRevenueQuery = `
    SELECT calculate_total_revenue(
      DATE_TRUNC('month', CURRENT_TIMESTAMP),
      CURRENT_TIMESTAMP
    ) as monthly_revenue
  `;
  const monthlyRevenueResult = await pool.query(monthlyRevenueQuery);
  
  // Order statistics
  const orderStatsQuery = `
    SELECT 
      COUNT(*) as total_orders,
      COUNT(*) FILTER (WHERE status = 'Selesai') as completed_orders,
      COUNT(*) FILTER (WHERE status = 'Dalam Proses') as pending_orders,
      COUNT(*) FILTER (WHERE status = 'Menunggu Pembayaran') as waiting_payment,
      COUNT(*) FILTER (WHERE status = 'Dibatalkan') as cancelled_orders
    FROM pemesanan
  `;
  const orderStatsResult = await pool.query(orderStatsQuery);
  
  // User statistics
  const userStatsQuery = `
    SELECT 
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
      COUNT(*) FILTER (WHERE role = 'user') as user_count,
      COUNT(*) FILTER (WHERE is_active = true) as active_users
    FROM users
  `;
  const userStatsResult = await pool.query(userStatsQuery);
  
  // Product statistics
  const productStatsQuery = `
    SELECT 
      COUNT(*) as total_products,
      COUNT(*) FILTER (WHERE is_active = true) as active_products,
      AVG(rating) as avg_rating,
      SUM(total_reviews) as total_reviews
    FROM products
  `;
  const productStatsResult = await pool.query(productStatsQuery);
  
  // Recent orders
  const recentOrdersQuery = `
    SELECT * FROM v_order_summary 
    ORDER BY tanggal DESC 
    LIMIT 10
  `;
  const recentOrdersResult = await pool.query(recentOrdersQuery);
  
  // Top selling products
  const topProductsQuery = `
    SELECT * FROM v_product_sales 
    ORDER BY total_sold DESC 
    LIMIT 5
  `;
  const topProductsResult = await pool.query(topProductsQuery);
  
  // Daily sales (last 7 days)
  const dailySalesQuery = `
    SELECT * FROM v_daily_sales 
    WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY sale_date DESC
  `;
  const dailySalesResult = await pool.query(dailySalesQuery);
  
  return {
    revenue: {
      total: revenueResult.rows[0].total_revenue,
      monthly: monthlyRevenueResult.rows[0].monthly_revenue
    },
    orders: orderStatsResult.rows[0],
    users: userStatsResult.rows[0],
    products: productStatsResult.rows[0],
    recent_orders: recentOrdersResult.rows,
    top_products: topProductsResult.rows,
    daily_sales: dailySalesResult.rows
  };
}

// Get user dashboard
async function getUserDashboard(userId) {
  const query = `SELECT * FROM v_user_dashboard WHERE id = $1`;
  const result = await pool.query(query, [userId]);
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  
  // Get user order stats
  const statsQuery = `SELECT * FROM get_user_order_stats($1)`;
  const statsResult = await pool.query(statsQuery, [userId]);
  
  // Get recent orders
  const ordersQuery = `
    SELECT * FROM v_order_summary 
    WHERE user_id = $1 
    ORDER BY tanggal DESC 
    LIMIT 5
  `;
  const ordersResult = await pool.query(ordersQuery, [userId]);
  
  return {
    user: result.rows[0],
    stats: statsResult.rows[0],
    recent_orders: ordersResult.rows
  };
}

// Get revenue report
async function getRevenueReport(startDate, endDate) {
  const query = `
    SELECT calculate_total_revenue($1::TIMESTAMP, $2::TIMESTAMP) as total_revenue
  `;
  
  const result = await pool.query(query, [startDate || null, endDate || null]);
  
  // Get detailed breakdown
  const detailQuery = `
    SELECT 
      DATE(tanggal) as date,
      COUNT(*) as total_orders,
      SUM(total) as daily_revenue
    FROM pemesanan
    WHERE status = 'Selesai'
      AND ($1::TIMESTAMP IS NULL OR tanggal >= $1::TIMESTAMP)
      AND ($2::TIMESTAMP IS NULL OR tanggal <= $2::TIMESTAMP)
    GROUP BY DATE(tanggal)
    ORDER BY date DESC
  `;
  
  const detailResult = await pool.query(detailQuery, [startDate || null, endDate || null]);
  
  return {
    total_revenue: result.rows[0].total_revenue,
    daily_breakdown: detailResult.rows
  };
}

module.exports = {
  getAdminDashboard,
  getUserDashboard,
  getRevenueReport
};

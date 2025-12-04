const pool = require("../db");

// Get all products with filters
async function getAllProducts(filters = {}) {
  let query = `
    SELECT p.*, c.nama_kategori, c.tipe as kategori_tipe
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
  `;
  
  const values = [];
  let paramCount = 1;
  
  if (filters.category_id) {
    query += ` AND p.category_id = $${paramCount}`;
    values.push(filters.category_id);
    paramCount++;
  }
  
  if (filters.tipe) {
    query += ` AND c.tipe = $${paramCount}`;
    values.push(filters.tipe);
    paramCount++;
  }
  
  if (filters.level) {
    query += ` AND p.level = $${paramCount}`;
    values.push(filters.level);
    paramCount++;
  }
  
  if (filters.min_price) {
    query += ` AND p.harga >= $${paramCount}`;
    values.push(filters.min_price);
    paramCount++;
  }
  
  if (filters.max_price) {
    query += ` AND p.harga <= $${paramCount}`;
    values.push(filters.max_price);
    paramCount++;
  }
  
  if (filters.search) {
    query += ` AND (p.nama_produk ILIKE $${paramCount} OR p.deskripsi ILIKE $${paramCount})`;
    values.push(`%${filters.search}%`);
    paramCount++;
  }
  
  query += ` ORDER BY p.rating DESC, p.total_reviews DESC`;
  
  const result = await pool.query(query, values);
  return result.rows;
}

// Get product by ID
async function getProductById(productId) {
  const query = `
    SELECT p.*, c.nama_kategori, c.tipe as kategori_tipe
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;
  
  const result = await pool.query(query, [productId]);
  return result.rows[0];
}

// Get product sales report (using view)
async function getProductSalesReport() {
  const query = `SELECT * FROM v_product_sales ORDER BY total_revenue DESC`;
  const result = await pool.query(query);
  return result.rows;
}

// Get product popularity score
async function getProductPopularity(productId) {
  const query = `SELECT get_product_popularity($1) as popularity_score`;
  const result = await pool.query(query, [productId]);
  return result.rows[0].popularity_score;
}

// Create product (admin only)
async function createProduct(productData) {
  const {
    category_id,
    nama_produk,
    deskripsi,
    harga,
    durasi,
    level,
    max_peserta,
    stok
  } = productData;
  
  const query = `
    INSERT INTO products (
      category_id, nama_produk, deskripsi, harga, durasi, 
      level, max_peserta, stok
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const values = [
    category_id,
    nama_produk,
    deskripsi,
    harga,
    durasi || null,
    level || null,
    max_peserta || null,
    stok || 0
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Update product (admin only)
async function updateProduct(productId, productData) {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  const allowedFields = [
    'nama_produk', 'deskripsi', 'harga', 'durasi', 
    'level', 'max_peserta', 'stok', 'is_active'
  ];
  
  allowedFields.forEach(field => {
    if (productData[field] !== undefined) {
      fields.push(`${field} = $${paramCount}`);
      values.push(productData[field]);
      paramCount++;
    }
  });
  
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }
  
  values.push(productId);
  
  const query = `
    UPDATE products 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Delete product (soft delete)
async function deleteProduct(productId) {
  const query = `
    UPDATE products 
    SET is_active = false
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [productId]);
  return result.rows[0];
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductSalesReport,
  getProductPopularity,
  createProduct,
  updateProduct,
  deleteProduct
};

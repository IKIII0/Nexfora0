const pool = require("../db");

// Get all categories
async function getAllCategories(tipe = null) {
  let query = `
    SELECT * FROM categories 
    WHERE is_active = true
  `;
  
  const values = [];
  
  if (tipe) {
    query += ` AND tipe = $1`;
    values.push(tipe);
  }
  
  query += ` ORDER BY nama_kategori ASC`;
  
  const result = await pool.query(query, values);
  return result.rows;
}

// Get category by ID
async function getCategoryById(categoryId) {
  const query = `SELECT * FROM categories WHERE id = $1`;
  const result = await pool.query(query, [categoryId]);
  return result.rows[0];
}

// Get category with product count
async function getCategoriesWithProductCount() {
  const query = `
    SELECT 
      c.*,
      COUNT(p.id) as total_products
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.nama_kategori ASC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

// Create category (admin only)
async function createCategory(categoryData) {
  const { nama_kategori, deskripsi, tipe } = categoryData;
  
  const query = `
    INSERT INTO categories (nama_kategori, deskripsi, tipe)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const result = await pool.query(query, [nama_kategori, deskripsi, tipe]);
  return result.rows[0];
}

// Update category (admin only)
async function updateCategory(categoryId, categoryData) {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  const allowedFields = ['nama_kategori', 'deskripsi', 'tipe', 'is_active'];
  
  allowedFields.forEach(field => {
    if (categoryData[field] !== undefined) {
      fields.push(`${field} = $${paramCount}`);
      values.push(categoryData[field]);
      paramCount++;
    }
  });
  
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }
  
  values.push(categoryId);
  
  const query = `
    UPDATE categories 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Delete category (soft delete)
async function deleteCategory(categoryId) {
  const query = `
    UPDATE categories 
    SET is_active = false
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [categoryId]);
  return result.rows[0];
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoriesWithProductCount,
  createCategory,
  updateCategory,
  deleteCategory
};

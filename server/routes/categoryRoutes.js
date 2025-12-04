const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const {
  getCategories,
  getCategoriesWithCount,
  getCategory,
  createNewCategory,
  updateCategoryData,
  deleteCategoryData
} = require("../controllers/categoryController");

const router = express.Router();

// Public routes
// GET /api/categories - Get all categories
router.get("/", getCategories);

// GET /api/categories/with-count - Get categories with product count
router.get("/with-count", getCategoriesWithCount);

// GET /api/categories/:id - Get category by ID
router.get("/:id", getCategory);

// Admin routes
// POST /api/categories - Create category (admin only)
router.post("/", authenticateToken, isAdmin, createNewCategory);

// PUT /api/categories/:id - Update category (admin only)
router.put("/:id", authenticateToken, isAdmin, updateCategoryData);

// DELETE /api/categories/:id - Delete category (admin only)
router.delete("/:id", authenticateToken, isAdmin, deleteCategoryData);

module.exports = router;

const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProduct,
  getPopularity,
  createNewProduct,
  updateProductData,
  deleteProductData
} = require("../controllers/productController");

const router = express.Router();

// Public routes
// GET /api/products - Get all products with filters
router.get("/", getProducts);

// GET /api/products/:id - Get product by ID
router.get("/:id", getProduct);

// GET /api/products/:id/popularity - Get product popularity
router.get("/:id/popularity", getPopularity);

// Admin routes
// POST /api/products - Create product (admin only)
router.post("/", authenticateToken, isAdmin, createNewProduct);

// PUT /api/products/:id - Update product (admin only)
router.put("/:id", authenticateToken, isAdmin, updateProductData);

// DELETE /api/products/:id - Delete product (admin only)
router.delete("/:id", authenticateToken, isAdmin, deleteProductData);

module.exports = router;

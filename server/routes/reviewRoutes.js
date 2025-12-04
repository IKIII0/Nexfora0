const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getReviewsByProduct,
  getReviewsByUser,
  createNewReview,
  updateUserReview,
  deleteUserReview
} = require("../controllers/reviewController");

const router = express.Router();

// Public routes
// GET /api/reviews/product/:productId - Get reviews for a product
router.get("/product/:productId", getReviewsByProduct);

// Protected routes (require authentication)
// GET /api/reviews/user - Get current user's reviews
router.get("/user", authenticateToken, getReviewsByUser);

// POST /api/reviews - Create review
router.post("/", authenticateToken, createNewReview);

// PUT /api/reviews/:id - Update review
router.put("/:id", authenticateToken, updateUserReview);

// DELETE /api/reviews/:id - Delete review
router.delete("/:id", authenticateToken, deleteUserReview);

module.exports = router;

const {
  getProductReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview
} = require("../services/reviewService");

// Get product reviews
async function getReviewsByProduct(req, res) {
  try {
    const productId = req.params.productId;
    const reviews = await getProductReviews(productId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Review produk berhasil diambil",
      data: reviews
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get user reviews
async function getReviewsByUser(req, res) {
  try {
    const userId = req.user.id;
    const reviews = await getUserReviews(userId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Review user berhasil diambil",
      data: reviews
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Create review
async function createNewReview(req, res) {
  try {
    const userId = req.user.id;
    const reviewData = {
      user_id: userId,
      ...req.body
    };
    
    const review = await createReview(reviewData);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Review berhasil dibuat",
      data: review
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: err.message
    });
  }
}

// Update review
async function updateUserReview(req, res) {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    const review = await updateReview(reviewId, userId, req.body);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Review berhasil diupdate",
      data: review
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: err.message
    });
  }
}

// Delete review
async function deleteUserReview(req, res) {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    const review = await deleteReview(reviewId, userId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Review berhasil dihapus",
      data: review
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: err.message
    });
  }
}

module.exports = {
  getReviewsByProduct,
  getReviewsByUser,
  createNewReview,
  updateUserReview,
  deleteUserReview
};

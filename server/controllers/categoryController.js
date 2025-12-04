const {
  getAllCategories,
  getCategoryById,
  getCategoriesWithProductCount,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../services/categoryService");

// Get all categories
async function getCategories(req, res) {
  try {
    const tipe = req.query.tipe;
    const categories = await getAllCategories(tipe);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Kategori berhasil diambil",
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get categories with product count
async function getCategoriesWithCount(req, res) {
  try {
    const categories = await getCategoriesWithProductCount();
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Kategori dengan jumlah produk berhasil diambil",
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get category by ID
async function getCategory(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    
    if (!category) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Kategori tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Kategori berhasil diambil",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Create category (admin only)
async function createNewCategory(req, res) {
  try {
    const category = await createCategory(req.body);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Kategori berhasil dibuat",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Update category (admin only)
async function updateCategoryData(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await updateCategory(categoryId, req.body);
    
    if (!category) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Kategori tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Kategori berhasil diupdate",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Delete category (admin only)
async function deleteCategoryData(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await deleteCategory(categoryId);
    
    if (!category) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Kategori tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Kategori berhasil dihapus",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

module.exports = {
  getCategories,
  getCategoriesWithCount,
  getCategory,
  createNewCategory,
  updateCategoryData,
  deleteCategoryData
};

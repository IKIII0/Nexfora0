const {
  getAllProducts,
  getProductById,
  getProductSalesReport,
  getProductPopularity,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../services/productService");

// Get all products with filters
async function getProducts(req, res) {
  try {
    const filters = {
      category_id: req.query.category_id,
      tipe: req.query.tipe,
      level: req.query.level,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      search: req.query.search
    };
    
    const products = await getAllProducts(filters);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Produk berhasil diambil",
      data: products
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get product by ID
async function getProduct(req, res) {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    
    if (!product) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Produk tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Produk berhasil diambil",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get product popularity
async function getPopularity(req, res) {
  try {
    const productId = req.params.id;
    const popularity = await getProductPopularity(productId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Popularitas produk berhasil diambil",
      data: { popularity_score: popularity }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Create product (admin only)
async function createNewProduct(req, res) {
  try {
    const product = await createProduct(req.body);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Produk berhasil dibuat",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Update product (admin only)
async function updateProductData(req, res) {
  try {
    const productId = req.params.id;
    const product = await updateProduct(productId, req.body);
    
    if (!product) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Produk tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Produk berhasil diupdate",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Delete product (admin only)
async function deleteProductData(req, res) {
  try {
    const productId = req.params.id;
    const product = await deleteProduct(productId);
    
    if (!product) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Produk tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Produk berhasil dihapus",
      data: product
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
  getProducts,
  getProduct,
  getPopularity,
  createNewProduct,
  updateProductData,
  deleteProductData
};

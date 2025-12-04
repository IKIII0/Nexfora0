const {
  processCheckout,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrderStats
} = require("../services/orderService");

// Process checkout
async function checkout(req, res) {
  try {
    const userId = req.user.id;
    const checkoutData = {
      user_id: userId,
      ...req.body
    };
    
    const newOrder = await processCheckout(checkoutData);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Checkout berhasil",
      data: newOrder
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get current user's orders
async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil diambil",
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get specific order by ID
async function getOrder(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Pesanan tidak ditemukan"
      });
    }

    // Only allow order owner or admin to view
    if (order.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Akses ditolak"
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil diambil",
      data: order
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Update order payment proof
async function uploadPaymentProof(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const { payment_proof } = req.body;
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Pesanan tidak ditemukan"
      });
    }
    
    if (order.user_id !== userId) {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Akses ditolak"
      });
    }
    
    const updatedOrder = await updateOrderStatus(orderId, 'Dalam Proses', payment_proof);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Bukti pembayaran berhasil diupload",
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Cancel order
async function cancelUserOrder(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Pesanan tidak ditemukan"
      });
    }
    
    if (order.user_id !== userId) {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Akses ditolak"
      });
    }
    
    if (order.status === 'Selesai') {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Pesanan yang sudah selesai tidak bisa dibatalkan"
      });
    }
    
    const cancelledOrder = await cancelOrder(orderId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil dibatalkan",
      data: cancelledOrder
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
}

// Get user order statistics
async function getOrderStats(req, res) {
  try {
    const userId = req.user.id;
    const stats = await getUserOrderStats(userId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Statistik pesanan berhasil diambil",
      data: stats
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
  checkout,
  getUserOrders,
  getOrder,
  uploadPaymentProof,
  cancelUserOrder,
  getOrderStats
};

const jwt = require("jsonwebtoken");
const {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} = require("../services/orderService");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Invalid or expired token"
      });
    }
    req.user = user;
    next();
  });
};

// Create new order
async function createNewOrder(req, res) {
  try {
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const userId = req.user.id;
    
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Request body is empty or missing"
      });
    }
    
    const { tipe_pemesanan, nama_paket, total, catatan, nama_lengkap, email } = req.body;

    // Validate required fields
    if (!tipe_pemesanan || !nama_paket || !nama_lengkap || !email) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing required fields: tipe_pemesanan, nama_paket, nama_lengkap, email"
      });
    }

    // Validate tipe_pemesanan
    if (!['kelas', 'jasa'].includes(tipe_pemesanan)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "tipe_pemesanan must be either 'kelas' or 'jasa'"
      });
    }

    const order = await createOrder(userId, {
      tipe_pemesanan,
      nama_paket,
      total: total || 0,
      catatan,
      nama_lengkap,
      email
    });

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Order created successfully",
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

// Get user's orders
async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Orders retrieved successfully",
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
        message: "Order not found"
      });
    }

    // Check if the order belongs to the authenticated user or if user is admin
    if (order.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Access denied"
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Order retrieved successfully",
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

// Update order status (admin only)
async function updateStatus(req, res) {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate status
    if (!['Selesai', 'Dalam Proses', 'Dibatalkan'].includes(status)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Status must be one of: Selesai, Dalam Proses, Dibatalkan"
      });
    }

    const order = await updateOrderStatus(orderId, status);
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Order not found"
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Order status updated successfully",
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

// Get all orders (admin only)
async function getAllOrdersController(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Admin access required"
      });
    }

    const orders = await getAllOrders();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "All orders retrieved successfully",
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

// Cancel order
async function cancelOrderController(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Order not found"
      });
    }

    // Only allow order owner or admin to cancel
    if (order.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Access denied"
      });
    }

    const cancelledOrder = await cancelOrder(orderId);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Order cancelled successfully",
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

module.exports = {
  createNewOrder,
  getUserOrders,
  getOrder,
  updateStatus,
  getAllOrdersController,
  cancelOrderController,
  authenticateToken
};

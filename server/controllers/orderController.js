const {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} = require("../services/orderService");

// Create new order
async function createNewOrder(req, res) {
  try {
    console.log('Request body:', req.body);
    const userId = req.user.id;
    const orderData = { ...req.body, user_id: userId };
    
    const newOrder = await createOrder(orderData);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Order created successfully",
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message
    });
  }
};

// Get current user's orders
const getUserOrders = async (req, res) => {
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
};

// Get specific order by ID
const getOrder = async (req, res) => {
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

    // Only allow order owner or admin to view
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
};

module.exports = {
  createNewOrder,
  getUserOrders,
  getOrder
};

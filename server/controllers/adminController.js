const { getAllOrders, updateOrderStatus } = require("../services/orderService");
const { getProductSalesReport } = require("../services/productService");
const { getAdminDashboard, getRevenueReport } = require("../services/dashboardService");

// Get admin dashboard
async function getDashboard(req, res) {
  try {
    const dashboard = await getAdminDashboard();
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Dashboard berhasil diambil",
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal mengambil dashboard"
    });
  }
}

// Get all orders for admin
async function getOrders(req, res) {
  try {
    const orders = await getAllOrders();
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil diambil",
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal mengambil pesanan"
    });
  }
}

// Verify order (mark as completed)
async function verifyOrder(req, res) {
  try {
    const { orderId } = req.params;
    
    const order = await updateOrderStatus(orderId, 'Selesai');
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Pesanan tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil diverifikasi",
      data: order
    });
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal memverifikasi pesanan"
    });
  }
}

// Cancel order
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    
    const order = await updateOrderStatus(orderId, 'Dibatalkan');
    
    if (!order) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Pesanan tidak ditemukan"
      });
    }
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Pesanan berhasil dibatalkan",
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal membatalkan pesanan"
    });
  }
}

// Get product sales report
async function getSalesReport(req, res) {
  try {
    const report = await getProductSalesReport();
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Laporan penjualan berhasil diambil",
      data: report
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal mengambil laporan penjualan"
    });
  }
}

// Get revenue report
async function getRevenue(req, res) {
  try {
    const { start_date, end_date } = req.query;
    const report = await getRevenueReport(start_date, end_date);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Laporan revenue berhasil diambil",
      data: report
    });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Gagal mengambil laporan revenue"
    });
  }
}

module.exports = {
  getDashboard,
  getOrders,
  verifyOrder,
  cancelOrder,
  getSalesReport,
  getRevenue
};

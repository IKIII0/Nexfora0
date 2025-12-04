const { getUserDashboard } = require("../services/dashboardService");

// Get user dashboard
async function getDashboard(req, res) {
  try {
    const userId = req.user.id;
    const dashboard = await getUserDashboard(userId);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Dashboard berhasil diambil",
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message
    });
  }
}

module.exports = {
  getDashboard
};

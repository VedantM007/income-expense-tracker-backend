const dashboardService = require("../services/dashboard.service");

exports.getDashboardStats = async (req, res) => {
  try {
    const response = await dashboardService.getDashboardStats(
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to fetch dashboard stats"
    });
  }
};
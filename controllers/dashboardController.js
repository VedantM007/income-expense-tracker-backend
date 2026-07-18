
const dashboardService = require("../services/dashboard.service");

exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;
   
    const result = await dashboardService.getDashboardStats(userId);
    return res.status(response.status).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

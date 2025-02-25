const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

const router = express.Router();

router.get("/getDashboardStats", verifyToken, getDashboardStats);

module.exports = router;
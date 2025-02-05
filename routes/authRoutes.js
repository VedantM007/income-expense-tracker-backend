// routes/authRoutes.js
const express = require('express');
const { signup, signin, verifyOtp } = require('../controllers/authController');
const router = express.Router();
const verifyEmailExistence = require('../middleware/emailVerifierMiddleware');


router.post('/signup', verifyEmailExistence, signup);
router.post('/signin', signin);
router.post('/verifyOtp',verifyOtp);

module.exports = router;
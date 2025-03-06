// routes/authRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { signup, signin, verifyOtp, resendOtp, changePassword, sendResetPasswordEmail, verifyResetToken, resetPassword } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verifyOtp',verifyOtp);
router.post('/resendOtp',resendOtp);
router.post('/forgotPassword', sendResetPasswordEmail);
router.get('/verifyToken', verifyResetToken)
router.post('/resetPassword', resetPassword);
router.post('/changePassword', verifyToken ,changePassword);

module.exports = router;
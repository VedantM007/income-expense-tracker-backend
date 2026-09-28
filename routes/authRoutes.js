// routes/authRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { signup, signin, verifyOtp, resendOtp, changePassword, sendResetPasswordEmail, verifyResetToken, resetPassword } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and sends a welcome email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Vedant
 *               lastName:
 *                 type: string
 *                 example: Mandwe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User created successfully and welcome email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: string
 *                   example: User created successfully, Welcome Email sent!
 *       400:
 *         description: User with the email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Internal server error.
 */
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verifyOtp',verifyOtp);
router.post('/resendOtp',resendOtp);
router.post('/forgotPassword', sendResetPasswordEmail);
router.get('/verifyToken', verifyResetToken)
router.post('/resetPassword', resetPassword);
router.post('/changePassword', verifyToken ,changePassword);

module.exports = router;
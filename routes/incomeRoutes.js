const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllIncomeCategory, addIncome, getAllIncomesByUserId, deleteIncomeById } = require('../controllers/incomeController');

const router = express.Router();

router.get('/getAllIncomeCategories', verifyToken, getAllIncomeCategory);
router.post('/addIncome', verifyToken, addIncome);
router.get('/getAllIncomesByUserId', verifyToken, getAllIncomesByUserId);
router.delete('/deleteIncomeById', verifyToken, deleteIncomeById);


module.exports = router;
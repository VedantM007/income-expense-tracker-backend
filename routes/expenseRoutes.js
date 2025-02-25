const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllExpenseCategory, addExpense, getAllExpensesByUserId, deleteExpenseById, getExpenseByExpenseId, updateExpense } = require('../controllers/expenseController');

const router = express.Router();

router.get('/getAllExpenseCategories', verifyToken, getAllExpenseCategory);
router.post('/addExpense', verifyToken, addExpense);
router.get('/getAllExpensesByUserId', verifyToken, getAllExpensesByUserId);
router.delete('/deleteExpenseById', verifyToken, deleteExpenseById);
router.get('/getExpenseByExpenseId', verifyToken, getExpenseByExpenseId);
router.put('/updateExpense', verifyToken, updateExpense);


module.exports = router;
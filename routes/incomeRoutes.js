const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllIncomeCategory, addIncome, getAllIncomesByUserId, deleteIncomeById, getIncomeByIncomeId, updateIncome } = require('../controllers/incomeController');

const router = express.Router();

router.get('/getAllIncomeCategories', verifyToken, getAllIncomeCategory);
router.post('/addIncome', verifyToken, addIncome);
router.get('/getAllIncomesByUserId', verifyToken, getAllIncomesByUserId);
router.delete('/deleteIncomeById', verifyToken, deleteIncomeById);
router.get('/getIncomeByIncomeId', verifyToken, getIncomeByIncomeId);
router.put('/updateIncome', verifyToken, updateIncome);


module.exports = router;
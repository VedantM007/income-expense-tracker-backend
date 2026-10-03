const mongoose = require('mongoose');

const ExpenseCategorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true, unique: true },
});

module.exports = mongoose.model(
    'ExpenseCategory',
    ExpenseCategorySchema,
    'expense_categories'
);
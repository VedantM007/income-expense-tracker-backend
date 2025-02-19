const moongoose = require('mongoose');

const ExpenseCategorySchema = new moongoose.Schema({
    id: { type: Number, required: true, unique : true },
    value: { type: String, required: true, unique : true },
});

module.exports = moongoose.model('ExpenseCategory', ExpenseCategorySchema, "expense_categories");
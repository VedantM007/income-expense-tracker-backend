const mongoose = require('mongoose');

const IncomeCategorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    value: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('IncomeCategory', IncomeCategorySchema, "income_categories");
const moongoose = require('mongoose');

const IncomeCategorySchema = new moongoose.Schema({
    id: { type: Number, required: true, unique : true },
    value: { type: String, required: true, unique : true },
});

module.exports = moongoose.model('IncomeCategory', IncomeCategorySchema, "income_categories");
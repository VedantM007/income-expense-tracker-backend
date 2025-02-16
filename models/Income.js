const moongoose = require('mongoose');

const IncomeSchema = new moongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    category: { type: Number, ref: 'IncomeCategory', required: true }, // Referencing category by numeric ID
    userId: { type: moongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = moongoose.model('Income', IncomeSchema)

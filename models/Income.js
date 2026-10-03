const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: Number, ref: 'IncomeCategory', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Income', IncomeSchema);
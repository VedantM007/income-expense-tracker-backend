const moongoose = require('mongoose');

const ExpenseSchema = new moongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String , required: true},
    category: { type: Number, ref: 'ExpenseCategory', required: true }, // Referencing category by numeric ID
    userId: { type: moongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
);

module.exports = moongoose.model('Expense', ExpenseSchema)

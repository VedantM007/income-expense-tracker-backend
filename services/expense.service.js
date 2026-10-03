const mongoose = require('mongoose');
const ExpenseCategory = require('../models/ExpenseCategory');
const Expense = require('../models/Expense');

const getAllExpenseCategory = async () => {
    try {
        const categories = await ExpenseCategory.find({}, "-_id id value");

        return {
            status: 200,
            success: "Categories fetched successfully!",
            data: categories
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to fetch categories!",
            error: error
        };
    }
};

const addExpense = async (body, userId) => {
    try {
        const {
            title,
            amount,
            date,
            description,
            category
        } = body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        if (!title || !amount || !date || !description || !category) {
            return {
                status: 400,
                success: false,
                error: "All fields are required!"
            };
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return {
                status: 400,
                success: false,
                error: "Invalid date format!"
            };
        }

        const newExpense = new Expense({
            title,
            amount,
            date: parsedDate,
            description,
            category,
            userId
        });

        const savedExpense = await newExpense.save();

        return {
            status: 201,
            success: "Expense added successfully!",
            data: savedExpense
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to add expense!",
            error: error
        };
    }
};

const getAllExpensesByUserId = async (userId) => {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const expenses = await Expense.find({ userId }).sort({ date: 1 });

        const categories = await ExpenseCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const expensesWithCategory = expenses.map(expense => ({
            ...expense.toObject(),
            categoryName: categoryMap[expense.category] || "Unknown"
        }));

        return {
            status: 200,
            success: "Expenses fetched successfully!",
            data: expensesWithCategory
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to fetch expenses!",
            error: error
        };
    }
};

const deleteExpenseById = async (query, userId) => {
    try {
        const { id } = query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deletedExpense) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            };
        }

        return {
            status: 200,
            success: "Expense deleted successfully!",
            data: deletedExpense
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to delete expense!",
            error: error
        };
    }
};

const getExpenseByExpenseId = async (query, userId) => {
    try {
        const { _id } = query;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const expense = await Expense.findOne({
            _id,
            userId
        });

        if (!expense) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            };
        }

        const categories = await ExpenseCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const expensePlain = expense.toObject();

        const expenseWithCategory = {
            ...expensePlain,
            categoryName:
                categoryMap[expensePlain.category] || "Unknown"
        };

        return {
            status: 200,
            success: "Expense fetched successfully!",
            data: expenseWithCategory
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to fetch expense!",
            error: error
        };
    }
};

const updateExpense = async (body, userId) => {
    try {
        const {
            id,
            title,
            amount,
            date,
            description,
            category
        } = body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        if (!title || !amount || !date || !description || !category) {
            return {
                status: 400,
                success: false,
                error: "All fields are required!"
            };
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return {
                status: 400,
                success: false,
                error: "Invalid date format!"
            };
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: id,
                userId
            },
            {
                title,
                amount,
                date: parsedDate,
                description,
                category
            },
            {
                new: true
            }
        );

        if (!updatedExpense) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            };
        }

        return {
            status: 200,
            success: "Expense updated successfully!",
            data: updatedExpense
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to update expense!",
            error: error
        };
    }
};

module.exports = {
    getAllExpenseCategory,
    addExpense,
    getAllExpensesByUserId,
    deleteExpenseById,
    getExpenseByExpenseId,
    updateExpense
};
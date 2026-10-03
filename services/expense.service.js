const mongoose = require("mongoose");
const ExpenseCategory = require("../models/ExpenseCategory");
const Expense = require("../models/Expense");

const validateExpenseInput = ({
    title,
    amount,
    date,
    description,
    category
}) => {
    if (
        typeof title !== "string" ||
        title.trim().length < 1 ||
        title.trim().length > 100
    ) {
        return "Title is required and must be 100 characters or less";
    }

    if (
        (typeof amount !== "number" &&
            typeof amount !== "string") ||
        String(amount).trim() === "" ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
    ) {
        return "Amount must be a positive number";
    }

    if (!date || isNaN(new Date(date).getTime())) {
        return "Invalid date format";
    }

    if (
        typeof description !== "string" ||
        description.trim().length < 1 ||
        description.trim().length > 500
    ) {
        return "Description is required and must be 500 characters or less";
    }

    if (
        category === undefined ||
        category === null ||
        category === ""
    ) {
        return "Category is required";
    }

    return null;
};

const getAllExpenseCategory = async () => {
    try {
        const categories = await ExpenseCategory.find(
            {},
            "-_id id value"
        );

        return {
            status: 200,
            success: "Categories fetched successfully!",
            data: categories
        };
    } catch (error) {
        console.error(
            "getAllExpenseCategory Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to fetch categories!"
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

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const validationError = validateExpenseInput({
            title,
            amount,
            date,
            description,
            category
        });

        if (validationError) {
            return {
                status: 400,
                success: false,
                error: validationError
            };
        }

        const categoryExists = await ExpenseCategory.exists({
            id: Number(category)
        });

        if (!categoryExists) {
            return {
                status: 400,
                success: false,
                error: "Invalid expense category!"
            };
        }

        const parsedDate = new Date(date);
        const normalizedTitle = title.trim();
        const normalizedAmount = Number(amount);
        const normalizedCategory = Number(category);

        const duplicateExpense =
            await Expense.findOne({
                userId,
                title: normalizedTitle,
                amount: normalizedAmount,
                date: parsedDate,
                category: normalizedCategory
            });

        if (duplicateExpense) {
            return {
                status: 409,
                success: false,
                error: "This expense already exists!"
            };
        }

        const newExpense = new Expense({
            title: normalizedTitle,
            amount: normalizedAmount,
            date: parsedDate,
            description: description.trim(),
            category: normalizedCategory,
            userId
        });

        const savedExpense = await newExpense.save();

        return {
            status: 201,
            success: "Expense added successfully!",
            data: savedExpense
        };
    } catch (error) {
        console.error("addExpense Error:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to add expense!"
        };
    }
};

const getAllExpensesByUserId = async (userId) => {
    try {
        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const expenses = await Expense.find({
            userId
        }).sort({
            date: 1
        });

        const categories = await ExpenseCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const expensesWithCategory = expenses.map(
            (expense) => ({
                ...expense.toObject(),
                categoryName:
                    categoryMap[expense.category] ||
                    "Unknown"
            })
        );

        return {
            status: 200,
            success: "Expenses fetched successfully!",
            data: expensesWithCategory
        };
    } catch (error) {
        console.error(
            "getAllExpensesByUserId Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to fetch expenses!"
        };
    }
};

const deleteExpenseById = async (query, userId) => {
    try {
        const { id } = query;

        if (
            !id ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const deletedExpense =
            await Expense.findOneAndDelete({
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
        console.error(
            "deleteExpenseById Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to delete expense!"
        };
    }
};

const getExpenseByExpenseId = async (query, userId) => {
    try {
        const { _id } = query;

        if (
            !_id ||
            !mongoose.Types.ObjectId.isValid(_id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
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
                categoryMap[expensePlain.category] ||
                "Unknown"
        };

        return {
            status: 200,
            success: "Expense fetched successfully!",
            data: expenseWithCategory
        };
    } catch (error) {
        console.error(
            "getExpenseByExpenseId Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to fetch expense!"
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

        if (
            !id ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            };
        }

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const validationError = validateExpenseInput({
            title,
            amount,
            date,
            description,
            category
        });

        if (validationError) {
            return {
                status: 400,
                success: false,
                error: validationError
            };
        }

        const categoryExists = await ExpenseCategory.exists({
            id: Number(category)
        });

        if (!categoryExists) {
            return {
                status: 400,
                success: false,
                error: "Invalid expense category!"
            };
        }

        const parsedDate = new Date(date);
        const normalizedTitle = title.trim();
        const normalizedAmount = Number(amount);
        const normalizedCategory = Number(category);

        const duplicateExpense =
            await Expense.findOne({
                _id: { $ne: id },
                userId,
                title: normalizedTitle,
                amount: normalizedAmount,
                date: parsedDate,
                category: normalizedCategory
            });

        if (duplicateExpense) {
            return {
                status: 409,
                success: false,
                error:
                    "Another expense with the same details already exists!"
            };
        }

        const updatedExpense =
            await Expense.findOneAndUpdate(
                {
                    _id: id,
                    userId
                },
                {
                    title: normalizedTitle,
                    amount: normalizedAmount,
                    date: parsedDate,
                    description: description.trim(),
                    category: normalizedCategory
                },
                {
                    new: true,
                    runValidators: true
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
        console.error("updateExpense Error:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to update expense!"
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
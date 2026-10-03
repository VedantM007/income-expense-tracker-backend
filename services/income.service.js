const IncomeCategory = require("../models/IncomeCategory");
const Income = require("../models/Income");
const mongoose = require("mongoose");

const getAllIncomeCategory = async () => {
    try {
        const categories = await IncomeCategory.find({}, "-_id id value");

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

const addIncome = async (body, userId) => {
    try {
        const {
            title,
            amount,
            date,
            description,
            category
        } = body;

        if (!title || !amount || !date || !description || !category) {
            return {
                status: 400,
                success: false,
                error: "All fields are required!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        // Convert incoming date string to a Date object
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return {
                status: 400,
                success: false,
                error: "Invalid date format!"
            };
        }

        const newIncome = new Income({
            title,
            amount,
            date: parsedDate,
            description,
            category,
            userId
        });

        const savedIncome = await newIncome.save();

        return {
            status: 201,
            success: "Income added successfully!",
            data: savedIncome
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to add income!",
            error: error
        };
    }
};

const getAllIncomesByUserId = async (userId) => {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        const incomes = await Income.find({ userId }).sort({ date: 1 });

        const categories = await IncomeCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const incomesWithCategory = incomes.map(income => ({
            ...income.toObject(),
            categoryName: categoryMap[income.category] || "Unknown"
        }));

        return {
            status: 200,
            success: "Incomes fetched successfully!",
            data: incomesWithCategory
        };
    } catch (error) {
        console.error("getAllIncomesByUserId Error:", error);

        return {
            status: 500,
            success: false,
            error: error.message
        };
    }
};

const deleteIncomeById = async (query, userId) => {
    try {
        const { id } = query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        // Delete only if the income belongs to the authenticated user
        const deletedIncome = await Income.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deletedIncome) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            };
        }

        return {
            status: 200,
            success: "Income deleted successfully!",
            data: deletedIncome
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to delete income!",
            error: error
        };
    }
};

const getIncomeByIncomeId = async (query, userId) => {
    try {
        const { _id } = query;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            };
        }

        // Fetch only if the income belongs to the authenticated user
        const income = await Income.findOne({
            _id,
            userId
        });

        if (!income) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            };
        }

        const categories = await IncomeCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const incomePlain = income.toObject();

        const incomeWithCategory = {
            ...incomePlain,
            categoryName: categoryMap[incomePlain.category] || "Unknown"
        };

        return {
            status: 200,
            success: "Income fetched successfully!",
            data: incomeWithCategory
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to fetch income!",
            error: error
        };
    }
};

const updateIncome = async (body, userId) => {
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
                error: "Invalid or missing Income ID!"
            };
        }

        if (!title || !amount || !date || !description || !category) {
            return {
                status: 400,
                success: false,
                error: "All fields are required!"
            };
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
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

        // Update only if the income belongs to the authenticated user
        const updatedIncome = await Income.findOneAndUpdate(
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

        if (!updatedIncome) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            };
        }

        return {
            status: 200,
            success: "Income updated successfully!",
            data: updatedIncome
        };
    } catch (error) {
        return {
            status: 500,
            success: "Failed to update income!",
            error: error
        };
    }
};

module.exports = {
    getAllIncomeCategory,
    addIncome,
    getAllIncomesByUserId,
    deleteIncomeById,
    getIncomeByIncomeId,
    updateIncome
};
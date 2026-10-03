const IncomeCategory = require("../models/IncomeCategory");
const Income = require("../models/Income");
const mongoose = require("mongoose");

const validateIncomeInput = ({
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

const getAllIncomeCategory = async () => {
    try {
        const categories = await IncomeCategory.find(
            {},
            "-_id id value"
        );

        return {
            status: 200,
            success: "Categories fetched successfully!",
            data: categories
        };
    } catch (error) {
        console.error("getAllIncomeCategory Error:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to fetch categories!"
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

        const validationError = validateIncomeInput({
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

        const categoryExists = await IncomeCategory.exists({
            id: Number(category)
        });

        if (!categoryExists) {
            return {
                status: 400,
                success: false,
                error: "Invalid income category!"
            };
        }

        const parsedDate = new Date(date);
        const normalizedTitle = title.trim();
        const normalizedAmount = Number(amount);
        const normalizedCategory = Number(category);

        const duplicateIncome = await Income.findOne({
            userId,
            title: normalizedTitle,
            amount: normalizedAmount,
            date: parsedDate,
            category: normalizedCategory
        });

        if (duplicateIncome) {
            return {
                status: 409,
                success: false,
                error: "This income already exists!"
            };
        }

        const newIncome = new Income({
            title: normalizedTitle,
            amount: normalizedAmount,
            date: parsedDate,
            description: description.trim(),
            category: normalizedCategory,
            userId
        });

        const savedIncome = await newIncome.save();

        return {
            status: 201,
            success: "Income added successfully!",
            data: savedIncome
        };
    } catch (error) {
        console.error("addIncome Error:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to add income!"
        };
    }
};

const getAllIncomesByUserId = async (userId) => {
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

        const incomes = await Income.find({ userId }).sort({
            date: 1
        });

        const categories = await IncomeCategory.find();

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value;
            return acc;
        }, {});

        const incomesWithCategory = incomes.map((income) => ({
            ...income.toObject(),
            categoryName:
                categoryMap[income.category] || "Unknown"
        }));

        return {
            status: 200,
            success: "Incomes fetched successfully!",
            data: incomesWithCategory
        };
    } catch (error) {
        console.error(
            "getAllIncomesByUserId Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to fetch incomes!"
        };
    }
};

const deleteIncomeById = async (query, userId) => {
    try {
        const { id } = query;

        if (
            !id ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
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

        const deletedIncome =
            await Income.findOneAndDelete({
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
        console.error(
            "deleteIncomeById Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to delete income!"
        };
    }
};

const getIncomeByIncomeId = async (query, userId) => {
    try {
        const { _id } = query;

        if (
            !_id ||
            !mongoose.Types.ObjectId.isValid(_id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
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
            categoryName:
                categoryMap[incomePlain.category] || "Unknown"
        };

        return {
            status: 200,
            success: "Income fetched successfully!",
            data: incomeWithCategory
        };
    } catch (error) {
        console.error(
            "getIncomeByIncomeId Error:",
            error
        );

        return {
            status: 500,
            success: false,
            error: "Failed to fetch income!"
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

        if (
            !id ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
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

        const validationError = validateIncomeInput({
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

        const categoryExists = await IncomeCategory.exists({
            id: Number(category)
        });

        if (!categoryExists) {
            return {
                status: 400,
                success: false,
                error: "Invalid income category!"
            };
        }

        const parsedDate = new Date(date);
        const normalizedTitle = title.trim();
        const normalizedAmount = Number(amount);
        const normalizedCategory = Number(category);

        const duplicateIncome = await Income.findOne({
            _id: { $ne: id },
            userId,
            title: normalizedTitle,
            amount: normalizedAmount,
            date: parsedDate,
            category: normalizedCategory
        });

        if (duplicateIncome) {
            return {
                status: 409,
                success: false,
                error: "Another income with the same details already exists!"
            };
        }

        const updatedIncome =
            await Income.findOneAndUpdate(
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
        console.error("updateIncome Error:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to update income!"
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
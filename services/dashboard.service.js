const Income = require("../models/Income");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

const getDashboardStats = async (userId) => {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            const error = new Error("Invalid or missing User ID");
            error.status = 400;
            throw error;
        }

        const incomes = await Income.find({ userId });
        const expenses = await Expense.find({ userId });

        const totalIncome = incomes.reduce(
            (sum, income) => sum + income.amount,
            0
        );

        const totalExpense = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );

        const balance = totalIncome - totalExpense;

        const latestIncome = await Income.findOne({ userId })
            .sort({ updatedAt: -1, createdAt: -1 })
            .lean();

        const latestExpense = await Expense.findOne({ userId })
            .sort({ updatedAt: -1, createdAt: -1 })
            .lean();

        let minIncome = 0;
        let maxIncome = 0;

        if (incomes.length > 0) {
            minIncome =
                incomes.length === 1
                    ? 0
                    : Math.min(...incomes.map(i => i.amount));

            maxIncome = Math.max(...incomes.map(i => i.amount));
        }

        let minExpense = 0;
        let maxExpense = 0;

        if (expenses.length > 0) {
            minExpense =
                expenses.length === 1
                    ? 0
                    : Math.min(...expenses.map(e => e.amount));

            maxExpense = Math.max(...expenses.map(e => e.amount));
        }

        return {
            status: 200,
            success: "Dashboard data fetched successfully!",
            data: {
                balance,
                totalIncome,
                totalExpense,
                recentHistory: {
                    income: latestIncome || null,
                    expense: latestExpense || null
                },
                minIncome,
                maxIncome,
                minExpense,
                maxExpense
            }
        };
    } catch (error) {
        console.error("getDashboardStats Error:", error);

        if (error.status) {
            throw error;
        }

        const serverError = new Error("Failed to fetch dashboard stats");
        serverError.status = 500;
        throw serverError;
    }
};

module.exports = {
    getDashboardStats
};
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all incomes and expenses for the user
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    // Calculate total income and total expense
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    // ✅ Fix: Get the latest added/updated income and expense
    const latestIncome = await Income.findOne({ userId }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    const latestExpense = await Expense.findOne({ userId }).sort({ updatedAt: -1, createdAt: -1 }).lean();

    // Find min and max income
    const minIncome = incomes.length ? incomes.reduce((min, curr) => (curr.amount < min.amount ? curr : min)) : null;
    const maxIncome = incomes.length ? incomes.reduce((max, curr) => (curr.amount > max.amount ? curr : max)) : null;

    // Find min and max expense
    const minExpense = expenses.length ? expenses.reduce((min, curr) => (curr.amount < min.amount ? curr : min)) : null;
    const maxExpense = expenses.length ? expenses.reduce((max, curr) => (curr.amount > max.amount ? curr : max)) : null;

    // Prepare response
    res.status(200).json({
      balance,
      totalIncome,
      totalExpense,
      recentHistory: {
        income: latestIncome || null,
        expense: latestExpense || null,
      },
      minIncome: minIncome || null,
      maxIncome: maxIncome || null,
      minExpense: minExpense || null,
      maxExpense: maxExpense || null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

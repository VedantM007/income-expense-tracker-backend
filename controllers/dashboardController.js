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

    // ✅ Get the latest added/updated income and expense
    const latestIncome = await Income.findOne({ userId }).sort({ updatedAt: -1, createdAt: -1 }).lean();
    const latestExpense = await Expense.findOne({ userId }).sort({ updatedAt: -1, createdAt: -1 }).lean();

    // ✅ Fix: Correct min/max income handling
    let minIncome = 0;
    let maxIncome = 0;
    if (incomes.length > 0) {
      minIncome = incomes.length === 1 ? 0 : Math.min(...incomes.map(i => i.amount));
      maxIncome = Math.max(...incomes.map(i => i.amount));
    }

    // ✅ Fix: Correct min/max expense handling
    let minExpense = 0;
    let maxExpense = 0;
    if (expenses.length > 0) {
      minExpense = expenses.length === 1 ? 0 : Math.min(...expenses.map(e => e.amount));
      maxExpense = Math.max(...expenses.map(e => e.amount));
    }

    // Prepare response
    res.status(200).json({
      balance,
      totalIncome,
      totalExpense,
      recentHistory: {
        income: latestIncome || null,
        expense: latestExpense || null,
      },
      minIncome,
      maxIncome,
      minExpense,
      maxExpense,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

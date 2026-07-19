const moongoose = require('mongoose');
const ExpenseCategory = require('../models/ExpenseCategory');
const Expense = require('../models/Expense');

const getAllExpenseCategory = async () => {
    try {
        const categories = await ExpenseCategory.find({}, "-_id id value"); // Exclude MongoDB _id field
        return {
            status: 200,
            success: "Categories fetched successfully!",
            data: categories
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to fetch categories!",
            error: error
        }
    }
}

const addExpense = async (body) => {
 try{
     const {title, amount, date, description, category, userId} = body;
     if (!title || !amount || !date || !description || !category || !userId) {
        return {
            status: 400,
            success: false,
            error: "All fields are required!"
        }
      }

      // Convert incoming date string to a Date object
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
          return {
            status: 400,
            success: false,
            error: "Invalid date format!"
          }
      }

      const newExpense = new Expense({
        title,
        amount,
        date : parsedDate,
        description,
        category,
        userId
      })
      const savedExpense = await newExpense.save();
     return {
        status: 201,
        success: "Expense added successfully!",
        data: savedExpense
     }
    } catch(error){
     return {
        status: 500,
        success: "Failed to add expense!",
        error: error
     }
    }
}

const getAllExpensesByUserId = async (query) => {
    try{
        const {userId} = query;
        if (!userId || !moongoose.Types.ObjectId.isValid(userId)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing User ID!"
            }
        }

        // Fetch expenses
        const expenses = await Expense.find({ userId }).sort({date : 1})

        // Fetch all categories (to manually map categoryId → categoryName)
        const categories = await ExpenseCategory.find();
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value; // Map id to value
            return acc;
        }, {});

        // Attach categoryName to each expense
        const expensesWithCategory = expenses.map(expense => ({
            ...expense.toObject(),
            categoryName: categoryMap[expense.category] || "Unknown"
        }));

        return {
            status: 200,
            success: "Expenses fetched successfully!",
            data: expensesWithCategory
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to fetch expenses!",
            error: error
        }
    }
}

const deleteExpenseById = async (query) => {
    try{
        const {id} = query;
        if (!id || !moongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            }
        }

        // Delete the expense
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            }
        }

        return {
            status: 200,
            success: "Expense deleted successfully!",
            data: deletedExpense
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to delete expense!",
            error: error
        }
    }
}

const getExpenseByExpenseId = async (query) => {
    try{
        const {_id} = query;
        if (!_id || !moongoose.Types.ObjectId.isValid(_id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            }
        }
        // Fetch expense
        const expense = await Expense.findById(_id);
        if (!expense) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            };
        }
        
        // Fetch all categories (to manually map categoryId → categoryName)
        const categories = await ExpenseCategory.find();
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value; // Map id to value
            return acc;
        }, {});

        // Convert Mongoose document to a plain object
        const expensePlain = expense.toObject();

        // Attach categoryName
        const expenseWithCategory = {
            ...expensePlain,
            categoryName: categoryMap[expensePlain.category] || "Unknown",
        };
        
        if (!expenseWithCategory) {
            return {
                status: 404,
                success: false,
                error: "Expense not found!"
            }
        }

        return {
            status: 200,
            success: "Expense fetched successfully!",
            data: expenseWithCategory
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to fetch expense!",
            error: error
        }
    }
}

const updateExpense = async (body) => {
    try{
        const {id, title, amount, date, description, category, userId} = body;
        if (!id || !moongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Expense ID!"
            }
        }
         if (!title || !amount || !date || !description || !category || !userId) {
           return {
                status: 400,
                success: false,
                error: "All fields are required!"
            }
        }
    
        // Convert incoming date string to a Date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
           return {
                status: 400,
                success: false,
                error: "Invalid date format!"
            }
        }
    
        // Check if the expense exists
        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
           return {
                status: 404,
                success: false,
                error: "Expense not found!"
            }
        }

        // Update the expense
        const updatedExpense = await Expense.findByIdAndUpdate(id, {
            title,
            amount,
            date : parsedDate,
            description,
            category,
            userId
        }, {new: true});

        return {
            status: 200,
            success: "Expense updated successfully!",
            data: updatedExpense
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to update expense!",
            error: error
        }
    }
}


module.exports = {
    getAllExpenseCategory,
    addExpense,
    getAllExpensesByUserId,
    deleteExpenseById,
    getExpenseByExpenseId,
    updateExpense
}
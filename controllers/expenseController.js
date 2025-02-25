const moongoose = require('mongoose');
const ExpenseCategory = require('../models/ExpenseCategory');
const Expense = require('../models/Expense');

exports.getAllExpenseCategory = async (req,res) => {
    try{
        const categories = await ExpenseCategory.find({}, "-_id id value"); // Exclude MongoDB _id field
        res.status(200).json(categories)
    } catch(error){
        console.log(error);
        res.status(500).json({message : 'Server Error'});
    }
}

exports.addExpense = async (req,res) => {
    try{
     const {title, amount, date, description, category, userId} = req.body;
     if (!title || !amount || !date || !description || !category || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Convert incoming date string to a Date object
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
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
     res.status(201).json({ success: 'New Expense added', savedExpense });
    } catch(error){
    res.status(500).json({ error: 'Failed to add expense' });
    }
}


exports.getAllExpensesByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || !moongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid or missing User ID' });
        }

        // Fetch expenses
        const expenses = await Expense.find({ userId });

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

        res.status(200).json(expensesWithCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

exports.deleteExpenseById = async (req, res) => {
    try {
      const { id } = req.query;
      const deletedExpense = await Expense.findByIdAndDelete(id);
      if (!deletedExpense) return res.status(404).json({ error: 'Expense not found' });
  
      res.status(200).json({ message: 'Expense deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  };


  exports.getExpenseByExpenseId = async (req, res) => {
    try {
      const { _id } = req.query;
      if (!_id) {
        return res.status(400).json({ error: "Invalid or missing Expense ID" });
      }
  
      // Fetch expense by expense Id
      const expense = await Expense.findById({ _id });
  
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
  
      res.status(200).json(expenseWithCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch expense by expense ID" });
    }
  };
  
  exports.updateExpense = async (req, res) => {
      try {
        const { _id } = req.query; // Get expense ID from query params
        const { title, amount, date, description, category, userId } = req.body;
    
        if (!_id) {
          return res.status(400).json({ error: "Expense ID is required" });
        }
    
        if (!title || !amount || !date || !description || !category || !userId) {
          return res.status(400).json({ error: "All fields are required" });
        }
    
        // Convert incoming date string to a Date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: "Invalid date format" });
        }
    
        // Check if the expense exists
        const existingExpense = await Expense.findById(_id);
        if (!existingExpense) {
          return res.status(404).json({ error: "Expense not found" });
        }
    
        // Update the expense record
        const updatedExpense = await Expense.findByIdAndUpdate(
          _id,
          {
            title,
            amount,
            date: parsedDate,
            description,
            category,
            userId,
          },
          { new: true } // Return the updated document
        );
    
        res.status(200).json({ success: "Expense updated successfully", updatedExpense });
      } catch (error) {
        res.status(500).json({ error: "Failed to update expense" });
      }
    };
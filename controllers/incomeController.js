const Category = require('../models/IncomeCategory');
const Income = require('../models/Income');
const mongoose = require('mongoose');
exports.getAllIncomeCategory = async (req,res) => {
    try{
        const categories = await Category.find({}, "-_id id value"); // Exclude MongoDB _id field
        res.status(200).json(categories)
    } catch(error){
        console.log(error);
        res.status(500).json({message : 'Server Error'});
    }
}

    exports.addIncome = async (req,res) => {
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

          const newIncome = new Income({
            title,
            amount,
            date : parsedDate,
            description,
            category,
            userId
          })
          const savedIncome = await newIncome.save();
         res.status(201).json({ success: 'New Income added', savedIncome });
        } catch(error){
        res.status(500).json({ error: 'Failed to add income' });
        }
    }


    exports.getAllIncomesByUserId = async (req, res) => {
        try {
            const { userId } = req.query;
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid or missing User ID' });
            }
    
            // Fetch incomes
            const incomes = await Income.find({ userId });
    
            // Fetch all categories (to manually map categoryId → categoryName)
            const categories = await Category.find();
            const categoryMap = categories.reduce((acc, cat) => {
                acc[cat.id] = cat.value; // Map id to value
                return acc;
            }, {});
    
            // Attach categoryName to each income
            const incomesWithCategory = incomes.map(income => ({
                ...income.toObject(),
                categoryName: categoryMap[income.category] || "Unknown"
            }));
    
            res.status(200).json(incomesWithCategory);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch incomes' });
        }
    };
    
    exports.deleteIncomeById = async (req, res) => {
        try {
          const { id } = req.query;
          const deletedIncome = await Income.findByIdAndDelete(id);
          if (!deletedIncome) return res.status(404).json({ error: 'Income not found' });
      
          res.status(200).json({ message: 'Income deleted' });
        } catch (err) {
          res.status(500).json({ error: 'Failed to delete note' });
        }
      };

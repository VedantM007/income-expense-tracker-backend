const IncomeCategory = require("../models/IncomeCategory");
const Income = require("../models/Income");
const moongoose = require("mongoose");

const getAllIncomeCategory = async () => {
    try {
        const categories = await IncomeCategory.find({}, "-_id id value"); // Exclude MongoDB _id field
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

const addIncome = async (body) => {
    try {
        const { title, amount, date, description, category, userId } = body;
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

        const newIncome = new Income({
            title,
            amount,
            date : parsedDate,
            description,
            category,
            userId
        })
        const savedIncome = await newIncome.save();
        return {
            status: 201,
            success: "Income added successfully!",
            data: savedIncome
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to add income!",
            error: error
        }
    }
}

const getAllIncomesByUserId = async (query) => {
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
        const incomes = await Income.find({ userId }).sort({date : 1})

        // Fetch all categories (to manually map categoryId → categoryName)
        const categories = await IncomeCategory.find();
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value; // Map id to value
            return acc;
        }, {});

        // Attach categoryName to each expense
        const incomesWithCategory = incomes.map(income => ({
            ...income.toObject(),
            categoryName: categoryMap[income.category] || "Unknown"
        }));

        return {
            status: 200,
            success: "Incomes fetched successfully!",
            data: incomesWithCategory
        }
    } catch (error) {
    console.error("getAllIncomesByUserId Error:", error);

    return {
        status: 500,
        success: false,
        error: error.message
    };
}
}

const deleteIncomeById = async (query) => {
    try{
        const {id} = query;
        if (!id || !moongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
            }
        }

        // Delete the income
        const deletedIncome = await Income.findByIdAndDelete(id);
        if (!deletedIncome) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            }
        }

        return {
            status: 200,
            success: "Income deleted successfully!",
            data: deletedIncome
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to delete income!",
            error: error
        }
    }
}


const getIncomeByIncomeId = async (query) => {
    try{
        const {_id} = query;
        if (!_id || !moongoose.Types.ObjectId.isValid(_id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
            }
        }
        // Fetch income
        const income = await Income.findById(_id);
        if (!income) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            };
        }
        
        // Fetch all categories (to manually map categoryId → categoryName)
        const categories = await IncomeCategory.find();
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat.value; // Map id to value
            return acc;
        }, {});

        // Convert Mongoose document to a plain object
        const incomePlain = income.toObject();

        // Attach categoryName
        const incomeWithCategory = {
            ...incomePlain,
            categoryName: categoryMap[incomePlain.category] || "Unknown",
        };
        
        if (!incomeWithCategory) {
            return {
                status: 404,
                success: false,
                error: "Income not found!"
            }
        }

        return {
            status: 200,
            success: "Income fetched successfully!",
            data: incomeWithCategory
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to fetch income!",
            error: error
        }
    }
}

const updateIncome = async (body) => {
    try{
        const {id, title, amount, date, description, category, userId} = body;
        if (!id || !moongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                error: "Invalid or missing Income ID!"
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
        const existingIncome = await Income.findById(id);
        if (!existingIncome) {
           return {
                status: 404,
                success: false,
                error: "Income not found!"
            }
        }

        // Update the expense
        const updatedIncome = await Income.findByIdAndUpdate(id, {
            title,
            amount,
            date : parsedDate,
            description,
            category,
            userId
        }, {new: true});

        return {
            status: 200,
            success: "Income updated successfully!",
            data: updatedIncome
        }
    } catch(error){
        return {
            status: 500,
            success: "Failed to update income!",
            error: error
        }
    }
}


module.exports = {
    getAllIncomeCategory,
    addIncome,
    getAllIncomesByUserId,
    deleteIncomeById,
    getIncomeByIncomeId,
    updateIncome
}
const expenseService = require('../services/expense.service');

exports.getAllExpenseCategory = async (req, res) => {
    try {
        const response = await expenseService.getAllExpenseCategory();
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

exports.addExpense = async (req, res) => {
    try {
        const response = await expenseService.addExpense(req.body);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}


exports.getAllExpensesByUserId = async (req, res) => {
   try {
        const response = await expenseService.getAllExpensesByUserId(req.query);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.deleteExpenseById = async (req, res) => {
    try {
        const response = await expenseService.deleteExpenseById(req.query);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


  exports.getExpenseByExpenseId = async (req, res) => {
      try {
        const response = await expenseService.getExpenseByExpenseId(req.query);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
  };
  
  exports.updateExpense = async (req, res) => { 
    try {
        const response = await expenseService.updateExpense(req.body);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
  };
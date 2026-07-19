const incomeService = require("../services/income.service");

exports.getAllIncomeCategory = async (req, res) => {
  try {
        const response = await incomeService.getAllIncomeCategory();
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.addIncome = async (req, res) => {
  try {
         const response = await incomeService.addIncome(req.body);
         return res.status(response.status).json(response);
     } catch (error) {
         console.error(error);
         return res.status(500).json({
             error: "Internal server error"
         });
     }
};

exports.getAllIncomesByUserId = async (req, res) => {
  try {
    const response = await incomeService.getAllIncomesByUserId(req.query);
    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.deleteIncomeById = async (req, res) => {
 try {
        const response = await incomeService.deleteIncomeById(req.query);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.getIncomeByIncomeId = async (req, res) => {
  try{
    const response = await incomeService.getIncomeByIncomeId(req.query);
    return res.status(response.status).json(response);
  } catch(error){
    console.error(error);
    return res.status(500).json({
        error: "Internal server error"
    });
  }
};

exports.updateIncome = async (req, res) => {
   try {
        const response = await incomeService.updateIncome(req.body);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
  };
  
  

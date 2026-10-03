const incomeService = require("../services/income.service");

exports.getAllIncomeCategory = async (req, res) => {
  try {
    const response = await incomeService.getAllIncomeCategory();
    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const response = await incomeService.addIncome(
      req.body,
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

exports.getAllIncomesByUserId = async (req, res) => {
  try {
    const response = await incomeService.getAllIncomesByUserId(
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

exports.deleteIncomeById = async (req, res) => {
  try {
    const response = await incomeService.deleteIncomeById(
      req.query,
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

exports.getIncomeByIncomeId = async (req, res) => {
  try {
    const response = await incomeService.getIncomeByIncomeId(
      req.query,
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const response = await incomeService.updateIncome(
      req.body,
      req.user.id
    );

    return res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};
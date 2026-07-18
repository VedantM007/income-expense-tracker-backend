const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {
    const { status, success } = await authService.signUp(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success});
  } catch (error) {
    res.status(error.status).json({status:error.status, error: error.message});
  }
};

exports.signin = async (req, res) => {
  try {
    const {status, success} = await authService.signin(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sign in" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const {status, success, data} = await authService.verifyOtp(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success, data});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const {status, success} = await authService.resendOtp(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const {status, success} = await authService.changePassword(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to change password" });
  }
};


exports.sendResetPasswordEmail = async (req,res) =>{

  try{
      const {status, success} = await authService.sendResetPasswordEmail(req.body);
    //Respond with success  
    res
      .status(status)
      .json({status, success});

  } catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to send the reset password email" });
  }
}

exports.verifyResetToken = async (req, res) => {
  try {
    const {status, success, data} = await authService.verifyResetToken(req.query);
    //Respond with success  
    res
      .status(status)
      .json({status, success, data});

  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const {token} = req.query;
    const {status, success, data} = await authService.resetPassword({token, newPassword});
    //Respond with success  
    res
      .status(status)
      .json({status, success, data});
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



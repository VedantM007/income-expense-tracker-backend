const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {
    const { status, success } = await authService.signUp(req.body);

    return res.status(status).json({ status, success });
  } catch (error) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { status, success } = await authService.signin(req.body);

    return res.status(status).json({ status, success });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Failed to sign in"
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { status, success, data } = await authService.verifyOtp(req.body);

    return res.status(status).json({ status, success, data });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Failed to verify OTP"
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { status, success } = await authService.resendOtp(req.body);

    return res.status(status).json({ status, success });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Failed to resend OTP"
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { status, success } = await authService.changePassword(
      req.body,
      req.user.id
    );

    return res.status(status).json({ status, success });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Failed to change password"
    });
  }
};

exports.sendResetPasswordEmail = async (req, res) => {
  try {
    const { status, success } =
      await authService.sendResetPasswordEmail(req.body);

    return res.status(status).json({ status, success });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Failed to send the reset password email"
    });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { status, success, data } =
      await authService.verifyResetToken(req.query);

    return res.status(status).json({ status, success, data });
  } catch (error) {
    console.error("Token Verification Error:", error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Internal server error"
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.query;

    const { status, success, data } =
      await authService.resetPassword({ token, newPassword });

    return res.status(status).json({ status, success, data });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Internal server error"
    });
  }
};
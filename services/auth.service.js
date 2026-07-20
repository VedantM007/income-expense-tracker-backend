const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/auth.config");
const crypto = require("crypto");
const emailService = require("../services/email.service");
const InvalidToken = require("../models/InvalidToken");

const signUp = async ({firstName, lastName, email, password}) => {
   // Step 2: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.status = 400;
        throw error;
    }

    //Step 3 : Hash the password
    const hashedPassword = await bcrypt.hash(password, authConfig.BCRYPT_SALT_ROUNDS);

    // Step 4: Create a new user
    await User.create({
        firstName,
        lastName,
        email,      
        password: hashedPassword,
    });

    // Step 5: Send welcome email
   await emailService.sendWelcomeEmail(email, firstName, lastName);

    return {
        status: 201,
        success: "User created successfully, Welcome Email sent!"
    };
}

const signin = async ({email, password}) => {
     const user = await User.findOne({ email });
    if (!user){
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }
      

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpExpires = Date.now() + authConfig.OTP_EXPIRY_MINUTES * 60 * 1000; // OTP expires in 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
   await emailService.sendOtpForSignInEmail(email, otp)

     return {
        status: 200,
        success: "OTP sent to email. Please verify to complete sign-in."
    };
}

const verifyOtp = async({email, otp})=>{
     const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or OTP");
      error.status = 401;
      throw error;
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      const error = new Error("Invalid or expired OTP");
      error.status = 401;
      throw error;
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, authConfig.JWT_SECRET, {
      expiresIn: authConfig.JWT_EXPIRY,
    });


    return {
      status: 200,
      success: "OTP verified successfully, You are logged in!",
      data:{
        userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
      },
    };
}

const resendOtp = async({email})=>{
    const user = await User.findOne({ email });
    if (!user){
      const error = new Error("Invalid email");
      error.status = 401;
      throw error;
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpExpires = Date.now() + authConfig.OTP_EXPIRY_MINUTES * 60 * 1000; // OTP expires in 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the new OTP via email
    await emailService.resendOtpEmail(email, otp);

    return {
        status: 200,
        success: "OTP resent successfully to your email."
    };
}

const changePassword = async({userId, oldPassword, newPassword})=>{
// Validate input
    if (!userId || !oldPassword || !newPassword) {
      const error = new Error("All fields are required");
      error.status = 400;
      throw error;
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error("Old password is incorrect");
      error.status = 400;
      throw error;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, authConfig.BCRYPT_SALT_ROUNDS);

    // Update password in the database
    user.password = hashedNewPassword;
    await user.save();


    return {
        status: 200,
        success: "Password changed successfully."
    };
}

const sendResetPasswordEmail = async({email})=>{
      //Check whether the user exists or not
    const existingUser = await User.findOne({ email });
    if (!existingUser){
      const error = new Error("This email doesn't exist or this email hasn't been registered yet");
      error.status = 400;
      throw error;
    }

         // Generate JWT token
       const token = jwt.sign({ userId: existingUser._id}, authConfig.JWT_SECRET, {
      expiresIn: authConfig.RESET_PASSWORD_EXPIRY,
       });

    // Send the reset password link via email
   await emailService.sendResetPasswordEmail(email, token);

   return {
    status: 200,
    success: "Reset password email sent successfully."
   }
}

const verifyResetToken = async({token})=>{
    if (!token) {
      const error = new Error("Token is required");
      error.status = 400;
      throw error;
    }

    // Check if the token is already used/invalidated
    const isInvalid = await InvalidToken.findOne({ token });
    if (isInvalid) {
      const error = new Error("Token has already been used or expired");
      error.status = 400;
      throw error;
    }

    // Verify the token
   const decoded = jwt.verify(token, authConfig.JWT_SECRET);
   return {
        status: 200,
        success: "Token is valid",
        data: {
          userId: decoded.userId
        }
      };
     
}

const resetPassword = async({token, newPassword})=>{
        if (!token) {
      const error = new Error("Token is required");
      error.status = 400;
      throw error;
    }

    // Check if token is already used/invalid
    const isInvalid = await InvalidToken.findOne({ token });
    if (isInvalid) {
      const error = new Error("Token has already been used or expired");
      error.status = 400;
      throw error;
    }

    // Verify token
  const decoded = jwt.verify(token, authConfig.JWT_SECRET);
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, authConfig.BCRYPT_SALT_ROUNDS);
      await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

      // Store the used token in InvalidToken collection to prevent reuse
      await InvalidToken.create({ token });

      return{
        status: 200,
        success: "Password reset successful. Please login."
      }
}

module.exports = {signUp, signin, verifyOtp, resendOtp, changePassword, sendResetPasswordEmail, verifyResetToken, resetPassword}
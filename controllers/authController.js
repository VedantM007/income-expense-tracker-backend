const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "your_secret_key";
const crypto = require("crypto");
const transporter = require("../config/nodeMailerTransporter");
const InvalidToken = require("../models/InvalidToken");
const generateWelcomeEmailTempalate = require("../templates/welcomeEmail.template");
const generateOtpForSignInTemplate = require("../templates/otpForSignIn.template");
const generateResendOtpEmailTemplate  = require("../templates/resendOtpEmail.template");
const generateResetPasswordEmailTemplate = require("../templates/resetPasswordEmail.template")


exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Step 2: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "User with this email already exists" });

    //Step 3 : Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Step 5: Send welcome email
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Welcome to the Income-Expense Tracker",
      text: "Hello User",
      html: generateWelcomeEmailTempalate(firstName, lastName),
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    //step 6 : Respond with success
      
    res
      .status(201)
      .json({ success: "User created successfully, Welcome Email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentYear = new Date().getFullYear();
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid email or password" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Your OTP for Sign In",
      text: "Hello User",
      html: generateOtpForSignInTemplate(email, otp),
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete sign-in.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sign in" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or OTP" });

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const currentYear = new Date().getFullYear();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the new OTP via email
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Resend: Your OTP for Sign In",
      text: "Hello User",
      html: generateResendOtpEmailTemplate(email, otp)
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    res.status(200).json({ message: "OTP resent successfully to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Validate input
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to change password" });
  }
};


exports.sendResetPasswordEmail = async (req,res) =>{

  try{
    const {email} = req.body;
    const currentYear = new Date().getFullYear();
    //Check whether the user exists or not
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(400)
        .json({ error: "This email doesn't exist or this email hasn't been registered yet" });

         // Generate JWT token
       const token = jwt.sign({ userId: existingUser._id}, JWT_SECRET, {
      expiresIn: "10m",
       });

    // Send the reset password link via email
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Reset Password",
      text: "Hello User",
      html: generateResetPasswordEmailTemplate(email, token),
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    res.status(200).json({ message: "Reset password email sent" });

  } catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to send the reset password email" });
  }
}

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Check if the token is already used/invalidated
    const isInvalid = await InvalidToken.findOne({ token });
    if (isInvalid) {
      return res.status(400).json({ error: "Token has already been used or expired" });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
      res.status(200).json({ message: "Token is valid", userId: decoded.userId });
    });

  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Check if token is already used/invalid
    const isInvalid = await InvalidToken.findOne({ token });
    if (isInvalid) {
      return res.status(400).json({ error: "Token has already been used or expired" });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

      // Store the used token in InvalidToken collection to prevent reuse
      await InvalidToken.create({ token });

      res.status(200).json({ message: "Password reset successful. Please login." });
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



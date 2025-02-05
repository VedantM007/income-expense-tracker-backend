const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_secret_key';
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const dev = require('../environments/dev.env')
const crypto = require('crypto');

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: dev.mailGunAPIKey, // Replace with your Mailgun API Key
});

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const currentYear = new Date().getFullYear();
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User with this email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Send welcome email
   try {
    await mg.messages.create(dev.mailGunDomain, {
        from: `Income-Expense Tracker <${dev.mailGunDomain}>`,
        to: email,
        subject : "Welcome to the Income-Expense Tracker",
        template: "welcome_email",
        "h:X-Mailgun-Variables": JSON.stringify({
        firstName : firstName,
        lastName : lastName,
        currentYear : currentYear
      }),
      });
   }
   catch (emailError){
    console.error("Email sending failed:", emailError);
   }

    // Respond with success
    res.status(201).json({ success: "User created successfully, Welcome Email sent!" });
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
      if (!user) return res.status(401).json({ error: "Invalid email or password" });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" });
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  
      // Save OTP and expiration in the database
      const hashedOtp = await bcrypt.hash(otp, 10);
      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      await user.save();
  
      // Send OTP via email
      try {
        await mg.messages.create(dev.mailGunDomain, {
            from: `Income-Expense Tracker <${dev.mailGunDomain}>`,
            to: email,
            subject : "Your OTP for Sign In",
            template: "otp_verification_email",
            "h:X-Mailgun-Variables": JSON.stringify({
            email : email,
            otp : otp,
            currentYear : currentYear
          }),
          });
       }
       catch (emailError){
        console.error("Email sending failed:", emailError);
       }
  
      res.status(200).json({ message: "OTP sent to email. Please verify to complete sign-in." });
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
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  
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
  
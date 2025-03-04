const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "your_secret_key";
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const dev = require("../environments/dev.env");
const crypto = require("crypto");
const transporter = require("../config/nodeMailerTransporter");
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
    // try {
    //   await mg.messages.create(dev.mailGunDomain, {
    //     from: `Income-Expense Tracker <${dev.mailGunDomain}>`,
    //     to: email,
    //     subject: "Welcome to the Income-Expense Tracker",
    //     template: "welcome_email",
    //     "h:X-Mailgun-Variables": JSON.stringify({
    //       firstName: firstName,
    //       lastName: lastName,
    //       currentYear: currentYear,
    //     }),
    //   });
    // } catch (emailError) {
    //   console.error("Email sending failed:", emailError);
    // }

    //step 6 : Respond with success
      
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Welcome to the Income-Expense Tracker",
      text: "Hello User",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
   .email-header {
  background: linear-gradient(90deg, #020024, #090979, #00d4ff, #23d5ab);
  padding: 2rem;
  text-align: center;
  color: white !important;
}
      .email-body {
        padding: 30px;
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
      .footer {
        text-align: center;
        padding: 15px;
        background-color: #f1f1f1;
        color: #777;
        font-size: 14px;
      }
      @media (max-width: 600px) {
        .email-container {
          width: 90%;
        }
        .email-body {
          padding: 15px;
        }
        .email-header {
          flex-direction: column;
        }
        .email-header h1 {
          margin: 10px 0 0;
          font-size: 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Income and Expense Tracker</h2>
      </div>
      <div class="email-body">
        <p>Hello ${firstName} ${lastName},</p>
       <p> Welcome to the Income and Expense Tracker, a powerful tool designed to
        help you manage your finances effortlessly. With features to track your
        income, monitor expenses, and gain insights into your spending habits,
        this project aims to promote smarter financial decisions and simplify
        personal budgeting.</p>
        <p>
          Click here to <a href="https://example.com">Sign In</a> and get started with the Income-Expense Tracker
        </p>
        <p>Thank you,<br> The Support Team</p>
      </div>
      <div class="footer">
        <p>© ${currentYear} Wayne Industries. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

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
    // try {
    //   await mg.messages.create(dev.mailGunDomain, {
    //       from: `Income-Expense Tracker <${dev.mailGunDomain}>`,
    //       to: email,
    //       subject : "Your OTP for Sign In",
    //       template: "otp_verification_email",
    //       "h:X-Mailgun-Variables": JSON.stringify({
    //       email : email,
    //       otp : otp,
    //       currentYear : currentYear
    //     }),
    //     "o:tracking": true, // Enable open and click tracking
    //     "o:require-tls": true, // Ensure emails are sent over TLS
    //     "o:tag": ["welcome"], // Add tags for better tracking
    //     });
    //  }
    //  catch (emailError){
    //   console.error("Email sending failed:", emailError);
    //  }
    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Your OTP for Sign In",
      text: "Hello User",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Send</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
   .email-header {
  background: linear-gradient(90deg, #020024, #090979, #00d4ff, #23d5ab);
  padding: 2rem;
  text-align: center;
  color: white !important;
}
      .email-body {
        padding: 30px;
        text-align: center;
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
      .otp-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px auto;
        padding: 12px 20px;
        background-color: #f3f3f3;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #2d89ef;
        border-radius: 4px;
        width: fit-content;
      }
      .footer {
        text-align: center;
        padding: 15px;
        background-color: #f1f1f1;
        color: #777;
        font-size: 14px;
      }
      @media (max-width: 600px) {
        .email-container {
          width: 90%;
        }
        .email-body {
          padding: 15px;
        }
        .email-header {
          flex-direction: column;
        }
        .email-header h1 {
          margin: 10px 0 0;
          font-size: 18px;
        }
        .otp-box {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Income and Expense Tracker</h2>
      </div>
      <div class="email-body">
        <p>Hello ${email},</p>
        <p>Your OTP for signing in is valid for 10 minutes. Please use it before it expires.</p>
        <div class="otp-box">${otp}</div>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br> The Support Team</p>
      </div>
      <div class="footer">
        <p>© ${currentYear} Wayne Industries. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`,
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
    // try {
    //   await mg.messages.create(dev.mailGunDomain, {
    //     from: `Income-Expense Tracker <${dev.mailGunDomain}>`,
    //     to: email,
    //     subject: "Resend: Your OTP for Sign In",
    //     template: "otp_verification_email",
    //     "h:X-Mailgun-Variables": JSON.stringify({
    //       email: email,
    //       otp: otp,
    //       currentYear: currentYear,
    //     }),
    //   });
    // } catch (emailError) {
    //   console.error("Email sending failed:", emailError);
    //   return res.status(500).json({ error: "Failed to send OTP" });
    // }

    const mailOptions = {
      from: "vedantmandwe5@gmail.com",
      to: email,
      subject: "Resend: Your OTP for Sign In",
      text: "Hello User",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Send</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
   .email-header {
  background: linear-gradient(90deg, #020024, #090979, #00d4ff, #23d5ab);
  padding: 2rem;
  text-align: center;
  color: white !important;
}
      .email-body {
        padding: 30px;
        text-align: center;
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
      .otp-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px auto;
        padding: 12px 20px;
        background-color: #f3f3f3;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #2d89ef;
        border-radius: 4px;
        width: fit-content;
      }
      .footer {
        text-align: center;
        padding: 15px;
        background-color: #f1f1f1;
        color: #777;
        font-size: 14px;
      }
      @media (max-width: 600px) {
        .email-container {
          width: 90%;
        }
        .email-body {
          padding: 15px;
        }
        .email-header {
          flex-direction: column;
        }
        .email-header h1 {
          margin: 10px 0 0;
          font-size: 18px;
        }
        .otp-box {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Income and Expense Tracker</h2>
      </div>
      <div class="email-body">
        <p>Hello ${email},</p>
        <p>Your OTP for signing in is valid for 10 minutes. Please use it before it expires.</p>
        <div class="otp-box">${otp}</div>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br> The Support Team</p>
      </div>
      <div class="footer">
        <p>© ${currentYear} Wayne Industries. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`,
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

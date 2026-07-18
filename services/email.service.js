const transporter = require("../config/nodeMailerTransporter");
const generateWelcomeEmailTempalate = require("../templates/welcomeEmail.template");
const generateOtpForSignInTemplate = require("../templates/otpForSignIn.template");
const generateResendOtpEmailTemplate  = require("../templates/resendOtpEmail.template");
const generateResetPasswordEmailTemplate = require("../templates/resetPasswordEmail.template")
const EMAIL_FROM = process.env.EMAIL_USER;
const DEFAULT_EMAIL_TEXT = "Hello User";

const sendWelcomeEmail = async(email, firstName, lastName)=>{
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Welcome to the Income-Expense Tracker",
      text: DEFAULT_EMAIL_TEXT,
      html: generateWelcomeEmailTempalate(firstName, lastName),
    };
    await transporter.sendMail(mailOptions);
}

const sendOtpForSignInEmail = async(email, otp)=>{
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Your OTP for Sign In",
      text: DEFAULT_EMAIL_TEXT,
      html: generateOtpForSignInTemplate(email, otp),
    };
   await transporter.sendMail(mailOptions);
}

const sendResetPasswordEmail = async(email, token)=>{
      const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Reset Password",
      text: DEFAULT_EMAIL_TEXT,
      html: generateResetPasswordEmailTemplate(email, token),
    };
    await transporter.sendMail(mailOptions);
}

 const resendOtpEmail = async(email, otp)=>{
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Your OTP for Sign In",
      text: DEFAULT_EMAIL_TEXT,
      html: generateResendOtpEmailTemplate(email, otp),
    };
    await transporter.sendMail(mailOptions);
}
module.exports = {sendWelcomeEmail, sendOtpForSignInEmail, sendResetPasswordEmail, resendOtpEmail};

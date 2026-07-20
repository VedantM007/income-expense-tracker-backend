const transporter = require("../config/nodeMailerTransporter");
const generateWelcomeEmailTempalate = require("../templates/welcomeEmail.template");
const generateOtpForSignInTemplate = require("../templates/otpForSignIn.template");
const generateResendOtpEmailTemplate  = require("../templates/resendOtpEmail.template");
const generateResetPasswordEmailTemplate = require("../templates/resetPasswordEmail.template")
const emailConfig = require("../config/email.config");

const sendWelcomeEmail = async(email, firstName, lastName)=>{
    const mailOptions = {
      from: emailConfig.EMAIL_FROM,
      to: email,
      subject: emailConfig.EMAIL_SUBJECTS.WELCOME,
      text: emailConfig.EMAIL_TEXT,
      html: generateWelcomeEmailTempalate(firstName, lastName),
    };
    await transporter.sendMail(mailOptions);
}

const sendOtpForSignInEmail = async(email, otp)=>{
    const mailOptions = {
      from: emailConfig.EMAIL_FROM,
      to: email,
      subject: emailConfig.EMAIL_SUBJECTS.SIGNIN_OTP,
      text: emailConfig.EMAIL_TEXT,
      html: generateOtpForSignInTemplate(email, otp),
    };
   await transporter.sendMail(mailOptions);
}

const sendResetPasswordEmail = async(email, token)=>{
      const mailOptions = {
      from: emailConfig.EMAIL_FROM,
      to: email,
      subject: emailConfig.EMAIL_SUBJECTS.RESET_PASSWORD,
      text: emailConfig.EMAIL_TEXT,
      html: generateResetPasswordEmailTemplate(email, token),
    };
    await transporter.sendMail(mailOptions);
}

 const resendOtpEmail = async(email, otp)=>{
    const mailOptions = {
      from: emailConfig.EMAIL_FROM,
      to: email,
      subject: emailConfig.EMAIL_SUBJECTS.RESEND_OTP,
      text: emailConfig.EMAIL_TEXT,
      html: generateResendOtpEmailTemplate(email, otp),
    };
    await transporter.sendMail(mailOptions);
}
module.exports = {sendWelcomeEmail, sendOtpForSignInEmail, sendResetPasswordEmail, resendOtpEmail};

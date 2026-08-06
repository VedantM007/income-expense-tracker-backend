const sesClient = require("../config/sesClient");
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const command = new SendEmailCommand({
            Source: emailConfig.EMAIL_FROM,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: html,
                        Charset: "UTF-8",
                    },
                    Text: {
                        Data: text,
                        Charset: "UTF-8",
                    },
                },
            },
        });

        await sesClient.send(command);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("SES Email Error:", error);
        throw error;
    }
};
const generateWelcomeEmailTempalate = require("../templates/welcomeEmail.template");
const generateOtpForSignInTemplate = require("../templates/otpForSignIn.template");
const generateResendOtpEmailTemplate  = require("../templates/resendOtpEmail.template");
const generateResetPasswordEmailTemplate = require("../templates/resetPasswordEmail.template")
const emailConfig = require("../config/email.config");



const sendWelcomeEmail = async (email, firstName, lastName) => {
    await sendEmail({
        to: email,
        subject: emailConfig.EMAIL_SUBJECTS.WELCOME,
        text: emailConfig.EMAIL_TEXT,
        html: generateWelcomeEmailTempalate(firstName, lastName),
    });
};

const sendOtpForSignInEmail = async (email, otp) => {
    await sendEmail({
        to: email,
        subject: emailConfig.EMAIL_SUBJECTS.SIGNIN_OTP,
        text: emailConfig.EMAIL_TEXT,
        html: generateOtpForSignInTemplate(email, otp),
    });
};

const sendResetPasswordEmail = async (email, token) => {
    await sendEmail({
        to: email,
        subject: emailConfig.EMAIL_SUBJECTS.RESET_PASSWORD,
        text: emailConfig.EMAIL_TEXT,
        html: generateResetPasswordEmailTemplate(email, token),
    });
};

const resendOtpEmail = async (email, otp) => {
    await sendEmail({
        to: email,
        subject: emailConfig.EMAIL_SUBJECTS.RESEND_OTP,
        text: emailConfig.EMAIL_TEXT,
        html: generateResendOtpEmailTemplate(email, otp),
    });
};
module.exports = {sendWelcomeEmail, sendOtpForSignInEmail, sendResetPasswordEmail, resendOtpEmail};

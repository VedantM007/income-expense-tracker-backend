const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/auth.config");
const crypto = require("crypto");
const emailService = require("../services/email.service");
const InvalidToken = require("../models/InvalidToken");

const {
    isValidEmail,
    isValidPassword,
    isValidOtp,
    isValidText
} = require("../utils/validation");

const signUp = async ({ firstName, lastName, email, password }) => {
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();

    if (
        !isValidText(firstName, 2, 50) ||
        !isValidText(lastName, 2, 50)
    ) {
        const error = new Error(
            "Valid first name and last name are required"
        );
        error.status = 400;
        throw error;
    }

    if (!isValidEmail(email)) {
        const error = new Error("Invalid email format");
        error.status = 400;
        throw error;
    }

    if (!isValidPassword(password)) {
        const error = new Error(
            "Password must be between 8 and 128 characters"
        );
        error.status = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.status = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        password,
        authConfig.BCRYPT_SALT_ROUNDS
    );

    await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    await emailService.sendWelcomeEmail(
        email,
        firstName,
        lastName
    );

    return {
        status: 201,
        success: "User created successfully, Welcome Email sent!"
    };
};

const signin = async ({ email, password }) => {
    email = email?.trim().toLowerCase();

    if (!isValidEmail(email) || !password) {
        const error = new Error("Invalid email or password");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpExpires =
        Date.now() +
        authConfig.OTP_EXPIRY_MINUTES * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await emailService.sendOtpForSignInEmail(email, otp);

    return {
        status: 200,
        success: "OTP sent to email. Please verify to complete sign-in."
    };
};

const verifyOtp = async ({ email, otp }) => {
    email = email?.trim().toLowerCase();

    if (!isValidEmail(email) || !isValidOtp(otp)) {
        const error = new Error("Invalid email or OTP");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or OTP");
        error.status = 401;
        throw error;
    }

    if (
        user.otp !== otp ||
        !user.otpExpires ||
        user.otpExpires < Date.now()
    ) {
        const error = new Error("Invalid or expired OTP");
        error.status = 401;
        throw error;
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        authConfig.JWT_SECRET,
        {
            expiresIn: authConfig.JWT_EXPIRY
        }
    );

    return {
        status: 200,
        success: "OTP verified successfully, You are logged in!",
        data: {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token
        }
    };
};

const resendOtp = async ({ email }) => {
    email = email?.trim().toLowerCase();

    if (!isValidEmail(email)) {
        const error = new Error("Invalid email");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email");
        error.status = 401;
        throw error;
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpExpires =
        Date.now() +
        authConfig.OTP_EXPIRY_MINUTES * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await emailService.resendOtpEmail(email, otp);

    return {
        status: 200,
        success: "OTP resent successfully to your email."
    };
};

const changePassword = async ({ oldPassword, newPassword }, userId) => {
    if (!userId || !oldPassword || !newPassword) {
        const error = new Error("All fields are required");
        error.status = 400;
        throw error;
    }

    if (!isValidPassword(newPassword)) {
        const error = new Error(
            "New password must be between 8 and 128 characters"
        );
        error.status = 400;
        throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Old password is incorrect");
        error.status = 400;
        throw error;
    }

    const hashedNewPassword = await bcrypt.hash(
        newPassword,
        authConfig.BCRYPT_SALT_ROUNDS
    );

    user.password = hashedNewPassword;

    await user.save();

    return {
        status: 200,
        success: "Password changed successfully."
    };
};

const sendResetPasswordEmail = async ({ email }) => {
    email = email?.trim().toLowerCase();

    if (!isValidEmail(email)) {
        const error = new Error("Invalid email");
        error.status = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return {
            status: 200,
            success:
                "If the email is registered, a reset password email has been sent."
        };
    }

    const token = jwt.sign(
        {
            userId: existingUser._id
        },
        authConfig.JWT_SECRET,
        {
            expiresIn: authConfig.RESET_PASSWORD_EXPIRY
        }
    );

    await emailService.sendResetPasswordEmail(email, token);

    return {
        status: 200,
        success:
            "If the email is registered, a reset password email has been sent."
    };
};

const verifyResetToken = async ({ token }) => {
    if (!token) {
        const error = new Error("Token is required");
        error.status = 400;
        throw error;
    }

    const isInvalid = await InvalidToken.findOne({ token });

    if (isInvalid) {
        const error = new Error(
            "Token has already been used or expired"
        );
        error.status = 400;
        throw error;
    }

    try {
        const decoded = jwt.verify(
            token,
            authConfig.JWT_SECRET
        );

        if (!decoded.userId) {
            const error = new Error("Invalid reset token");
            error.status = 400;
            throw error;
        }

        return {
            status: 200,
            success: "Token is valid",
            data: {
                userId: decoded.userId
            }
        };
    } catch (error) {
        if (error.status) {
            throw error;
        }

        const tokenError = new Error(
            error.name === "TokenExpiredError"
                ? "Reset token has expired"
                : "Invalid reset token"
        );

        tokenError.status = 400;
        throw tokenError;
    }
};

const resetPassword = async ({ token, newPassword }) => {
    if (!token || !newPassword) {
        const error = new Error(
            !token
                ? "Token is required"
                : "New password is required"
        );

        error.status = 400;
        throw error;
    }

    if (!isValidPassword(newPassword)) {
        const error = new Error(
            "New password must be between 8 and 128 characters"
        );
        error.status = 400;
        throw error;
    }

    const isInvalid = await InvalidToken.findOne({ token });

    if (isInvalid) {
        const error = new Error(
            "Token has already been used or expired"
        );
        error.status = 400;
        throw error;
    }

    let decoded;

    try {
        decoded = jwt.verify(
            token,
            authConfig.JWT_SECRET
        );
    } catch (error) {
        const tokenError = new Error(
            error.name === "TokenExpiredError"
                ? "Reset token has expired"
                : "Invalid reset token"
        );

        tokenError.status = 400;
        throw tokenError;
    }

    if (!decoded.userId) {
        const error = new Error("Invalid reset token");
        error.status = 400;
        throw error;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        authConfig.BCRYPT_SALT_ROUNDS
    );

    user.password = hashedPassword;

    await user.save();

    await InvalidToken.create({ token });

    return {
        status: 200,
        success: "Password reset successful. Please login."
    };
};

module.exports = {
    signUp,
    signin,
    verifyOtp,
    resendOtp,
    changePassword,
    sendResetPasswordEmail,
    verifyResetToken,
    resetPassword
};
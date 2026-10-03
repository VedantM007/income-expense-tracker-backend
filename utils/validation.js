const isValidEmail = (email) => {
    return (
        typeof email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
};

const isValidPassword = (password) => {
    return (
        typeof password === "string" &&
        password.length >= 8 &&
        password.length <= 128
    );
};

const isValidOtp = (otp) => {
    return typeof otp === "string" && /^\d{6}$/.test(otp);
};

const isValidText = (value, min = 1, max = 100) => {
    return (
        typeof value === "string" &&
        value.trim().length >= min &&
        value.trim().length <= max
    );
};

const isValidAmount = (amount) => {
    return (
        (typeof amount === "number" ||
            (typeof amount === "string" && amount.trim() !== "")) &&
        Number.isFinite(Number(amount)) &&
        Number(amount) > 0
    );
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidOtp,
    isValidText,
    isValidAmount
};
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRY: "1h",

    RESET_PASSWORD_EXPIRY: "10m",

    OTP_EXPIRY_MINUTES: 10,

    BCRYPT_SALT_ROUNDS: 10
};
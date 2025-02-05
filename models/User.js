const moongoose = require('mongoose');

const userSchema = new moongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: {type : String}, // To store the OTP
    otpExpires: {type : Date}, // To store OTP expiration time
});

module.exports = moongoose.model('User', userSchema);
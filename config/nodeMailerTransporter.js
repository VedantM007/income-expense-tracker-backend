const nodemailer = require('nodemailer');
const env = require('../environments/dev.env');
const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
       auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
         },
    secure: true,
    });

    module.exports = transporter;
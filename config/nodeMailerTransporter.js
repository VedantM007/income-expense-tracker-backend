const nodemailer = require('nodemailer');
const env = require('../environments/dev.env');

const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
       auth: {
            user: 'vedantmandwe5@gmail.com',
            pass: env.appPasswordKey,
         },
    secure: true,
    });

    module.exports = transporter;
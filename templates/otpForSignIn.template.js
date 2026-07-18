function generateOtpForSignInTemplate(email, otp){
    const currentYear = new Date().getFullYear();
    return `<!DOCTYPE html>
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
</html>`;
}

module.exports = generateOtpForSignInTemplate;
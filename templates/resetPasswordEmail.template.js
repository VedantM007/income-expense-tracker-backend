function generateResetPasswordEmailTemplate(email, token){
const currentYear = new Date().getFullYear();
return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
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
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
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
        <p>To reset your password please click on this <a href="https://income-expense-tracker-x2a3.onrender.com/reset-password/${token}">link</a></p>
        <p>This link is valid for 10 minutes. Please make sure to visit it within that time.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br> The Support Team</p>
      </div>
      <div class="footer">
        <p>© ${currentYear} Wayne Industries. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`

}

module.exports = generateResetPasswordEmailTemplate;
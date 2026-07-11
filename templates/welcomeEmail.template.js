function generateWelcomeEmailTemplate(firstName, lastName){
    const currentYear = new Date().getFullYear();
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
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
        <p>Hello ${firstName} ${lastName},</p>
       <p> Welcome to the Income and Expense Tracker, a powerful tool designed to
        help you manage your finances effortlessly. With features to track your
        income, monitor expenses, and gain insights into your spending habits,
        this project aims to promote smarter financial decisions and simplify
        personal budgeting.</p>
        <p>
          Click here to <a href="https://income-expense-tracker-x2a3.onrender.com/sign-in">Sign In</a> and get started with the Income-Expense Tracker
        </p>
        <p>Thank you,<br> The Support Team</p>
      </div>
      <div class="footer">
        <p>© ${currentYear} Vedant Mandwe. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
}

module.exports = generateWelcomeEmailTemplate
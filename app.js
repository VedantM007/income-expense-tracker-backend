require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')
const app = express();


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(bodyParser.json());

//Routes
app.use('/auth', authRoutes);
app.use('/income', incomeRoutes);
app.use('/expense', expenseRoutes);
app.use('/dashboard', dashboardRoutes);

module.exports = app;
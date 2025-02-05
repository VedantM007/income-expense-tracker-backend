const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(bodyParser.json());

//Routes
app.use('/auth', authRoutes);

//Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
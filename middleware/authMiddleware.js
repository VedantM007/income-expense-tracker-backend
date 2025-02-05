// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };

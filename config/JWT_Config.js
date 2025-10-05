const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_Secret = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_Secret, { expiresIn: '1h' });
}

const verifyToken = (token) => {
  return jwt.verify(token, JWT_Secret);
};

module.exports = { generateToken, verifyToken };
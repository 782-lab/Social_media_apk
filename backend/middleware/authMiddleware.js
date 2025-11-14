// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;

  // 1. Request ke headers se token nikaalna
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token 'Bearer <token>' format mein hota hai, humein sirf token chahiye
      token = req.headers.authorization.split(' ')[1];

      // 2. Token ko verify karna (hamare JWT_SECRET se)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Token se user ki ID nikaal kar, user ko database se dhoondhna
      // Password ko chhodkar (select('-password'))
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Sab sahi hai, toh agle step (Controller) par jaane dena
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // 5. Agar token nahi mila, toh error dena
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };
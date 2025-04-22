// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // If there's no token, return unauthorized
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user info to request object
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to next middleware or route handler
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

export default protect;

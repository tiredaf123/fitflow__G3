import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';  // Use an environment variable for security

/**
 * Middleware to protect routes - verifies JWT and sets req.user & req.userId
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fix: Use decoded.userId instead of decoded.id
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      console.error('TOKEN ERROR:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;

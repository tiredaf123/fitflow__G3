import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';  // Use an environment variable for security

/**
 * Middleware to protect routes - verifies JWT and sets req.user & req.userId
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
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

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and decode the user ID
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch the user from the database, excluding the password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user data and ID to the request for use in subsequent routes
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Role-based access control middleware
 * Usage: router.get('/', protect, authorize('trainer'), handler);
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if the user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};

export default protect;

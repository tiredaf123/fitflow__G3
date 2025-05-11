import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adjust this if your token payload uses 'userId' instead of 'id'
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    if (decoded.role === 'trainer') {
      req.user = await Trainer.findById(userId).select('-password');
    } else {
      req.user = await User.findById(userId).select('-password');
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('TOKEN ERROR:', err);
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({ message: isExpired ? 'Token expired' : 'Not authorized, token failed' });
  }
};

export default protect;

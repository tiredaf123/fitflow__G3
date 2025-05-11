import jwt from 'jsonwebtoken';
import Trainer from '../models/Trainer.js';

const protectTrainer = async (req, res, next) => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded.role !== 'trainer') {
        return res.status(403).json({ message: 'Access denied: Not a trainer' });
      }

      const trainer = await Trainer.findById(decoded.id).select('-password');
      if (!trainer) {
        return res.status(401).json({ message: 'Trainer not found' });
      }

      req.user = trainer;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      console.error('Trainer token error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protectTrainer;

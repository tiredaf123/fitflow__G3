// middleware/protectUser.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectUser = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  let token;

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not defined.');
    return res.status(500).json({ message: 'Server error' });
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // ⚠️ Make sure this matches what your controller expects
      req.user = { userId: user._id };
      next();
    } catch (err) {
      console.error('User token error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protectUser;

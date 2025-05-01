// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not defined in .env file. Using fallback default.');
}

// ✅ Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// User Signup
export const signup = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// User Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Streak calculation logic
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterDateStr = yesterday.toISOString().split('T')[0];

    if (user.lastLoginDate !== today) {
      if (user.lastLoginDate === yesterDateStr) {
        user.loginStreak += 1;
      } else {
        user.loginStreak = 1;
      }
      user.lastLoginDate = today;
      await user.save();
    }

    const token = generateToken(user._id);

    // ✅ Include streak info in response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        loginStreak: user.loginStreak,
        lastLoginDate: user.lastLoginDate,
        // Include more fields if needed
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get Current Authenticated User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Failed to get current user', error: err.message });
  }
};

// Logout (frontend concern for token-based apps)
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

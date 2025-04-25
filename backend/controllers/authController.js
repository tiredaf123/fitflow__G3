// controllers/authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not defined, using default secret');
}

// Helper: generate a JWT for a user ID
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// User Signup Route
export const signup = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    // Check for existing username
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Create welcome achievement
    await Achievement.create({
      userId: user._id,
      title: 'Welcome to FitFlow!',
      description: 'You’ve joined the fitness journey. Let’s get started! 💪',
      date: new Date(),
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// User Login Route
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Handle login streak
    const today = new Date();
    const last = user.lastLoginDate;
    let streak = user.loginStreak || 1;

    if (last) {
      const diffMs = today - new Date(last);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      } // if diffDays===0, same-day login, keep streak
    } else {
      streak = 1;
    }

    // Update user streak info
    user.lastLoginDate = today;
    user.loginStreak = streak;
    await user.save();

    // Award 3-day streak achievement
    if (streak === 3) {
      const exists = await Achievement.findOne({
        userId: user._id,
        title: '3-Day Login Streak!',
      });
      if (!exists) {
        await Achievement.create({
          userId: user._id,
          title: '3-Day Login Streak!',
          description: 'Logged in 3 days in a row. Keep it going! 🔥',
          date: new Date(),
        });
      }
    }

    // Generate token & respond
    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get Current User
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

// Logout Route
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

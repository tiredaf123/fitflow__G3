import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not defined, using default secret');
}

// 🔐 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Signup Controller
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const trimmedFullName = fullName?.trim();
    const trimmedUsername = username?.trim().toLowerCase();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedFullName || !trimmedUsername || !trimmedEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: trimmedFullName,
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
    });

    // Welcome Achievement
    await Achievement.create({
      userId: user._id,
      title: 'Welcome to FitFlow!',
      description: 'You’ve joined the fitness journey. Let’s get started! 💪',
      date: new Date(),
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Signup successful',
      token,
      isAdmin: user.isAdmin,
      username: user.username,
      fullName: user.fullName,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (
    !username || typeof username !== 'string' || username.trim() === '' ||
    !password || typeof password !== 'string' || password.trim() === ''
  ) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🧠 Login Streak Logic
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let updatedStreak = user.loginStreak;

    if (user.lastLoginDate === todayStr) {
      // Already logged in today – do nothing
    } else if (user.lastLoginDate === yesterdayStr) {
      updatedStreak += 1;
    } else {
      updatedStreak = 1;
    }

    user.lastLoginDate = todayStr;
    user.loginStreak = updatedStreak;
    await user.save();

    // 🏆 Add 3-day login streak achievement
    if (updatedStreak >= 3) {
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

    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      isAdmin: user.isAdmin,
      username: user.username,
      fullName: user.fullName,
      loginStreak: user.loginStreak,
      lastLoginDate: user.lastLoginDate,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ✅ Get Current Authenticated User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      photoURL: user.photoURL || null,
      isAdmin: user.isAdmin,
      username: user.username,
    });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Failed to get current user', error: err.message });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;

  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return res.status(400).json({ message: 'Full name is required and must be a non-empty string' });
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return res.status(400).json({ message: 'Phone must be a string' });
  }

  try {
    const user = req.user; // loaded by auth middleware
    user.fullName = fullName.trim();
    user.phone = phone !== undefined ? phone.trim() : user.phone;
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      fullName: user.fullName,
      phone: user.phone,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// ✅ Logout (optional stateless)
export const logout = async (req, res) => {
  try {
    // Token invalidation can be handled via token blacklist if needed.
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

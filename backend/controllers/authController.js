import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not defined in .env file. Using fallback default.');
}

// Generate JWT token
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

// Signup controller
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Validate inputs
    if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        message: 'All fields are required and password must be at least 6 characters long',
      });
    }

    const trimmedUsername = username.toLowerCase().trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedFullName = fullName.trim();

    // Check if username already exists
    const existingUsername = await User.findOne({ username: trimmedUsername });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: trimmedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullName: trimmedFullName,
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
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

// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (
    !username || typeof username !== 'string' || username.trim() === '' ||
    !password || typeof password !== 'string' || password === ''
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

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      isAdmin: user.isAdmin,
      username: user.username,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get current authenticated user
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

// Update user profile (fullName and phone)
export const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;

  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return res.status(400).json({ message: 'Full name is required and must be a non-empty string' });
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return res.status(400).json({ message: 'Phone must be a string' });
  }

  try {
    const user = req.user; // ✅ already loaded in protect middleware

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

// Logout controller (optional)
export const logout = async (req, res) => {
  try {
    // If you implement token invalidation, do it here.
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

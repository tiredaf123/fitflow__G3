import User from '../models/User.js'; // For accessing user model
import WeightEntry from '../models/WeightEntry.js'; // Assuming you're saving weight entries
// controllers/profileController.js
import User from '../models/User.js';
import UserProfile from '../models/profile.js';
import WeightEntry from '../models/WeightEntry.js';
import { cloudinary } from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// ✅ Get current user's profile
export const getMe = async (req, res) => {
  try {
    const profile = await User.findById(req.user._id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      photoURL: req.user.photoURL || null,
      profile: {
        gender: profile.gender || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        goal: profile.goal || '',
      },
    });
  } catch (err) {
    console.error('GET PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Save or update profile info
export const saveProfileData = async (req, res) => {
  const { gender, age, height, weight, goal } = req.body;

  try {
    let profile = await User.findOne({ userId: req.user._id });

    if (profile) {
      profile.gender = gender;
      profile.age = age;
      profile.height = height;
      profile.weight = weight;
      profile.goal = goal;
      await profile.save();
    } else {
      profile = await User.create({
        userId: req.user._id,
        gender,
        age,
        height,
        weight,
        goal,
      });
    }

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    console.error('SAVE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Failed to save profile', error: err.message });
  }
};

// ✅ Update profile directly
export const updateProfile = async (req, res) => {
  const { gender, age, height, weight, goal } = req.body;

  try {
    const updated = await User.findOneAndUpdate(
      { userId: req.user._id },
      { gender, age, height, weight, goal },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile updated', profile: updated });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Save a new weight entry
export const saveWeight = async (req, res) => {
  const { weight, date } = req.body;

  try {
    const entry = new WeightEntry({
      userId: req.user._id,
      weight,
      date: date || new Date(),
    });

    await entry.save();

    res.status(201).json({ message: 'Weight saved successfully', entry });
  } catch (err) {
    console.error('SAVE WEIGHT ERROR:', err);
    res.status(500).json({ message: 'Failed to save weight', error: err.message });
  }
};

// ✅ Get current weight and weight history
export const getWeightData = async (req, res) => {
  try {
    const entries = await WeightEntry.find({ userId: req.user._id }).sort({ date: -1 });

    const currentWeight = entries.length > 0 ? {
      weight: entries[0].weight,
      date: entries[0].date,
    } : null;

    res.status(200).json({ currentWeight, history: entries });
  } catch (err) {
    console.error('GET WEIGHT ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch weight history', error: err.message });
  }
};

// @desc    Get the current membership deadline
// @route   GET /api/profile/membership
// @access  Private
export const getMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ membershipDeadline: user.membershipDeadline });
  } catch (err) {
    console.error('GET MEMBERSHIP ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch membership deadline', error: err.message });
  }
};

// @desc    Update membership deadline for the current user
// @route   PUT /api/profile/membership
// @access  Private
export const updateMembership = async (req, res) => {
  const { membershipDeadline } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.membershipDeadline = membershipDeadline || user.membershipDeadline;
    await user.save();

    res.status(200).json({
      message: 'Membership updated successfully',
      membershipDeadline: user.membershipDeadline
    });
  } catch (err) {
    console.error('UPDATE MEMBERSHIP ERROR:', err);
    res.status(500).json({ message: 'Failed to update membership', error: err.message });
  }
};

// ==============================
// NEW: Get All Clients for Trainer
// ==============================
export const getClients = async (req, res) => {
  try {
    // Exclude the current user (trainer) and return all other users
    const clients = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.status(200).json(clients);
  } catch (err) {
    console.error('GET CLIENTS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
// ✅ Upload profile photo using Cloudinary
export const uploadProfilePhoto = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'fitflow-profile-images',
        resource_type: 'image',
        transformation: [{ width: 400, height: 400, crop: 'limit' }],
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }

        const user = await User.findByIdAndUpdate(
          req.user._id,
          { photoURL: result.secure_url },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ photoURL: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error('UPLOAD PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
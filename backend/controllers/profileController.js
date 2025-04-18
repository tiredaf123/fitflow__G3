// controllers/profileController.js

import UserProfile from '../models/Profile.js';
import WeightEntry from '../models/WeightEntry.js';

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });

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

// @desc    Save or update profile info (onboarding)
// @route   POST /api/profile/save
// @access  Private
export const saveProfileData = async (req, res) => {
  const { gender, age, height, weight, goal } = req.body;

  try {
    let profile = await UserProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile.gender = gender;
      profile.age = age;
      profile.height = height;
      profile.weight = weight;
      profile.goal = goal;
      await profile.save();
    } else {
      profile = await UserProfile.create({
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

// @desc    Update profile directly
// @route   PUT /api/profile/update
// @access  Private
export const updateProfile = async (req, res) => {
  const { gender, age, height, weight, goal } = req.body;

  try {
    const updated = await UserProfile.findOneAndUpdate(
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

// @desc    Save a new weight entry
// @route   POST /api/profile/weight
// @access  Private
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

// @desc    Get current weight and weight history
// @route   GET /api/profile/weight
// @access  Private
export const getWeightData = async (req, res) => {
  try {
    const entries = await WeightEntry.find({ userId: req.user._id }).sort({ date: -1 });

    const currentWeight = entries.length > 0 ? {
      weight: entries[0].weight,
      date: entries[0].date
    } : null;

    res.status(200).json({
      currentWeight,
      history: entries
    });
  } catch (err) {
    console.error('GET WEIGHT ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch weight history', error: err.message });
  }
};

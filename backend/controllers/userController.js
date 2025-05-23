// controllers/userController.js
import User from '../models/User.js';
import { checkStreakAchievements } from './achievementController.js';

/**
 * @desc   Get and update login streak info for authenticated user
 * @route  GET /api/users/streak
 * @access Private
 */
export const getStreakInfo = async (req, res) => {
  try {
    const user = req.user;
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Initialize streak if doesn't exist
    if (typeof user.loginStreak !== 'number') {
      user.loginStreak = 0;
    }

    let streakUpdated = false;
    let lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    
    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0); // Normalize to start of day
      const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day login
        user.loginStreak += 1;
        streakUpdated = true;
      } else if (diffDays > 1) {
        // Broken streak - reset to 1
        user.loginStreak = 1;
        streakUpdated = true;
      }
      // diffDays === 0 means already logged in today - no change
    } else {
      // First login
      user.loginStreak = 1;
      streakUpdated = true;
    }

    // Always update last login date
    user.lastLoginDate = now;

    // Check for achievements only if streak was updated
    let unlockedAchievements = [];
    if (streakUpdated) {
      unlockedAchievements = await checkStreakAchievements(user._id, user.loginStreak);
      await user.save();
    }

    res.status(200).json({
      success: true,
      loginStreak: user.loginStreak,
      lastLoginDate: user.lastLoginDate,
      streakUpdated,
      unlockedAchievements: unlockedAchievements.map(ach => ({
        id: ach._id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
      })),
    });

  } catch (err) {
    console.error('STREAK UPDATE ERROR:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update streak',
      error: err.message 
    });
  }
};

/**
 * @desc   Get current streak info without updating
 * @route  GET /api/users/streak/check
 * @access Private
 */
export const checkStreakInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loginStreak lastLoginDate');
    
    res.status(200).json({
      success: true,
      loginStreak: user.loginStreak || 0,
      lastLoginDate: user.lastLoginDate || null,
    });
  } catch (err) {
    console.error('STREAK CHECK ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to check streak',
      error: err.message
    });
  }
};
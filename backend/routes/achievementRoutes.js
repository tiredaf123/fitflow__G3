import express from 'express';
import {
  getAchievementsByUserId,
  unlockAchievement,
  checkStreakAchievements,
  getAchievements,
  addAchievement,
} from '../controllers/achievementController.js';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// GET achievements of the currently logged-in user (with streak info)
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('loginStreak lastLogin achievements newAchievements');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check for streak achievements
  const newAchievements = [];
  
  if (user.loginStreak >= 7 && !user.achievements.includes('7_day_streak')) {
    user.achievements.push('7_day_streak');
    newAchievements.push('7_day_streak');
  }
  
  if (user.loginStreak >= 30 && !user.achievements.includes('30_day_streak')) {
    user.achievements.push('30_day_streak');
    newAchievements.push('30_day_streak');
  }
  
  // Add any new achievements to the newAchievements array
  if (newAchievements.length > 0) {
    user.newAchievements = [...new Set([...user.newAchievements, ...newAchievements])];
    await user.save();
  }
  
  res.json({
    success: true,
    streak: user.loginStreak,
    lastLogin: user.lastLogin,
    achievements: user.achievements,
    newAchievements: user.newAchievements
  });
}));

// POST unlock a specific achievement
router.post('/unlock', protect, asyncHandler(async (req, res) => {
  const { achievementId } = req.body;
  
  if (!achievementId) {
    res.status(400);
    throw new Error('Please provide an achievementId');
  }
  
  const achievement = await unlockAchievement(req.user.id, achievementId);
  res.json({
    success: true,
    data: achievement
  });
}));

// POST check for new streak achievements
router.post('/check-streaks', protect, asyncHandler(async (req, res) => {
  const { currentStreak } = req.body;
  
  if (typeof currentStreak !== 'number') {
    res.status(400);
    throw new Error('Please provide a valid currentStreak number');
  }
  
  const unlocked = await checkStreakAchievements(req.user.id, currentStreak);
  res.json({
    success: true,
    data: unlocked
  });
}));

// GET by explicit userId (admin route)
router.get('/:userId', protect, getAchievements);

// POST a new achievement (admin route)
router.post('/', protect, addAchievement);

export default router;
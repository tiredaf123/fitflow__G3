import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

// Predefined streak achievements with IDs for better tracking
const STREAK_ACHIEVEMENTS = Object.freeze({
  SEVEN_DAY: {
    id: 'streak_7day',
    title: '7-Day Streak', 
    description: 'Logged in for 7 consecutive days!', 
    icon: 'zap',
    type: 'streak',
    requiredDays: 7
  },
  TWO_WEEK: {
    id: 'streak_14day',
    title: '2-Week Streak', 
    description: 'Logged in for 14 consecutive days!', 
    icon: 'battery',
    type: 'streak',
    requiredDays: 14
  },
  MONTHLY: {
    id: 'streak_30day',
    title: 'Monthly Streak', 
    description: 'Logged in for 30 consecutive days!', 
    icon: 'calendar',
    type: 'streak',
    requiredDays: 30
  },
  QUARTERLY: {
    id: 'streak_90day',
    title: 'Quarterly Streak', 
    description: 'Logged in for 90 consecutive days!', 
    icon: 'award',
    type: 'streak',
    requiredDays: 90
  },
  YEARLY: {
    id: 'streak_365day',
    title: 'Yearly Streak', 
    description: 'Logged in for 365 consecutive days!', 
    icon: 'star',
    type: 'streak',
    requiredDays: 365
  }
});

// Helper function to get streak achievement by days
const getStreakAchievement = (days) => {
  return Object.values(STREAK_ACHIEVEMENTS).find(
    achievement => days === achievement.requiredDays
  );
};

// Get all achievements for a user (including potential streak achievements)
export const getAchievementsByUserId = async (userId, currentStreak = 0) => {
  try {
    const [unlockedAchievements, user] = await Promise.all([
      Achievement.find({ userId }),
      User.findById(userId).select('loginStreak lastLogin')
    ]);

    // Get relevant streak achievements
    const potentialStreakAchievements = Object.values(STREAK_ACHIEVEMENTS)
      .filter(sa => currentStreak >= sa.requiredDays)
      .map(sa => ({
        ...sa,
        isUnlocked: unlockedAchievements.some(ua => ua.achievementId === sa.id),
        unlockedAt: unlockedAchievements.find(ua => ua.achievementId === sa.id)?.unlockedAt || null
      }));

    return {
      unlocked: unlockedAchievements,
      potential: potentialStreakAchievements.filter(psa => 
        !unlockedAchievements.some(ua => ua.achievementId === psa.id)
      ),
      streakInfo: {
        currentStreak: user?.loginStreak || 0,
        lastLogin: user?.lastLogin || null
      }
    };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw new Error('Failed to fetch achievements');
  }
};

// Unlock an achievement with validation
export const unlockAchievement = async (userId, achievementData) => {
  if (!achievementData?.id) {
    throw new Error('Achievement ID is required');
  }

  try {
    const existing = await Achievement.findOne({ 
      userId, 
      achievementId: achievementData.id 
    });

    if (existing) {
      return existing;
    }

    const achievement = new Achievement({
      userId,
      achievementId: achievementData.id,
      title: achievementData.title,
      description: achievementData.description,
      icon: achievementData.icon,
      type: achievementData.type || 'general',
      isUnlocked: true,
      unlockedAt: new Date(),
      metadata: achievementData.metadata || {}
    });

    await achievement.save();
    
    // Optionally update user's achievement count
    await User.findByIdAndUpdate(userId, {
      $inc: { achievementCount: 1 }
    });

    return achievement;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw new Error('Failed to unlock achievement');
  }
};

// Check and unlock streak achievements
export const checkStreakAchievements = async (userId, currentStreak) => {
  if (!currentStreak || currentStreak < 1) {
    return [];
  }

  try {
    const unlockedAchievements = await Achievement.find({ 
      userId, 
      type: 'streak' 
    });

    const achievementsToCheck = Object.values(STREAK_ACHIEVEMENTS)
      .filter(sa => 
        currentStreak >= sa.requiredDays && 
        !unlockedAchievements.some(ua => ua.achievementId === sa.id)
      );

    const results = await Promise.all(
      achievementsToCheck.map(achievement => 
        unlockAchievement(userId, achievement)
      )
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error('Error checking streak achievements:', error);
    throw new Error('Failed to check streak achievements');
  }
};

// Get achievements by specific user ID
export const getAchievements = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await Achievement.find({ userId })
      .sort({ unlockedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch achievements' 
    });
  }
};

// Add a custom achievement with validation
export const addAchievement = async (req, res) => {
  try {
    const { title, description, icon, type } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const achievement = new Achievement({
      userId: req.user.id,
      title,
      description,
      icon: icon || 'award',
      type: type || 'general',
      isUnlocked: true,
      unlockedAt: new Date()
    });

    const savedAchievement = await achievement.save();
    
    res.status(201).json({
      success: true,
      data: savedAchievement
    });
  } catch (error) {
    console.error('Error saving achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save achievement'
    });
  }
};
import Achievement from '../models/achievement.js';

// Get achievements by specific user ID (used by /me route)
export const getAchievementsByUserId = async (userId) => {
  try {
    const achievements = await Achievement.find({ userId }); // ✅ fixed field name
    return achievements;
  } catch (error) {
    throw new Error('Error fetching achievements');
  }
};

// Get achievements using userId from params
export const getAchievements = async (req, res) => {
  const { userId } = req.params;
  try {
    const achievements = await Achievement.find({ userId }); // ✅ fixed field name
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

// Add a new achievement for the authenticated user
export const addAchievement = async (req, res) => {
  const { title, description } = req.body;
  try {
    const achievement = new Achievement({
      userId: req.user.id, // ✅ fixed field name
      title,
      description,
    });
    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(500).json({ message: 'Error saving achievement' });
  }
};

import express from 'express';
import {
  getAchievements,
  addAchievement,
  getAchievementsByUserId, // ✅ Add this line
} from '../controllers/achievementController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET achievements of the currently logged-in user
router.get('/me', protect, async (req, res, next) => {
  try {
    const achs = await getAchievementsByUserId(req.user.id); // cleaner than req.userId
    return res.json(achs);
  } catch (err) {
    next(err);
  }
});


// GET by explicit userId (optional route)
router.get('/:userId', protect, getAchievements);

// POST a new achievement
router.post('/', protect, addAchievement);

export { router };

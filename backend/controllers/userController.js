// controllers/userController.js
import User from '../models/User.js';

/**
 * @desc   Get login streak info for authenticated user
 * @route  GET /api/users/streak
 * @access Private
 */
export const getStreakInfo = async (req, res) => {
  try {
    //  Use userId from JWT
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      loginStreak: user.loginStreak || 0,
      lastLoginDate: user.lastLoginDate || 'N/A',
    });
  } catch (err) {
    console.error('STREAK FETCH ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch streak', error: err.message });
  }
};

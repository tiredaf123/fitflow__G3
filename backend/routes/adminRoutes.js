import express from 'express';
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js'; // optional

const router = express.Router();

// Get all members with an active or past membership
router.get('/members', protect, isAdmin, async (req, res) => {
  try {
    const members = await Membership.find({
      status: { $in: ['active', 'past_due', 'incomplete'] }
    })
    .populate('user', 'username email fullName')
    .sort({ currentPeriodEnd: -1 });

    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

export default router;

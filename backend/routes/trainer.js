import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/trainers - Add a trainer to the current user
router.post('/', protect, async (req, res) => {
  const { name, specialization } = req.body;

  if (!name || !specialization) {
    return res.status(400).json({ message: 'Name and specialization are required' });
  }

  try {
    // Create a new trainer
    const newTrainer = await Trainer.create({
      name,
      specialization,
      clients: [req.user._id], // Link client to trainer
    });

    // Update the user to include this trainer
    const user = await User.findById(req.user._id);
    user.trainers.push(newTrainer._id);
    await user.save();

    res.status(201).json(newTrainer);
  } catch (err) {
    console.error('Error adding trainer:', err);
    res.status(500).json({ message: 'Server error while adding trainer.' });
  }
});

// GET /api/trainers - Get all trainers for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('trainers');
    res.status(200).json(user.trainers);
  } catch (err) {
    console.error('Error fetching trainers:', err);
    res.status(500).json({ message: 'Server error while fetching trainers.' });
  }
});

export default router;

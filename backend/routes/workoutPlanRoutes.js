// routes/workoutPlanRoutes.js
import express from 'express';
import protect from '../middleware/authMiddleware.js';
import WorkoutPlan from '../models/WorkoutPlan.js';

const router = express.Router();

// POST /api/workouts
router.post('/', protect, async (req, res) => {
  const { clientId, title, description, duration } = req.body;

  if (!clientId || !title || !description || !duration) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const plan = await WorkoutPlan.create({
      trainerId: req.user._id, // trainer's ID from the token
      clientId,
      title,
      description,
      duration,
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error('Error creating workout plan:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/workouts/:clientId - Fetch workout plans for a client
router.get('/:clientId', protect, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (err) {
    console.error('Error fetching workout plans:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;

import WorkoutPlan from '../models/WorkoutPlan.js';
import DietPlan from '../models/DietPlan.js';

// Create a new Workout Plan for a client
export const createWorkoutPlan = async (req, res) => {
  const { clientId, title, description, duration } = req.body;
  const trainerId = req.user._id;  // Corrected from req.userId to req.user._id

  if (!clientId || !title || !description || !duration) {
    return res.status(400).json({ message: 'clientId, title, description, and duration are required.' });
  }

  try {
    const plan = await WorkoutPlan.create({
      trainerId,
      clientId,
      title,
      description,
      duration,
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error('Failed to create workout plan:', err);
    res.status(500).json({ message: 'Failed to create workout plan', error: err.message });
  }
};

// Get all Workout Plans created by this trainer
export const getWorkoutPlans = async (req, res) => {
  const trainerId = req.user._id;  // Corrected from req.userId to req.user._id
  try {
    const plans = await WorkoutPlan.find({ trainerId }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (err) {
    console.error('Failed to fetch workout plans:', err);
    res.status(500).json({ message: 'Failed to fetch workout plans', error: err.message });
  }
};

// Create a new Diet Plan for a client
export const createDietPlan = async (req, res) => {
  const { clientId, title, meals } = req.body;
  const trainerId = req.user._id;  // Corrected from req.userId to req.user._id

  if (!clientId || !title || !Array.isArray(meals) || meals.length === 0) {
    return res.status(400).json({ message: 'clientId, title, and at least one meal are required.' });
  }

  try {
    const plan = await DietPlan.create({
      trainerId,
      clientId,
      title,
      meals,
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error('Failed to create diet plan:', err);
    res.status(500).json({ message: 'Failed to create diet plan', error: err.message });
  }
};

// Get all Diet Plans created by this trainer
export const getDietPlans = async (req, res) => {
  const trainerId = req.user._id;  // Corrected from req.userId to req.user._id
  try {
    const plans = await DietPlan.find({ trainerId }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (err) {
    console.error('Failed to fetch diet plans:', err);
    res.status(500).json({ message: 'Failed to fetch diet plans', error: err.message });
  }
};

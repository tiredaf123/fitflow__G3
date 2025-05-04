import WorkoutPlan from '../models/WorkoutPlan.js';
import DietPlan from '../models/DietPlan.js';

// Create a Workout Plan
export const createWorkoutPlan = async (req, res) => {
  const { clientId, title, description, exercises } = req.body;
  try {
    const plan = await WorkoutPlan.create({
      trainerId: req.user.id,
      clientId,
      title,
      description,
      exercises
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create workout plan', error: err.message });
  }
};

// Create a Diet Plan
export const createDietPlan = async (req, res) => {
  const { clientId, title, meals, description } = req.body;
  try {
    const plan = await DietPlan.create({
      trainerId: req.user.id,
      clientId,
      title,
      meals,
      description
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create diet plan', error: err.message });
  }
};

// Get all plans for a client
export const getClientPlans = async (req, res) => {
  const { clientId } = req.params;
  try {
    const workoutPlans = await WorkoutPlan.find({ clientId });
    const dietPlans = await DietPlan.find({ clientId });
    res.status(200).json({ workoutPlans, dietPlans });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans', error: err.message });
  }
};

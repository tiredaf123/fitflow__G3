import Workout from '../models/Workout.js';

// @desc    Create a new workout
// @route   POST /api/workouts/add
// @access  Private (Trainer only)
// @desc    Create a new workout
// @route   POST /api/workouts/add
// @access  Private (Trainer only)
export const addWorkout = async (req, res) => {
  try {
    const { title, description, duration, imageUrl } = req.body;
    const trainerId = req.user._id;

    if (!title || !description || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newWorkout = new Workout({
      title,
      description,
      duration,
      imageUrl: imageUrl || '',
      createdByTrainer: trainerId,
      userId: req.body.userId || null,
    });

    await newWorkout.save();
    res.status(201).json({ message: 'Workout created successfully', workout: newWorkout });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Server error while creating workout' });
  }
};


// @desc    Get all workouts (for all users)
// @route   GET /api/workouts
// @access  Public
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('createdByTrainer', 'username fullName imageUrl') // 👈 includes trainer info
      .sort({ createdAt: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Get all workouts error:', error);
    res.status(500).json({ message: 'Failed to retrieve workouts' });
  }
};


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

import Trainer from '../models/Trainer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// POST /api/trainers
export const createTrainer = async (req, res) => {
  try {
    console.log('req.body:', req.body); // ADD THIS LINE
    console.log('req.file:', req.file); // ADD THIS LINE
    const { username, password, bio, specialties } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existing = await Trainer.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Trainer username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Construct the full image URL
    const imageUrl = req.file ? `${process.env.SERVER_URL}/uploads/profile/${req.file.filename}` : '';

    const newTrainer = new Trainer({
      username,
      password: hashedPassword,
      bio,
      specialties: specialties?.split(',').map(s => s.trim()) || [],
      imageUrl,
    });

    await newTrainer.save();
    res.status(201).json({ message: 'Trainer created', trainer: newTrainer });
  } catch (err) {
    console.error('Trainer creation error:', err);
    res.status(500).json({ message: 'Failed to create trainer', error: err.message });
  }
};
// POST /api/trainers/login
export const loginTrainer = async (req, res) => {
  const { username, password } = req.body;

  try {
    const trainer = await Trainer.findOne({ username });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: trainer._id, role: 'trainer' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, trainer });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// GET /api/trainers
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trainers', error: err.message });
  }
};

// PUT /api/trainers/:id
export const updateTrainer = async (req, res) => {
  const { bio, specialties, imageUrl } = req.body;

  try {
    const updated = await Trainer.findByIdAndUpdate(
      req.params.id,
      { bio, specialties, imageUrl },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({ message: 'Trainer updated', trainer: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/trainers/:id
export const deleteTrainer = async (req, res) => {
  try {
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({ message: 'Trainer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

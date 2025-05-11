import Trainer from '../models/Trainer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST /api/trainers - Create new trainer (Admin only)
export const createTrainer = async (req, res) => {
  try {
    const { username, password, bio, specialties } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existing = await Trainer.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Trainer username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = req.file ? `uploads/profile/${req.file.filename}` : '';

    const newTrainer = new Trainer({
      username,
      password: hashedPassword,
      bio: bio || '',
      specialties: specialties
        ? Array.isArray(specialties)
          ? specialties
          : specialties.split(',').map(s => s.trim())
        : [],
      imageUrl,
    });

    await newTrainer.save();
    res.status(201).json({ message: 'Trainer created', trainer: newTrainer });
  } catch (err) {
    console.error('Trainer creation error:', err);
    res.status(500).json({ message: 'Failed to create trainer', error: err.message });
  }
};

// POST /api/trainers/login - Trainer login
export const loginTrainer = async (req, res) => {
  const { username, password } = req.body;

  try {
    const trainer = await Trainer.findOne({ username });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: trainer._id, role: 'trainer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password before sending trainer data
    const trainerData = trainer.toObject();
    delete trainerData.password;

    res.status(200).json({ token, trainer: trainerData });
  } catch (err) {
    console.error('Trainer login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// GET /api/trainers - Get all trainers (Admin only)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().select('-password');
    res.status(200).json(trainers);
  } catch (err) {
    console.error('Get all trainers error:', err);
    res.status(500).json({ message: 'Failed to fetch trainers', error: err.message });
  }
};

// GET /api/trainers/public - Public route to get trainers (no password)
export const getPublicTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().select('-password');
    res.status(200).json(trainers);
  } catch (err) {
    console.error('Get public trainers error:', err);
    res.status(500).json({ message: 'Failed to fetch trainers', error: err.message });
  }
};

// PUT /api/trainers/:id - Update trainer (Admin only)
export const updateTrainer = async (req, res) => {
  const { bio, specialties, imageUrl } = req.body;

  try {
    const updated = await Trainer.findByIdAndUpdate(
      req.params.id,
      {
        bio: bio || '',
        specialties: specialties
          ? Array.isArray(specialties)
            ? specialties
            : specialties.split(',').map(s => s.trim())
          : [],
        imageUrl: imageUrl || '',
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({ message: 'Trainer updated', trainer: updated });
  } catch (err) {
    console.error('Update trainer error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/trainers/:id - Delete trainer (Admin only)
export const deleteTrainer = async (req, res) => {
  try {
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({ message: 'Trainer deleted' });
  } catch (err) {
    console.error('Delete trainer error:', err);
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

// GET /api/trainers/me - Get logged-in trainer profile
export const getMyTrainerProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.status(200).json(req.user);
  } catch (err) {
    console.error('Error fetching trainer profile:', err);
    res.status(500).json({ message: 'Failed to fetch trainer profile' });
  }
};

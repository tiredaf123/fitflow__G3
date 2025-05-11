import express from 'express';
import { addWorkout, getAllWorkouts } from '../controllers/workoutController.js';
import protectTrainer from '../middleware/protectTrainer.js';
import { memoryStorage } from '../middleware/multerMemory.js';
import uploadWorkoutImage from '../middleware/uploadWorkoutImage.js';

const router = express.Router();

router.post(
  '/add',
  protectTrainer,
  memoryStorage.single('image'), // field name must be 'image'
  uploadWorkoutImage,
  addWorkout
);

router.get('/', getAllWorkouts);

export default router;

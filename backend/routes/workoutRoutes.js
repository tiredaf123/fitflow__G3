import express from 'express';
import { addWorkout, getAllWorkouts } from '../controllers/workoutController.js';
import protectTrainer from '../middleware/protectTrainer.js';
import multer from 'multer';
import uploadWorkoutMedia from '../middleware/uploadWorkoutMedia.js';

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'), false);
    }
  }
});

router.post(
  '/add',
  protectTrainer,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  uploadWorkoutMedia,
  addWorkout
);

router.get('/', getAllWorkouts);

export default router;
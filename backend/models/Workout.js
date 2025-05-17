// models/Workout.js
import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    imageUrl: {
      type: String, // e.g. Cloudinary URL or file path
      default: '',   // Optional default value
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Workout', workoutSchema);

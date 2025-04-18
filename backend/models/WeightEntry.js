import mongoose from 'mongoose';

const weightEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  weight: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model('WeightEntry', weightEntrySchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderRole' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverRole' },
    senderRole: { type: String, enum: ['Trainer', 'User'], required: true },
    receiverRole: { type: String, enum: ['Trainer', 'User'], required: true },
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);


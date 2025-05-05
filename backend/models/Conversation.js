import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    // For 1-to-1 or group chats, store all participant IDs
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // or 'Trainer' if you want to support both
        required: true,
      },
    ],
    // Optional: Name for group chats
    name: {
      type: String,
      trim: true,
      default: '',
    },
    // Optional: Is this a group chat?
    isGroup: {
      type: Boolean,
      default: false,
    },
    // Optional: Admins (for group chats)
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Optional: Last message for quick access
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    // Optional: Conversation status
    status: {
      type: String,
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);

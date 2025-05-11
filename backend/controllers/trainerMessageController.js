import Message from '../models/Message.js';
import mongoose from 'mongoose';

// Get messages between logged-in trainer and a user
export const getMessagesWithUser = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: trainerId, receiverId: userId },
        { senderId: userId, receiverId: trainerId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Trainer → User GET Error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Send a message from trainer to user
export const sendTrainerMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { userId, text } = req.body;

    if (!userId || !text || !text.trim()) {
      return res.status(400).json({ error: 'User and message text are required.' });
    }

    const message = new Message({
      senderId,
      receiverId: userId,
      senderRole: 'Trainer',
      receiverRole: 'User',
      type: 'text',
      text: text.trim(),
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Trainer → User SEND Error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

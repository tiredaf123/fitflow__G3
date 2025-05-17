import Message from '../models/Message.js';

// Get all messages between logged-in user and a trainer
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { trainerId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: trainerId },
        { senderId: trainerId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('User → Trainer GET Error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Send a text message from user to trainer
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { trainerId, text } = req.body;

    if (!trainerId || !text || !text.trim()) {
      return res.status(400).json({ error: 'Trainer and message text are required.' });
    }

    const message = new Message({
      senderId,
      receiverId: trainerId,
      senderRole: 'User',     // ✅ FIXED
      receiverRole: 'Trainer', // ✅ FIXED
      type: 'text',
      text: text.trim(),
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('User → Trainer SEND Error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

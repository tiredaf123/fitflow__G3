import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import User from './models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', async ({ token, trainerId }) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return;

        socket.userId = decoded.userId;
        socket.join(`${decoded.userId}-${trainerId}`);
      } catch (err) {
        console.log('Socket Join Auth Error:', err);
      }
    });

    socket.on('sendMessage', async (data) => {
      const { sender, text, image, trainerId, timestamp } = data;
      const userId = socket.userId;

      if (!userId || !trainerId) return;

      try {
        const message = new Message({ sender, text, image, trainerId, userId, timestamp });
        const savedMessage = await message.save();

        io.to(`${userId}-${trainerId}`).emit('receiveMessage', savedMessage);
      } catch (err) {
        console.error('❌ Message Save Error:', err);
      }
    });
  });
};

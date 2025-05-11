import jwt from 'jsonwebtoken';
import Message from './models/Message.js'; // Adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET;

export const setupSocket = (io) => {
  // Middleware: Authenticate each socket connection using JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: Token missing'));

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.role = decoded.role;

      if (!socket.userId || !socket.role) {
        return next(new Error('Authentication error: Invalid token payload'));
      }

      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.userId} (${socket.role})`);

    // Join a room for private messaging
    socket.on('joinRoom', ({ otherUserId }) => {
      if (!otherUserId) return;
      const room = [socket.userId, otherUserId].sort().join('-');
      socket.join(room);
      console.log(`🔗 ${socket.userId} joined room ${room}`);
    });

    // Handle message sending
    socket.on('sendMessage', async (data) => {
      try {
        const senderId = socket.userId;
        const receiverId = data.receiverId;
        if (!receiverId || !data.text) return;

        // Save message in MongoDB with proper roles (capitalized for populate)
        const message = await Message.create({
          senderId,
          receiverId,
          senderRole: socket.role === 'trainer' ? 'Trainer' : 'User',
          receiverRole: socket.role === 'trainer' ? 'User' : 'Trainer',
          text: data.text.trim(),
          type: data.type || 'text',
          timestamp: new Date(),
        });

        // Send message to the private room
        const room = [senderId, receiverId].sort().join('-');
        io.to(room).emit('receiveMessage', message);
        console.log(`📩 Message sent in room ${room}`);
      } catch (err) {
        console.error('❌ Error sending message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.userId}`);
    });
  });
};

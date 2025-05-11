import dotenv from 'dotenv';
dotenv.config();

import './models/User.js';
import './models/Trainer.js';
import './models/Membership.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';

import { setupSocket } from './socket.js';
import { handleWebhook } from './controllers/membershipController.js';
import createAdminUser from './utils/createAdmin.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import supplementRoutes from './routes/supplementRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import trainerMessageRoutes from './routes/trainerMessageRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env');
  process.exit(1);
}

// Ensure upload directories exist
const uploadDir = path.resolve('uploads/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

setupSocket(io);

// --- Stripe Webhook (must come BEFORE express.json())
app.post(
  '/api/membership/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Static files
app.use('/api/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages/user', messageRoutes);
app.use('/api/messages/trainer', trainerMessageRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('🚀 FitFlow Server is running!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack || err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB + server startup
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected');
  await createAdminUser();
  server.listen(PORT, () => {
    console.log(`🚀 Server running at ${SERVER_URL}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT: shutting down...');
  try {
    await mongoose.disconnect();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
});
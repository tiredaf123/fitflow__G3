// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';

// Load Models
import './models/User.js';
import './models/Trainer.js';
import './models/Membership.js';

// Utilities
import createAdminUser from './utils/createAdmin.js';
import { setupSocket } from './socket.js';
import { handleWebhook } from './controllers/membershipController.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import supplementRoutes from './routes/supplementRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import trainerMessageRoutes from './routes/trainerMessageRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

// Env Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Env Check
console.log('🌐 ENV Check:', {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ Missing',
});

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env');
  process.exit(1);
}

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create app and server
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

// Stripe Webhook — placed before body parser
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

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/users', userRoutes); // includes /streak
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages/user', messageRoutes);
app.use('/api/messages/trainer', trainerMessageRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);

app.use('/api/stripe', stripeRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 FitFlow Server is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// MongoDB connection and launch server
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
  console.log('SIGINT received: shutting down...');
  try {
    await mongoose.disconnect();
    server.close(() => {
      console.log('🛑 Server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
});

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';

import {setupSocket}  from './socket.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env');
  process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadDir = path.resolve('uploads/profile');
fs.mkdirSync(uploadDir, { recursive: true });

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server with CORS config
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'], // replace with your frontend URL(s)
    methods: ['GET', 'POST'],
  },
});

// Setup Socket.IO event handlers
setupSocket(io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev')); // HTTP request logger

// Serve static files for uploads
app.use('/api/uploads', express.static(path.resolve('uploads')));

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import supplementRoutes from './routes/supplementRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import createAdminUser from './utils/createAdmin.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('🚀 FitFlow Server is running!');
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Optional: create default admin user if not exists
    await createAdminUser();

    // Start HTTP + Socket.IO server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at ${SERVER_URL}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Optional: handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected!');
});

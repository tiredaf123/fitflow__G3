// server.js

// server.js or index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import path from 'path';
import fs from 'fs';

// Load .env first!
dotenv.config();
console.log('🌐 ENV Check:', {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ Missing',
});

import profileRoutes from './routes/profileRoutes.js';
import authRoutes from './routes/authRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import { router as achievementRoutes } from './routes/Achievement.js';
import workoutPlanRoutes from './routes/workoutPlanRoutes.js';

dotenv.config();
import supplementRoutes from './routes/supplementRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js'; 
import userRoutes from './routes/userRoutes.js';


// Utils
import createAdminUser from './utils/createAdmin.js';

// Initialize app
const app = express();

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads/profile');
fs.mkdirSync(uploadDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/workouts', workoutPlanRoutes);  // Updated endpoint for workout plans
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/users', userRoutes);


// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);

    await createAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at ${process.env.SERVER_URL || 'http://localhost'}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

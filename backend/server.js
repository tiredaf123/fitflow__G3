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

// Routes
import profileRoutes from './routes/profileRoutes.js';
import authRoutes from './routes/authRoutes.js';
import supplementRoutes from './routes/supplementRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js'; // ADD THIS LINE

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/trainers', trainerRoutes); // ADD THIS LINE

// Port
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await createAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at ${process.env.SERVER_URL || 'http://localhost'}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

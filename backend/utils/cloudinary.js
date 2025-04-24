// utils/cloudinary.js
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config(); // ✅ Ensure .env is loaded

// 🔍 Debug output (remove in production)
console.log('🌐 Cloudinary ENV:', {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  SECRET_PRESENT: !!process.env.CLOUDINARY_API_SECRET,
});

// 🔧 Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📦 Optional storage config (if using multer)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fitflow-profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  },
});

export { cloudinary, storage };

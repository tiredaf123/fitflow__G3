// middleware/uploadWorkoutImage.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadWorkoutImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const streamUpload = (req) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload(req);
    req.body.imageUrl = result.secure_url;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

export default uploadWorkoutImage; // ✅ default export

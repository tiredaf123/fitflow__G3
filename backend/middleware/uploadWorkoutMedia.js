import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadWorkoutMedia(req, res, next) {
  try {
    // Process image if exists
    if (req.files?.image) {
      const imageResult = await uploadStream(req.files.image[0]);
      req.body.imageUrl = imageResult.secure_url;
    }

    // Process video if exists
    if (req.files?.video) {
      const videoResult = await uploadStream(req.files.video[0], { 
        resource_type: 'video',
        chunk_size: 6000000
      });
      req.body.videoUrl = videoResult.secure_url;
    }

    next();
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Media upload failed' });
  }
}

function uploadStream(file, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
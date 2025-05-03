import multer from 'multer';
import path from 'path';

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/profile/');
  },
  filename(req, file, cb) {
    // Check if req.user and req.user._id exist
    if (req.user && req.user._id) {
      cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    } else {
      // Handle the case where req.user or req.user._id is undefined
      console.error('req.user or req.user._id is undefined');
      return cb(new Error('User not authenticated'), false); // Reject the upload
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;

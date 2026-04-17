import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edot_uploads',
    resource_type: 'auto', // Important for allowing videos (mp4, etc.)
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'pdf'], 
  },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 1000000000 } // 1GB Limit
});

// @route   POST /api/upload
// @desc    Upload an image or video to Cloudinary
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }
        res.json({
            success: true,
            filePath: req.file.path // Cloudinary returns the secure URL in req.file.path
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

export default router;

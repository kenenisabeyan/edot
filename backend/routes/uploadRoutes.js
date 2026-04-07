const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');
const path = require('path');

// Configure Cloudinary (Keys must be securely stored in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'edot_uploads',
      resource_type: 'auto', // Cloudinary will automatically decide if it is image or video
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'mp4', 'mkv', 'webm', 'pdf', 'doc', 'docx', 'zip', 'rar']
    };
  },
});

// Init upload
const upload = multer({ 
    storage: storage,
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
            filePath: req.file.path // Cloudinary URL
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

module.exports = router;

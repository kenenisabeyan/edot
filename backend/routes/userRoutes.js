// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's enrolled courses
// @route   GET /api/users/:id/courses
// @access  Private
router.get('/:id/courses', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id)
      .populate({
        path: 'enrolledCourses.courseId',
        populate: { path: 'tutorId', select: 'name profile' }
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const enrolledCourses = user.enrolledCourses.map(enrollment => ({
      ...enrollment.courseId.toObject(),
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt
    }));
    
    res.json(enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    res.json(user.notifications || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/users/notifications/:id
// @access  Private
router.patch('/notifications/:id', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    const notification = user.notifications.id(req.params.id);
    if (notification) {
      notification.read = true;
      await user.save();
    }
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'enrolledCourses.course',
        populate: {
          path: 'lessons'
        }
      });
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/mycourses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/mycourses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      });
    
    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
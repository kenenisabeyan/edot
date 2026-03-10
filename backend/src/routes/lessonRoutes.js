// backend/src/routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');

// @desc    Get lessons for a course
// @route   GET /api/lessons/:courseId
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course.lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Tutor
router.post('/', protect, authorize('tutor'), async (req, res) => {
  try {
    const { courseId, ...lessonData } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.tutorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    course.lessons.push(lessonData);
    await course.save();
    
    res.status(201).json(course.lessons[course.lessons.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
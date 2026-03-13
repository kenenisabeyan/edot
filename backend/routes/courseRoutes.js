const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    
    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('lessons')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Course.countDocuments(query);
    
    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a course (Instructor only)
// @access  Private/Instructor
router.post('/', protect, authorize('instructor'), async (req, res) => {
  try {
    req.body.instructor = req.user._id;
    
    const course = new Course(req.body);
    await course.save();
    
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Instructor
router.put('/:id', protect, authorize('instructor'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.find(
      enrollment => enrollment.course.toString() === course._id.toString()
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    user.enrolledCourses.push({
      course: course._id,
      progress: 0,
      completedLessons: []
    });
    
    await user.save();
    
    // Increment total students count
    course.totalStudents += 1;
    await course.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:courseId/lessons/:lessonId/complete
// @desc    Mark lesson as completed
// @access  Private
router.post('/:courseId/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === course._id.toString()
    );
    
    if (!enrollment) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }
    
    // Check if lesson already completed
    if (!enrollment.completedLessons.includes(req.params.lessonId)) {
      enrollment.completedLessons.push(req.params.lessonId);
      
      // Calculate progress
      const totalLessons = course.lessons.length;
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = (completedCount / totalLessons) * 100;
      
      await user.save();
    }
    
    res.json({ 
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
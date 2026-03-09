const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 9 } = req.query;

    let query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('lessons')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      courses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio avatar')
      .populate({ path: 'lessons', options: { sort: { order: 1 } } });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', protect, authorize('instructor'), async (req, res) => {
  try {
    req.body.instructor = req.user.id;
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', protect, authorize('instructor'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);

    const alreadyEnrolled = user.enrolledCourses.some(e => e.course.toString() === course.id);
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }

    user.enrolledCourses.push({ course: course.id });
    await user.save();

    course.totalStudents += 1;
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:courseId/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(e => e.course.toString() === req.params.courseId);

    if (!enrollment) {
      return res.status(400).json({ success: false, message: 'Not enrolled' });
    }

    if (!enrollment.completedLessons.includes(req.params.lessonId)) {
      enrollment.completedLessons.push(req.params.lessonId);
      const course = await Course.findById(req.params.courseId);
      const progress = (enrollment.completedLessons.length / course.lessons.length) * 100;
      enrollment.progress = Math.round(progress);
      await user.save();
    }

    res.json({ success: true, progress: enrollment.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
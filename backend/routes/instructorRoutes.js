const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { protect, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(protect);
router.use(authorize('instructor', 'admin'));

// @route   GET /api/instructor/courses
// @desc    Get courses created by instructor
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id })
                                    .populate('lessons')
                                    .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/instructor/courses
// @desc    Create a new course
router.post('/courses', async (req, res) => {
    try {
        // Automatically assign the logged-in user as the instructor
        req.body.instructor = req.user.id;
        req.body.status = 'draft'; // newly created courses start as draft
        req.body.isPublished = false;

        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/instructor/courses/:id
// @desc    Update a course
router.put('/courses/:id', async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course instructor
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this course' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/instructor/courses/:courseId/lessons
// @desc    Add a lesson to a course
router.post('/courses/:courseId/lessons', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course instructor
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to add a lesson to this course' });
        }

        req.body.courseId = req.params.courseId;
        
        // Auto-assign order if not provided
        if (!req.body.order) {
            req.body.order = course.lessons.length + 1;
        }

        const lesson = await Lesson.create(req.body);

        // Add lesson reference to course
        course.lessons.push(lesson._id);
        await course.save();

        res.status(201).json({ success: true, data: lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/instructor/courses/:id/submit
// @desc    Submit a course for admin approval
router.put('/courses/:id/submit', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course instructor
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to publish this course' });
        }

        course.status = 'pending';
        await course.save();

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/instructor/dashboard
// @desc    Get instructor dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        const totalCourses = courses.length;
        const activeCourses = courses.filter(c => c.isPublished).length;
        
        // Count total students enrolled across all their courses
        let totalStudents = 0;
        courses.forEach(course => {
            totalStudents += (course.totalStudents || 0); // Assuming totalStudents is updated on enrollment
        });

        // Add a mock for teaching activity or lesson count
        let totalLessons = 0;
        courses.forEach(course => {
            totalLessons += course.lessons.length;
        });

        res.status(200).json({
            success: true,
            data: {
                totalCourses,
                activeCourses,
                totalStudents,
                totalLessons
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

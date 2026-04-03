const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { logActivity } = require('../controllers/activityController');

// @route   GET /api/courses
// @desc    Get all courses with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            level, 
            search, 
            page = 1, 
            limit = 9,
            sort = '-createdAt'
        } = req.query;

        // Build query
        let query = { isPublished: true, status: 'approved' };
        
        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const courses = await Course.find(query)
            .populate('instructor', 'name email')
            .populate('lessons')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        // Get total count
        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            count: courses.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
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
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Get course error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/courses
// @desc    Create a new course (Instructor only)
// @access  Private/Instructor
router.post('/', protect, authorize('instructor'), async (req, res) => {
    try {
        // Add instructor to request body
        req.body.instructor = req.user.id;

        const course = await Course.create(req.body);

        await logActivity(req.user.id, `Created a new course: ${course.title}`, 'course', course.title, course._id);

        res.status(201).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Instructor
router.put('/:id', protect, authorize('instructor'), async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is course instructor
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course'
            });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/courses/:id/enroll
// @desc    Request enrollment in a course (pending admin approval)
// @access  Private/Student
router.post('/:id/enroll', protect, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course || course.status !== 'approved' || !course.isPublished) {
            return res.status(404).json({ success: false, message: 'Course not available for enrollment' });
        }

        const user = await User.findById(req.user.id);

        const existing = await Enrollment.findOne({ student: user._id, course: course._id });
        if (existing) {
            if (existing.status === 'active') {
                return res.status(400).json({ success: false, message: 'Already active in this course' });
            }
            if (existing.status === 'pending') {
                return res.status(400).json({ success: false, message: 'Enrollment request is already pending approval' });
            }
            if (existing.status === 'rejected') {
                existing.status = 'pending';
                existing.reason = '';
                existing.requestedAt = Date.now();
                await existing.save();
            }
        } else {
            await Enrollment.create({
                student: user._id,
                course: course._id,
                status: 'pending'
            });
        }

        const userEnrollment = user.enrolledCourses.find((en) => en.course.toString() === course._id.toString());
        if (userEnrollment) {
            userEnrollment.status = 'pending';
        } else {
            user.enrolledCourses.push({
                course: course._id,
                status: 'pending',
                progress: 0,
                completedLessons: []
            });
        }
        await user.save();

        await logActivity(req.user.id, `Requested enrollment in course: ${course.title}`, 'enrollment', course.title, course._id);

        res.json({ success: true, message: 'Enrollment request sent, awaiting admin approval' });
    } catch (error) {
        console.error('Enrollment request error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
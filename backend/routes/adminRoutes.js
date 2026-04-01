const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('enrolledCourses.course', 'title status')
            .sort({ createdAt: -1 })
            .lean();
        
        // Find courses to map to instructors natively
        const allCourses = await Course.find().select('title instructor status isPublished');
        
        const enhancedUsers = users.map(user => {
            if (user.role === 'instructor') {
                user.taughtCourses = allCourses.filter(c => 
                    c.instructor && c.instructor.toString() === user._id.toString()
                );
            }
            return user;
        });

        res.status(200).json({ success: true, count: enhancedUsers.length, data: enhancedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/users
// @desc    Create a new user manually
// @access  Private/Admin
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, batch, section, department, specialization, phone } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Hook automatically salts in the mongoose pre-save logic.
            role: role || 'student',
            batch,
            section,
            department,
            specialization,
            phone
        });

        // Safe return (no passport/jwt overriding)
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                batch: user.batch,
                section: user.section,
                department: user.department,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Admin Create User error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User removed completely' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/courses/pending
// @desc    Get all pending courses
router.get('/courses/pending', async (req, res) => {
    try {
        const courses = await Course.find({ status: 'pending' }).populate('instructor', 'name email');
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/courses/:id/status
// @desc    Approve or reject a course
router.put('/courses/:id/status', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        course.status = req.body.status;
        if (req.body.status === 'approved') {
            course.isPublished = true;
        } else {
            course.isPublished = false;
        }

        await course.save();
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstructors = await User.countDocuments({ role: 'instructor' });
        
        const courses = await Course.find();
        const totalCourses = courses.length;
        const pendingCourses = courses.filter(c => c.status === 'pending').length;
        
        // Mocking revenue: summing up price of all published courses multiplied by their student count
        // If we had an Orders/Payments table this would aggregate from there
        let totalRevenue = 0;
        courses.forEach(course => {
            if (course.isPublished && course.price && course.totalStudents) {
                totalRevenue += (course.price * course.totalStudents);
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalCourses,
                pendingCourses,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

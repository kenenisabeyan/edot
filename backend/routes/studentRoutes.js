const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const { logActivity } = require('../controllers/activityController');

// Apply protect middleware to all student routes
router.use(protect);
router.use(authorize('student', 'instructor', 'admin')); // Anyone who can enroll

// @route   GET /api/student/enrollments
// @desc    Get all enrolled courses for the logged-in user
router.get('/enrollments', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'enrolledCourses.course',
            populate: { path: 'instructor', select: 'name avatar' }
        });

        res.status(200).json({
            success: true,
            count: user.enrolledCourses.length,
            data: user.enrolledCourses
        });
    } catch (error) {
        console.error('Fetch enrollments error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/student/courses/:courseId/lessons/:lessonId/complete
// @desc    Mark a lesson as complete and update course progress
router.post('/courses/:courseId/lessons/:lessonId/complete', async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const user = await User.findById(req.user.id);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Find the enrollment
        const enrollment = user.enrolledCourses.find(
            (e) => e.course.toString() === courseId
        );

        if (!enrollment) {
            return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
        }

        // Check if lesson is already marked complete
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            
            // Calculate new progress
            const totalLessons = course.lessons.length;
            const completedLessons = enrollment.completedLessons.length;
            
            if (totalLessons > 0) {
                enrollment.progress = Math.round((completedLessons / totalLessons) * 100);
            } else {
                enrollment.progress = 100;
            }

            await user.save();
            await logActivity(req.user.id, `Completed a lesson in ${course.title}`, 'learning', course.title, course._id);
        }

        res.status(200).json({
            success: true,
            progress: enrollment.progress,
            completedLessons: enrollment.completedLessons
        });
    } catch (error) {
        console.error('Mark lesson complete error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/student/courses/:courseId/exam/complete
// @desc    Mark a final exam as passed
router.post('/courses/:courseId/exam/complete', async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = await User.findById(req.user.id);
        
        const enrollment = user.enrolledCourses.find(
            (e) => e.course.toString() === courseId
        );

        if (!enrollment) {
            return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
        }

        enrollment.passedFinalExam = true;
        await user.save();
        
        const course = await Course.findById(courseId);
        await logActivity(req.user.id, `Passed final exam for ${course.title}`, 'learning', course.title, course._id);

        res.status(200).json({ success: true, passedFinalExam: true });
    } catch (error) {
        console.error('Submit exam error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/student/analytics/detailed
// @desc    Get detailed analytics for student (currently minimal fallback)
router.get('/analytics/detailed', async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('enrolledCourses');
        // Provide baseline mock/empty analytics structure
        res.status(200).json({
            success: true,
            data: {
                revenueData: [],
                engagementData: [],
                courseCompletionData: [
                   { name: 'Enrolled', value: student?.enrolledCourses?.length || 1, color: '#10b981' }
                ],
                totalRevenue: 0,
                totalActiveLearners: 1,
                totalCourseCompletions: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/student/dashboard
// @desc    Get student dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'enrolledCourses.course'
        });

        const enrollments = user.enrolledCourses || [];
        const totalEnrolled = enrollments.length;
        
        let totalProgress = 0;
        let completedLessons = 0;
        let completedCourses = 0;
        
        enrollments.forEach(enrollment => {
            totalProgress += (enrollment.progress || 0);
            completedLessons += (enrollment.completedLessons ? enrollment.completedLessons.length : 0);
            if (enrollment.progress === 100) {
                completedCourses++;
            }
        });
        
        const averageProgress = totalEnrolled > 0 ? Math.round(totalProgress / totalEnrolled) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalEnrolled,
                averageProgress,
                completedLessons,
                completedCourses,
                recentEnrollments: enrollments.slice(-3).map(e => ({
                    courseId: e.course._id,
                    courseTitle: e.course.title,
                    progress: e.progress
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

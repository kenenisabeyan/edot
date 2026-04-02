const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({
                path: 'enrolledCourses.course',
                populate: {
                    path: 'instructor',
                    select: 'name'
                }
            });

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { 
            name, bio, avatar, coverPhoto, phone,
            gender, dateOfBirth, address, emergencyContact, department, specialization, occupation 
        } = req.body;

        const user = await User.findById(req.user.id);

        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;
        if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
        if (phone !== undefined) user.phone = phone;
        if (gender !== undefined) user.gender = gender;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (address !== undefined) user.address = address;
        if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
        if (department !== undefined) user.department = department;
        if (specialization !== undefined) user.specialization = specialization;
        if (occupation !== undefined) user.occupation = occupation;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
                coverPhoto: user.coverPhoto,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                emergencyContact: user.emergencyContact,
                department: user.department,
                specialization: user.specialization,
                occupation: user.occupation
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/mycourses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/mycourses', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'enrolledCourses.course',
                populate: [
                    {
                        path: 'instructor',
                        select: 'name'
                    },
                    {
                        path: 'lessons'
                    }
                ]
            });

        res.json({
            success: true,
            enrolledCourses: user.enrolledCourses
        });
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/dashboard-metrics
// @desc    Get counts of unread messages, pending courses, unseen certificates
// @access  Private
router.get('/dashboard-metrics', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // Count unread messages (all roles)
        const unreadMessages = await Message.countDocuments({ receiverId: userId, isRead: false });
        
        // Count role-specific metrics
        let pendingCourses = 0;
        let pendingApprovals = 0;
        let newCertificates = 0;
        let pendingUsers = 0;

        if (role === 'admin') {
            pendingApprovals = await Course.countDocuments({ status: 'pending' });
            pendingUsers = await User.countDocuments({ status: 'pending' });
        } else if (role === 'instructor') {
            pendingCourses = await Course.countDocuments({ instructor: userId, status: 'pending' });
        } else if (role === 'student' || role === 'parent') { // just in case parent has certificates too later
            newCertificates = await Certificate.countDocuments({ user_id: userId, isSeen: false });
        }

        res.json({
            success: true,
            metrics: {
                unreadMessages,
                pendingApprovals,
                pendingCourses,
                newCertificates,
                pendingUsers
            }
        });
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/mark-certificates-seen
// @desc    Mark all certificates for user as seen
// @access  Private
router.put('/mark-certificates-seen', protect, async (req, res) => {
    try {
        await Certificate.updateMany(
            { user_id: req.user.id, isSeen: false },
            { $set: { isSeen: true } }
        );
        res.json({ success: true, message: 'Certificates marked as seen' });
    } catch (error) {
        console.error('Mark certs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// @route   POST /api/users/connect
// @desc    Connect a parent and a student
// @access  Private
router.post('/connect', protect, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const targetUser = await User.findOne({ email: email.toLowerCase() });
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const currentUser = await User.findById(req.user.id);
        
        let parent, student;

        if (currentUser.role === 'parent' && targetUser.role === 'student') {
            parent = currentUser;
            student = targetUser;
        } else if (currentUser.role === 'student' && targetUser.role === 'parent') {
            parent = targetUser;
            student = currentUser;
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid connection request. Only parents and students can connect to each other.'
            });
        }

        // Check if already connected
        if (parent.children && parent.children.includes(student._id)) {
            return res.status(400).json({ success: false, message: 'Already connected to this user.' });
        }

        // Connect them (add student ID to parent's children array)
        if (!parent.children) {
            parent.children = [];
        }
        parent.children.push(student._id);
        await parent.save();

        res.json({ success: true, message: 'Successfully connected!' });
    } catch (error) {
        console.error('Connect route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
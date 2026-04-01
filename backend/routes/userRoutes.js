const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Section = require('../models/Section');
const Course = require('../models/Course');
const User = require('../models/User');

// @route   POST /api/sections
// @desc    Create a new section
// @access  Private (Admin/Instructor)
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const { name, course, instructor, schedule } = req.body;
        
        const courseExists = await Course.findById(course);
        if (!courseExists) return res.status(404).json({ success: false, message: 'Course not found' });

        const section = await Section.create({
            name,
            course,
            instructor: instructor || req.user.id,
            schedule
        });

        res.status(201).json({ success: true, data: section });
    } catch (error) {
        console.error('Create Section Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Section name already exists for this course' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/sections
// @desc    Get all sections (optionally filter by courseId)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const query = {};
        if (req.query.courseId) query.course = req.query.courseId;

        const sections = await Section.find(query)
            .populate('course', 'title')
            .populate('instructor', 'name email avatar')
            .populate('students', 'name email avatar');

        res.json({ success: true, count: sections.length, data: sections });
    } catch (error) {
        console.error('Get Sections Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/sections/:id
// @desc    Get a single section by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const section = await Section.findById(req.params.id)
            .populate('course', 'title')
            .populate('instructor', 'name email avatar')
            .populate('students', 'name email avatar');

        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

        res.json({ success: true, data: section });
    } catch (error) {
        console.error('Get Section Details Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/sections/:id
// @desc    Update a section (including instructor assignment)
// @access  Private (Admin/Instructor)
router.put('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        let section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

        if (req.user.role !== 'admin' && section.instructor?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this section' });
        }

        section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: section });
    } catch (error) {
        console.error('Update Section Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/sections/:id
// @desc    Delete a section
// @access  Private (Admin/Instructor)
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

        if (req.user.role !== 'admin' && section.instructor?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this section' });
        }

        await Section.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) {
        console.error('Delete Section Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/sections/:id/add-student
// @desc    Add a student to a section
// @access  Private (Admin/Instructor)
router.post('/:id/add-student', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const { studentId } = req.body;
        if (!studentId) return res.status(400).json({ success: false, message: 'Please provide studentId' });

        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

        if (req.user.role !== 'admin' && section.instructor?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this section' });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(400).json({ success: false, message: 'Valid student user is required' });
        }

        if (section.students.includes(studentId)) {
            return res.status(400).json({ success: false, message: 'Student is already in this section' });
        }

        section.students.push(studentId);
        await section.save();

        res.json({ success: true, message: 'Student added successfully', data: section });
    } catch (error) {
        console.error('Add Student Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/sections/:id/assign-instructor
// @desc    Assign an instructor to a section
// @access  Private (Admin)
router.post('/:id/assign-instructor', protect, authorize('admin'), async (req, res) => {
    try {
        const { instructorId } = req.body;
        if (!instructorId) return res.status(400).json({ success: false, message: 'Please provide instructorId' });

        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

        const instructor = await User.findById(instructorId);
        if (!instructor || instructor.role !== 'instructor') {
            return res.status(400).json({ success: false, message: 'Valid instructor user is required' });
        }

        section.instructor = instructorId;
        await section.save();

        res.json({ success: true, message: 'Instructor assigned successfully', data: section });
    } catch (error) {
        console.error('Assign Instructor Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

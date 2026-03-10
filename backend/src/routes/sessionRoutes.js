// backend/src/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const TutoringSession = require('../models/TutoringSession');

// @desc    Get user's sessions
// @route   GET /api/sessions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (req.user.role === 'tutor') {
      query.tutorId = req.user._id;
    }
    
    const sessions = await TutoringSession.find(query)
      .populate('studentId', 'name email profile')
      .populate('tutorId', 'name email profile')
      .sort({ date: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get student's sessions
// @route   GET /api/sessions/student
// @access  Private/Student
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    const sessions = await TutoringSession.find({ studentId: req.user._id })
      .populate('tutorId', 'name email profile')
      .sort({ date: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Book tutoring session
// @route   POST /api/sessions/book
// @access  Private/Student
router.post('/book', protect, authorize('student'), async (req, res) => {
  try {
    const { tutorId, date, startTime, endTime, duration, topic, price } = req.body;
    
    const session = await TutoringSession.create({
      studentId: req.user._id,
      tutorId,
      date,
      startTime,
      endTime,
      duration,
      topic,
      price,
      meetingLink: `https://meet.edot.com/${Date.now()}`
    });
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

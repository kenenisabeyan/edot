const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { logActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  // PREVENT ROLE ESCALATION & AUTO-PENDING LOGIC ERROR
  const allowedRoles = ['student', 'instructor'];
  const finalRole = allowedRoles.includes(role) ? role : 'student';
  const initialStatus = finalRole === 'instructor' ? 'pending' : 'approved';

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: finalRole,
      status: initialStatus
    });

    await user.save();

    await logActivity(
      user._id, 
      'Registered a new account', 
      'auth', 
      'Initial account creation', 
      null, 
      'public', 
      null, 
      { ip: req.ip, userAgent: req.headers['user-agent'] }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      message: user.status === 'pending' 
        ? 'Account created successfully. Awaiting administrator approval.' 
        : 'Account created successfully. You can now log in.'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email }).select('+password');


    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account is pending administrator approval.' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'Account has been rejected. Contact support.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account has been blocked. Contact support.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    await logActivity(
      user._id, 
      'Logged in to EDOT Platform', 
      'auth', 
      'Session authenticated securely', 
      null, 
      'public', 
      null, 
      { ip: req.ip, userAgent: req.headers['user-agent'] }
    );

    res.cookie('token', token, {
        httpOnly: true,  // Prevents JavaScript from reading the cookie (Security)
        secure: process.env.NODE_ENV === 'production',   // Set to true in production (HTTPS)
        sameSite: 'lax', // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.course');
    
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user / clear cookie
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'User logged out successfully' });
});

module.exports = router;
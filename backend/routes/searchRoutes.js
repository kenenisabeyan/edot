const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth'); // Verify access control

/**
 * @route GET /api/search/global?q=...
 * @desc Search across users, courses, and notices dynamically.
 * @access Private (Filters based on role internally if needed, but primarily returns unified object)
 */
router.get('/global', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    const results = [];

    // 1. Fetch Users (Limit 15 total) and Categorize
    const users = await User.find({ name: searchRegex }).select('name role email avatar _id').limit(15);
    users.forEach(u => {
      const type = u.role === 'admin' ? 'System' :
                   u.role === 'instructor' ? 'Instructor' :
                   u.role === 'parent' ? 'Parent' : 'Student';
      
      results.push({
        type: type,
        title: u.name,
        subtitle: u.email,
        id: u._id,
        path: '/dashboard/users' // They can click users to go to the global user mgmt list!
      });
    });

    // 2. Fetch Courses (Limit 10 total)
    const courses = await Course.find({ title: searchRegex }).select('title description _id').limit(10);
    courses.forEach(c => {
      results.push({
        type: 'Course',
        title: c.title,
        subtitle: c.description ? c.description.substring(0, 40) + '...' : '',
        id: c._id,
        path: '/dashboard/courses'
      });
    });

    // 3. Fetch Notices (Limit 5 total)
    const notices = await Notice.find({ title: searchRegex }).select('title _id').limit(5);
    notices.forEach(n => {
      results.push({
        type: 'Notice',
        title: n.title,
        subtitle: 'Platform Announcement',
        id: n._id,
        path: '/dashboard/notice'
      });
    });

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Global Search Error:', error);
    res.status(500).json({ success: false, message: 'Server search error' });
  }
});

module.exports = router;

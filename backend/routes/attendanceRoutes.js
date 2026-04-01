const express = require('express');
const { 
  getCourseAttendance,
  submitAttendance,
  getDashboardAggregate 
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Protect all attendance routes to ensure user is verified
router.route('/aggregate')
  .get(getDashboardAggregate);

router.route('/')
  .post(submitAttendance);

router.route('/course/:courseId')
  .get(getCourseAttendance);

module.exports = router;

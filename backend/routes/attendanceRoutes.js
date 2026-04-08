const express = require('express');
const { 
  getCourseAttendance,
  submitAttendance,
  getDashboardAggregate,
  submitFinalReport,
  getFinalReports,
  getAttendanceByQuery,
  getEnrolledUsers
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Protect all attendance routes to ensure user is verified
router.route('/aggregate')
  .get(getDashboardAggregate);

router.route('/reports')
  .get(getFinalReports);

router.route('/report')
  .post(submitFinalReport);

router.route('/users')
  .get(getEnrolledUsers);

router.route('/')
  .get(getAttendanceByQuery)
  .post(submitAttendance);

router.route('/section/:sectionId')
  .get(getCourseAttendance);

module.exports = router;

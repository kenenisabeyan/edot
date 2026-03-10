// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const { validate, courseValidation } = require('../middleware/validation');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('tutor', 'admin'), validate(courseValidation), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('tutor', 'admin'), updateCourse)
  .delete(protect, authorize('tutor', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

module.exports = router;
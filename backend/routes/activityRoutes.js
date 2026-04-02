const express = require('express');
const router = express.Router();
const { getMyActivities, getAllActivities, getInsightsForParent, flagActivity, createActivity } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getMyActivities);
router.post('/', protect, createActivity);
router.get('/insights', protect, authorize('parent', 'admin'), getInsightsForParent);
router.put('/:id/flag', protect, authorize('instructor', 'admin'), flagActivity);
router.get('/all', protect, authorize('admin'), getAllActivities);

module.exports = router;

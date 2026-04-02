const express = require('express');
const router = express.Router();
const { getMyAchievements, getChildAchievements } = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyAchievements);
router.get('/children', protect, authorize('parent', 'admin'), getChildAchievements);

module.exports = router;

const express = require('express');
const router = express.Router();

const { getParentDashboardStats, getParentLearners } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('parent'));

router.get('/dashboard', getParentDashboardStats);
router.get('/learners', getParentLearners);

module.exports = router;

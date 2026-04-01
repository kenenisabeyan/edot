const express = require('express');
const router = express.Router();

const { getParentDashboardStats, getParentLearners } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('parent'));

router.get('/dashboard', getParentDashboardStats);
router.get('/learners', getParentLearners);

router.get('/analytics/detailed', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            revenueData: [],
            engagementData: [],
            courseCompletionData: [],
            totalRevenue: 0,
            totalActiveLearners: 1,
            totalCourseCompletions: 0
        }
    });
});

module.exports = router;

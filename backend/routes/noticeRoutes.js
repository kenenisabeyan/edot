const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/notices
router.get('/', protect, async (req, res) => {
    try {
        const notices = await Notice.find({
            $or: [{ audience: 'all' }, { audience: req.user.role }]
        }).sort({ date: -1 });
        
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/notices
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        req.body.author = req.user.id;
        const notice = await Notice.create(req.body);
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

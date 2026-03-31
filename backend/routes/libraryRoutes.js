const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/library
router.get('/', protect, async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/library
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        req.body.addedBy = req.user.id;
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Library = require('../models/Library');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/library
// @desc    Get all library resources
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const resources = await Library.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error retrieving library' });
    }
});

// @route   POST /api/library
// @desc    Create new library resource
// @access  Private (Admin & Instructor only)
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const { title, author, category, fileUrl } = req.body;
        if (!title || !author || !fileUrl) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const resource = await Library.create({
            title,
            author,
            category: category || 'General',
            fileUrl,
            uploadedBy: req.user.id
        });
        res.status(201).json({ success: true, data: resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error saving resource' });
    }
});

// @route   DELETE /api/library/:id
// @desc    Delete a resource
// @access  Private (Admin & Instructor only)
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const resource = await Library.findById(req.params.id);
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
        
        // Ensure only uploader or admin can delete
        if(resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this resource' });
        }

        await resource.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error deleting resource' });
    }
});

module.exports = router;

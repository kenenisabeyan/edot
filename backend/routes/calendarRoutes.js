const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/calendar
router.get('/', protect, async (req, res) => {
    try {
        let queryCondition = { 
            $or: [
                { targetAudiences: { $in: ['all', req.user.role] } },
                { createdBy: req.user.id } // Creators always see their own events
            ] 
        };

        // Admins can see absolutely all events
        if (req.user.role === 'admin') {
            queryCondition = {}; 
        }

        const events = await Event.find(queryCondition).sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/calendar
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        // Enforce createdBy to the logged in user
        req.body.createdBy = req.user.id;
        
        // Ensure legacy fallback mappings if frontend sends string 'audience'
        if (req.body.audience && (!req.body.targetAudiences || req.body.targetAudiences.length === 0)) {
            req.body.targetAudiences = [req.body.audience];
        }

        // Security: Restrict Instructor scope
        if (req.user.role === 'instructor') {
            // Instructors cannot broadcast to admin or all instructors globally
            const restrictedTargets = ['admin', 'all'];
            if (req.body.targetAudiences.some(tgt => restrictedTargets.includes(tgt))) {
                return res.status(403).json({ success: false, message: 'Limit exceeded: Instructors can only target students and parents.' });
            }
        }

        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/calendar/:id
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
             return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }
        
        await event.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

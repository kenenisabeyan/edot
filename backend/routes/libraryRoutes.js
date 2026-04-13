import express from 'express';
import { prisma } from '../lib/prisma.js';
import { protect, authorize, guardActiveEnrollment, checkNotBlocked } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/library
// @desc    Get all library resources
// @access  Private
router.get('/', protect, checkNotBlocked, async (req, res) => {
    try {
        const resources = await prisma.library.findMany({
            orderBy: { createdAt: 'desc' }
        });
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
        const resource = await prisma.library.create({
            data: {
                title,
                author,
                category: category || 'General',
                fileUrl,
                uploadedById: req.user.id
            }
        });
        res.status(201).json({ success: true, data: resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error saving resource' });
    }
});

// @route   GET /api/library/course/:courseId
// @desc    Get all library resources for a specific course (student active enrollment required)
router.get('/course/:courseId', protect, checkNotBlocked, authorize('student'), guardActiveEnrollment, async (req, res) => {
    try {
        const resources = await prisma.library.findMany({
            where: { courseId: req.params.courseId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error retrieving course resources' });
    }
});

// @route   DELETE /api/library/:id
// @desc    Delete a resource
// @access  Private (Admin & Instructor only)
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const resource = await prisma.library.findUnique({ where: { id: req.params.id } });
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
        
        // Ensure only uploader or admin can delete
        const userId = req.user.id;
        if(resource.uploadedById !== userId && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this resource' });
        }

        await prisma.library.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error deleting resource' });
    }
});

export default router;

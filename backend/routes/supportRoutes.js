import express from 'express';
import { getDashboardData, supportStudent, acceptSponsorship, rejectSponsorship, getPendingSponsorships } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('sponsor', 'admin'), getDashboardData);

// POST request to create a support linkage safely
router.post('/', protect, authorize('sponsor', 'admin'), supportStudent);

// GET request for student to view their pending offers
router.get('/pending', protect, authorize('student', 'admin'), getPendingSponsorships);

// POST requests to securely manage support linkage consent
router.post('/:sponsorshipId/accept', protect, authorize('student', 'admin'), acceptSponsorship);
router.post('/:sponsorshipId/reject', protect, authorize('student', 'admin'), rejectSponsorship);

export default router;

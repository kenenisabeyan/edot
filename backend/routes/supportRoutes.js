import express from 'express';
import { getDashboardData, supportStudent } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('sponsor', 'admin'), getDashboardData);

// POST request to create a support linkage safely
router.post('/', protect, authorize('sponsor', 'admin'), supportStudent);

export default router;

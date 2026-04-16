import express from 'express';
import { 
   requestConnection, 
   getPendingConnections, 
   acceptConnection, 
   rejectConnection 
} from '../controllers/connectionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST request to create a connection safely (Only parents and admins can initiate)
router.post('/', protect, authorize('parent', 'admin'), requestConnection);

// GET request for student to view their pending connection offers
router.get('/pending', protect, getPendingConnections);

// POST requests to securely manage connection linkage consent
router.post('/:connectionId/accept', protect, acceptConnection);
router.post('/:connectionId/reject', protect, rejectConnection);

export default router;

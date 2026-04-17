import express from 'express';
import { sendMessage, getConversation, getContacts, createGroup, toggleBlockUser, getBlockedUsers, updateMessage, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All message routes are protected
router.use(protect);

router.post('/', sendMessage);
router.put('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);
router.post('/groups', createGroup);
router.post('/block/:userId', toggleBlockUser);
router.get('/blocked', getBlockedUsers);
router.get('/conversation/:userId', getConversation);
router.get('/contacts', getContacts);

export default router;

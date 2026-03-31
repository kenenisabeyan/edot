const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getContacts } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All message routes are protected
router.use(protect);

router.post('/', sendMessage);
router.get('/conversation/:userId', getConversation);
router.get('/contacts', getContacts);

module.exports = router;

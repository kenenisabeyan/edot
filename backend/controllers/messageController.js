const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ success: false, message: 'Receiver and content are required' });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get conversation between current user and specified user
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        // Mark messages as read if receiver is current user
        await Message.updateMany(
            { senderId: userId, receiverId: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        console.error('Get conversation error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all unique contacts (users) the current user can message or has messaged
// @route   GET /api/messages/contacts
// @access  Private
exports.getContacts = async (req, res) => {
    try {
        // For simplicity in MVP: return all users except current user. 
        // In production, we would filter by shared courses or recent messages.
        const contacts = await User.find({ _id: { $ne: req.user.id } })
            .select('role title name profilePic') // name, role, etc (depending on user model schema)
            .sort({ name: 1 })
            .limit(100);

        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (err) {
        console.error('Get contacts error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

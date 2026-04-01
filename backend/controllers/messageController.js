const mongoose = require('mongoose');
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
        const currentUserId = req.user.id;
        
        // For simplicity in MVP: return all users except current user. 
        // In production, we would filter by shared courses or recent messages.
        const contacts = await User.find({ _id: { $ne: currentUserId } })
            .select('role title name avatar') // name, role, etc (depending on user model schema)
            .sort({ name: 1 })
            .limit(100);

        // Fetch unread messages for the current user
        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: new mongoose.Types.ObjectId(currentUserId), isRead: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const unreadMap = {};
        unreadCounts.forEach(item => {
            unreadMap[item._id.toString()] = item.count;
        });

        const contactsWithUnread = contacts.map(contact => {
            const contactObj = contact.toObject();
            contactObj.unreadCount = unreadMap[contact._id.toString()] || 0;
            return contactObj;
        });

        contactsWithUnread.sort((a, b) => {
            if (b.unreadCount !== a.unreadCount) {
                return b.unreadCount - a.unreadCount;
            }
            return a.name.localeCompare(b.name);
        });

        res.status(200).json({
            success: true,
            data: contactsWithUnread
        });
    } catch (err) {
        console.error('Get contacts error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

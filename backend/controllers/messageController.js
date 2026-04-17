import { prisma } from '../lib/prisma.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, attachmentUrl, attachmentType } = req.body;
        const senderId = req.user.id;

        // If it's just a file upload, content could be empty, so we must allow one or the other
        if (!receiverId || (!content && !attachmentUrl)) {
            return res.status(400).json({ success: false, message: 'Receiver and content/attachment are required' });
        }

        // Check if receiver has blocked sender
        const receiverSettings = await prisma.userSetting.findUnique({
            where: { userId: receiverId }
        });
        
        if (receiverSettings?.blockedUsers?.includes(senderId)) {
            return res.status(403).json({ success: false, message: 'You have been blocked by this user.' });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content: content || "",
                attachmentUrl,
                attachmentType
            }
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
export const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: userId },
                    { senderId: userId, receiverId: currentUserId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        // Mark messages as read if receiver is current user
        await prisma.message.updateMany({
            where: {
                senderId: userId,
                receiverId: currentUserId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

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
export const getContacts = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        
        // For simplicity in MVP: return all users except current user. 
        const contacts = await prisma.user.findMany({
            where: { id: { not: currentUserId } },
            select: { id: true, role: true, name: true, avatar: true },
            orderBy: { name: 'asc' },
            take: 100
        });

        // Fetch unread messages grouped by sender
        const unreadCounts = await prisma.message.groupBy({
            by: ['senderId'],
            where: {
                receiverId: currentUserId,
                isRead: false
            },
            _count: {
                _all: true
            }
        });

        const unreadMap = {};
        unreadCounts.forEach(item => {
            unreadMap[item.senderId] = item._count._all;
        });

        // Get current user's blocked users to filter out from contacts
        const userSettings = await prisma.userSetting.findUnique({
            where: { userId: currentUserId }
        });
        const blockedUsers = userSettings?.blockedUsers || [];

        const contactsWithUnread = contacts
          .filter(contact => !blockedUsers.includes(contact.id))
          .map(contact => {
            return {
                ...contact,
                unreadCount: unreadMap[contact.id] || 0,
                isOnline: true
            };
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

// @desc    Get blocked users for current user
// @route   GET /api/messages/blocked
// @access  Private
export const getBlockedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const userSettings = await prisma.userSetting.findUnique({
            where: { userId: currentUserId }
        });
        const blockedUsers = userSettings?.blockedUsers || [];

        if (blockedUsers.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const users = await prisma.user.findMany({
            where: { id: { in: blockedUsers } },
            select: { id: true, name: true, role: true, avatar: true }
        });

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error('Get blocked users error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new message group or channel
// @route   POST /api/messages/groups
// @access  Private
export const createGroup = async (req, res) => {
    try {
        const { name, description, isChannel, memberIds } = req.body;
        const adminId = req.user.id;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Group name is required' });
        }

        const validMemberIds = Array.isArray(memberIds) ? memberIds : [];

        const group = await prisma.messageGroup.create({
            data: {
                name,
                description: description || '',
                isChannel: isChannel || false,
                adminId,
                members: {
                    connect: [...validMemberIds.map(id => ({ id })), { id: adminId }]
                }
            }
        });

        res.status(201).json({
            success: true,
            data: group
        });
    } catch (err) {
        console.error('Create group error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a message content
// @route   PUT /api/messages/:messageId
// @access  Private
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const currentUserId = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Message content is required' });
        }

        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (message.senderId !== currentUserId) {
            return res.status(403).json({ success: false, message: 'Only the sender can edit this message' });
        }

        const updated = await prisma.message.update({
            where: { id: messageId },
            data: { content: content.trim() }
        });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error('Update message error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a message for the conversation
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const currentUserId = req.user.id;

        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (message.senderId !== currentUserId && message.receiverId !== currentUserId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
        }

        await prisma.message.delete({ where: { id: messageId } });

        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
        console.error('Delete message error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle block status of a user
// @route   POST /api/messages/block/:userId
// @access  Private
export const toggleBlockUser = async (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user.id;

        // Ensure user settings exist
        let settings = await prisma.userSetting.findUnique({
            where: { userId: currentUserId }
        });

        if (!settings) {
            settings = await prisma.userSetting.create({
                data: { userId: currentUserId }
            });
        }

        let updatedBlocked = [...settings.blockedUsers];
        const isBlocked = updatedBlocked.includes(targetUserId);

        if (isBlocked) {
            // Unblock
            updatedBlocked = updatedBlocked.filter(id => id !== targetUserId);
        } else {
            // Block
            updatedBlocked.push(targetUserId);
        }

        const updatedSettings = await prisma.userSetting.update({
            where: { userId: currentUserId },
            data: { blockedUsers: updatedBlocked }
        });

        res.status(200).json({
            success: true,
            isBlocked: !isBlocked,
            message: !isBlocked ? 'User blocked successfully.' : 'User unblocked successfully.'
        });
    } catch (err) {
        console.error('Toggle block error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

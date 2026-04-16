import prisma from '../prisma/prismaClient.js';

// @route   POST /api/connections
// @desc    Initiates a connection request (Parent or Admin to Student)
// @access  Private (Parent/Admin)
export const requestConnection = async (req, res) => {
  try {
    const { targetId, type, termsAccepted } = req.body;
    const requesterId = req.user.id;

    if (!termsAccepted) {
      return res.status(400).json({ success: false, message: "Privacy terms must be accepted to establish a monitored link." });
    }

    if (requesterId === targetId) {
      return res.status(400).json({ success: false, message: "Cannot connect to yourself." });
    }

    const existing = await prisma.connectionRequest.findFirst({
      where: {
        requesterId,
        targetId,
        status: { in: ['pending_consent', 'active'] }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "A connection or pending request already exists with this user." });
    }

    // Provision an encrypted proxy message channel
    const secureChannel = await prisma.messageGroup.create({
      data: {
        name: `Connection-${Date.now().toString().slice(-6)}`,
        description: `Encrypted communication overlay between ${type} and student. Monitored by Administration.`,
        isChannel: false,
        adminId: requesterId,
        members: {
          connect: [{ id: requesterId }, { id: targetId }]
        }
      }
    });

    const connection = await prisma.connectionRequest.create({
      data: {
        requesterId,
        targetId,
        type,
        status: 'pending_consent',
        termsAccepted: Boolean(termsAccepted),
        messageChannelId: secureChannel.id
      }
    });

    res.status(201).json({ success: true, data: connection, message: "Connection request initiated. Awaiting consent." });
  } catch (err) {
    console.error('Request Connection Error:', err);
    res.status(500).json({ success: false, error: "Server Protocol Rejection Failed" });
  }
};

// @route   GET /api/connections/pending
// @desc    Gets the pending incoming connections for the user
// @access  Private
export const getPendingConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const pending = await prisma.connectionRequest.findMany({
      where: { targetId: userId, status: 'pending_consent' },
      include: {
        requester: { select: { id: true, name: true, role: true } }
      }
    });
    
    res.status(200).json({ success: true, data: pending });
  } catch (err) {
    console.error('Fetch Pending Connections Error:', err);
    res.status(500).json({ success: false, error: "Server Protocol Fetch Failed" });
  }
};

// @route   POST /api/connections/:connectionId/accept
// @desc    Accepts the incoming connection establishing the relationship officially
// @access  Private
export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const request = await prisma.connectionRequest.findFirst({
      where: { id: connectionId, targetId: userId, status: 'pending_consent' }
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found or expired." });
    }

    const updated = await prisma.connectionRequest.update({
      where: { id: connectionId },
      data: { status: 'active' }
    });

    // If it's a parent link, optionally update the User parentId reference map
    if (updated.type === 'parent') {
       await prisma.user.update({
         where: { id: userId },
         data: { parentId: updated.requesterId }
       });
    }

    // Ping the group to alert its active
    if (updated.messageChannelId) {
       await prisma.message.create({
          data: {
             content: "SYSTEM ALERT: The user has authorized the privacy proxy. Secure connection active.",
             senderId: userId,
             groupId: updated.messageChannelId
          }
       });
    }

    res.status(200).json({ success: true, message: "Connection Privileges Delegated securely." });
  } catch (err) {
    console.error('Accept Connection Error:', err);
    res.status(500).json({ success: false, error: "Authorization Protocol Failed" });
  }
};

// @route   POST /api/connections/:connectionId/reject
// @desc    Declines the incoming connection permanently isolating and deleting the proxy
// @access  Private
export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const request = await prisma.connectionRequest.findFirst({
      where: { id: connectionId, targetId: userId, status: 'pending_consent' }
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    const updated = await prisma.connectionRequest.update({
      where: { id: connectionId },
      data: { status: 'rejected' }
    });
    
    // Purge the proxy channel early to enforce privacy block
    if (updated.messageChannelId) {
       await prisma.messageGroup.delete({ where: { id: updated.messageChannelId } }).catch(() => null);
    }

    res.status(200).json({ success: true, message: "Connection Rejected. Constraints maintained." });
  } catch (err) {
    console.error('Reject Connection Error:', err);
    res.status(500).json({ success: false, error: "Termination Protocol Failed" });
  }
};

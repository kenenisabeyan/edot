const Activity = require('../models/Activity');
const Achievement = require('../models/Achievement');

// Utility to log activity internally
const logActivity = async (userId, action, type = 'system', details = null, relatedId = null, visibility = 'public', insightFlag = null, metadata = null) => {
  try {
    if (!userId) return; // Need user to log against
    const activity = new Activity({
      user: userId,
      action,
      type,
      details,
      relatedId,
      visibility,
      insightFlag,
      metadata
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// GET /api/activity
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching personal activities', error: error.message });
  }
};

// GET /api/activity/all - Admin only
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name role email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching all activities', error: error.message });
  }
};

// GET /api/activity/insights - For Parents
const getInsightsForParent = async (req, res) => {
  try {
    // Assuming parent has a list of children ObjectIds in req.user.children
    const childrenIds = req.user.children || [];
    
    // In MVP, we fetch insights for their children. If children array is empty, handle gracefully.
    const insights = await Activity.find({
      user: { $in: childrenIds },
      visibility: 'insight'
    })
    // Selective projection: Hide raw details and metadata
    .select('-details -metadata')
    .populate('user', 'name role avatar')
    .sort({ createdAt: -1 })
    .limit(20);

    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching insights', error: error.message });
  }
};

// PUT /api/activity/:id/flag - For Instructors to flag/elevate actions
const flagActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { insightFlag } = req.body; // 'achievement' or 'concern'

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Toggle logic: if already an insight with same flag, maybe untouch it?
    // We will just overwrite it here.
    activity.visibility = 'insight';
    activity.insightFlag = insightFlag;
    await activity.save();

    // Gamification Hook: Reward learning points for 'achievement' insights
    if (insightFlag === 'achievement') {
      let ach = await Achievement.findOne({ user: activity.user });
      if (!ach) ach = new Achievement({ user: activity.user });
      ach.learningPoints += 50; // Mint 50 points
      
      ach.badges.push({
        title: 'Instructor Acknowledgment',
        description: activity.action,
        iconType: 'star'
      });
      await ach.save();
    }

    res.status(200).json({ success: true, data: activity, message: 'Activity promoted to an insight successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error flagging activity', error: error.message });
  }
};

// POST /api/activity - Create manual activity (like Student private micro-goals)
const createActivity = async (req, res) => {
  try {
    const { action, type, details, relatedId, visibility, insightFlag, metadata } = req.body;
    const activity = new Activity({
      user: req.user._id,
      action,
      type,
      details,
      relatedId,
      visibility: visibility || 'private', // default to private if manual Post
      insightFlag,
      metadata
    });
    await activity.save();
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error creating activity', error: error.message });
  }
};

module.exports = {
  logActivity,
  getMyActivities,
  getAllActivities,
  getInsightsForParent,
  flagActivity,
  createActivity
};

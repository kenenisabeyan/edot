const Achievement = require('../models/Achievement');
const User = require('../models/User');

const getMyAchievements = async (req, res) => {
  try {
    let achievement = await Achievement.findOne({ user: req.user._id });
    if (!achievement) {
      achievement = await Achievement.create({ user: req.user._id });
    }
    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

const getChildAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('children');
    if (!user || user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const childIds = user.children.map(child => child._id);
    const achievements = await Achievement.find({ user: { $in: childIds } }).populate('user', 'name');

    // Filter out private badges to respect Transparency Center rules
    const filteredAchievements = achievements.map(ach => {
      const doc = ach.toObject();
      doc.badges = doc.badges.filter(b => b.visibility === 'public');
      return doc;
    });

    res.status(200).json({ success: true, data: filteredAchievements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

module.exports = { getMyAchievements, getChildAchievements };

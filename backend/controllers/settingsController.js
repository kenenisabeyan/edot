const UserSetting = require('../models/UserSetting');

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await UserSetting.findOne({ user: req.user._id });
    if (!settings) {
      settings = await UserSetting.create({ user: req.user._id });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching settings', error: error.message });
  }
};

// PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const role = req.user.role; // 'student', 'parent', 'instructor', 'admin'
    const settingsData = req.body[role];
    const commonData = req.body.common;

    if (!settingsData && !commonData) {
      return res.status(400).json({ success: false, message: 'No valid setting payload provided.' });
    }

    let settings = await UserSetting.findOne({ user: req.user._id });
    if (!settings) {
      settings = new UserSetting({ user: req.user._id });
    }

    // Role specific
    if (settingsData) {
      settings[role] = { ...settings[role]?._doc || settings[role], ...settingsData };
    }
    
    // Common properties
    if (commonData) {
      settings.common = { ...settings.common?._doc || settings.common, ...commonData };
    }
    
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error updating settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};

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

    if (!settingsData) {
      return res.status(400).json({ success: false, message: 'No valid setting payload provided for role: ' + role });
    }

    let settings = await UserSetting.findOne({ user: req.user._id });
    if (!settings) {
      settings = new UserSetting({ user: req.user._id });
    }

    // Isolate updating exactly and only by role context
    // Example: If a student updates settings, req.body.student is applied to settings.student
    // Anything else provided is ignored.
    settings[role] = { ...settings[role]?._doc || settings[role], ...settingsData };
    
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

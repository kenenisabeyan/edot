const mongoose = require('mongoose');

const userSettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  student: {
    shareMilestones: { type: Boolean, default: true },
    shareGrades: { type: Boolean, default: true },
    privateMode: { type: Boolean, default: false }
  },
  parent: {
    billingMethod: { type: String, enum: ['card', 'bank_transfer', 'unlinked'], default: 'unlinked' },
    alertGradeBelow: { type: Number, default: 70 },
    alertAbsenceCount: { type: Number, default: 3 }
  },
  instructor: {
    consultationHours: { type: String, default: 'Mon-Wed 3PM-5PM' },
    courseVisibility: { type: String, enum: ['public', 'enrolled_only'], default: 'public' },
    autoTags: { type: Boolean, default: true }
  },
  admin: {
    primaryColor: { type: String, default: '#4f46e5' },
    feePercentage: { type: Number, default: 10 },
    autoInterventionTriggers: { type: Boolean, default: true },
    apiKey: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserSetting', userSettingSchema);

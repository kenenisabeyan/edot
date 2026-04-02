const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['auth', 'course', 'enrollment', 'learning', 'system', 'communication'],
    default: 'system'
  },
  details: {
    type: String
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'insight'],
    default: 'public'
  },
  insightFlag: {
    type: String,
    enum: ['achievement', 'concern', 'neutral', null],
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);

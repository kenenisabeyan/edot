const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please set a date for the event'],
  },
  type: {
    type: String,
    enum: ['exam', 'meeting', 'holiday', 'event', 'announcement', 'advice', 'support', 'assignment'],
    default: 'announcement',
  },
  color: {
    type: String,
    default: 'bg-indigo-500',
  },
  targetAudiences: [{
    type: String,
    enum: ['all', 'student', 'instructor', 'admin', 'parent'],
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

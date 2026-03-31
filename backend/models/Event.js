const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please set a date for the event'],
  },
  type: {
    type: String,
    enum: ['exam', 'meeting', 'holiday', 'event'],
    default: 'event',
  },
  color: {
    type: String,
    default: 'bg-indigo-500',
  },
  audience: {
    type: String,
    enum: ['all', 'student', 'instructor', 'admin'],
    default: 'all',
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

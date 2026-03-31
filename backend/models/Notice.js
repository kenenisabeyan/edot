const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add notice content'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  audience: {
    type: String,
    enum: ['all', 'student', 'instructor', 'admin'],
    default: 'all',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);

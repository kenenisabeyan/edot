const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a section name']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please provide a course ID']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: {
    days: [String],
    time: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);

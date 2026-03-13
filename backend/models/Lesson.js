const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lesson title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please add a video URL']
  },
  duration: {
    type: Number,
    required: [true, 'Please add lesson duration in minutes']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    fileUrl: String
  }],
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);
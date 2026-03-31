const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add the author name'],
  },
  category: {
    type: String,
    enum: ['Fiction', 'Science', 'History', 'Technology', 'Mathematics', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['available', 'checked_out'],
    default: 'available',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);

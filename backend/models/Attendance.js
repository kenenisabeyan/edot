const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Excused', 'Late'],
      default: 'Present',
    },
    notes: {
      type: String,
      trim: true,
    }
  }]
}, { timestamps: true });

// Prevent duplicate attendance for the same course on exactly the same day
attendanceSchema.index({ course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

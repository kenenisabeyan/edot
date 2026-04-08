const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  records: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor'],
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Truncate the time from the date to ensure we only have one document per day
attendanceSchema.pre('validate', function(next) {
  if (this.date) {
    // Zero out the time component to normalize the date
    this.date = new Date(Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate()));
  }
  next();
});

// Ensure one attendance document per course + section + date combination
attendanceSchema.index({ course: 1, section: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

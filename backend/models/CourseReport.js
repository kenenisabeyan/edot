const mongoose = require('mongoose');

const courseReportSchema = new mongoose.Schema({
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
  term: {
    type: String,
    required: true,
    default: 'Fall Term',
  },
  studentRecords: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendancePercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    finalGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F', 'Incomplete', 'Pending'],
      default: 'Pending',
    },
    remarks: {
      type: String,
      default: '',
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'submitted',
  }
}, { timestamps: true });

module.exports = mongoose.model('CourseReport', courseReportSchema);

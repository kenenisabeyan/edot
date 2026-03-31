const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Assuming lesson_id targets an embedded lesson's _id
    },
    video_segments: {
        type: [Number], // Array of integers representing 30-second blocks (e.g. [30, 60, 90])
        default: []
    },
    is_video_complete: {
        type: Boolean,
        default: false
    },
    exam_scores: [{
        attempt_date: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            required: true
        },
        passed: {
            type: Boolean,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Compound index to ensure one log per user per lesson
progressLogSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model('ProgressLog', progressLogSchema);

const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
    issue_date: {
        type: Date,
        default: Date.now
    },
    verification_hash: {
        type: String,
        required: true,
        unique: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// A rule for insertion would ideally be handled via a pre('save') hook or Service layer logic, 
// checking ProgressLogs aggregation for the actual user and course before generating the hash and saving.

certificateSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Here we could perform an aggregation logic check on ProgressLog
        // For example conceptually: const logs = await mongoose.model('ProgressLog').find(...)
        // Let's assume the controller handles validation before calling .save().
    }
    next();
});

module.exports = mongoose.model('Certificate', certificateSchema);

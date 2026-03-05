const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a lesson title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    videoUrl: {
        type: String,
        required: [true, 'Please provide a video URL'],
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Please provide a valid URL'
        ]
    },
    duration: {
        type: Number,
        required: [true, 'Please provide lesson duration in minutes'],
        min: [1, 'Duration must be at least 1 minute'],
        max: [180, 'Duration cannot exceed 180 minutes']
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    resources: [{
        title: String,
        fileUrl: String,
        type: {
            type: String,
            enum: ['pdf', 'link', 'file'],
            default: 'link'
        }
    }],
    isPreview: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure unique order per course
lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

// Format duration for display
lessonSchema.virtual('formattedDuration').get(function() {
    const minutes = this.duration;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
        ? `${hours} hr ${remainingMinutes} min` 
        : `${hours} hr`;
});

module.exports = mongoose.model('Lesson', lessonSchema);
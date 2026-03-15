const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Programming',
            'Mathematics',
            'Science',
            'Exam Prep',
            'Languages',
            'Business',
            'Design',
            'Marketing'
        ]
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'Beginner'
    },
    duration: {
        type: Number,
        required: [true, 'Please provide course duration in hours'],
        min: [1, 'Duration must be at least 1 hour']
    },
    thumbnail: {
        type: String,
        default: 'default-course.jpg'
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4.5
    },
    totalStudents: {
        type: Number,
        default: 0,
        min: 0
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    requirements: [String],
    whatYouWillLearn: [String],
    isPublished: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    tags: [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create slug before saving
courseSchema.pre('save', function(next) {
    this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    next();
});

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
    return this.lessons.length;
});

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function() {
    const hours = this.duration;
    if (hours < 1) return `${hours * 60} minutes`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
});

module.exports = mongoose.model('Course', courseSchema);
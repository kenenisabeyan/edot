const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Programming', 'Mathematics', 'Science', 'Exam Prep', 'Languages', 'Business']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number,
    required: [true, 'Please add course duration in hours']
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  price: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.5
  },
  totalStudents: {
    type: Number,
    default: 0
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create course slug from title
courseSchema.pre('save', function(next) {
  this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

module.exports = mongoose.model('Course', courseSchema);
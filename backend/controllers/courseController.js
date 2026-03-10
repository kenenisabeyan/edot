// backend/controllers/courseController.js
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficultyLevel = difficulty;
    if (search) {
      query.$text = { $search: search };
    }
    
    const courses = await Course.find(query)
      .populate('tutorId', 'name profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Course.countDocuments(query);
    
    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutorId', 'name profile')
      .populate('enrolledStudents.studentId', 'name');
      
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Tutor
const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      tutorId: req.user._id
    };
    
    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Tutor
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is course tutor or admin
    if (course.tutorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Tutor/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.tutorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.studentId.toString() === req.user._id.toString()
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Add to course
    course.enrolledStudents.push({
      studentId: req.user._id,
      enrolledAt: new Date(),
      completedLessons: [],
      progress: 0
    });
    
    await course.save();
    
    // Add to user's enrolled courses
    user.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date()
    });
    
    await user.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
};
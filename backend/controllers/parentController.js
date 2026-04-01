const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get parent dashboard stats
// @route   GET /api/parent/dashboard
// @access  Private (Parent)
exports.getParentDashboardStats = async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Find parent and populate children with their enrolledCourses and basic info
    const parent = await User.findById(parentId).populate({
      path: 'children',
      select: 'name email avatar enrolledCourses',
      populate: {
        path: 'enrolledCourses.course',
        select: 'title'
      }
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }

    const children = parent.children || [];
    const totalLearners = children.length;
    
    let totalEnrolledCourses = 0;
    let totalProgress = 0;
    let progressCount = 0;
    let completedLessons = 0;
    let completedCourses = 0;

    children.forEach(child => {
      if (child.enrolledCourses && child.enrolledCourses.length > 0) {
        totalEnrolledCourses += child.enrolledCourses.length;
        child.enrolledCourses.forEach(enroll => {
          totalProgress += enroll.progress || 0;
          progressCount++;
          completedLessons += (enroll.completedLessons ? enroll.completedLessons.length : 0);
          if (enroll.passedFinalExam) {
            completedCourses++;
          }
        });
      }
    });

    const averageProgress = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0;

    res.json({
      success: true,
      data: {
        totalLearners,
        totalEnrolledCourses,
        averageProgress,
        completedLessons,
        completedCourses
      }
    });
  } catch (error) {
    console.error('Error fetching parent dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard stats' });
  }
};

// @desc    Get parent's learners detailed progress
// @route   GET /api/parent/learners
// @access  Private (Parent)
exports.getParentLearners = async (req, res) => {
  try {
    const parentId = req.user.id;
    
    const parent = await User.findById(parentId).populate({
      path: 'children',
      select: 'name email avatar enrolledCourses',
      populate: {
        path: 'enrolledCourses.course',
        select: 'title description thumbnail category level'
      }
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }

    res.json({
      success: true,
      count: parent.children.length,
      data: parent.children
    });
  } catch (error) {
    console.error('Error fetching parent learners:', error);
    res.status(500).json({ success: false, message: 'Server error fetching learners data' });
  }
};

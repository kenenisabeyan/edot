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

    // Generate Mock Timeline Data for charts
    const performanceTimeline = [
      { name: 'Week 1', progress: 10, target: 15 },
      { name: 'Week 2', progress: 25, target: 30 },
      { name: 'Week 3', progress: 35, target: 45 },
      { name: 'Week 4', progress: 50, target: 60 },
      { name: 'Week 5', progress: 75, target: 75 },
      { name: 'Week 6', progress: 85, target: 90 },
      { name: 'Week 7', progress: 95, target: 100 },
    ];

    // Generate Mock Recent Activity
    const recentActivity = [
      { id: 1, type: 'course_completed', title: 'React Fundamentals', studentName: children[0]?.name || 'Student', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, type: 'quiz_passed', title: 'JavaScript Basics Quiz', score: 95, studentName: children[0]?.name || 'Student', date: new Date(Date.now() - 172800000).toISOString() },
      { id: 3, type: 'lesson_watched', title: 'Introduction to Hooks', studentName: children[0]?.name || 'Student', date: new Date(Date.now() - 259200000).toISOString() },
    ];

    const primaryLearner = children.length > 0 ? {
      id: children[0]._id,
      name: children[0].name,
      avatar: children[0].avatar
    } : null;

    res.json({
      success: true,
      data: {
        primaryLearner,
        totalLearners,
        totalEnrolledCourses,
        averageProgress,
        completedLessons,
        completedCourses,
        performanceTimeline,
        recentActivity
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

// @desc    Get detailed, secure insights for a specific student (No private messages)
// @route   GET /api/parent/student/:id/insights
// @access  Private (Parent)
exports.getParentStudentInsights = async (req, res) => {
  try {
    const parentId = req.user.id;
    const studentId = req.params.id;
    
    const parent = await User.findById(parentId);
    if (!parent || !parent.children.includes(studentId)) {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this student data' });
    }

    const student = await User.findById(studentId).populate({
        path: 'enrolledCourses.course',
        select: 'title category'
    });

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Mock timeline mapping to specific student's enrolled courses for the UI timeline stepper
    const timeline = student.enrolledCourses.map((ec, idx) => ({
       id: idx,
       courseName: ec.course?.title || 'Unknown Course',
       progress: ec.progress || 0,
       status: ec.progress === 100 ? 'Completed' : (ec.progress > 0 ? 'In Progress' : 'Not Started'),
       date: new Date(Date.now() - (idx * 86400000)).toISOString()
    }));

    res.json({
        success: true,
        data: {
           studentName: student.name,
           avatar: student.avatar,
           timeline,
           overallProgress: student.enrolledCourses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / (student.enrolledCourses.length || 1)
        }
    });

  } catch (error) {
     console.error('Error fetching student insights:', error);
     res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get financial invoice summary for a specific student
// @route   GET /api/parent/student/:id/invoice
// @access  Private (Parent)
exports.getParentStudentInvoice = async (req, res) => {
  try {
    const parentId = req.user.id;
    const studentId = req.params.id;
    
    const parent = await User.findById(parentId);
    if (!parent || !parent.children.includes(studentId)) {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this student data' });
    }

    // Mock response for the 'Mini-Invoice' requirement
    res.json({
        success: true,
        data: {
           studentId: studentId,
           pendingFees: 450,
           currency: 'USD',
           dueDate: new Date(Date.now() + (7 * 86400000)).toISOString(),
           status: 'Pending',
           description: 'Fall Semester Registration & Labs'
        }
    });

  } catch (error) {
     console.error('Error fetching student invoice:', error);
     res.status(500).json({ success: false, message: 'Server error' });
  }
};

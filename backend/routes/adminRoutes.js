const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('enrolledCourses.course', 'title status')
            .sort({ createdAt: -1 })
            .lean();
        
        // Find courses to map to instructors natively
        const allCourses = await Course.find().select('title instructor status isPublished').lean();
        
        const enhancedUsers = users.map(user => {
            if (user.role === 'instructor') {
                user.taughtCourses = allCourses.filter(c => 
                    c.instructor && c.instructor.toString() === user._id.toString()
                );
            }
            return user;
        });

        res.status(200).json({ success: true, count: enhancedUsers.length, data: enhancedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/users
// @desc    Create a new user manually
// @access  Private/Admin
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, batch, section, department, specialization, phone } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Hook automatically salts in the mongoose pre-save logic.
            role: role || 'student',
            batch,
            section,
            department,
            specialization,
            phone
        });

        // Safe return (no passport/jwt overriding)
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                batch: user.batch,
                section: user.section,
                department: user.department,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Admin Create User error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/instructors
// @desc    Get all instructors
router.get('/instructors', async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' })
            .select('-password')
            .populate('assignedStudents', 'name email status')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: instructors.length, data: instructors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/instructor/:id/approve
// @desc    Approve an instructor
router.put('/instructor/:id/approve', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'Instructor not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/instructor/:id/reject
// @desc    Reject an instructor
router.put('/instructor/:id/reject', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'Instructor not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/students
// @desc    Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .populate('assignedInstructor', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/student/:id/approve
// @desc    Approve a student
router.put('/student/:id/approve', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/student/:id/reject
// @desc    Reject a student
router.put('/student/:id/reject', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/student/:id/assign
// @desc    Assign student to an instructor bi-directionally
router.put('/student/:id/assign', async (req, res) => {
    try {
        const { instructorId } = req.body;
        const student = await User.findById(req.params.id);
        const instructor = await User.findById(instructorId);

        if (!student || !instructor || student.role !== 'student' || instructor.role !== 'instructor') {
            return res.status(400).json({ success: false, message: 'Invalid assignment targets' });
        }

        // Clean previous relationship if reassigning
        if (student.assignedInstructor) {
           const oldInst = await User.findById(student.assignedInstructor);
           if (oldInst) {
             oldInst.assignedStudents.pull(student._id);
             await oldInst.save();
           }
        }

        // Apply new Assignment
        student.assignedInstructor = instructor._id;
        if (!instructor.assignedStudents.includes(student._id)) {
            instructor.assignedStudents.push(student._id);
        }

        await student.save();
        await instructor.save();

        res.status(200).json({ success: true, message: 'Student assigned safely', data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (approve/reject)
router.put('/users/:id/status', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Ensure valid status
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        user.status = status;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User removed completely' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/courses/pending
// @desc    Get all pending courses
router.get('/courses/pending', async (req, res) => {
    try {
        const courses = await Course.find({ status: 'pending' }).populate('instructor', 'name email');
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/admin/courses/:id/status
// @desc    Approve or reject a course
router.put('/courses/:id/status', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        course.status = req.body.status;
        if (req.body.status === 'approved') {
            course.isPublished = true;
        } else {
            course.isPublished = false;
        }

        await course.save();
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/analytics/detailed
// @desc    Get precise detailed admin analytics for charts
router.get('/analytics/detailed', async (req, res) => {
    try {
        const users = await User.find().select('role createdAt');
        const courses = await Course.find().select('title price totalStudents createdAt isPublished instructor');

        // Revenue over last 6 months (Real calculation only, no mock)
        const revenueData = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date();
        for (let i = 5; i >= 0; i--) {
            let m = new Date(d.getFullYear(), d.getMonth() - i, 1);
            let monthRev = 0;
            courses.forEach(c => {
                if (c.isPublished && c.price && c.totalStudents) {
                    if (new Date(c.createdAt) <= new Date(m.getFullYear(), m.getMonth() + 1, 0)) {
                         monthRev += (c.price * c.totalStudents); 
                    }
                }
            });
            revenueData.push({ name: monthNames[m.getMonth()], revenue: monthRev });
        }

        // Engagement Data (Students vs Teachers over time)
        const engagementData = [];
        for (let i = 3; i >= 0; i--) {
            let start = new Date();
            start.setDate(start.getDate() - (i*7));
            let sCount = users.filter(u => u.role === 'student' && new Date(u.createdAt) <= start).length;
            let tCount = users.filter(u => u.role === 'instructor' && new Date(u.createdAt) <= start).length;
            engagementData.push({ name: `Week ${4-i}`, students: sCount, teachers: tCount });
        }

        // Course completion data (Status Overview)
        let total = courses.length;
        let published = courses.filter(c => c.isPublished).length;
        const courseCompletionData = [
            { name: 'Published', value: published, color: '#10b981' },
            { name: 'Draft/Pending', value: (total - published), color: '#f59e0b' }
        ];

        res.status(200).json({
            success: true,
            data: {
                revenueData,
                engagementData,
                courseCompletionData,
                totalRevenue: revenueData.reduce((acc, curr) => acc + curr.revenue, 0),
                totalActiveLearners: users.filter(u => u.role === 'student').length,
                totalCourseCompletions: 0 // True implementation requires mapping through enrolledCourses passing logic
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ status: 'approved' });
        const totalStudents = await User.countDocuments({ role: 'student', status: 'approved' });
        const totalInstructors = await User.countDocuments({ role: 'instructor', status: 'approved' });
        
        const courses = await Course.find();
        const totalCourses = courses.length;
        const pendingCourses = courses.filter(c => c.status === 'pending').length;
        const pendingUsers = await User.countDocuments({ status: 'pending' });
        
        // Real revenue strictly mapped
        let totalRevenue = 0;
        courses.forEach(course => {
            if (course.isPublished && course.price && course.totalStudents) {
                totalRevenue += (course.price * course.totalStudents);
            }
        });

        // Get Real Top 3 Courses for Admin Performance Dashboard
        const topCourses = courses.filter(c => c.isPublished).sort((a,b) => b.totalStudents - a.totalStudents).slice(0, 3);
        const courseIds = topCourses.map(c => c._id);
        
        const ProgressLog = require('../models/ProgressLog');
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        const rawLogs = await ProgressLog.find({ 
           course_id: { $in: courseIds }, 
           updatedAt: { $gte: fiveDaysAgo } 
        }).populate('course_id', 'title');

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const studentPerformanceData = [4, 3, 2, 1, 0].map(diff => {
            const d = new Date();
            d.setDate(d.getDate() - diff);
            return {
                name: days[d.getDay()],
                dateStr: d.toISOString().split('T')[0],
                value1: 0,
                value2: 0,
                value3: 0
            };
        });

        rawLogs.forEach(log => {
             const logDate = new Date(log.updatedAt).toISOString().split('T')[0];
             const targetDay = studentPerformanceData.find(d => d.dateStr === logDate);
             if (targetDay) {
                  const cid = log.course_id._id.toString();
                  if (topCourses[0] && cid === topCourses[0]._id.toString()) targetDay.value1 += 1;
                  else if (topCourses[1] && cid === topCourses[1]._id.toString()) targetDay.value2 += 1;
                  else if (topCourses[2] && cid === topCourses[2]._id.toString()) targetDay.value3 += 1;
             }
        });

        const cleanStudentPerformance = studentPerformanceData.map(({name, value1, value2, value3}) => ({name, value1, value2, value3}));

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5); // get all users, not just approved
        const recentActivity = [];
        recentUsers.forEach(u => recentActivity.push({ 
             id: u._id, 
             title: u.status === 'pending' ? `New ${u.role} registered (Pending)` : `New ${u.role} joined`, 
             itemTitle: u.name, 
             type: u.status === 'pending' ? 'user_pending' : 'user_joined', 
             studentName: u.name, 
             date: u.createdAt 
        }));
        const recentCoursesObj = await Course.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3);
        recentCoursesObj.forEach(c => recentActivity.push({ id: c._id, title: 'Course published', itemTitle: c.title, type: 'course_completed', studentName: 'System', date: c.createdAt }));
        recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalCourses,
                pendingCourses,
                pendingUsers,
                totalRevenue,
                studentPerformanceData: cleanStudentPerformance,
                courseNames: topCourses.map(c => c.title),
                recentActivity: recentActivity.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;

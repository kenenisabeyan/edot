// frontend/src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  ClockIcon, 
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, sessionsRes, notificationsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users/${user._id}/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/sessions/student`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/users/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEnrolledCourses(coursesRes.data);
      setUpcomingSessions(sessionsRes.data.filter(s => s.status === 'scheduled'));
      setNotifications(notificationsRes.data);

      // Calculate stats
      const total = coursesRes.data.length;
      const completed = coursesRes.data.filter(c => c.progress === 100).length;
      const avgProgress = total > 0 
        ? coursesRes.data.reduce((acc, curr) => acc + curr.progress, 0) / total 
        : 0;

      setStats({
        totalCourses: total,
        completedCourses: completed,
        totalHours: coursesRes.data.reduce((acc, curr) => acc + (curr.totalDuration || 0), 0),
        averageProgress: Math.round(avgProgress)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/notifications/${notificationId}`,
        { read: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-textPrimary">{stats.totalCourses}</span>
          </div>
          <h3 className="text-textSecondary">Enrolled Courses</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-textPrimary">{stats.completedCourses}</span>
          </div>
          <h3 className="text-textSecondary">Completed Courses</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-textPrimary">{stats.totalHours}</span>
          </div>
          <h3 className="text-textSecondary">Learning Hours</h3>
        </div>

        <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-textPrimary">{stats.averageProgress}%</span>
          </div>
          <h3 className="text-textSecondary">Avg. Progress</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 bg-cardBackground rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-textPrimary">Continue Learning</h2>
            <Link to="/student/my-courses" className="text-primary hover:text-blue-800 text-sm font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} className="flex items-center gap-4">
                <img
                  src={course.thumbnail || 'https://source.unsplash.com/random/100x100?course'}
                  alt={course.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-textPrimary mb-1">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-textSecondary mb-2">
                    <span>{course.lessons?.length || 0} lessons</span>
                    <span>{course.totalDuration || 0} min</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      ></div>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/student/course/${course._id}/learn`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition duration-300 text-sm"
                >
                  Continue
                </Link>
              </div>
            ))}

            {enrolledCourses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-textSecondary mb-4">You haven't enrolled in any courses yet</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-textPrimary">Upcoming Sessions</h2>
              <Link to="/student/book-tutoring" className="text-primary hover:text-blue-800 text-sm font-semibold">
                Book New
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingSessions.slice(0, 3).map((session) => (
                <div key={session._id} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-textPrimary">{session.topic}</p>
                    <p className="text-sm text-textSecondary">
                      {new Date(session.date).toLocaleDateString()} at {session.startTime}
                    </p>
                    <p className="text-xs text-textSecondary mt-1">
                      with {session.tutorId?.name}
                    </p>
                  </div>
                </div>
              ))}

              {upcomingSessions.length === 0 && (
                <p className="text-textSecondary text-center py-4">
                  No upcoming sessions
                </p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-textPrimary">Notifications</h2>
              {notifications.some(n => !n.read) && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-lg cursor-pointer transition duration-300 ${
                    notification.read ? 'bg-background' : 'bg-primary/5 border-l-4 border-primary'
                  }`}
                  onClick={() => !notification.read && markNotificationRead(notification._id)}
                >
                  <p className="text-sm text-textPrimary">{notification.message}</p>
                  <p className="text-xs text-textSecondary mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-textSecondary text-center py-4">
                  No notifications
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-textPrimary mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((course) => (
            <div key={course} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={`https://source.unsplash.com/random/300x200?course=${course}`}
                  alt="Course"
                  className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold">
                    View Course
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-textPrimary mb-1">Advanced Web Development</h3>
              <p className="text-sm text-textSecondary">Dr. Sarah Johnson</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-accent">★★★★★</span>
                <span className="text-sm text-textSecondary">(4.8)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
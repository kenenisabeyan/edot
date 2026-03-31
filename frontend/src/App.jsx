import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourseBuilder from './pages/InstructorCourseBuilder';
import StudentDashboard from './pages/StudentDashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Lesson from './pages/Lesson';
import QuizViewer from './pages/QuizViewer';
import About from './pages/About';
import Contact from './pages/Contact';
import { useAuth } from './context/AuthContext';

import EDOTLayout from './components/EDOTLayout';
import EDOTDashboard from './pages/EDOTDashboard';
import TeachersList from './pages/TeachersList';
import FinanceFees from './pages/FinanceFees';
import CalendarView from './pages/CalendarView';
import MessagesView from './pages/MessagesView';
import StudentCourses from './pages/StudentCourses';
import InstructorClasses from './pages/InstructorClasses';
import InstructorManageCourses from './pages/InstructorManageCourses';
import AdminCourseApprovals from './pages/AdminCourseApprovals';
import CertificatesView from './pages/CertificatesView';
import NoticeView from './pages/NoticeView';
import LibraryView from './pages/LibraryView';
import ProfileView from './pages/ProfileView';
import { Outlet } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';

function MainLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public / Landing Pages with Navbar & Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/quiz/:id" element={<QuizViewer />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Old Standalone routes mapping to null or removed to force dashboard usage */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor/*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/*" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* New EDOT Dashboard Layout (Full UI, no main Navbar/Footer) */}
      <Route path="/dashboard" element={
        <ErrorBoundary>
          <ProtectedRoute />
        </ErrorBoundary>
      }>
        <Route element={<EDOTLayout />}>
          <Route index element={<EDOTDashboard />} />
          <Route path="teachers" element={<TeachersList />} />
          <Route path="students" element={<div className="p-8 text-slate-500 font-medium">Students page under construction...</div>} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="classes" element={<InstructorClasses />} />
          <Route path="my-courses" element={<InstructorManageCourses />} />
          <Route path="builder" element={<InstructorCourseBuilder />} />
          <Route path="builder/:id" element={<InstructorCourseBuilder />} />
          <Route path="approvals" element={<AdminCourseApprovals />} />
          <Route path="attendance" element={<div className="p-8 text-slate-500 font-medium">Attendance page under construction...</div>} />
          <Route path="finance/fees" element={<FinanceFees />} />
          <Route path="finance/expenses" element={<div className="p-8 text-slate-500 font-medium">Expenses page under construction...</div>} />
          <Route path="notice" element={<NoticeView />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="schedule" element={<CalendarView />} />
          <Route path="library" element={<LibraryView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="certificates" element={<CertificatesView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="settings" element={<div className="p-8 text-slate-500 font-medium">Settings page under construction...</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

// Helper component to redirect /dashboard to the correct role dashboard
function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'instructor') return <Navigate to="/instructor" replace />;
  return <Navigate to="/student" replace />; // Default to student
}

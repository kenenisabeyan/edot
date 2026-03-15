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

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/quiz/:id" element={<QuizViewer />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Route Redirects base on Auth */}
          <Route path="/dashboard" element={
            <ProtectedRoute />
          }>
             <Route index element={<DashboardRouter />} />
          </Route>

          {/* Role-Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="/instructor/builder" element={<InstructorCourseBuilder />} />
            <Route path="/instructor/builder/:id" element={<InstructorCourseBuilder />} />
            <Route path="/instructor/*" element={<InstructorDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/*" element={<StudentDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// Helper component to redirect /dashboard to the correct role dashboard
function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'instructor') return <Navigate to="/instructor" replace />;
  return <Navigate to="/student" replace />; // Default to student
}

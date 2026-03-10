// frontend/src/App.jsx
import CoursesPage from "./pages/CoursesPage";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import { CoursesPage } from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import TutorProfilePage from './pages/TutorProfilePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CourseLearning from './pages/student/CourseLearning';
import BookTutoring from './pages/student/BookTutoring';
import SavedCourses from './pages/student/SavedCourses';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import CreateCourse from './pages/tutor/CreateCourse';
import ManageCourses from './pages/tutor/ManageCourses';
import ManageStudents from './pages/tutor/ManageStudents';
import TutorEarnings from './pages/tutor/TutorEarnings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTutors from './pages/admin/ManageTutors';
import Analytics from './pages/admin/Analytics';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="tutor/:id" element={<TutorProfilePage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="course/:id/learn" element={<CourseLearning />} />
            <Route path="book-tutoring" element={<BookTutoring />} />
            <Route path="saved" element={<SavedCourses />} />
          </Route>

          {/* Tutor Routes */}
          <Route path="/tutor" element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<TutorDashboard />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="manage-courses" element={<ManageCourses />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="earnings" element={<TutorEarnings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="tutors" element={<ManageTutors />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
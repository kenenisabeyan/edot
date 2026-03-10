// frontend/src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  BellIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student', icon: HomeIcon, label: 'Dashboard' },
    { to: '/student/my-courses', icon: BookOpenIcon, label: 'My Courses' },
    { to: '/student/book-tutoring', icon: CalendarIcon, label: 'Book Tutoring' },
    { to: '/student/saved', icon: AcademicCapIcon, label: 'Saved Courses' },
  ];

  const tutorLinks = [
    { to: '/tutor', icon: HomeIcon, label: 'Dashboard' },
    { to: '/tutor/create-course', icon: BookOpenIcon, label: 'Create Course' },
    { to: '/tutor/manage-courses', icon: AcademicCapIcon, label: 'Manage Courses' },
    { to: '/tutor/manage-students', icon: UserGroupIcon, label: 'Students' },
    { to: '/tutor/earnings', icon: CreditCardIcon, label: 'Earnings' },
  ];

  const adminLinks = [
    { to: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { to: '/admin/users', icon: UserGroupIcon, label: 'Users' },
    { to: '/admin/tutors', icon: AcademicCapIcon, label: 'Tutors' },
    { to: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
  ];

  const commonLinks = [
    { to: '/notifications', icon: BellIcon, label: 'Notifications' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const getLinks = () => {
    if (user?.role === 'student') return studentLinks;
    if (user?.role === 'tutor') return tutorLinks;
    if (user?.role === 'admin') return adminLinks;
    return [];
  };

  const links = [...getLinks(), ...commonLinks];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

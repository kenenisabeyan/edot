// frontend/src/pages/tutor/ManageCourses.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const ManageCourses = () => {
  const courses = [
    { id: 1, title: 'Complete Web Development Bootcamp', students: 234, revenue: 8999, status: 'published' },
    { id: 2, title: 'Advanced React Patterns', students: 89, revenue: 4399, status: 'published' },
    { id: 3, title: 'Node.js API Masterclass', students: 156, revenue: 5699, status: 'draft' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Manage Courses</h1>
        <Link
          to="/tutor/create-course"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          + New Course
        </Link>
      </div>

      <div className="bg-cardBackground rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4">
                  <div className="font-semibold text-textPrimary">{course.title}</div>
                </td>
                <td className="px-6 py-4 text-textSecondary">{course.students}</td>
                <td className="px-6 py-4 text-textSecondary">${course.revenue}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <EyeIcon className="h-5 w-5 text-textSecondary" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <PencilIcon className="h-5 w-5 text-textSecondary" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;
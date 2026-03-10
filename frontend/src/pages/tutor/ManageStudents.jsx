// frontend/src/pages/tutor/ManageStudents.jsx
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ManageStudents = () => {
  const students = [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', course: 'Web Development', progress: 65, lastActive: '2024-03-15' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', course: 'React Masterclass', progress: 32, lastActive: '2024-03-14' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', course: 'Node.js API', progress: 78, lastActive: '2024-03-15' },
    { id: 4, name: 'David Lee', email: 'david@example.com', course: 'Web Development', progress: 45, lastActive: '2024-03-13' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-textPrimary mb-6">Manage Students</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-cardBackground rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-textPrimary">{student.name}</div>
                    <div className="text-sm text-textSecondary
// frontend/src/pages/tutor/TutorDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const TutorDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '156', icon: UserGroupIcon, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Courses', value: '8', icon: AcademicCapIcon, color: 'bg-green-100 text-green-600' },
    { label: 'Monthly Earnings', value: '$2,450', icon: CurrencyDollarIcon, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg. Rating', value: '4.8', icon: ChartBarIcon, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentStudents = [
    { id: 1, name: 'Alice Brown', course: 'Web Development', progress: 65 },
    { id: 2, name: 'Bob Wilson', course: 'React Masterclass', progress: 32 },
    { id: 3, name: 'Carol Davis', course: 'Node.js API', progress: 78 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Tutor Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-cardBackground rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-textPrimary">{stat.value}</span>
            </div>
            <h3 className="text-textSecondary">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div className="bg-cardBackground rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-textPrimary mb-4">Recent Students</h2>
        <div className="space-y-4">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-semibold text-textPrimary">{student.name}</h3>
                <p className="text-sm text-textSecondary">{student.course}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button className="text-primary hover:text-blue-800">Message</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
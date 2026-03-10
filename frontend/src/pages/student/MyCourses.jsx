// frontend/src/pages/student/MyCourses.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const courses = [1, 2, 3, 4];

  return (
    <div>
      <h1 className="text-2xl font-bold text-textPrimary mb-6">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course} className="bg-cardBackground rounded-xl overflow-hidden shadow-lg">
            <img
              src={`https://source.unsplash.com/random/400x200?course=${course}`}
              alt="Course"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-textPrimary mb-2">Course Title {course}</h3>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course * 20}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${course * 20}%` }}
                  ></div>
                </div>
              </div>
              <Link
                to={`/student/course/${course}/learn`}
                className="inline-block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-blue-800"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
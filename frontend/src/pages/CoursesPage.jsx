import React from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const courses = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-textPrimary mb-8">All Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course} className="bg-cardBackground rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src={`https://source.unsplash.com/random/400x200?course=${course}`}
                alt="Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  Course Title {course}
                </h3>
                <p className="text-textSecondary mb-4">
                  Course description goes here...
                </p>
                <Link
                  to={`/courses/${course}`}
                  className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

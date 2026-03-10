// frontend/src/pages/student/SavedCourses.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';

const SavedCourses = () => {
  const savedCourses = [1, 2, 3];

  const removeFromSaved = (id) => {
    alert(`Course ${id} removed from saved`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-textPrimary mb-6">Saved Courses</h1>
      
      {savedCourses.length === 0 ? (
        <div className="text-center py-12 bg-cardBackground rounded-xl">
          <BookmarkOutline className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-textPrimary mb-2">No saved courses</h3>
          <p className="text-textSecondary mb-6">Browse courses and save the ones you're interested in</p>
          <Link
            to="/courses"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((course) => (
            <div key={course} className="bg-cardBackground rounded-xl overflow-hidden shadow-lg">
              <div className="relative">
                <img
                  src={`https://source.unsplash.com/random/400x200?course=${course}`}
                  alt="Course"
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => removeFromSaved(course)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <BookmarkSolid className="h-5 w-5 text-primary" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-textPrimary mb-2">Course Title {course}</h3>
                <p className="text-sm text-textSecondary mb-3">by Dr. Sarah Johnson</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent">★★★★★</span>
                  <span className="text-lg font-bold text-primary">$99.99</span>
                </div>
                <Link
                  to={`/courses/${course}`}
                  className="mt-4 inline-block w-full text-center border-2 border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition duration-300"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCourses;
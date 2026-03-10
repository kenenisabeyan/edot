import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cardBackground rounded-xl shadow-lg overflow-hidden">
          <img
            src={`https://source.unsplash.com/random/1200x400?course=${id}`}
            alt="Course"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-textPrimary mb-4">
              Course Details - {id}
            </h1>
            <p className="text-textSecondary mb-6">
              Detailed course description goes here...
            </p>
            <Link
              to="/courses"
              className="text-primary hover:text-blue-800"
            >
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
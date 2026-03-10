// frontend/src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-textPrimary mb-4">About EDOT</h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Empowering learners worldwide with quality education through innovative technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary mb-4">Our Mission</h2>
            <p className="text-textSecondary mb-4">
              EDOT (Education Digital Online Tutorials) was founded with a simple mission: 
              to make quality education accessible to everyone, everywhere. We believe that 
              learning should be flexible, engaging, and tailored to individual needs.
            </p>
            <p className="text-textSecondary">
              Through our platform, we connect students with expert tutors and provide 
              comprehensive courses that help learners achieve their goals.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Students learning"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-cardBackground p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">1000+ Courses</h3>
            <p className="text-textSecondary">Wide range of topics from programming to design</p>
          </div>
          <div className="bg-cardBackground p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">Expert Tutors</h3>
            <p className="text-textSecondary">Learn from industry professionals</p>
          </div>
          <div className="bg-cardBackground p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-2">50,000+ Students</h3>
            <p className="text-textSecondary">Join our growing community of learners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
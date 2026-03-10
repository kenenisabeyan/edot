// frontend/src/pages/TutorProfilePage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/solid';

const TutorProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  // Mock tutor data
  const tutor = {
    id: id,
    name: 'Dr. Sarah Johnson',
    title: 'Senior Web Development Instructor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.9,
    students: 1234,
    courses: 8,
    hourlyRate: 75,
    bio: 'With over 10 years of experience in web development and a PhD in Computer Science, I am passionate about teaching others to code. I have worked at top tech companies and now dedicate my time to helping students master full-stack development.',
    expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
    education: 'Ph.D. in Computer Science - Stanford University',
    experience: [
      'Senior Developer at Google (5 years)',
      'Lead Instructor at Coding Bootcamp (3 years)',
      'Freelance Developer (2 years)'
    ],
    courses: [
      { id: 1, title: 'Complete Web Development Bootcamp', students: 850, rating: 4.9 },
      { id: 2, title: 'Advanced React Patterns', students: 320, rating: 4.8 },
      { id: 3, title: 'Node.js API Masterclass', students: 420, rating: 4.9 }
    ],
    reviews: [
      { id: 1, student: 'John Doe', rating: 5, comment: 'Excellent instructor! Very clear explanations.', date: '2024-02-15' },
      { id: 2, student: 'Jane Smith', rating: 5, comment: 'Sarah is incredibly knowledgeable and patient.', date: '2024-02-10' },
      { id: 3, student: 'Mike Johnson', rating: 4, comment: 'Great course, learned a lot!', date: '2024-02-05' }
    ]
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/courses" className="text-primary hover:text-blue-800 mb-6 inline-block">
          ← Back to Courses
        </Link>

        {/* Profile Header */}
        <div className="bg-cardBackground rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-textPrimary mb-2">{tutor.name}</h1>
              <p className="text-xl text-textSecondary mb-4">{tutor.title}</p>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-accent" />
                  <span className="font-semibold">{tutor.rating}</span>
                  <span className="text-textSecondary">({tutor.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-primary" />
                  <span>{tutor.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-green-600" />
                  <span>${tutor.hourlyRate}/hour</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tutor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 font-semibold ${
                activeTab === 'about'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`pb-4 font-semibold ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Courses ({tutor.courses.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-semibold ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              Reviews ({tutor.reviews.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-cardBackground rounded-xl shadow-lg p-8">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-2xl font-bold text-textPrimary mb-4">About Me</h2>
              <p className="text-textSecondary mb-6">{tutor.bio}</p>
              
              <h3 className="text-xl font-bold text-textPrimary mb-3">Education</h3>
              <p className="text-textSecondary mb-6">{tutor.education}</p>
              
              <h3 className="text-xl font-bold text-textPrimary mb-3">Experience</h3>
              <ul className="list-disc list-inside text-textSecondary">
                {tutor.experience.map((exp, index) => (
                  <li key={index} className="mb-2">{exp}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold text-textPrimary mb-6">Courses by {tutor.name}</h2>
              <div className="space-y-4">
                {tutor.courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-textPrimary mb-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-textSecondary">
                          <span>{course.students} students</span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-accent" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold text-textPrimary mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {tutor.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-textPrimary">{review.student}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-accent' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-textSecondary">{review.date}</span>
                    </div>
                    <p className="text-textSecondary">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;

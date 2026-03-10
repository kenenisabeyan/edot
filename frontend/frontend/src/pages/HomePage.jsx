// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  ChartBarIcon,
  PlayCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <BookOpenIcon className="h-8 w-8 text-primary" />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry experts with years of practical experience'
    },
    {
      icon: <PlayCircleIcon className="h-8 w-8 text-primary" />,
      title: 'Video Lessons',
      description: 'High-quality video content with downloadable resources'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary" />,
      title: '1-on-1 Tutoring',
      description: 'Personalized sessions with tutors for better understanding'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary" />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'EDOT transformed my career. The courses are comprehensive and the tutors are incredibly helpful.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Developer',
      content: 'The platform is intuitive and the quality of content is outstanding. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Designer',
      content: 'I love the flexibility of learning at my own pace. The tutoring sessions are a game-changer.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Access thousands of expert-led courses, get personalized tutoring, 
              and advance your career with EDOT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/courses"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300"
                  >
                    Browse Courses
                  </Link>
                </>
              ) : (
                <Link
                  to={`/${user.role}`}
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
            <div className="mt-12 flex items-center gap-8 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm">
                <span className="font-bold">10,000+</span> students enrolled
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 hidden lg:block">
          <svg className="w-64 h-64 text-white opacity-10" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
              Why Choose EDOT?
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              We provide the best tools and resources to help you achieve your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-cardBackground p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
                Popular Courses
              </h2>
              <p className="text-textSecondary text-lg">
                Start learning with our most popular courses
              </p>
            </div>
            <Link
              to="/courses"
              className="text-primary hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              View All Courses
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((course) => (
              <div
                key={course}
                className="bg-cardBackground rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <img
                  src={`https://source.unsplash.com/random/400x200?course=${course}`}
                  alt="Course"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      Programming
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-textSecondary text-sm rounded-full">
                      Beginner
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-textPrimary mb-2">
                    Complete Web Development Bootcamp
                  </h3>
                  <p className="text-textSecondary mb-4">
                    Learn HTML, CSS, JavaScript, React, Node.js and more...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Instructor"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-textSecondary">John Doe</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 text-accent" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
              What Our Students Say
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Join thousands of satisfied learners who transformed their careers with EDOT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-cardBackground p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-accent" />
                  ))}
                </div>
                <p className="text-textSecondary mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://randomuser.me/api/portraits/women/${index + 10}.jpg`}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-textPrimary">{testimonial.name}</h4>
                    <p className="text-sm text-textSecondary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join EDOT today and get access to thousands of courses and expert tutors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Get Started Now
            </Link>
            <Link
              to="/courses"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
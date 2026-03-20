import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { GraduationCap, Code, Calculator, FlaskConical, BookOpen, Clock, Star, Users, Video, Award, Play, ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses?limit=3');
        setFeaturedCourses(data.courses);
      } catch (err) {
        console.error('Error fetching featured courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-200 overflow-hidden min-h-[calc(100vh-80px)] flex items-center py-20">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.1)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
                Learn Smart with <span className="text-blue-600">EDOT</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                A modern digital learning platform designed for students from primary to secondary level.
                Access structured lessons, expert guidance, and interactive tools to improve your education anytime.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
                  <GraduationCap className="w-5 h-5" />
                  Explore Courses
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 font-medium rounded-lg hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-sm cursor-default">
                  <Play className="w-5 h-5 text-blue-600" />
                  How EDOT Works
                </button>
              </div>

              <div className="flex gap-8 sm:gap-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">100+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Courses</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">10K+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Students</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">50+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Tutors</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 hidden lg:block">
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students learning with EDOT" 
                className="relative rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Explore Subjects</h2>
            <p className="text-slate-500 mt-4">Choose your learning path</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Mathematics', icon: Calculator },
              { name: 'English', icon: BookOpen },
              { name: 'Science', icon: FlaskConical },
              { name: 'Programming', icon: Code }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link 
                  to={`/courses?category=${cat.name.toLowerCase()}`} 
                  key={cat.name} 
                  className="group flex flex-col items-center p-8 bg-white border rounded-2xl hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{cat.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Popular Courses</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-center col-span-full">Loading...</p>
            ) : featuredCourses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl shadow hover:shadow-xl transition">
                <img src={course.thumbnail} alt="" className="rounded-t-2xl h-48 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm text-slate-500">{course.description}</p>
                  <Link to={`/course/${course._id}`} className="text-blue-600 mt-4 inline-block">
                    View Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <Video className="mx-auto text-blue-600 mb-4" />
            <h3>Video Lessons</h3>
          </div>
          <div>
            <Award className="mx-auto text-blue-600 mb-4" />
            <h3>Certificates</h3>
          </div>
          <div>
            <Users className="mx-auto text-blue-600 mb-4" />
            <h3>Community</h3>
          </div>
          <div>
            <Clock className="mx-auto text-blue-600 mb-4" />
            <h3>Flexible Learning</h3>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <h2 className="text-3xl mb-10">What Students Say</h2>
        <p className="max-w-xl mx-auto text-slate-300">
          “EDOT helped me improve my grades and understand subjects easily.”
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-center text-white">
        <h2 className="text-4xl mb-6">Start Learning Today</h2>
        <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl">
          Join EDOT
        </Link>
      </section>
    </>
  );
}
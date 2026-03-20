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
                Build Your Future with <span className="text-blue-600">EDOT</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Discover powerful, real-world learning designed for students in Ethiopia and beyond. 
                Gain practical skills in programming, science, mathematics, and more — all in one platform.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
                  <GraduationCap className="w-5 h-5" />
                  Explore Courses
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 font-medium rounded-lg hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-sm cursor-default">
                  <Play className="w-5 h-5 text-blue-600" />
                  See How EDOT Works
                </button>
              </div>

              <div className="flex gap-8 sm:gap-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">5K+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Courses Available</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">50K+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Active Learners</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-blue-600">1K+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Expert Instructors</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 hidden lg:block">
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning together" 
                className="relative rounded-2xl shadow-2xl object-cover"
                loading="eager" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full">
              Learn by Category
            </h2>
            <p className="text-slate-500 mt-8 text-lg">Choose your path and start mastering your skills today</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Programming', icon: Code },
              { name: 'Mathematics', icon: Calculator },
              { name: 'Science', icon: FlaskConical },
              { name: 'Exam Prep', icon: BookOpen }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link 
                  to={`/courses?category=${cat.name.toLowerCase()}`} 
                  key={cat.name} 
                  className="group flex flex-col items-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 relative z-10">{cat.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full">
              Top Featured Courses
            </h2>
            <p className="text-slate-500 mt-8 text-lg">Handpicked courses designed to boost your real-world skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : featuredCourses.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-12">New courses are coming soon. Stay tuned!</div>
            ) : (
              featuredCourses.map(course => (
                <div key={course._id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' : course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {course.duration}h
                      </span>
                    </div>
                    <Link to={`/course/${course._id}`}>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                          {course.instructor?.name?.charAt(0) || 'I'}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{course.instructor?.name || 'Instructor'}</span>
                      </div>
                      <Link to={`/course/${course._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        Start Learning →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-800 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              Discover All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full">
              Why EDOT Stands Out
            </h2>
            <p className="text-slate-500 mt-8 text-lg">A smarter way to learn, grow, and succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Video, title: 'Real Expert Guidance', desc: 'Learn directly from skilled instructors who simplify complex concepts into clear lessons.' },
              { icon: Clock, title: 'Flexible Learning', desc: 'Study anytime at your own pace without pressure, whether at home or on campus.' },
              { icon: Award, title: 'Recognized Certificates', desc: 'Earn certificates that prove your skills and help you stand out in your career.' },
              { icon: Users, title: 'Strong Learning Community', desc: 'Collaborate, ask questions, and grow together with other learners and mentors.' }
            ].map((feat, idx) => {
               const Icon = feat.icon;
               return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                  <p className="text-slate-600">{feat.desc}</p>
                </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rounded-l-full blur-3xl pointer-events-none transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-display font-bold text-white mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-400 after:to-blue-200 after:rounded-full">
              Voices of Our Learners
            </h2>
            <p className="text-slate-400 mt-8 text-lg">Real stories from students transforming their future</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Student', quote: 'EDOT changed the way I learn. The lessons are practical, engaging, and easy to follow.' },
              { name: 'David Chen', role: 'Professional', quote: 'I improved my skills while working full-time. EDOT made learning flexible and powerful.' }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-slate-300 italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                    <span className="text-sm text-slate-400">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Start Your Learning Journey Today</h2>
            <p className="text-xl text-blue-100 mb-10">Join EDOT and unlock knowledge, skills, and opportunities that shape your future.</p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
              Join EDOT Now
              <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>
    </>
  );
}
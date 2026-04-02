import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, Clock, Users, BookOpen, AlertCircle, CheckCircle, Lock, LayoutList, User as UserIcon, Award } from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  // Check if currently logged in user is enrolled
  const isEnrolled = user?.enrolledCourses?.some(e => e.course === id || e.course?._id === id);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.course);
      } catch (err) {
        console.error('Failed to load course details', err);
        setError('Course not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: `/course/${id}` } });
    }
    
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 flex items-center gap-3 max-w-md w-full">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="font-medium text-lg">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-transparent pb-20">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-16 pb-32 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rounded-l-full blur-3xl transform translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Header Content */}
            <div className="flex-1 lg:max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                  {course.category}
                </span>
                <span className="text-slate-300 text-sm font-medium flex items-center gap-1.5">
                  <LayoutList className="w-4 h-4" /> {course.level || 'Beginner'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex items-center gap-4 mb-10 p-4 bg-slate-800/50 rounded-xl border border-slate-700 inline-flex">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  {course.instructor?.name ? (
                    <span className="text-lg font-bold text-white uppercase">{course.instructor.name.charAt(0)}</span>
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5">Created by</p>
                  <p className="font-bold text-lg">{course.instructor?.name || 'Instructor'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-lg">{course.duration} Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium text-lg">{course.totalStudents || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-lg">{course.lessons?.length || 0} Lessons</span>
                </div>
              </div>
            </div>

            {/* floating enrollment card placeholder for desktop sizing */}
            <div className="hidden lg:block w-[400px] shrink-0"></div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* Syllabus */}
          <div className="flex-1 w-full mt-20 lg:mt-0 order-2 lg:order-1 pt-8 lg:pt-28">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Course Syllabus</h2>
            
            <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {!course.lessons || course.lessons.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <LayoutList className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-lg">No lessons have been added to this course yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {course.lessons.map((lesson, idx) => (
                    <div 
                      key={lesson._id} 
                      className={`p-6 flex items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-6 ${idx % 2 === 0 ? 'glass-card' : 'bg-transparent/50'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 border border-blue-100 hidden sm:flex">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="sm:hidden text-blue-600 font-bold text-sm bg-blue-50 px-2 rounded">Part {idx + 1}</span>
                          <h4 className="text-xl font-bold text-slate-900">{lesson.title}</h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed mt-2">{lesson.description}</p>
                      </div>
                      
                      <div className="shrink-0 w-full sm:w-auto flex justify-between sm:justify-end items-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 sm:border-0">
                        {isEnrolled ? (
                          <Link 
                            to={`/lesson/${lesson._id}?courseId=${course._id}`} 
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <PlayCircle className="w-5 h-5" /> Watch
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-100 px-4 py-2 rounded-lg">
                            <Lock className="w-4 h-4" /> 
                            <span>{lesson.duration}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructor Bios */}
            <div className="mt-16 glass-card p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">About the Instructor</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border-4 border-white shadow-md">
                   {course.instructor?.name ? (
                    <span className="text-3xl font-bold uppercase">{course.instructor.name.charAt(0)}</span>
                  ) : (
                    <UserIcon className="w-12 h-12" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{course.instructor?.name || 'Instructor Name'}</h4>
                  <div className="flex items-center gap-4 mb-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> Leading Expert</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4 text-blue-500" /> {course.totalStudents || 0} Students</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {course.instructor?.bio || 'An experienced educator dedicated to bridging the gap between theoretical knowledge and practical application. Bringing years of industry experience directly to the virtual classroom.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Enrollment Card */}
          <div className="w-full lg:w-[400px] shrink-0 order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="glass-card rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="h-56 lg:h-64 relative bg-slate-100">
                <img 
                  src={course.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' : course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                   <div className="flex items-center justify-center w-16 h-16 glass-card/20 backdrop-blur-md rounded-full border border-white/40">
                      <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                   </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-slate-900">Free</span>
                  <span className="text-slate-500 line-through text-lg">$99.99</span>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-bold text-lg rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 mb-6"
                  >
                    <CheckCircle className="w-6 h-6" /> Go to Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll} 
                    disabled={enrolling} 
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mb-6"
                  >
                    {enrolling ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                )}
                
                <p className="text-center text-sm font-medium text-slate-500 mb-6 pb-6 border-b border-slate-100">
                  Full lifetime access to course materials
                </p>

                <h4 className="font-bold text-slate-900 mb-4">This course includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-600">
                    <PlayCircle className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>{course.duration} hours of on-demand video</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <BookOpen className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>{course.lessons?.length || 0} comprehensive lessons</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <UserIcon className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Direct messaging with instructor</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <Award className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

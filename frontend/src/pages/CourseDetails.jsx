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

  // Check if currently logged in user is enrolled/pending/active
  const enrollmentRecord = user?.enrolledCourses?.find(e => e.course === id || e.course?._id === id);
  const isPending = enrollmentRecord?.status === 'pending';
  const isActive = enrollmentRecord?.status === 'active';
  const isEnrolled = !!enrollmentRecord;
  const isBlocked = user?.status === 'blocked';

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
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] p-4">
        <div className="max-w-lg w-full border border-[#E30A17]/30 bg-[#E30A17]/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-[#E30A17] mb-3">Service Suspended</h2>
          <p className="text-sm text-slate-300 mb-4">Access is restricted due to account suspension. Please contact administration for restoration.</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <div className="bg-[#E30A17]/10 text-[#E30A17] p-6 rounded-2xl border border-[#E30A17]/20 flex items-center gap-3 max-w-md w-full">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="font-bold text-lg">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0B0E14] pb-20 text-white">
      
      {/* Hero Section */}
      <div className="pt-16 pb-32 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFD700]/5 rounded-l-full blur-3xl transform translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#008A32]/5 rounded-r-full blur-3xl transform -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Header Content */}
            <div className="flex-1 lg:max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#FFD700]/10 text-[#FFD700] px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest border border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                  {course.category}
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <LayoutList className="w-4 h-4 text-[#008A32]" /> {course.level || 'Beginner'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight drop-shadow-lg">
                {course.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex items-center gap-4 mb-10 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner inline-flex backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-[#008A32]/20 flex items-center justify-center shrink-0 border border-[#008A32]/30 text-[#008A32]">
                  {course.instructor?.name ? (
                    <span className="text-xl font-bold uppercase">{course.instructor.name.charAt(0)}</span>
                  ) : (
                    <UserIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Created by</p>
                  <p className="font-bold text-lg text-white">{course.instructor?.name || 'Instructor'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-300 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 w-fit">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                  <span className="font-bold">{course.duration} Hours</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#008A32]" />
                  <span className="font-bold">{course.totalStudents || 0} Enrolled</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold">{course.lessons?.length || 0} Lessons</span>
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
            <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
               <LayoutList className="w-7 h-7 text-[#FFD700]" /> Course Curriculum
            </h2>
            
            <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {!course.lessons || course.lessons.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <LayoutList className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                  <p className="text-lg">No lessons have been added to this course yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {course.lessons.map((lesson, idx) => (
                    <div 
                      key={lesson._id} 
                      className={`p-6 flex items-start flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center font-bold text-lg shrink-0 border border-[#FFD700]/20 shadow-inner">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-white">{lesson.title}</h4>
                        </div>
                        <p className="text-slate-400 leading-relaxed mt-2 text-sm md:text-base">{lesson.description}</p>
                      </div>
                      
                      <div className="shrink-0 w-full sm:w-auto flex justify-between sm:justify-end items-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/10 sm:border-0">
                        {isActive ? (
                          <Link 
                            to={`/lesson/${lesson._id}?courseId=${course._id}`} 
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#008A32]/20 text-[#008A32] border border-[#008A32]/40 font-bold rounded-xl hover:bg-[#008A32] hover:text-white transition-all shadow-[0_0_15px_rgba(0,138,50,0.2)]"
                          >
                            <PlayCircle className="w-5 h-5" /> Watch
                          </Link>
                        ) : isPending ? (
                          <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4" /> Pending
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm">
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
            <div className="mt-16 bg-[#0B0E14]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#008A32] opacity-5 rounded-bl-full pointer-events-none"></div>
              
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 <UserIcon className="w-6 h-6 text-[#008A32]" /> About the Instructor
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-24 h-24 rounded-3xl bg-[#008A32]/20 text-[#008A32] flex items-center justify-center shrink-0 border border-[#008A32]/30 shadow-inner">
                   {course.instructor?.name ? (
                    <span className="text-4xl font-black uppercase">{course.instructor.name.charAt(0)}</span>
                  ) : (
                    <UserIcon className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#FFD700] mb-3">{course.instructor?.name || 'Instructor Name'}</h4>
                  <div className="flex flex-wrap items-center gap-4 mb-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#FFD700]" /> Leading Expert</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-400" /> {course.totalStudents || 0} Students</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {course.instructor?.bio || 'An experienced educator dedicated to bridging the gap between theoretical knowledge and practical application. Bringing years of industry experience directly to the virtual classroom.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Enrollment Card */}
          <div className="w-full lg:w-[400px] shrink-0 order-1 lg:order-2 lg:sticky lg:top-24 z-20">
            <div className="bg-[#0B0E14]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none"></div>
              
              <div className="h-56 lg:h-64 relative bg-[#11151F]">
                <img 
                  src={course.thumbnail === 'default-course.jpg' || !course.thumbnail ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' : course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent flex items-center justify-center">
                   <div className="w-20 h-20 bg-[#FFD700]/20 backdrop-blur-md rounded-full border border-[#FFD700]/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                      <PlayCircle className="w-10 h-10 text-[#FFD700]" />
                   </div>
                </div>
              </div>
              
              <div className="p-8 relative z-10">
                <div className="mb-6 flex items-baseline gap-3">
                  <span className="text-4xl font-display font-black text-white">{course.price ? `$${course.price}` : 'Free'}</span>
                  {course.price === 0 && <span className="text-slate-500 line-through text-lg">$99.99</span>}
                </div>

                {!isEnrolled ? (
                  <button 
                    onClick={handleEnroll} 
                    disabled={enrolling} 
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed mb-6"
                  >
                    {enrolling ? (
                      <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                ) : isPending ? (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold tracking-wider rounded-xl cursor-not-allowed mb-6 text-sm"
                  >
                    <Lock className="w-5 h-5" /> Waiting for Approval
                  </button>
                ) : isActive ? (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,138,50,0.4)] mb-6"
                  >
                    <CheckCircle className="w-5 h-5" /> Enter Classroom
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#E30A17]/20 border border-[#E30A17]/30 text-[#E30A17] font-bold tracking-wider rounded-xl cursor-not-allowed mb-6 text-sm"
                  >
                    <Lock className="w-5 h-5" /> Enrollment Disabled
                  </button>
                )}
                
                <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6 pb-6 border-b border-white/10">
                  Full lifetime access to course materials
                </p>

                <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-sm border-l-2 border-[#FFD700] pl-3">This course includes</h4>
                <ul className="space-y-4 font-medium">
                  <li className="flex items-center gap-3 text-slate-300">
                    <PlayCircle className="w-5 h-5 text-[#008A32] shrink-0" />
                    <span>{course.duration} hours of on-demand content</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <BookOpen className="w-5 h-5 text-[#FFD700] shrink-0" />
                    <span>{course.lessons?.length || 0} comprehensive lessons</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <UserIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span>Direct messaging with instructor</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <Award className="w-5 h-5 text-amber-500 shrink-0" />
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

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Clock, 
  MapPin, 
  Euro, 
  Users, 
  PlayCircle,
  FileText,
  BadgeAlert,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  MonitorPlay,
  Lock,
  Unlock,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // 'none', 'pending', 'active', 'rejected'
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.course);

        if (user) {
          try {
             // Dynamically fetch the real-time status
             const { data: statusData } = await api.get(`/student/courses/${id}/status`);
             setEnrollmentStatus(statusData.status);
          } catch(err) {
             console.error("Failed to fetch course status", err);
             setEnrollmentStatus('none');
          }
        } else {
          setEnrollmentStatus('none');
        }

      } catch (err) {
         setError('Failed to securely establish connection for this course. Data may be unavailable.');
      } finally {
         setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.status === 'blocked') return alert('Your account is blocked.');
    setEnrolling(true);
    try {
      await api.post(`/student/courses/${id}/enroll`);
      setEnrollmentStatus('pending');
      alert('Enrollment request transmitted successfully. Waiting on administrative approval.');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FFC107] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4 bg-transparent text-center">
        <div className="bg-[#11151F]/60 backdrop-blur-xl p-10 border border-white/10 rounded-2xl shadow-xl">
           <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-[#FFC107]" />
           <p className="font-black text-white uppercase tracking-widest">{error || 'Data Not Found'}</p>
        </div>
      </div>
    );
  }

  const isEnrolled = enrollmentStatus === 'active';
  const totalDuration = course.lessons?.length ? course.lessons.length * 15 : 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-[calc(100vh-80px)] w-full font-sans pb-20 text-slate-100 relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />
      
      {/* Dynamic Hero Banner */}
      <div className="bg-[#11151F]/60 backdrop-blur-2xl text-white pt-32 pb-24 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#FFC107] hover:text-white transition-colors mb-8 uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
             <div className="lg:w-2/3">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-[#FFC107] font-black text-xs uppercase tracking-widest">
                   <span>{course.mainCategory || 'General'}</span>
                   {course.subCategory && (
                     <>
                        <ChevronRight className="w-4 h-4 text-white/50" />
                        <span className="text-white px-2 py-1 bg-[#11151F]/10 rounded-md border border-white/20">{course.subCategory}</span>
                     </>
                   )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">{course.title}</h1>
                <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-3xl mb-8">
                   {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-200 uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                     <Users className="w-5 h-5 text-[#FFC107]" />
                     Instructor: <span className="text-white ml-1">{course.instructor?.name || 'EDOT Expert'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <MonitorPlay className="w-5 h-5 text-[#FFC107]" />
                     Delivery: <span className="text-white ml-1">Hybrid / Online</span>
                   </div>
                </div>
             </div>

             <div className="hidden lg:block lg:w-1/3">
                 <div className="w-full aspect-video rounded-sm overflow-hidden border-4 border-white shadow-xl relative group">
                    <div className="absolute inset-0 bg-[#FFC107]/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"} 
                      alt="Course Preview" 
                      className="w-full h-full object-cover zoom-in-95 group-hover:scale-110 transition-transform duration-700" 
                    />
                 </div>
             </div>
          </div>

        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* Primary Content Column */}
           <div className="w-full lg:w-2/3">
              
              {/* Desktop Navigation Tabs */}
              <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex overflow-x-auto scrollbar-hide mb-8 shadow-sm">
                 {['overview', 'curriculum', 'instructor'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-6 font-black uppercase tracking-widest text-[10px] transition-all rounded-xl whitespace-nowrap ${
                        activeTab === tab ? 'bg-[#FFD700] text-[#0B0E14] shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'text-slate-200 hover:bg-[#11151F]/5 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                 ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-sm">
                     <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-[#008A32]"/> Program Details</h2>
                     <div className="prose max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                       {course.description}
                     </div>
                  </div>

                  <div className="bg-[#11151F]/80 backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                     <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#FFD700]/10 rounded-full blur-[40px] pointer-events-none"></div>
                     <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-6 relative z-10">
                       <CheckCircle className="w-6 h-6 text-[#FFD700]" /> What You'll Learn
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          'Understand core industry-standard methodologies.',
                          'Build and deploy production-ready projects.',
                          'Analyze performance metrics with modern tooling.',
                          'Receive a formalized digital certification upon passing.',
                        ].map((point, i) => (
                           <div key={i} className="flex gap-3 text-gray-300">
                              <ChevronRight className="w-5 h-5 text-[#FFC107] shrink-0" />
                              <span className="font-bold text-sm leading-relaxed">{point}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* Tab: Curriculum */}
              {activeTab === 'curriculum' && (
                <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3"><BookOpen className="w-6 h-6 text-[#FFD700]"/> Syllabus</h2>
                     <div className="text-[10px] font-black uppercase tracking-widest bg-[#11151F]/10 px-3 py-1.5 rounded-lg text-white border border-white/20">
                       {course.lessons?.length || 0} Modules
                     </div>
                  </div>

                  <div className="space-y-8">
                    {course.lessons && course.lessons.length > 0 ? (
                      (() => {
                        const phases = [...new Set(course.lessons.map(l => l.phase || 'General Content'))];
                        return phases.map((phase, pIdx) => {
                          const phaseLessons = course.lessons.filter(l => (l.phase || 'General Content') === phase);
                          return (
                            <div key={pIdx} className="space-y-4">
                              <h3 className="text-xl font-bold text-[#FFD700] border-b border-white/10 pb-2 mb-4">{phase}</h3>
                              {phaseLessons.map((lesson, idx) => (
                                <div key={lesson.id} className="w-full bg-[#11151F] border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-[#151a26] flex flex-col md:flex-row gap-6 items-start md:items-center group relative overflow-hidden">
                                   
                                   {/* Left decorative color bar */}
                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#008A32] group-hover:bg-[#FFD700] transition-colors"></div>

                                   <div className="flex items-start md:items-center gap-6 w-full">
                                       {/* Icon / Emblem */}
                                       <div className="shrink-0 w-20 h-20 rounded-2xl bg-[#0B0E14] border border-white/5 flex flex-col items-center justify-center p-2 shadow-inner group-hover:border-[#FFD700]/30 transition-colors">
                                          <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Module</span>
                                          <span className="text-2xl font-black text-[#FFD700] leading-none">{course.lessons.findIndex(l => l.id === lesson.id) + 1}</span>
                                       </div>
                                       
                                       {/* Text Content */}
                                       <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-xl sm:text-2xl text-white leading-tight mb-2 group-hover:text-[#FFD700] transition-colors tracking-tight">{lesson.title}</h4>
                                          <p className="text-slate-200 text-sm line-clamp-2 leading-relaxed mb-3">
                                             {lesson.description || `Focuses on learning the basics of ${lesson.title}, including core competencies, advanced application, and problem-solving skills.`}
                                          </p>

                                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-bold text-slate-300 uppercase tracking-widest">
                                            <span className="flex items-center gap-1 bg-[#11151F]/5 px-2 py-1 rounded-md border border-white/5"><PlayCircle className="w-3 h-3 text-[#008A32]" /> {lesson.duration}m Video</span>
                                            {lesson.readingMaterials && <span className="flex items-center gap-1 bg-[#11151F]/5 px-2 py-1 rounded-md border border-white/5"><FileText className="w-3 h-3 text-[#FFD700]" /> Docs</span>}
                                            {lesson.quiz?.length > 0 && <span className="flex items-center gap-1 bg-[#11151F]/5 px-2 py-1 rounded-md border border-white/5"><BadgeAlert className="w-3 h-3 text-red-400" /> Assessment</span>}
                                          </div>
                                       </div>

                                       {/* Lock Status */}
                                       <div className="shrink-0 mr-4 text-slate-200 hidden md:block">
                                          {isEnrolled ? (
                                             <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20">
                                                <Unlock className="w-4 h-4" />
                                             </div>
                                          ) : (
                                             <div className="w-10 h-10 rounded-full bg-slate-800/50 text-slate-300 flex items-center justify-center border border-white/5">
                                                <Lock className="w-4 h-4" />
                                             </div>
                                          )}
                                       </div>
                                   </div>
                                </div>
                              ))}
                            </div>
                          );
                        });
                      })()
                    ) : (
                      <p className="text-slate-200 text-center py-10 font-bold tracking-widest border-2 border-dashed border-gray-200">System modules currently under construction.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Instructor */}
              {activeTab === 'instructor' && (
                <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10 animate-in fade-in duration-300 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                   <div className="w-32 h-32 bg-[#0B0E14] rounded-full overflow-hidden shrink-0 border-4 border-[#008A32]/50 shadow-[0_0_20px_rgba(0,138,50,0.2)]">
                     <img src="https://ui-avatars.com/api/?name=Instructor&background=008A32&color=FFFFFF" alt="Instructor" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1">{course.instructor?.name || 'EDOT Expert Personnel'}</h2>
                     <p className="text-[#008A32] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#008A32]/30 bg-[#008A32]/10 inline-block px-3 py-1 rounded-md">Lead Authority</p>
                     <p className="text-slate-300 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                        Instructor is a certified professional with extensive verifiable experience in building out large-scale technical systems and leading dynamic teams across the globe.
                     </p>
                   </div>
                </div>
              )}
           </div>

           {/* Sticky Interaction Sidebar (Order Box) */}
           <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-[#11151F]/80 backdrop-blur-xl border border-white/10 p-6 lg:p-8 shadow-2xl relative overflow-hidden rounded-3xl sticky top-24">
                 <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#008A32]/10 rounded-full blur-[40px] pointer-events-none"></div>
                 
                 <div className="text-center mb-6 border-b border-white/10 pb-6 relative z-10">
                    <h3 className="text-slate-200 font-black uppercase tracking-widest text-[10px] mb-2">Program Value</h3>
                    <div className="text-4xl font-black text-[#FFD700]">
                      ETB {course.price || 'Free'}
                    </div>
                 </div>

                 <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between items-center text-[11px] font-black border-b border-white/5 pb-3">
                       <span className="text-slate-200 uppercase tracking-widest flex items-center gap-2"><Clock className="w-4 h-4 text-[#008A32]"/> Duration</span>
                       <span className="text-white">{totalDuration} Mins Runtime</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black border-b border-white/5 pb-3">
                       <span className="text-slate-200 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#008A32]"/> Syllabus Length</span>
                       <span className="text-white">{course.lessons?.length || 0} Modules</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black border-b border-white/5 pb-3">
                       <span className="text-slate-200 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4 text-[#008A32]"/> Location</span>
                       <span className="text-white">Global Digital</span>
                    </div>
                 </div>

                 {/* Action Button Logic */}
                 {enrollmentStatus === 'active' ? (
                   <Link 
                     to={`/lesson/${course.lessons[0]?.id}?courseId=${course.id}`}
                     className="w-full relative z-10 block text-center bg-[#11151F]/5 border border-white/10 text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0B0E14] font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)] text-xs"
                   >
                     Start Learning
                   </Link>
                 ) : enrollmentStatus === 'pending' ? (
                   <div className="w-full relative z-10 flex items-center justify-center gap-2 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 font-black uppercase tracking-widest py-4 rounded-xl opacity-90 cursor-wait text-xs">
                     <Clock className="w-4 h-4" /> Pending Approval
                   </div>
                 ) : enrollmentStatus === 'rejected' ? (
                   <div className="w-full relative z-10 flex items-center justify-center gap-2 bg-rose-500/100/10 text-rose-500 border border-rose-500/30 font-black uppercase tracking-widest py-4 rounded-xl cursor-not-allowed text-xs">
                     <XSquare className="w-4 h-4" /> Access Denied
                   </div>
                 ) : (
                   <button 
                     onClick={handleEnroll}
                     disabled={enrolling}
                     className="w-full relative z-10 bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs"
                   >
                     {enrolling ? 'Processing...' : 'Enroll Now'} <ArrowRight className="w-4 h-4"/>
                   </button>
                 )}

                 <div className="mt-6 text-center relative z-10">
                   <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest">Guaranteed Encrypted Processing</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

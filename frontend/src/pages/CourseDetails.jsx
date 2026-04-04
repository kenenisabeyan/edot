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
  Unlock
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
        const { data } = await api.get(`/courses/public/${id}`);
        setCourse(data.course);

        if (user) {
          const userEnrollment = user.enrolledCourses?.find(e => e.course === id || e.course?._id === id);
          if (userEnrollment) setEnrollmentStatus(userEnrollment.status);
          else setEnrollmentStatus('none');
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
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4 bg-gray-50 text-center">
        <div className="bg-white p-10 border-2 border-dashed border-gray-300 rounded-sm">
           <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
           <p className="font-bold text-[#111111] uppercase tracking-widest">{error || 'Data Not Found'}</p>
        </div>
      </div>
    );
  }

  const isEnrolled = enrollmentStatus === 'active';
  const totalDuration = course.lessons?.length ? course.lessons.length * 15 : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 text-gray-800 font-sans pb-20">
      
      {/* Dynamic Hero Banner */}
      <div className="bg-[#111111] text-white pt-16 pb-24 border-b-[6px] border-[#FFC107]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#FFC107] hover:text-white transition-colors mb-8 uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
             <div className="lg:w-2/3">
                <div className="mb-4 inline-block bg-[#FFC107] text-[#111111] px-3 py-1 font-black text-xs uppercase tracking-widest rounded-sm">
                   {course.category}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">{course.title}</h1>
                <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-3xl mb-8">
                   {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
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
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-2 flex overflow-x-auto scrollbar-hide mb-8">
                 {['overview', 'curriculum', 'instructor'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-6 font-bold uppercase tracking-widest text-sm transition-all rounded-sm whitespace-nowrap ${
                        activeTab === tab ? 'bg-[#111111] text-[#FFC107]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                 ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200">
                     <h2 className="text-2xl font-black text-[#111111] uppercase tracking-widest mb-6 border-b-4 border-[#FFC107] inline-block pb-1">Program Details</h2>
                     <div className="prose max-w-none text-gray-700 text-base leading-loose whitespace-pre-wrap font-medium">
                       {course.description}
                     </div>
                  </div>

                  <div className="bg-[#111111] text-white p-8 rounded-sm shadow-sm border-l-8 border-[#FFC107]">
                     <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-6">
                       <CheckCircle className="w-6 h-6 text-[#FFC107]" /> What You'll Learn
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
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black text-[#111111] uppercase tracking-widest border-b-4 border-[#FFC107] inline-block pb-1">Syllabus</h2>
                     <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded text-gray-600 border border-gray-200">
                       {course.lessons?.length || 0} Modules
                     </div>
                  </div>

                  <div className="space-y-3">
                    {course.lessons && course.lessons.length > 0 ? (
                      course.lessons.map((lesson, idx) => (
                        <div key={lesson._id} className="group border-2 border-gray-100 hover:border-[#111111] rounded-sm p-5 transition-all flex items-center justify-between cursor-default bg-gray-50 hover:bg-white text-[#111111]">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#111111] text-[#FFC107] flex items-center justify-center font-black shrink-0 relative overflow-hidden transition-colors">
                                 {idx + 1}
                              </div>
                              <div>
                                 <h4 className="font-bold text-base leading-tight">{lesson.title}</h4>
                                 <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                   <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" /> Video</span>
                                   {lesson.readingMaterials && <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Docs</span>}
                                   {lesson.quiz?.length > 0 && <span className="flex items-center gap-1"><BadgeAlert className="w-3.5 h-3.5" /> Assessment</span>}
                                 </div>
                              </div>
                           </div>
                           <div className="text-gray-400">
                              {isEnrolled ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5" />}
                           </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-10 font-bold uppercase tracking-widest border-2 border-dashed border-gray-200">System modules currently under construction.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Instructor */}
              {activeTab === 'instructor' && (
                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 animate-in fade-in duration-300 flex items-center gap-8">
                   <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden shrink-0 border-4 border-[#111111]">
                     <img src="https://ui-avatars.com/api/?name=Instructor&background=FFC107&color=111111" alt="Instructor" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-[#111111] uppercase tracking-widest mb-1">{course.instructor?.name || 'EDOT Expert Personnel'}</h2>
                     <p className="text-[#FFC107] font-bold text-sm uppercase tracking-widest mb-4 bg-[#111111] inline-block px-2 py-0.5 rounded-sm">Lead Authority</p>
                     <p className="text-gray-600 font-medium leading-relaxed">
                        Instructor is a certified professional with extensive verifiable experience in building out large-scale technical systems and leading dynamic teams across the globe.
                     </p>
                   </div>
                </div>
              )}
           </div>

           {/* Sticky Interaction Sidebar (Order Box) */}
           <div className="w-full lg:w-1/3">
              <div className="bg-white border-2 border-[#111111] p-6 lg:p-8 shadow-xl sticky top-24 rounded-sm">
                 
                 <div className="text-center mb-6 border-b-2 border-gray-100 pb-6">
                    <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Program Value</h3>
                    <div className="text-4xl font-black text-[#111111]">
                      ETB {course.price || 'Free'}
                    </div>
                 </div>

                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-3">
                       <span className="text-gray-500 uppercase tracking-widest flex items-center gap-2"><Clock className="w-4 h-4 text-[#111111]"/> Duration</span>
                       <span className="text-[#111111]">{totalDuration} Mins Runtime</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-3">
                       <span className="text-gray-500 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#111111]"/> Syllabus Length</span>
                       <span className="text-[#111111]">{course.lessons?.length || 0} Modules</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-3">
                       <span className="text-gray-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4 text-[#111111]"/> Location</span>
                       <span className="text-[#111111]">Global Digital</span>
                    </div>
                 </div>

                 {/* Action Button Logic */}
                 {enrollmentStatus === 'active' ? (
                   <Link 
                     to={`/lesson/${course.lessons[0]?._id}?courseId=${course._id}`}
                     className="w-full block text-center bg-[#111111] text-[#FFC107] font-black uppercase tracking-widest py-4 rounded-sm hover:bg-[#222] transition-colors shadow-sm"
                   >
                     Access Material
                   </Link>
                 ) : enrollmentStatus === 'pending' ? (
                   <div className="w-full text-center bg-[#FFC107] text-[#111111] font-black uppercase tracking-widest py-4 rounded-sm shadow-sm opacity-90 cursor-wait">
                     Authorizing...
                   </div>
                 ) : enrollmentStatus === 'rejected' ? (
                   <div className="w-full text-center bg-red-100 text-red-600 font-black uppercase tracking-widest py-4 rounded-sm border-2 border-red-500 cursor-not-allowed">
                     Clearance Denied
                   </div>
                 ) : (
                   <button 
                     onClick={handleEnroll}
                     disabled={enrolling}
                     className="w-full bg-[#FFC107] text-[#111111] font-black uppercase tracking-widest py-4 rounded-sm hover:bg-[#e0a800] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                   >
                     {enrolling ? 'Processing...' : 'Secure Placement'} <ArrowRight className="w-5 h-5"/>
                   </button>
                 )}

                 <div className="mt-4 text-center">
                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Guaranteed Encrypted Processing</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

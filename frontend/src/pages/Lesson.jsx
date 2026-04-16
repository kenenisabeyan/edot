import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, FileText, CheckCircle2, Lock, Unlock, ArrowLeft, ChevronDown, ChevronUp, CheckSquare, BadgeAlert, Award, ExternalLink, X } from 'lucide-react';
import ReactPlayer from 'react-player';

export default function Lesson() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Accordion State
  const [expandedPhase, setExpandedPhase] = useState({}); 
  const [expandedCategory, setExpandedCategory] = useState({});
  const [playingVideoId, setPlayingVideoId] = useState(null); 
  
  // Modals for Docs and Quiz
  const [activeModal, setActiveModal] = useState(null); // { type: 'docs' | 'quiz', lessonId: '...' }

  // Lesson Activity State
  const [completingPhase, setCompletingPhase] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [quizState, setQuizState] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAttempts, setQuizAttempts] = useState({});
  const [preAssessmentScore, setPreAssessmentScore] = useState({});
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setError('System parameter missing. Return to catalog and reboot selection.');
      setLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.course);



        if (user) {
          try {
             const { data: statusData } = await api.get(`/student/courses/${courseId}/status`);
             setEnrollmentStatus(statusData.status);
             setEnrollmentProgress(statusData.progress);
          } catch(err) {
             setEnrollmentStatus('none');
          }
        }
      } catch (err) {
        setError('Transmission failure. Unable to retrieve module resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, id, user]);

  const isActive = enrollmentStatus === 'active';
  const isBlocked = user?.status === 'blocked';

  let completedList = [];
  if (enrollmentProgress?.completedLessons) {
      if (Array.isArray(enrollmentProgress.completedLessons)) {
          completedList = enrollmentProgress.completedLessons;
      } else if (typeof enrollmentProgress.completedLessons === 'string') {
          try { completedList = JSON.parse(enrollmentProgress.completedLessons); } catch (e) {}
      }
  }

  const togglePhase = (phaseId) => {
    setExpandedPhase(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleCat = (phaseId, cat) => {
    const key = `${phaseId}-${cat}`;
    setExpandedCategory(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const verifyPhaseCompletion = async (lessonId) => {
     setCompletingPhase(prev => ({ ...prev, [lessonId]: true }));
     try {
       await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
       window.location.reload();
     } catch (err) {
       console.error('Failed to complete phase', err);
       setCompletingPhase(prev => ({ ...prev, [lessonId]: false }));
     }
  };

  const resolveUrl = (url) => {
    if (!url) return '';
    let cleanUrl = url.trim();
    
    // Extract src from iframe if present
    const iframeMatch = cleanUrl.match(/<iframe.*?src=["'](.*?)["']/i);
    if (iframeMatch) {
       cleanUrl = iframeMatch[1];
    }
    
    // Extract url if it is formatted as a markdown link [Title](url)
    const mdMatch = cleanUrl.match(/\]\((.*?)\)/);
    if (mdMatch) {
       cleanUrl = mdMatch[1].trim();
    }
    
    // Normalize Windows backslashes to forward slashes
    cleanUrl = cleanUrl.replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
    if (cleanUrl.startsWith('www.')) return `https://${cleanUrl}`;
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
    }
    
    // For local uploads
    return `http://localhost:5000${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  const handleClaimCertificate = async () => {
    try {
      setGeneratingCertificate(true);
      const { data } = await api.post('/progress/certificate', { courseId });
      if (data.success && data.data) {
        setCertificateData(data.data);
      }
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      alert(err.response?.data?.message || 'Certificate generation failed. Make sure all requirements are met.');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0B0E14]">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#FFC107] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-[#0B0E14] text-white">
        <div className="bg-[#11151F] border border-white/10 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <p className="font-black mb-8 text-xl uppercase tracking-widest">{error || 'Clearance error.'}</p>
          <Link to="/student/courses" className="px-6 py-4 bg-[#FFC107] text-[#11151F] font-black uppercase rounded-xl hover:bg-[#11151F] inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-200 font-sans pb-20" style={{ backgroundColor: 'rgba(11,14,20,1)' }}>
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      {/* Global Top Navigation Bar */}
      <div className="w-full bg-[#11151F]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <Link to="/student/courses" className="text-slate-200 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors bg-[#11151F]/5 px-4 py-2 rounded-lg border border-white/10">
                   <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>
                <Link to={`/course/${course.id}`} className="text-slate-200 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors bg-[#11151F]/5 px-4 py-2 rounded-lg border border-white/10">
                   Course Info
                </Link>
            </div>
            <div className="hidden md:flex font-black text-white text-lg tracking-widest uppercase">
               EDOT <span className="text-[#008A32] ml-2">Learning Protocol</span>
            </div>
         </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 relative z-10">
         
         {/* Course Header Banner */}
         <div className="bg-gradient-to-r from-[#11151F] to-[#0B0E14] rounded-3xl border border-white/10 p-8 sm:p-12 mb-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#FFC107]/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-[#008A32]/10 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
               <h1 className="text-3xl sm:text-4xl font-display font-medium text-white mb-4 leading-snug break-words max-w-2xl">
                  {course.title.split(',')[0]} <br className="hidden sm:block" />
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#008A32] px-2">
                     {course.title.includes(',') ? course.title.substring(course.title.indexOf(',') + 1) : 'EDOT Masterclass'}
                  </span>
               </h1>
            </div>
         </div>

         {/* The Accordion Phases List */}
         <div className="space-y-6">
            {course.lessons?.map((lesson, idx) => {
               const lId = lesson.id;
               const isPhaseExp = expandedPhase[lId];
               const lCompleted = completedList.includes(lId);

               const textContent = lesson.readingMaterials || '';
               let linkUrl = '';
               let linkTitle = '';
               let pureText = textContent;

               const mdMatch = textContent.match(/\[(.*?)\]\((.*?)\)/);
               const rawMatch = textContent.match(/(https?:\/\/[^\s]+|\/uploads\/[^\s]+)/);

               if (mdMatch) {
                  linkTitle = mdMatch[1] || 'Attached File';
                  linkUrl = resolveUrl(mdMatch[2]);
                  pureText = textContent.replace(/\[(.*?)\]\((.*?)\)/g, '').trim();
               } else if (rawMatch) {
                  linkUrl = resolveUrl(rawMatch[1]);
                  linkTitle = 'Attached Resource';
                  pureText = textContent.replace(/(https?:\/\/[^\s]+|\/uploads\/[^\s]+)/g, '').trim();
               }
               
               const isIframeable = linkUrl && !!linkUrl.match(/\.(pdf|png|jpg|jpeg|gif)$/i);
               const isDownloadOnly = linkUrl && !isIframeable;

               return (
                  <div key={lId} className={`rounded-3xl border transition-all duration-500 overflow-hidden shadow-xl ${isPhaseExp ? 'border-white/20 bg-[#11151F] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform scale-[1.01]' : 'border-white/5 bg-[#11151F]/60'}`}>
                     
                     {/* Phase Header (Level 1) */}
                     <button 
                        onClick={() => togglePhase(lId)}
                        className={`w-full p-5 sm:p-6 flex justify-between items-center transition-colors ${isPhaseExp ? 'bg-[#11151F]/5' : 'hover:bg-[#11151F]/5'}`}
                     >
                        <div className="flex items-center gap-6 text-left">
                           <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${lCompleted ? 'bg-[#008A32]/20 text-[#008A32] border border-[#008A32]/30' : 'bg-[#0B0E14] text-[#FFD700] border border-white/5'}`}>
                              {lCompleted ? <CheckCircle2 className="w-6 h-6"/> : (idx + 1)}
                           </div>
                           <h2 className="text-xl sm:text-2xl font-bold text-slate-200 tracking-tight leading-snug">Phase {idx + 1}: {lesson.title}</h2>
                        </div>
                        <div className="shrink-0 ml-4 hidden sm:block bg-[#0B0E14] p-2 rounded-full border border-white/5">
                           {isPhaseExp ? <ChevronUp className="w-5 h-5 text-[#FFD700]" /> : <ChevronDown className="w-5 h-5 text-slate-200" />}
                        </div>
                     </button>
                     
                     {/* Phase Expanded Content */}
                     {isPhaseExp && (
                        <div className="p-4 sm:p-8 bg-gradient-to-b from-[#11151F] to-[#0B0E14] border-t border-white/5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                           
                           {/* Category: Mission Objectives (To-Do) */}
                           <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#11151F] shadow-sm">
                              <button onClick={() => toggleCat(lId, 'todo')} className="w-full p-5 flex justify-between items-center hover:bg-[#11151F]/5 transition-colors group">
                                 <span className="font-bold flex items-center gap-4 text-slate-200 group-hover:text-white"><div className="w-8 h-8 rounded-full bg-indigo-500/100/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><CheckSquare className="w-4 h-4" /></div> Mission Objectives</span>
                                 <span className="text-[10px] uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold group-hover:text-[#FFC107]">
                                    {expandedCategory[`${lId}-todo`] ? 'Collapse' : 'Expand'} {expandedCategory[`${lId}-todo`] ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                                 </span>
                              </button>
                              {expandedCategory[`${lId}-todo`] && (
                                 <div className="p-6 border-t border-white/5 bg-[#0B0E14] text-slate-300 text-sm leading-relaxed border-l-[3px] border-l-indigo-500/50">
                                    {lesson.description || 'Initialize phase objectives. Consolidate knowledge matrices prior to execution.'}
                                 </div>
                              )}
                           </div>

                           {/* Category: Class Videos */}
                           <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#11151F] shadow-sm">
                              <button onClick={() => toggleCat(lId, 'videos')} className="w-full p-5 flex justify-between items-center hover:bg-[#11151F]/5 transition-colors group">
                                 <span className="font-bold flex items-center gap-4 text-slate-200 group-hover:text-white"><div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20"><PlayCircle className="w-4 h-4" /></div> Class Videos</span>
                                 <span className="text-[10px] uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold group-hover:text-[#FFC107]">
                                    {expandedCategory[`${lId}-videos`] ? 'Collapse' : 'Expand'} {expandedCategory[`${lId}-videos`] ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                                 </span>
                              </button>
                              
                              {expandedCategory[`${lId}-videos`] && (
                                 <div className="border-t border-white/5 bg-[#0B0E14] p-2">
                                    
                                    {/* Video Item Header */}
                                    <button 
                                       onClick={() => setPlayingVideoId(playingVideoId === lId ? null : lId)} 
                                       className="w-full p-4 flex justify-between items-center hover:bg-[#11151F]/5 transition-colors border border-white/5 rounded-xl bg-[#11151F] mt-2 mb-2 group"
                                    >
                                       <span className="font-bold text-sm text-slate-300 flex items-center gap-3">
                                          <PlayCircle className="w-5 h-5 text-red-500" />
                                          {lesson.title} - Visual Feed
                                       </span>
                                       <div className="flex items-center gap-4">
                                          {lCompleted ? <Unlock className="w-4 h-4 text-[#008A32]" /> : <Lock className="w-4 h-4 text-slate-300" />}
                                          <div className={`p-1.5 rounded-full ${playingVideoId === lId ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-[#11151F]/5 text-slate-200 group-hover:text-white'}`}>
                                            {playingVideoId === lId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                          </div>
                                       </div>
                                    </button>

                                    {/* Embedded Video Player */}
                                    {playingVideoId === lId && (
                                       <div 
                                         className="m-2 mt-4 p-4 md:p-6 bg-[#11151F] border border-white/5 rounded-2xl animate-in slide-in-from-top-2 duration-300 relative overflow-hidden group select-none"
                                         onContextMenu={(e) => e.preventDefault()}
                                       >
                                          <div className={`aspect-video w-full rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 relative bg-black ${!isActive ? 'grayscale opacity-75 blur-[2px]' : ''}`}>
                                             
                                             <ReactPlayer
                                                url={resolveUrl(lesson.videoUrl)} 
                                                width="100%" 
                                                height="100%" 
                                                controls={isActive}
                                                playing={false}
                                                onProgress={({ played }) => {
                                                   if (played > 0.95 && !videoProgress[lId]) {
                                                      setVideoProgress({ ...videoProgress, [lId]: true });
                                                   }
                                                }}
                                                onError={(e) => console.error("ReactPlayer Error: ", e, resolveUrl(lesson.videoUrl))}
                                                config={{ 
                                                   file: { attributes: { controlsList: 'nodownload' } },
                                                   youtube: { playerVars: { modestbranding: 1, rel: 0, showinfo: 0, fs: 1, disablekb: 1 } }
                                                }}
                                             />
                                          </div>
                                          
                                          {/* Lock Overlay */}
                                          {(!isActive || isBlocked) && (
                                             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0E14]/80 backdrop-blur-md text-center px-4 rounded-xl m-6">
                                                <Lock className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                                                <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Signal Locked</h3>
                                                <p className="text-[#FFC107] text-xs font-bold uppercase tracking-widest">Clearance Authorization Required</p>
                                             </div>
                                          )}
                                          
                                          {/* Disable Warning Text */}
                                          <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl p-4 mt-6 text-xs font-black uppercase tracking-widest text-[#FFD700] text-center flex items-center justify-center gap-3">
                                             <Lock className="w-4 h-4" /> Protected Stream: Direct URL access and downloading are disabled
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>

                           {/* INLINE MODULE: Study Notes */}
                           {pureText && (
                              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#11151F] shadow-sm">
                                 <button onClick={() => toggleCat(lId, 'notes')} className="w-full p-5 flex justify-between items-center hover:bg-[#11151F]/5 transition-colors group">
                                    <span className="font-bold flex items-center gap-4 text-slate-200 group-hover:text-white"><div className="w-8 h-8 rounded-full bg-indigo-500/100/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><FileText className="w-4 h-4" /></div> Study Notes</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold group-hover:text-[#FFC107]">
                                       {expandedCategory[`${lId}-notes`] ? 'Collapse' : 'Expand'} {expandedCategory[`${lId}-notes`] ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                                    </span>
                                 </button>
                                 {expandedCategory[`${lId}-notes`] && (
                                    <div className="p-6 sm:p-10 border-t border-white/5 bg-[#0B0E14] text-slate-300 font-sans whitespace-pre-wrap leading-[1.8] text-[16px] border-l-[3px] border-l-indigo-500/50">
                                       {pureText}
                                    </div>
                                 )}
                              </div>
                           )}

                           {/* INLINE MODULE: Attached Document */}
                           {linkUrl && (
                              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#11151F] shadow-sm">
                                 <button onClick={() => toggleCat(lId, 'docs')} className="w-full p-5 flex justify-between items-center hover:bg-[#11151F]/5 transition-colors group">
                                    <span className="font-bold flex items-center gap-4 text-slate-200 group-hover:text-white"><div className="w-8 h-8 rounded-full bg-emerald-500/100/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20"><FileText className="w-4 h-4" /></div> Attached Document</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold group-hover:text-[#FFC107]">
                                       {expandedCategory[`${lId}-docs`] ? 'Collapse' : 'Expand'} {expandedCategory[`${lId}-docs`] ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                                    </span>
                                 </button>
                                 {expandedCategory[`${lId}-docs`] && (
                                    <div className="border-t border-white/5 bg-[#0B0E14] p-4 flex flex-col items-center">
                                       {isIframeable ? (
                                          <>
                                             <iframe src={linkUrl} className="w-full h-[65vh] bg-white rounded-xl" title="Attached Document"/>
                                             <a href={linkUrl} target="_blank" rel="noreferrer" className="mt-4 px-6 py-3 bg-[#11151F]/20 border border-emerald-500/30 hover:bg-emerald-500/100/20 text-emerald-400 hover:text-emerald-300 rounded-xl font-black uppercase tracking-widest text-[11px] transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Open Remotely</a>
                                          </>
                                       ) : (
                                          <div className="py-12 px-6 text-center">
                                             <FileText className="w-16 h-16 text-emerald-500 mb-6 mx-auto drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                                             <p className="text-slate-400 mb-8 max-w-sm">This presentation or document requires native desktop application access. Initiate extraction to view the files.</p>
                                             <a href={linkUrl} download target="_blank" rel="noreferrer" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3"><ExternalLink className="w-5 h-5" /> Download Resources</a>
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           )}

                           {/* Phase Completion Trigger (Bottom of expanded phase) */}
                           <div className="pt-8 mt-6 border-t font-sans border-white/10 flex justify-center md:justify-end">
                              <button
                                 onClick={() => {
                                    if (lesson.quiz?.length > 0 && !lCompleted) {
                                       setActiveModal({ type: 'quiz', lessonId: lId, phaseIndex: idx + 1 });
                                       if (!quizAttempts[lId]) setQuizAttempts(prev => ({ ...prev, [lId]: 1 }));
                                    } else if (!lCompleted) {
                                       verifyPhaseCompletion(lId);
                                    }
                                 }}
                                 disabled={!isActive || lCompleted || completingPhase[lId] || (!videoProgress[lId] && lesson.videoUrl)}
                                 className={`w-full md:w-auto px-8 py-5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-3 ${
                                    lCompleted ? 'bg-[#008A32] text-white shadow-[0_0_20px_rgba(0,138,50,0.3)]' 
                                    : (!isActive || (!videoProgress[lId] && lesson.videoUrl)) ? 'bg-[#11151F] text-slate-300 border-2 border-white/5 cursor-not-allowed' 
                                    : completingPhase[lId] ? 'bg-[#1e48bc] text-white animate-pulse'
                                    : 'bg-[#1e48bc] hover:bg-[#295ce8] text-white shadow-lg'
                                 }`}
                              >
                                 <CheckCircle2 className="w-5 h-5" /> 
                                 {lCompleted 
                                    ? 'Phase Resolved' 
                                    : completingPhase[lId] 
                                       ? 'Synchronizing...' 
                                       : (lesson.quiz?.length > 0 ? 'Complete Phase Assessment' : 'Finalize Phase Approval')}
                              </button>
                           </div>

                        </div>
                     )}
                  </div>
               );
            })}
         </div>

         {/* Course Completion / Certificate Generation */}
         {course.lessons?.length > 0 && completedList.length >= course.lessons.length && (
            <div className="mt-12 bg-gradient-to-r from-[#008A32]/20 to-[#00A13B]/10 rounded-3xl border border-[#008A32]/30 p-8 sm:p-12 text-center animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(0,138,50,0.15)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#008A32]/20 rounded-full blur-[80px] pointer-events-none"></div>
               <Award className={`w-20 h-20 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] ${certificateData ? 'text-[#008A32]' : 'text-[#FFD700]'}`} />
               <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
                  {certificateData ? 'Certificate Secured' : 'Course Protocol Completed'}
               </h2>
               <p className="text-slate-300 font-medium mb-8 max-w-lg mx-auto">
                  {certificateData 
                     ? `Verification Code: ${certificateData.verificationHash || certificateData.verified_hash}\nYour certificate is permanently recorded in the system.` 
                     : 'You have successfully finalized all phase assessments. Your clearance is fully upgraded.'}
               </p>
               {!certificateData ? (
                  <button 
                     onClick={handleClaimCertificate}
                     disabled={generatingCertificate}
                     className={`px-10 py-5 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 mx-auto shadow-xl ${generatingCertificate ? 'bg-[#FFD700]/50 text-black/50 cursor-not-allowed' : 'bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black hover:scale-105'}`}
                  >
                     <Award className={`w-6 h-6 ${generatingCertificate ? 'animate-pulse' : ''}`} /> 
                     {generatingCertificate ? 'Synthesizing...' : 'Claim Official Certificate'}
                  </button>
               ) : (
                  <Link to="/student/profile" className="px-10 py-5 bg-[#11151F] border-2 border-[#008A32] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#008A32] transition-colors flex items-center justify-center gap-3 mx-auto shadow-xl max-w-xs cursor-pointer inline-flex">
                     <CheckCircle2 className="w-5 h-5 text-[#008A32] group-hover:text-white" /> View Certificate
                  </Link>
               )}
            </div>
         )}

      </div>

      {/* Modal Overlay for Assessment */}
      {activeModal?.type === 'quiz' && (
         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 font-sans border-2 border-slate-200">
               
               {/* Modal Header */}
               <div className="flex justify-between items-center p-4 border-b border-slate-200 shadow-sm relative z-10 bg-white">
                  <h3 className="font-bold text-lg">{quizState[activeModal.lessonId]?.submitted ? 'Result' : 'Assessment'}</h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-black transition-colors rounded-full p-1 hover:bg-slate-100">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               {/* Modal Body */}
               <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-slate-50 relative">
                  {(() => {
                     const lId = activeModal.lessonId;
                     const targetLesson = course.lessons.find(l => l.id === lId);
                     const qsState = quizState[lId];
                     
                     if (!qsState?.submitted) {
                        return (
                           <div className="space-y-8">
                              {targetLesson.quiz.map((q, qIndex) => (
                                 <div key={qIndex} className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <p className="font-bold text-slate-800 mb-5 text-[15px]">{qIndex + 1}. {q.question}</p>
                                    <div className="space-y-4">
                                       {q.options.map((opt, oIndex) => {
                                          const isSelected = quizAnswers[`${lId}-${qIndex}`] === oIndex;
                                          return (
                                          <label key={oIndex} className="w-full flex items-center cursor-pointer group">
                                             <input 
                                                type="radio" 
                                                checked={isSelected} 
                                                onChange={() => setQuizAnswers(prev => ({...prev, [`${lId}-${qIndex}`]: oIndex}))} 
                                                className="w-4 h-4 text-[#ea580c] bg-white border-slate-300 focus:ring-[#ea580c] focus:ring-2 focus:ring-offset-1 transition-all"
                                             />
                                             <span className={`ml-3 text-[14px] transition-colors ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt}</span>
                                          </label>
                                          );
                                       })}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        );
                     } else {
                        // Result View
                        const { score, total, grade, passed } = qsState;
                        const percentage = Math.round((score / total) * 100);
                        const attemptNum = quizAttempts[lId] || 1;
                        const preScore = preAssessmentScore[lId] || Math.max(0, percentage - 10);
                        
                        return (
                           <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-center max-w-xl mx-auto">
                              <h2 className="text-xl font-bold text-slate-800 mb-4">Post-Assessment Results</h2>
                              <div className="text-[3.5rem] font-black text-[#2563eb] leading-none mb-3 tracking-tighter">
                                 {score} / {total}
                              </div>
                              <p className="text-slate-700 font-bold mb-1 text-sm">Grade: <span className={passed ? "text-emerald-500" : "text-amber-500"}>{grade}</span></p>
                              <p className="text-slate-400 text-xs mb-8 font-medium">Attempt #{attemptNum}</p>
                              
                              {passed ? (
                                 <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl text-left -mx-2 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden">
                                     <div className="px-6 py-4 border-b border-emerald-50 text-center">
                                         <p className="text-emerald-600 font-bold text-[15px]">Assessment Completed Successfully!</p>
                                     </div>
                                    <div className="p-6">
                                        <p className="text-[11px] text-emerald-600/80 font-bold mb-4">Your Progress Improvement:</p>
                                        <div className="flex gap-4">
                                           <div className="flex-1 bg-white border border-emerald-100 rounded-lg p-5 shadow-sm text-left">
                                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-wider">PRE-ASSESSMENT</p>
                                              <p className="text-[#2563eb] font-black text-xl">{preScore}%</p>
                                           </div>
                                           <div className="flex-1 bg-white border border-emerald-100 rounded-lg p-5 shadow-sm text-left">
                                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-wider">POST-ASSESSMENT</p>
                                              <p className="text-emerald-500 font-black text-xl">{percentage}%</p>
                                           </div>
                                        </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 mb-8 text-center -mx-2">
                                    <p className="text-red-600 font-bold mb-2">Assessment Failed</p>
                                    <p className="text-sm text-slate-600">You need a score of 50% or higher to pass. Please review the material and try again.</p>
                                 </div>
                              )}
                           </div>
                        );
                     }
                  })()}
               </div>

               {/* Modal Footer */}
               <div className="p-4 md:px-6 md:py-4 border-t border-slate-200 bg-slate-50 flex justify-start gap-3">
                  {(() => {
                     const lId = activeModal.lessonId;
                     const targetLesson = course.lessons.find(l => l.id === lId);
                     const qsState = quizState[lId];

                     if (!qsState?.submitted) {
                        return (
                           <>
                              <button 
                                 onClick={() => {
                                    let score = 0;
                                    targetLesson.quiz.forEach((q, i) => { if (quizAnswers[`${lId}-${i}`] === q.correctAnswer) score++; });
                                    const total = targetLesson.quiz.length;
                                    const percentage = (score / total) * 100;
                                    let grade = 'F';
                                    if (percentage >= 90) grade = 'A';
                                    else if (percentage >= 80) grade = 'B';
                                    else if (percentage >= 70) grade = 'C';
                                    else if (percentage >= 50) grade = 'D';

                                    const passed = percentage >= 50;

                                    if (!preAssessmentScore[lId]) {
                                       setPreAssessmentScore(prev => ({ ...prev, [lId]: percentage }));
                                    }

                                    setQuizState(prev => ({ ...prev, [lId]: { submitted: true, score, total, grade, passed } }));
                                 }}
                                 className="px-6 py-2.5 bg-[#1e48bc] text-white font-bold rounded-md hover:bg-blue-700 shadow-sm text-sm"
                              >
                                 Submit
                              </button>
                              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-md shadow-sm text-sm transition-colors">
                                 Cancel
                              </button>
                           </>
                        );
                     } else {
                        return (
                           <div className="w-full flex justify-center pb-2">
                              <button 
                                 onClick={() => {
                                    if (qsState.passed) {
                                       verifyPhaseCompletion(lId);
                                    } else {
                                       setQuizState(prev => ({ ...prev, [lId]: null }));
                                       setQuizAttempts(prev => ({ ...prev, [lId]: (prev[lId] || 1) + 1 }));
                                    }
                                    setActiveModal(null);
                                 }}
                                 className="px-10 py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all sm:min-w-[200px]"
                              >
                                 {qsState.passed ? 'Continue' : 'Try Again'}
                              </button>
                           </div>
                        );
                     }
                  })()}
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, CheckCircle, ArrowLeft, Play, FileText, CheckCircle2, MessageSquare, ThumbsUp, Send, Lock } from 'lucide-react';
import ReactPlayer from 'react-player';

export default function Lesson() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Heartbeat tracking
  const [lastPingedBlock, setLastPingedBlock] = useState(-1);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    setIsVideoFinished(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setActiveTab('overview');
    setLastPingedBlock(-1);
    setProgressData(null);
  }, [id]);

  const [qaList, setQaList] = useState([
    {
      id: 1,
      user: 'Alice Smith',
      avatar: 'A',
      text: 'I encountered an issue while applying the second concept in this lesson. Could someone explain why the function returned an unexpected result?',
      time: '2 hours ago',
      likes: 3,
      replies: [
        {
          user: 'Instructor',
          avatar: 'I',
          text: 'Great question! Please ensure that your variables are properly initialized before calling the function.',
          time: '1 hour ago'
        }
      ]
    },
    {
      id: 2,
      user: 'Bob Johnson',
      avatar: 'B',
      text: 'This lesson was extremely helpful in understanding the core fundamentals. Thank you for the clear explanation!',
      time: '1 day ago',
      likes: 12,
      replies: []
    }
  ]);

  const enrollment = user?.enrolledCourses?.find(e => e.course === courseId || e.course?._id === courseId);
  const isActive = enrollment?.status === 'active';
  const isPending = enrollment?.status === 'pending';
  const isRejected = enrollment?.status === 'rejected';
  const isCompleted = enrollment?.completedLessons?.includes(id);
  const isBlocked = user?.status === 'blocked';

  useEffect(() => {
    if (!courseId) {
      setError('Course information is missing. Please return and select a valid course.');
      setLoading(false);
      return;
    }

    const fetchCourseAndLesson = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.course);

        const currentLesson = data.course.lessons.find(l => l._id === id);
        if (currentLesson) {
          setLesson(currentLesson);
        } else {
          setError('The requested lesson could not be found within this course.');
        }
      } catch (err) {
        console.error('Failed to load lesson', err);
        setError('An error occurred while loading lesson details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLesson();
  }, [id, courseId]);

  const handleCompleteLesson = async () => {
    setCompleting(true);
    try {
      await api.post(`/student/courses/${courseId}/lessons/${id}/complete`);
      window.location.reload();
    } catch (err) {
      console.error('Failed to complete lesson', err);
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-[#0B0E14]">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4 bg-[#0B0E14] text-white">
        <div className="bg-[#E30A17]/10 text-white p-8 rounded-2xl border border-[#E30A17]/30 max-w-md w-full text-center shadow-[0_0_30px_rgba(227,10,23,0.15)] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#E30A17]/20 flex items-center justify-center mb-6">
             <Lock className="w-8 h-8 text-[#E30A17]" />
          </div>
          <p className="font-bold text-lg mb-6 leading-relaxed">
            {error || 'The lesson you are looking for is currently unavailable.'}
          </p>
          <Link to="/dashboard" className="inline-flex bg-white/5 border border-white/10 px-6 py-3 rounded-xl hover:bg-white/10 font-bold gap-2 items-center transition-colors uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#0B0E14] text-white">

      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-[#11151F] border-r border-white/5 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col z-10 shrink-0">

        <div className="p-6 border-b border-white/5 bg-[#0B0E14]/50 backdrop-blur-md">
          <Link to={`/course/${course._id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#FFD700] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>

          <h3 className="text-lg font-bold text-white leading-snug">{course.title}</h3>

          <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>Your Progress</span>
              <span className="text-[#FFD700]">{enrollment?.progress || 0}%</span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#FFD700] to-[#EAB308] shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-500" style={{ width: `${enrollment?.progress || 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {course.lessons.map((l, idx) => {
            const isCurrent = l._id === id;
            const lCompleted = enrollment?.completedLessons?.includes(l._id);

            return (
              <Link
                key={l._id}
                to={`/lesson/${l._id}?courseId=${course._id}`}
                className={`flex px-6 py-4 border-l-[3px] transition-all group ${
                  isCurrent ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="mr-4 mt-0.5 shrink-0 flex items-center justify-center">
                  {lCompleted ? (
                     <CheckCircle2 className="w-5 h-5 text-[#008A32]" />
                  ) : (
                     <PlayCircle className={`w-5 h-5 ${isCurrent ? 'text-[#FFD700]' : 'text-slate-500 group-hover:text-white'}`} />
                  )}
                </div>

                <div>
                  <div className={`text-sm font-bold mb-1 ${isCurrent ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {idx + 1}. {l.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    {l.duration} minutes
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-5xl">

        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-white leading-tight">
          {lesson.title}
        </h1>

        {/* Video */}
        <div 
          className={`bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center text-white mb-10 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 ${!isActive ? 'filter blur-sm grayscale' : ''}`}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ReactPlayer 
            url={lesson.videoUrl} 
            width="100%" 
            height="100%" 
            controls={isActive}
            playing={isActive}
            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
            onEnded={() => setIsVideoFinished(true)}
            onProgress={async ({ played, playedSeconds }) => {
                if (played > 0.98 && !isVideoFinished) setIsVideoFinished(true);

                // Heartbeat logic: execute every 30 seconds of play
                const currentBlock = Math.floor(playedSeconds / 30) * 30;
                
                if (currentBlock > lastPingedBlock && currentBlock >= 0) {
                    setLastPingedBlock(currentBlock);
                    try {
                        const { data } = await api.post('/progress/ping', {
                            courseId,
                            lessonId: id,
                            currentSecond: currentBlock
                        });
                        
                        if (data.success && data.data) {
                            setProgressData(data.data);
                            // If backend confirms 100% completion based on tracked time
                            if (data.data.isComplete && !isVideoFinished) {
                                setIsVideoFinished(true);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to ping progress server', err);
                    }
                }
            }}
          />
          {(!isActive || isBlocked) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0E14]/80 backdrop-blur-md rounded-2xl text-white text-center px-6 border border-white/10">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                 <Lock className="w-10 h-10 text-[#FFD700]" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Access Restricted</h3>
              {isBlocked ? (
                <p className="mt-2 text-sm max-w-sm text-slate-300">Your account has been suspended by administration. Content access is disabled.</p>
              ) : isPending ? (
                <p className="mt-2 text-sm max-w-sm text-slate-300">Your enrollment request is currently pending admin approval. Please wait for authorization.</p>
              ) : isRejected ? (
                <p className="mt-2 text-sm max-w-sm text-slate-300">Your enrollment request was rejected. Contact support for details.</p>
              ) : (
                <p className="mt-2 text-sm max-w-sm text-slate-300">You need to enroll in this course and receive approval before accessing this core material.</p>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Lesson Overview & Materials
          </button>
          <button 
            onClick={() => setActiveTab('qa')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'qa' ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Discussion <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">{qaList.length}</span>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-4 text-white">Lesson Description</h2>
            <p className="text-slate-300 text-base leading-relaxed mb-10 whitespace-pre-wrap">
              {lesson.description}
            </p>

            {/* Reading Materials */}
            {lesson.readingMaterials && (
              <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 md:p-8 border border-white/10 mb-10 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-bl-full pointer-events-none"></div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="p-2 bg-[#FFD700]/10 rounded-lg"><FileText className="w-5 h-5 text-[#FFD700]" /></div>
                  Supplementary Materials
                </h3>
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {lesson.readingMaterials}
                </div>
              </div>
            )}

            {/* Quiz Section */}
            {lesson.quiz && lesson.quiz.length > 0 && (
              <div className="bg-[#11151F] rounded-2xl p-6 md:p-8 border border-white/5 mb-10 shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                   Knowledge Check
                </h3>
                {lesson.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="mb-8 last:mb-0">
                    <p className="font-bold text-white mb-4 leading-relaxed">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => {
                         const isSelected = quizAnswers[qIndex] === oIndex;
                         const isCorrect = q.correctAnswer === oIndex;
                         const showCorrect = quizSubmitted && isCorrect;
                         const showWrong = quizSubmitted && isSelected && !isCorrect;
                         
                         return (
                          <div key={oIndex} className="flex items-center">
                            <label className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              showCorrect ? 'bg-[#008A32]/10 border-[#008A32]/50 shadow-[0_0_15px_rgba(0,138,50,0.1)]' :
                              showWrong ? 'bg-[#E30A17]/10 border-[#E30A17]/50 stroke-[#E30A17]' :
                              isSelected ? 'bg-[#FFD700]/10 border-[#FFD700]/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]' :
                              'bg-[#0B0E14] border-white/5 hover:border-white/20'
                            }`}>
                              <input 
                                type="radio" 
                                name={`question-${qIndex}`}
                                disabled={quizSubmitted}
                                checked={isSelected}
                                onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                                className="w-4 h-4 text-[#FFD700] bg-transparent border-white/20 accent-[#FFD700]"
                              />
                              <span className={`font-medium text-sm ${showCorrect ? 'text-[#008A32]' : showWrong ? 'text-[#E30A17]' : isSelected ? 'text-[#FFD700]' : 'text-slate-300'}`}>
                                {opt}
                              </span>
                              {showCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-[#008A32]" />}
                            </label>
                          </div>
                         );
                      })}
                    </div>
                  </div>
                ))}
                
                {!quizSubmitted ? (
                  <button 
                    onClick={() => {
                        let score = 0;
                        lesson.quiz.forEach((q, i) => {
                            if (quizAnswers[i] === q.correctAnswer) score++;
                        });
                        setQuizScore(score);
                        setQuizSubmitted(true);
                    }}
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                    className="mt-6 w-full sm:w-auto bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Submit Assessment
                  </button>
                ) : (
                  <div className={`mt-8 p-5 rounded-xl border font-bold text-center text-sm uppercase tracking-widest ${quizScore === lesson.quiz.length ? 'bg-[#008A32]/10 border-[#008A32]/30 text-[#008A32]' : 'bg-[#E30A17]/10 border-[#E30A17]/30 text-[#E30A17]'}`}>
                    {quizScore === lesson.quiz.length ? 'Assessment Passed! You may now complete this lesson.' : 'Assessment Failed. Please review the material and try again.'}
                    {quizScore < lesson.quiz.length && (
                        <button 
                          onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                          }}
                          className="block mx-auto mt-4 text-[#FFD700] hover:text-white underline decoration-dashed underline-offset-4"
                        >
                          Retake Assessment
                        </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Completion Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
               <div className="absolute inset-0 bg-gradient-to-r from-[#008A32]/5 to-transparent pointer-events-none"></div>
               
               <div className="flex-1 relative z-10">
                 <h4 className="text-xl font-bold text-white mb-4">Completion Requirements</h4>
                 <ul className="text-sm text-slate-300 space-y-3">
                   <li className="flex items-center gap-3">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isVideoFinished || isCompleted ? 'border-[#008A32] bg-[#008A32]/20 text-[#008A32]' : 'border-white/20 text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                     </div>
                     <span className={isVideoFinished || isCompleted ? 'text-white' : ''}>Watch the entire video</span>
                     {progressData && !isVideoFinished && (
                         <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-[#FFD700] ml-2 border border-white/5">
                             ({Math.round((progressData.watchedSeconds / progressData.requiredSeconds) * 100)}% verified)
                         </span>
                     )}
                   </li>
                   {lesson.quiz && lesson.quiz.length > 0 && (
                     <li className="flex items-center gap-3">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${quizSubmitted && quizScore === lesson.quiz.length ? 'border-[#008A32] bg-[#008A32]/20 text-[#008A32]' : 'border-white/20 text-slate-500'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                       </div>
                       <span className={quizSubmitted && quizScore === lesson.quiz.length ? 'text-white' : ''}>Pass the lesson assessment</span>
                     </li>
                   )}
                 </ul>
               </div>
               
               <div className="relative z-10 w-full md:w-auto">
                 <button 
                   onClick={handleCompleteLesson} 
                   disabled={(!isVideoFinished && !isCompleted) || (lesson.quiz?.length > 0 && (!quizSubmitted || quizScore < lesson.quiz.length))}
                   className={`w-full md:w-auto font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                     isCompleted 
                       ? 'bg-transparent border border-[#008A32]/50 text-[#008A32] cursor-default' 
                       : completing 
                         ? 'bg-[#FFD700]/50 text-[#0f172a] cursor-wait' 
                         : 'bg-gradient-to-r from-[#008A32] to-[#006622] text-white hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:shadow-none'
                   }`}
                 >
                   {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                   {completing ? 'Updating...' : isCompleted ? 'Lesson Completed' : 'Mark as Completed'}
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#FFD700]" /> Discussion Forum
            </h2>

            <div className="bg-[#11151F] border border-white/5 rounded-2xl p-4 sm:p-6 mb-8 shadow-inner">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or share a thought..."
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 transition-all resize-none min-h-[100px] mb-4 text-sm"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (newComment.trim()) {
                      setQaList([
                        {
                          id: Date.now(),
                          user: user?.name,
                          avatar: user?.name?.charAt(0),
                          text: newComment,
                          time: 'Just now',
                          likes: 0,
                          replies: []
                        },
                        ...qaList
                      ]);
                      setNewComment('');
                    }
                  }}
                  className="bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl border border-white/10 hover:bg-[#FFD700] hover:border-[#FFD700] hover:text-[#0f172a] transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Post Comment
                </button>
              </div>
            </div>

            <div className="space-y-6">
               {qaList.map(thread => (
                  <div key={thread.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 sm:p-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#EAB308] flex items-center justify-center font-bold text-[#0f172a] shrink-0">
                           {thread.avatar}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-white text-sm">{thread.user}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{thread.time}</span>
                           </div>
                           <p className="text-slate-300 text-sm leading-relaxed mb-4">{thread.text}</p>
                           <div className="flex items-center gap-4 text-slate-500">
                              <button className="flex items-center gap-1.5 text-xs font-bold hover:text-[#FFD700] transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> {thread.likes}</button>
                              <button className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-colors"><MessageSquare className="w-3.5 h-3.5" /> Reply</button>
                           </div>

                           {thread.replies.length > 0 && (
                              <div className="mt-6 space-y-4">
                                 {thread.replies.map((reply, ridx) => (
                                    <div key={ridx} className="flex gap-4">
                                       <div className="w-8 h-8 rounded-full bg-[#008A32]/20 border border-[#008A32]/30 flex items-center justify-center font-bold text-[#008A32] text-xs shrink-0">
                                          {reply.avatar}
                                       </div>
                                       <div className="flex-1 bg-[#11151F] border border-white/5 rounded-xl p-4">
                                          <div className="flex items-center gap-3 mb-1">
                                             <span className="font-bold text-[#FFD700] text-xs uppercase tracking-widest">{reply.user}</span>
                                             <span className="text-[10px] text-slate-500 uppercase tracking-widest">{reply.time}</span>
                                          </div>
                                          <p className="text-slate-300 text-sm">{reply.text}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
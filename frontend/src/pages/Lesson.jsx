import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, CheckCircle, ArrowLeft, FileText, CheckCircle2, MessageSquare, ThumbsUp, Send, Lock } from 'lucide-react';
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
          user: 'Instructor Administrator',
          avatar: 'IA',
          text: 'Great question! Please ensure that your variables are properly initialized to the specs laid out in module 1 before execution.',
          time: '1 hour ago'
        }
      ]
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
      setError('System parameter missing. Return to catalog and reboot selection.');
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
          setError('Module not found within this track.');
        }
      } catch (err) {
        console.error('Failed to load lesson', err);
        setError('Transmission failure. Unable to retrieve module resources.');
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
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-[#111111] border-t-[#FFC107] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4 bg-gray-50">
        <div className="bg-white border-2 border-[#111111] p-10 rounded-sm shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 outline outline-4 outline-[#111111] outline-offset-4 bg-[#FFC107] text-[#111111] rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock className="w-10 h-10" />
          </div>
          <p className="font-black text-[#111111] mb-8 text-xl uppercase tracking-widest">
            {error || 'Clearance error. Material locked.'}
          </p>
          <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 bg-[#111111] text-[#FFC107] w-full px-6 py-4 font-black uppercase tracking-widest hover:bg-[#222] transition-colors rounded-sm shadow-md">
            <ArrowLeft className="w-5 h-5" /> Return Output
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-gray-50 text-gray-800 font-sans">

      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 bg-white border-r-2 border-gray-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col z-10 shrink-0">

        <div className="p-6 border-b-[4px] border-[#FFC107] bg-[#111111] text-white">
          <Link to={`/course/${course._id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#FFC107] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 leading-tight">{course.title}</h3>

          <div className="bg-white/10 p-3 rounded-sm border border-white/20">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-gray-300">
              <span>Execution</span>
              <span className="text-[#FFC107]">{enrollment?.progress || 0}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 w-full overflow-hidden rounded-full">
              <div className="h-full bg-[#FFC107] transition-all duration-500 shadow-[0_0_10px_#FFC107]" style={{ width: `${enrollment?.progress || 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((l, idx) => {
            const isCurrent = l._id === id;
            const lCompleted = enrollment?.completedLessons?.includes(l._id);

            return (
              <Link
                key={l._id}
                to={`/lesson/${l._id}?courseId=${course._id}`}
                className={`flex px-6 py-5 border-l-4 transition-all group border-b border-gray-100 ${
                  isCurrent ? 'border-[#FFC107] bg-[#FFC107]/10' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="mr-4 mt-0.5 shrink-0 flex items-center justify-center">
                  {lCompleted ? (
                     <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                     <PlayCircle className={`w-5 h-5 ${isCurrent ? 'text-[#111111]' : 'text-gray-400 group-hover:text-[#111111]'}`} />
                  )}
                </div>

                <div>
                  <div className={`text-sm font-black uppercase tracking-wider mb-1 ${isCurrent ? 'text-[#111111]' : 'text-gray-600 group-hover:text-[#111111]'}`}>
                    {idx + 1}. {l.title}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {l.duration} mins block
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Study Interface */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-5xl">

        <h1 className="text-3xl sm:text-4xl font-black mb-6 text-[#111111] uppercase tracking-tight">
          {lesson.title}
        </h1>

        {/* Video Player */}
        <div 
          className={`bg-[#000] rounded-sm overflow-hidden aspect-video flex items-center justify-center text-white mb-8 relative shadow-[0_10px_40px_rgba(0,0,0,0.1)] outline outline-4 outline-offset-4 outline-[#111111] ${!isActive ? 'filter blur-md grayscale' : ''}`}
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

                // Heartbeat logic
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111]/90 backdrop-blur-md rounded-sm text-center px-6">
              <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                 <Lock className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-widest">Signal Locked</h3>
              {isBlocked ? (
                <p className="mt-2 text-sm max-w-sm text-red-400 font-bold uppercase">Administrator Override: Account Suspended.</p>
              ) : isPending ? (
                <p className="mt-2 text-sm max-w-sm text-[#FFC107] font-bold uppercase">Clearance Pending Authorization.</p>
              ) : isRejected ? (
                <p className="mt-2 text-sm max-w-sm text-red-400 font-bold uppercase">Clearance Denied. Contact Authority.</p>
              ) : (
                <p className="mt-2 text-sm max-w-sm text-gray-300 font-bold uppercase">Enrollment criteria unmet.</p>
              )}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b-2 border-gray-200 mb-8 overflow-x-auto padding-bottom-scroll">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-4 ${activeTab === 'overview' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-gray-400 hover:text-[#111111] hover:border-gray-300'}`}
          >
            Mission Docs
          </button>
          <button 
            onClick={() => setActiveTab('qa')}
            className={`pb-4 px-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-4 flex items-center gap-2 ${activeTab === 'qa' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-gray-400 hover:text-[#111111] hover:border-gray-300'}`}
          >
            Comm Link <span className="bg-[#111111] text-[#FFC107] px-2 py-0.5 rounded-sm text-[10px]">{qaList.length}</span>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-black mb-4 text-[#111111] uppercase tracking-widest">Objective Overview</h2>
            <p className="text-gray-700 text-base font-medium leading-relaxed mb-10 whitespace-pre-wrap bg-white p-6 border-2 border-gray-200 rounded-sm">
              {lesson.description}
            </p>

            {/* Reading Materials */}
            {lesson.readingMaterials && (
              <div className="bg-white rounded-sm p-6 md:p-8 border-2 border-[#111111] mb-10 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#FFC107]"></div>
                <h3 className="text-lg font-black text-[#111111] uppercase tracking-widest mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#111111] p-1 bg-[#FFC107] rounded-sm" />
                  Attachment Briefing
                </h3>
                <div className="prose max-w-none text-gray-700 font-medium whitespace-pre-wrap text-sm leading-relaxed">
                  {lesson.readingMaterials}
                </div>
              </div>
            )}

            {/* Assessment Section */}
            {lesson.quiz && lesson.quiz.length > 0 && (
              <div className="bg-white rounded-sm p-6 md:p-8 border-2 border-[#111111] mb-10 shadow-md relative">
                <h3 className="text-lg font-black text-[#111111] uppercase tracking-widest mb-8 flex items-center gap-3 border-b-4 border-[#FFC107] inline-block pb-1">
                   Knowledge Audit
                </h3>
                {lesson.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="mb-8 last:mb-0">
                    <p className="font-black text-[#111111] mb-5 leading-relaxed text-lg">Query 0{qIndex + 1}: {q.question}</p>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => {
                         const isSelected = quizAnswers[qIndex] === oIndex;
                         const isCorrect = q.correctAnswer === oIndex;
                         const showCorrect = quizSubmitted && isCorrect;
                         const showWrong = quizSubmitted && isSelected && !isCorrect;
                         
                         return (
                          <div key={oIndex} className="flex items-center">
                            <label className={`w-full flex items-center gap-4 p-4 rounded-sm border-2 cursor-pointer transition-all ${
                              showCorrect ? 'bg-green-50 border-green-500' :
                              showWrong ? 'bg-red-50 border-red-500' :
                              isSelected ? 'bg-[#111111] border-[#111111] shadow-lg scale-[1.01]' :
                              'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}>
                              <input 
                                type="radio" 
                                name={`question-${qIndex}`}
                                disabled={quizSubmitted}
                                checked={isSelected}
                                onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                                className="w-5 h-5 text-[#FFC107] bg-gray-100 border-gray-300 focus:ring-[#FFC107]"
                              />
                              <span className={`font-bold text-sm tracking-wide ${showCorrect ? 'text-green-700' : showWrong ? 'text-red-700' : isSelected ? 'text-[#FFC107]' : 'text-[#111111]'}`}>
                                {opt}
                              </span>
                              {showCorrect && <CheckCircle2 className="w-6 h-6 ml-auto text-green-600" />}
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
                    className="mt-6 w-full bg-[#111111] text-[#FFC107] font-black uppercase tracking-widest py-4 px-8 border-b-4 border-[#FFC107] hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Transmit Assessment
                  </button>
                ) : (
                  <div className={`mt-8 p-6 rounded-sm font-black uppercase tracking-widest text-center shadow-inner ${quizScore === lesson.quiz.length ? 'bg-green-500 text-[#111111]' : 'bg-red-500 text-white'}`}>
                    {quizScore === lesson.quiz.length ? 'Audit Passed. Proceed to finalize.' : 'Audit Failed. Review intelligence and attempt.'}
                    {quizScore < lesson.quiz.length && (
                        <button 
                          onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                          }}
                          className="block mx-auto mt-4 text-[#111111] hover:text-white bg-white/20 px-6 py-2 transition-colors rounded-sm text-sm"
                        >
                          Reboot Audit
                        </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Validation Checkbox Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111111] text-white p-6 md:p-8 rounded-sm shadow-xl border-t-8 border-[#FFC107]">
               
               <div className="flex-1">
                 <h4 className="text-xl font-black uppercase tracking-widest mb-4">Final Validation Protocol</h4>
                 <ul className="text-sm font-bold text-gray-300 space-y-4">
                   <li className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/10">
                     <div className={`w-6 h-6 rounded-sm flex items-center justify-center border-2 ${isVideoFinished || isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-600 text-transparent'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                     </div>
                     <span className={isVideoFinished || isCompleted ? 'text-white' : ''}>Consume visual transmission completely</span>
                     {progressData && !isVideoFinished && (
                         <span className="text-xs text-[#FFC107] font-black ml-auto bg-[#111111] px-2 py-1 rounded">
                             {Math.round((progressData.watchedSeconds / progressData.requiredSeconds) * 100)}%
                         </span>
                     )}
                   </li>
                   {lesson.quiz && lesson.quiz.length > 0 && (
                     <li className="flex items-center gap-4 bg-white/5 p-3 rounded-sm border border-white/10">
                       <div className={`w-6 h-6 rounded-sm flex items-center justify-center border-2 ${quizSubmitted && quizScore === lesson.quiz.length ? 'border-green-500 bg-green-500 text-white' : 'border-gray-600 text-transparent'}`}>
                          <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <span className={quizSubmitted && quizScore === lesson.quiz.length ? 'text-white' : ''}>Execute successful audit</span>
                     </li>
                   )}
                 </ul>
               </div>
               
               <div className="w-full md:w-auto border-t border-white/20 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                 <button 
                   onClick={handleCompleteLesson} 
                   disabled={(!isVideoFinished && !isCompleted) || (lesson.quiz?.length > 0 && (!quizSubmitted || quizScore < lesson.quiz.length))}
                   className={`w-full font-black uppercase tracking-widest px-8 py-5 rounded-sm transition-all flex items-center justify-center gap-3 ${
                     isCompleted 
                       ? 'bg-green-500 text-[#111111] cursor-default' 
                       : completing 
                         ? 'bg-[#FFC107]/50 text-[#111111] cursor-wait' 
                         : 'bg-[#FFC107] text-[#111111] hover:bg-[#e0a800] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed active:scale-95'
                   }`}
                 >
                   {isCompleted && <CheckCircle2 className="w-5 h-5" />}
                   {completing ? 'SYNCING...' : isCompleted ? 'AUTHORIZED' : 'DECLARE COMPLETE'}
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-black mb-6 text-[#111111] uppercase tracking-widest flex items-center gap-3 border-b-4 border-[#FFC107] inline-block pb-1">
               Decentralized Comm Link
            </h2>

            <div className="bg-white border-2 border-gray-200 text-[#111111] p-6 mb-8 shadow-sm">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Initialize message vector..."
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-sm p-5 font-bold focus:outline-none focus:border-[#FFC107] resize-y min-h-[120px] mb-4 text-sm"
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
                          time: 'T-00',
                          likes: 0,
                          replies: []
                        },
                        ...qaList
                      ]);
                      setNewComment('');
                    }
                  }}
                  className="bg-[#111111] text-[#FFC107] font-black uppercase tracking-widest text-sm px-8 py-3 rounded-sm hover:bg-[#222] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Broadcast
                </button>
              </div>
            </div>

            <div className="space-y-6">
               {qaList.map(thread => (
                  <div key={thread.id} className="bg-white border-2 border-gray-200 rounded-sm p-6 shadow-sm">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#FFC107] text-[#111111] flex items-center justify-center font-black text-xl shrink-0 border-2 border-[#111111]">
                           {thread.avatar}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-4 mb-2">
                              <span className="font-black text-[#111111] uppercase tracking-widest">{thread.user}</span>
                              <span className="bg-gray-100 text-gray-500 font-bold px-2 py-0.5 text-[10px] uppercase rounded-sm border border-gray-200">{thread.time}</span>
                           </div>
                           <p className="text-gray-700 text-sm font-medium leading-relaxed mb-6">{thread.text}</p>
                           
                           <div className="flex items-center gap-6 text-[#111111] mb-2 border-t-2 border-gray-100 pt-4">
                              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#FFC107] transition-colors bg-gray-50 px-3 py-1.5 rounded-sm"><ThumbsUp className="w-4 h-4" /> {thread.likes}</button>
                              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#FFC107] transition-colors bg-gray-50 px-3 py-1.5 rounded-sm"><MessageSquare className="w-4 h-4" /> Link Reply</button>
                           </div>

                           {thread.replies.length > 0 && (
                              <div className="mt-6 space-y-4 border-l-4 border-[#FFC107] pl-4 lg:pl-6 ml-2">
                                 {thread.replies.map((reply, ridx) => (
                                    <div key={ridx} className="flex gap-4 bg-gray-50 p-4 border border-gray-100 rounded-sm">
                                       <div className="w-10 h-10 bg-[#111111] text-[#FFC107] flex items-center justify-center font-black text-sm shrink-0">
                                          {reply.avatar}
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-4 mb-2">
                                             <span className="font-black text-[#111111] text-xs uppercase tracking-widest">{reply.user}</span>
                                             <span className="text-gray-400 font-bold text-[10px] uppercase">{reply.time}</span>
                                          </div>
                                          <p className="text-gray-700 text-sm font-medium">{reply.text}</p>
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
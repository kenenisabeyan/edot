import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, CheckCircle, ArrowLeft, Play, FileText, CheckCircle2, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import ReactPlayer from 'react-player';

export default function Lesson() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const navigate = useNavigate();
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
  const isCompleted = enrollment?.completedLessons?.includes(id);

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
      <div className="min-h-screen flex justify-center items-center bg-transparent">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4 bg-transparent">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 max-w-md w-full text-center">
          <p className="font-medium text-lg mb-4">
            {error || 'The lesson you are looking for is currently unavailable.'}
          </p>
          <Link to="/dashboard" className="inline-flex text-blue-600 hover:text-blue-800 font-semibold gap-2 items-center">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-transparent">

      {/* Sidebar */}
      <div className="w-full lg:w-80 glass-card border-r border-slate-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col shadow-sm">

        <div className="p-6 border-b bg-slate-900 text-white">
          <Link to={`/course/${course._id}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Course Overview
          </Link>

          <h3 className="text-lg font-bold">{course.title}</h3>

          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1">
              <span>Your Learning Progress</span>
              <span>{enrollment?.progress || 0}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${enrollment?.progress || 0}%` }}></div>
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
                className={`flex px-6 py-4 border-l-4 ${
                  isCurrent ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-transparent'
                }`}
              >
                <div className="mr-3">
                  {lCompleted ? <CheckCircle className="text-green-500" /> : <PlayCircle />}
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    {idx + 1}. {l.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    Duration: {l.duration} minutes
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-4">
          {lesson.title}
        </h1>

        {/* Video */}
        <div 
          className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center text-white mb-8 relative shadow-lg"
          onContextMenu={(e) => e.preventDefault()}
        >
          <ReactPlayer 
            url={lesson.videoUrl} 
            width="100%" 
            height="100%" 
            controls={true}
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
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button onClick={() => setActiveTab('overview')}>
            Lesson Overview & Materials
          </button>
          <button onClick={() => setActiveTab('qa')}>
            Discussion & Questions ({qaList.length})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            <h2 className="text-xl font-bold mb-2">Lesson Description</h2>
            <p className="text-slate-600 mb-6 whitespace-pre-wrap">
              {lesson.description}
            </p>

            {/* Reading Materials */}
            {lesson.readingMaterials && (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8 mt-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  EDOT Resource Center
                </h3>
                <div className="prose prose-amber max-w-none text-amber-800 whitespace-pre-wrap">
                  {lesson.readingMaterials}
                </div>
              </div>
            )}

            {/* Quiz Section */}
            {lesson.quiz && lesson.quiz.length > 0 && (
              <div className="glass-card rounded-xl p-6 border border-slate-200 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Lesson Quiz Assessment</h3>
                {lesson.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="mb-6 last:mb-0">
                    <p className="font-semibold text-slate-800 mb-3">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => {
                         const isSelected = quizAnswers[qIndex] === oIndex;
                         const isCorrect = q.correctAnswer === oIndex;
                         const showCorrect = quizSubmitted && isCorrect;
                         const showWrong = quizSubmitted && isSelected && !isCorrect;
                         
                         return (
                          <div key={oIndex} className="flex items-center">
                            <label className={`w-full flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              showCorrect ? 'bg-emerald-50 border-emerald-500' :
                              showWrong ? 'bg-red-50 border-red-500' :
                              isSelected ? 'bg-indigo-50 border-indigo-500' :
                              'hover:bg-transparent border-slate-200'
                            }`}>
                              <input 
                                type="radio" 
                                name={`question-${qIndex}`}
                                disabled={quizSubmitted}
                                checked={isSelected}
                                onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className={showCorrect ? 'text-emerald-700 font-medium' : showWrong ? 'text-red-700' : 'text-slate-700'}>
                                {opt}
                              </span>
                              {showCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-500" />}
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
                    className="mt-4 bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div className={`mt-4 p-4 rounded-lg font-bold text-center ${quizScore === lesson.quiz.length ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {quizScore === lesson.quiz.length ? 'Quiz Passed! You may now complete this lesson.' : 'Quiz Failed. Please review the lesson and try again.'}
                    {quizScore < lesson.quiz.length && (
                        <button 
                          onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                          }}
                          className="block mx-auto mt-2 text-sm text-red-600 underline"
                        >
                          Retake Quiz
                        </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-100 p-6 rounded-xl border border-slate-200">
               <div className="flex-1">
                 <h4 className="font-bold text-slate-900">Completion Requirements</h4>
                 <ul className="text-sm text-slate-600 space-y-1 mt-2">
                   <li className="flex items-center gap-2">
                     <CheckCircle2 className={`w-4 h-4 ${isVideoFinished || isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} /> Watch the entire video
                     {progressData && !isVideoFinished && (
                         <span className="text-xs ml-2 text-indigo-500">
                             ({Math.round((progressData.watchedSeconds / progressData.requiredSeconds) * 100)}% Verified by Server)
                         </span>
                     )}
                   </li>
                   {lesson.quiz && lesson.quiz.length > 0 && (
                     <li className="flex items-center gap-2">
                       <CheckCircle2 className={`w-4 h-4 ${quizSubmitted && quizScore === lesson.quiz.length ? 'text-emerald-500' : 'text-slate-400'}`} /> Pass the lesson quiz
                     </li>
                   )}
                 </ul>
               </div>
               
               <button 
                 onClick={handleCompleteLesson} 
                 disabled={(!isVideoFinished && !isCompleted) || (lesson.quiz?.length > 0 && (!quizSubmitted || quizScore < lesson.quiz.length))}
                 className="w-full sm:w-auto bg-[#4338ca] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {completing ? 'Updating...' : isCompleted ? 'Lesson Completed' : 'Mark as Completed'}
               </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">
              Ask Questions & Share Ideas
            </h2>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your question, feedback, or idea related to this lesson..."
              className="w-full border p-3 mb-3"
            />

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
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              Post Your Question
            </button>
          </>
        )}

      </div>
    </div>
  );
}
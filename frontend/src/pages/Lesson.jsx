import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, CheckCircle, ArrowLeft, Play, FileText, CheckCircle2, MessageSquare, ThumbsUp, Send } from 'lucide-react';

export default function Lesson() {
  const { id } = useParams(); // lesson id
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
  
  // Mock QA Data
  const [qaList, setQaList] = useState([
    { id: 1, user: 'Alice Smith', avatar: 'A', text: 'I tried this concept but got confused at the second step. Can someone explain it in a simpler way?', time: '2 hours ago', likes: 3, replies: [{ user: 'Instructor', avatar: 'I', text: 'Focus on understanding the first step clearly, then the rest becomes easier. Try again step by step.', time: '1 hour ago' }] },
    { id: 2, user: 'Bob Johnson', avatar: 'B', text: 'This lesson really helped me understand the fundamentals clearly. Great explanation!', time: '1 day ago', likes: 12, replies: [] }
  ]);

  const enrollment = user?.enrolledCourses?.find(e => e.course === courseId || e.course?._id === courseId);
  const isCompleted = enrollment?.completedLessons?.includes(id);

  useEffect(() => {
    if (!courseId) {
      setError('Course information is missing');
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
          setError('This lesson could not be found in the selected course');
        }
      } catch (err) {
        console.error('Failed to load lesson', err);
        setError('Unable to load lesson content. Please try again.');
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
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4 bg-slate-50">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 max-w-md w-full text-center">
          <p className="font-medium text-lg mb-4">{error || 'Lesson not found'}</p>
          <Link to="/dashboard" className="inline-flex text-blue-600 hover:text-blue-800 font-semibold gap-2 items-center">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
      
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r border-slate-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col z-10 shadow-sm shrink-0">
        
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <Link 
            to={`/course/${course._id}`} 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-3 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Course Overview
          </Link>
          <h3 className="text-lg font-bold leading-snug line-clamp-2">{course.title}</h3>
          
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-1.5 px-0.5">
              <span>Your Progress</span>
              <span className="text-white">{enrollment?.progress || 0}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${enrollment?.progress || 0}%` }}
              >
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          {course.lessons.map((l, idx) => {
            const isCurrent = l._id === id;
            const lCompleted = enrollment?.completedLessons?.includes(l._id);
            
            return (
              <Link 
                key={l._id} 
                to={`/lesson/${l._id}?courseId=${course._id}`}
                className={`flex items-start px-6 py-4 border-l-4 transition-colors ${
                  isCurrent 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 mr-3 shrink-0 ${lCompleted ? 'text-emerald-500' : isCurrent ? 'text-blue-600' : 'text-slate-300'}`}>
                  {lCompleted ? (
                    <CheckCircle className="w-5 h-5 fill-emerald-50" />
                  ) : (
                    <PlayCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className={`text-sm ${isCurrent ? 'font-bold text-blue-900' : 'font-medium text-slate-700'}`}>
                    {idx + 1}. {l.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Play className="w-3 h-3" /> {l.duration} minutes
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-2">{lesson.title}</h1>
        </div>
        
        {/* Video */}
        <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center mb-8 relative shadow-2xl border border-slate-800">
           {lesson.videoUrl && (lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be')) ? (
             <iframe 
               width="100%" 
               height="100%" 
               src={`https://www.youtube.com/embed/${
                 lesson.videoUrl.includes('youtu.be/') 
                   ? lesson.videoUrl.split('youtu.be/')[1].split('?')[0] 
                   : lesson.videoUrl.split('v=')[1]?.split('&')[0]
               }`} 
               title={lesson.title} 
               frameBorder="0" 
               allowFullScreen
               className="w-full h-full"
             ></iframe>
           ) : (
             <div className="text-center z-10">
               <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
                 className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                 <Play className="w-8 h-8" />
               </a>
               <p className="text-white">Open lesson video</p>
             </div>
           )}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8 px-2">
          <button onClick={() => setActiveTab('overview')} className={`pb-4 border-b-2 font-bold text-sm ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'text-slate-500'}`}>
            Lesson Overview
          </button>
          <button onClick={() => setActiveTab('qa')} className={`pb-4 border-b-2 font-bold text-sm ${activeTab === 'qa' ? 'border-blue-600 text-blue-600' : 'text-slate-500'}`}>
            Discussion ({qaList.length})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div>
            <h2 className="text-xl font-bold mb-3">What you will learn</h2>
            <p className="text-slate-600 text-lg">{lesson.description}</p>

            <div className="mt-6">
              {isCompleted ? (
                <div className="text-green-600 font-bold">You have completed this lesson</div>
              ) : (
                <button onClick={handleCompleteLesson} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                  {completing ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Ask Questions & Share Ideas</h2>

            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask your question or share your understanding..."
              className="w-full border p-3 rounded-lg mb-3"
            ></textarea>

            <button 
              onClick={() => {
                if(newComment.trim()) {
                  setQaList([{ id: Date.now(), user: user?.name, avatar: 'U', text: newComment, time: 'Now', likes: 0, replies: [] }, ...qaList]);
                  setNewComment('');
                }
              }}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg"
            >
              Post
            </button>

            <div className="mt-6 space-y-4">
              {qaList.map(q => (
                <div key={q.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-bold">{q.user}</p>
                  <p>{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
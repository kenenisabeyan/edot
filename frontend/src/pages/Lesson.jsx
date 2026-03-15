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
    { id: 1, user: 'Alice Smith', avatar: 'A', text: 'Does anyone know why the second array method threw an error for me?', time: '2 hours ago', likes: 3, replies: [{ user: 'Instructor', avatar: 'I', text: 'Make sure your array is initialized before calling .map()!', time: '1 hour ago' }] },
    { id: 2, user: 'Bob Johnson', avatar: 'B', text: 'Great explanation on the core concepts here.', time: '1 day ago', likes: 12, replies: [] }
  ]);

  // Determine if the current lesson is completed by the user
  const enrollment = user?.enrolledCourses?.find(e => e.course === courseId || e.course?._id === courseId);
  const isCompleted = enrollment?.completedLessons?.includes(id);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not provided');
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
          setError('Lesson not found in this course');
        }
      } catch (err) {
        console.error('Failed to load lesson', err);
        setError('Failed to load lesson details');
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
      // Update local context by forcing a reload (or updating context directly)
      window.location.reload();
    } catch (err) {
      console.error('Failed to complete lesson', err);
      // Even if it fails, maybe they are already complete
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
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
      
      {/* Sidebar for Curriculum */}
      <div className="w-full lg:w-80 bg-white border-r border-slate-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col z-10 shadow-sm shrink-0">
        
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <Link 
            to={`/course/${course._id}`} 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-3 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>
          <h3 className="text-lg font-bold leading-snug line-clamp-2">{course.title}</h3>
          
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-1.5 px-0.5">
              <span>Course Progress</span>
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
                className={`flex items-start px-6 py-4 border-l-4 transition-colors relative ${
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
                    <Play className="w-3 h-3" /> {l.duration} min
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-2">{lesson.title}</h1>
        </div>
        
        {/* Video Player */}
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
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               allowFullScreen
               className="w-full h-full"
             ></iframe>
           ) : (
             <div className="text-center z-10">
               <a 
                 href={lesson.videoUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-20 h-20 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-colors backdrop-blur-sm border border-blue-400/30 group"
               >
                 <Play className="w-8 h-8 ml-1 fill-white transform group-hover:scale-110 transition-transform" />
               </a>
               <p className="font-medium text-white/90 tracking-wide">Click to open video in new tab</p>
             </div>
           )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8 px-2">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`pb-4 border-b-2 font-bold text-sm transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Overview & Resources
          </button>
          <button 
            onClick={() => setActiveTab('qa')} 
            className={`pb-4 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'qa' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Q&A Discussions 
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'qa' ? 'bg-blue-100' : 'bg-slate-100 text-slate-500'}`}>{qaList.length}</span>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div>
            {/* Lesson Controls & Info */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-slate-100 pb-8 mb-8 gap-6">
              <div className="flex-1 md:pr-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Lesson Details</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{lesson.description}</p>
              </div>
              
              <div className="shrink-0 w-full md:w-auto">
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 w-full md:w-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    Completed
                  </div>
                ) : (
                  <button 
                    onClick={handleCompleteLesson} 
                    disabled={completing}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {completing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {completing ? 'Marking...' : 'Mark as Complete'}
                  </button>
                )}
              </div>
            </div>

            {/* Resources Section */}
            <div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Resources</h3>
               {lesson.resources && lesson.resources.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {lesson.resources.map((res, i) => (
                     <a 
                       key={i} 
                       href={res.fileUrl} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                     >
                       <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                         <FileText className="w-6 h-6" />
                       </div>
                       <span className="font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-2">
                         {res.title}
                       </span>
                     </a>
                   ))}
                 </div>
               ) : (
                 <div className="bg-white border border-slate-200 border-dashed rounded-xl p-8 text-center">
                   <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                   <p className="text-slate-500 font-medium">No additional resources available for this lesson.</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Course Q&A</h2>
            
            {/* New Question Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 text-right">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or share a thought..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y min-h-[100px] text-sm mb-3"
                  ></textarea>
                  <button 
                    onClick={() => {
                      if(newComment.trim()) {
                        setQaList([{ id: Date.now(), user: user?.name, avatar: user?.name?.charAt(0) || 'U', text: newComment, time: 'Just now', likes: 0, replies: [] }, ...qaList]);
                        setNewComment('');
                      }
                    }}
                    disabled={!newComment.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Post
                  </button>
                </div>
              </div>
            </div>

            {/* Q&A Thread */}
            <div className="space-y-6">
              {qaList.map(qa => (
                <div key={qa.id} className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold shrink-0">
                      {qa.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-bold text-slate-900">{qa.user}</h4>
                        <span className="text-xs text-slate-400 font-medium">{qa.time}</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">{qa.text}</p>
                      
                      <div className="flex items-center gap-4 text-slate-500 mb-4">
                        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" /> {qa.likes || 0}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-blue-600 transition-colors">
                          <MessageSquare className="w-4 h-4" /> Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {qa.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-slate-100 space-y-4 pt-4">
                          {qa.replies.map((reply, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                                {reply.avatar}
                              </div>
                              <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                <div className="flex items-baseline justify-between mb-1">
                                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                                    {reply.user} 
                                    {reply.user === 'Instructor' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                                  </h4>
                                  <span className="text-xs text-slate-400">{reply.time}</span>
                                </div>
                                <p className="text-slate-700 text-sm">{reply.text}</p>
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

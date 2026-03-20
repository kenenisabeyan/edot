import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlayCircle, CheckCircle, ArrowLeft, Play, FileText, CheckCircle2, MessageSquare, ThumbsUp, Send } from 'lucide-react';

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
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4 bg-slate-50">
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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">

      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r border-slate-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 flex flex-col shadow-sm">

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
                  isCurrent ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-slate-50'
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
        <div className="bg-black rounded-xl h-64 flex items-center justify-center text-white mb-8">
          <p>Interactive lesson video will be displayed here.</p>
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
            <p className="text-slate-600 mb-6">
              {lesson.description}
            </p>

            <button onClick={handleCompleteLesson} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              {completing ? 'Updating Progress...' : 'Mark Lesson as Completed'}
            </button>

            <h3 className="text-lg font-bold mt-8 mb-4">Learning Resources</h3>
            <p className="text-slate-500">
              Additional learning materials, documents, and references will appear here to support your understanding.
            </p>
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
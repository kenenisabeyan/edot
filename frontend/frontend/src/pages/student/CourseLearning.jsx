// frontend/src/pages/student/CourseLearning.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { 
  PlayCircleIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CourseLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/courses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(response.data);
      
      // Find user's progress in this course
      const enrollment = response.data.enrolledStudents.find(
        e => e.studentId === user._id
      );
      if (enrollment) {
        setCompletedLessons(enrollment.completedLessons || []);
        setProgress(enrollment.progress || 0);
        
        // Set current lesson to the first incomplete lesson
        if (response.data.lessons && response.data.lessons.length > 0) {
          const firstIncomplete = response.data.lessons.findIndex(
            (_, index) => !enrollment.completedLessons?.includes(index)
          );
          setCurrentLesson(firstIncomplete >= 0 ? firstIncomplete : 0);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
      navigate('/student/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonIndex) => {
    if (completedLessons.includes(lessonIndex)) return;

    try {
      const newCompletedLessons = [...completedLessons, lessonIndex];
      const newProgress = Math.round(
        (newCompletedLessons.length / course.lessons.length) * 100
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/${id}/progress`,
        {
          lessonIndex,
          completedLessons: newCompletedLessons,
          progress: newProgress
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompletedLessons(newCompletedLessons);
      setProgress(newProgress);
      
      toast.success('Lesson completed!');
      
      // Auto-advance to next lesson if available
      if (lessonIndex < course.lessons.length - 1) {
        setCurrentLesson(lessonIndex + 1);
        setPlaying(true);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const saveNotes = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/${id}/notes`,
        {
          lessonIndex: currentLesson,
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Notes saved!');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const handleVideoProgress = (state) => {
    // Mark lesson as complete when user watches 90% of the video
    if (
      state.played > 0.9 && 
      !completedLessons.includes(currentLesson) &&
      course?.lessons[currentLesson]?.videoUrl
    ) {
      markLessonComplete(currentLesson);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-textSecondary">Course not found</p>
        <button
          onClick={() => navigate('/student/my-courses')}
          className="mt-4 text-primary hover:text-blue-800"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  const lesson = course.lessons[currentLesson];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/student/my-courses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-300"
            >
              <ArrowLeftIcon className="h-5 w-5 text-textSecondary" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-textPrimary">{course.title}</h1>
              <p className="text-sm text-textSecondary">
                Lesson {currentLesson + 1} of {course.lessons.length}: {lesson?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-textSecondary">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">{progress}%</p>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Player Section */}
        <div className="flex-1 flex flex-col">
          <div className="bg-black aspect-video">
            {lesson?.videoUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={lesson.videoUrl}
                width="100%"
                height="100%"
                playing={playing}
                controls
                onProgress={handleVideoProgress}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload'
                    }
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <p className="text-white">No video available for this lesson</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-textPrimary">{lesson?.title}</h2>
              {completedLessons.includes(currentLesson) && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircleSolid className="h-5 w-5" />
                  Completed
                </span>
              )}
            </div>
            <p className="text-textSecondary">{lesson?.description}</p>
          </div>

          {/* Lesson Actions */}
          <div className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  {showNotes ? 'Hide Notes' : 'Take Notes'}
                </button>
                
                {lesson?.resources && lesson.resources.length > 0 && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300">
                    <BookOpenIcon className="h-5 w-5" />
                    Resources
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentLesson(prev => Math.max(0, prev - 1))}
                  disabled={currentLesson === 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentLesson(prev => Math.min(course.lessons.length - 1, prev + 1))}
                  disabled={currentLesson === course.lessons.length - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showNotes && (
              <div className="mt-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={saveNotes}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition duration-300"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-textPrimary">Course Content</h3>
            <p className="text-sm text-textSecondary mt-1">
              {completedLessons.length} of {course.lessons.length} completed
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {course.lessons.map((lesson, index) => (
              <button
                key={index}
                onClick={() => setCurrentLesson(index)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition duration-300 ${
                  currentLesson === index ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {completedLessons.includes(index) ? (
                    <CheckCircleSolid className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <PlayCircleIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      currentLesson === index ? 'text-primary' : 'text-textPrimary'
                    }`}>
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-sm text-textSecondary mt-1">
                      {lesson.duration || 0} min
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  FolderOpen, PlusCircle, Edit3, Clock, CheckCircle2, 
  XSquare, PlayCircle, Send, Users
} from 'lucide-react';

export default function InstructorManageCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().finally(() => setLoading(false));
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/instructor/courses');
      setCourses(data.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleSubmitReview = async (courseId) => {
    try {
      await api.put(`/instructor/courses/${courseId}/submit`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to submit for review', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Courses</h2>
          <p className="text-slate-500 mt-1">View, edit, and publish your course materials</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/builder')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4338ca] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
        >
          <PlusCircle className="w-5 h-5" /> Create Course
        </button>
      </div>
      
      {courses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mt-8">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses created yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Share your knowledge with the world by creating your very first comprehensive curriculum.</p>
            <button 
            onClick={() => navigate('/dashboard/builder')} 
            className="px-6 py-2.5 bg-[#4338ca] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start Creating
            </button>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map(c => (
              <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-md hover:border-slate-200">
                
                <div className="w-full md:w-72 h-56 md:h-auto shrink-0 relative bg-slate-100">
                    <img 
                    src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                    alt={c.title} 
                    className="w-full h-full object-cover" 
                  />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 uppercase tracking-wider shadow-sm">
                      {c.category}
                    </div>
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-slate-900 leading-snug break-words">{c.title}</h3>
                      <span className={`shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        c.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                        (c.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                        (c.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' : 
                        'bg-slate-50 text-slate-700 border border-slate-200'))
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit">
                      <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-indigo-500" /> {c.duration} hours</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="flex items-center gap-1.5 font-medium"><PlayCircle className="w-4 h-4 text-emerald-500" /> {c.lessons?.length || 0} lessons</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="flex items-center gap-1.5 font-medium"><Users className="w-4 h-4 text-amber-500" /> {c.totalStudents || 0} students</span>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-2 md:line-clamp-3 mb-0">{c.description}</p>
                  </div>
                  
                  <div className="p-4 md:px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Last edited: {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {(c.status === 'draft' || c.status === 'rejected') && (
                          <button 
                            onClick={() => handleSubmitReview(c._id)} 
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4338ca] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
                          >
                            <Send className="w-4 h-4" /> Submit for Review
                          </button>
                        )}
                        {c.status === 'approved' && (
                            <span className="inline-flex items-center gap-2 text-emerald-700 text-sm font-bold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live for Students
                            </span>
                        )}
                        {c.status !== 'pending' && (
                          <button 
                            onClick={() => navigate('/dashboard/builder/' + c._id)} 
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm text-sm"
                          >
                            <Edit3 className="w-4 h-4" /> Edit Update
                          </button>
                        )}
                        {c.status === 'pending' && (
                            <span className="inline-flex items-center gap-2 text-amber-700 text-sm font-bold bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
                              <Clock className="w-5 h-5 text-amber-500" /> Pending Admin Review
                            </span>
                        )}
                        {c.status === 'rejected' && (
                            <span className="inline-flex items-center gap-2 text-red-700 text-sm font-bold bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                              <XSquare className="w-5 h-5 text-red-500" /> Changes Required
                            </span>
                        )}
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

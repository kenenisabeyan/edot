import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
  ClipboardCheck, Clock, CheckCircle2, 
  XSquare, PlayCircle, Users, AlertCircle
} from 'lucide-react';

export default function AdminCourseApprovals() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const { data } = await api.get('/admin/courses/pending');
      setCourses(data.data);
    } catch (err) {
      console.error('Failed to fetch pending courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (courseId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'approved' ? 'approve and publish' : 'reject'} this course?`)) return;
    
    setProcessing(courseId);
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      // Remove from list
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Failed to update course status', err);
      alert('Failed to update course status');
    } finally {
      setProcessing(null);
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
          <h2 className="text-2xl font-bold text-slate-800">Pending Course Approvals</h2>
          <p className="text-slate-500 mt-1">Review courses submitted by instructors before publishing</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {courses.length} courses waiting
        </div>
      </div>
      
      {courses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mt-8">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <ClipboardCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 max-w-sm">There are no pending courses waiting for your approval at this time.</p>
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
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-snug break-words mb-1">{c.title}</h3>
                        <p className="text-sm font-medium text-indigo-600">Instructor: {c.instructor?.name || 'Unknown'}</p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-4 h-4" /> Pending
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit">
                      <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-indigo-500" /> {c.duration} hours</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="flex items-center gap-1.5 font-medium"><PlayCircle className="w-4 h-4 text-emerald-500" /> {c.lessons?.length || 0} lessons</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="font-bold text-slate-700">{c.price > 0 ? `$${c.price}` : 'Free'}</span>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-3 mb-0">{c.description}</p>
                  </div>
                  
                  <div className="p-4 md:px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Submitted: {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                         <button 
                         disabled={processing === c._id}
                         onClick={() => handleStatusUpdate(c._id, 'rejected')} 
                         className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm text-sm disabled:opacity-50"
                         >
                           <XSquare className="w-4 h-4" /> Reject/Needs Changes
                         </button>
                         <button 
                         disabled={processing === c._id}
                         onClick={() => handleStatusUpdate(c._id, 'approved')} 
                         className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-sm disabled:opacity-50"
                         >
                           <CheckCircle2 className="w-5 h-5" /> Approve & Publish
                         </button>
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

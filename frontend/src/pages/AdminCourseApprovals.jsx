import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
  ClipboardCheck, Clock, CheckCircle2, 
  XSquare, PlayCircle, Users, AlertCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCourseApprovals() {
  const [courses, setCourses] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingCourses();
    fetchPendingEnrollments();
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

  const fetchPendingEnrollments = async () => {
    try {
      const { data } = await api.get('/admin/enrollments/pending');
      setPendingEnrollments(data.data);
    } catch (err) {
      console.error('Failed to fetch pending enrollments', err);
    }
  };

  const handleStatusUpdate = async (courseId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'approved' ? 'approve and publish' : 'reject'} this course?`)) return;
    
    setProcessing(courseId);
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Failed to update course status', err);
      alert('Failed to update course status');
    } finally {
      setProcessing(null);
    }
  };

  const handleEnrollmentStatusUpdate = async (userId, courseId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'reject'} this enrollment?`)) return;

    const key = `${userId}_${courseId}`;
    setProcessing(key);
    try {
      await api.put(`/admin/enrollments/${userId}/${courseId}/status`, { status: newStatus });
      setPendingEnrollments(pendingEnrollments.filter(en => !(en.userId === userId && en.courseId === courseId)));
    } catch (err) {
      console.error('Failed to update enrollment status', err);
      alert('Failed to update enrollment status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-6 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#E30A17]/10 opacity-30 pointer-events-none"></div>
        <div className="relative z-10 mb-4 sm:mb-0">
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Pending Course Approvals</h2>
          <p className="text-slate-300 mt-1 font-medium text-lg">Review courses and enrollments submitted by instructors and students.</p>
        </div>
        <div className="relative z-10 bg-[#FFD700]/10 text-[#FFD700] px-5 py-2.5 rounded-xl font-bold border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {courses.length} courses waiting
        </div>
      </div>
      
      {(courses.length === 0 && pendingEnrollments.length === 0) ? (
          <div className="p-16 text-center rounded-3xl border border-white/10 bg-[#0B0E14]/90 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#008A32]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-24 h-24 bg-white/5 text-slate-400 border border-white/10 rounded-full flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500 group-hover:border-[#008A32]/30 group-hover:text-[#008A32]">
              <ClipboardCheck className="w-12 h-12 text-[#008A32]" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">You're all caught up!</h3>
            <p className="text-slate-400 max-w-sm mb-8 text-lg">There are no pending course or enrollment approvals waiting for your review.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.length > 0 && (
              <div className="rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="font-bold text-white text-xl mb-6">Pending Course Approvals ({courses.length})</h3>
                <div className="grid gap-6">
                  <AnimatePresence>
                  {courses.map(c => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={c._id} 
                      className="rounded-2xl border border-white/10 bg-[#0B0E14] shadow-inner overflow-hidden flex flex-col md:flex-row group transition-all"
                    >
                      <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative bg-black/40">
                        <img 
                          src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-80 md:opacity-50"></div>
                        <div className="absolute top-4 left-4 bg-[#0B0E14]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-[#FFD700] uppercase tracking-wider shadow-sm border border-white/10">
                          {c.category}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 relative z-10 -mt-6 md:mt-0 bg-[#0B0E14]/90 md:bg-transparent rounded-t-3xl md:rounded-none">
                        <div className="p-6 md:p-8 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white leading-snug break-words mb-2 group-hover:text-[#FFD700] transition-colors">{c.title}</h3>
                              <p className="text-sm font-medium text-slate-400">Instructor: <span className="text-white">{c.instructor?.name || 'Unknown'}</span></p>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 shadow-sm">
                              <Clock className="w-4 h-4" /> Pending
                            </span>
                          </div>
                          <p className="text-slate-400 line-clamp-2 md:line-clamp-3 mb-0 text-base">{c.description}</p>
                        </div>
                        <div className="p-5 md:px-8 py-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Submitted: <span className="text-slate-300">{new Date(c.updatedAt).toLocaleDateString()}</span></span>
                          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <button 
                              disabled={processing === c._id}
                              onClick={() => handleStatusUpdate(c._id, 'rejected')} 
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 text-[#E30A17] font-bold rounded-xl border border-[#E30A17]/30 hover:bg-[#E30A17]/20 transition-colors shadow-sm text-sm disabled:opacity-50"
                            >
                              <XSquare className="w-4 h-4" /> Reject
                            </button>
                            <button 
                              disabled={processing === c._id}
                              onClick={() => handleStatusUpdate(c._id, 'approved')} 
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] transition-all shadow-sm text-sm disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-5 h-5" /> Approve & Publish
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {pendingEnrollments.length > 0 && (
              <div className="rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="font-bold text-white text-xl mb-6">Pending Enrollment Requests ({pendingEnrollments.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                  {pendingEnrollments.map(en => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={`${en.userId}_${en.courseId}`} 
                      className="rounded-2xl border border-white/10 bg-[#0B0E14] p-5 shadow-inner hover:border-indigo-500/30 transition-colors group"
                    >
                      <p className="font-bold text-white text-lg">
                        <span className="text-[#FFD700]">{en.userName}</span> requested to enroll in <span className="text-[#008A32]">"{en.courseTitle}"</span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-2 mb-6">Requested on: <span className="text-slate-300">{new Date(en.requestedAt).toLocaleDateString()}</span></p>
                      <div className="flex gap-3">
                        <button
                          disabled={processing === `${en.userId}_${en.courseId}`}
                          onClick={() => handleEnrollmentStatusUpdate(en.userId, en.courseId, 'rejected')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#E30A17]/30 bg-white/5 text-[#E30A17] font-bold hover:bg-[#E30A17]/20 transition-colors disabled:opacity-50 shadow-sm"
                        ><XSquare className="w-4 h-4"/> Reject</button>
                        <button
                          disabled={processing === `${en.userId}_${en.courseId}`}
                          onClick={() => handleEnrollmentStatusUpdate(en.userId, en.courseId, 'approved')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-bold hover:shadow-[0_0_15px_rgba(0,138,50,0.4)] transition-all disabled:opacity-50 shadow-sm"
                        ><CheckCircle2 className="w-4 h-4"/> Approve</button>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
      )}
    </motion.div>
  );
}

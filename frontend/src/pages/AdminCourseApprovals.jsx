import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
  ClipboardCheck, Clock, CheckCircle2, 
  XSquare, Users, AlertCircle, FileText, BadgeInfo, Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCourseApprovals() {
  const [courses, setCourses] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [activeEnrollments, setActiveEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'active'

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
         const { data: coursesData } = await api.get('/admin/courses/pending');
         setCourses(coursesData.data);
         const { data: enrollmentsData } = await api.get('/admin/enrollments/pending');
         setPendingEnrollments(enrollmentsData.data);
      } else {
         const { data: activeData } = await api.get('/admin/enrollments/active');
         setActiveEnrollments(activeData.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (courseId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'approved' ? 'approve and publish' : 'reject'} this course?`)) return;
    
    setProcessing(courseId);
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Failed to update course status', err);
      alert('Failed to update course status');
    } finally {
      setProcessing(null);
    }
  };

  const handleEnrollmentStatusUpdate = async (enrollmentId, newStatus, isRollback = false) => {
    const actionText = newStatus === 'approved' || newStatus === 'active' ? 'approve' : (isRollback ? 'revoke/rollback' : 'reject');
    if (!window.confirm(`Are you sure you want to ${actionText} this enrollment?`)) return;

    setProcessing(enrollmentId);
    try {
      await api.put(`/admin/enrollments/${enrollmentId}/status`, { status: newStatus === 'approved' ? 'active' : newStatus });
      
      if (activeTab === 'pending') {
        setPendingEnrollments(pendingEnrollments.filter(en => en.id !== enrollmentId));
      } else {
        setActiveEnrollments(activeEnrollments.filter(en => en.id !== enrollmentId));
      }
    } catch (err) {
      console.error('Failed to update enrollment status', err);
      alert('Failed to update enrollment status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading && courses.length === 0 && pendingEnrollments.length === 0 && activeEnrollments.length === 0) {
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
      className="max-w-7xl mx-auto space-y-6 pb-10 font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#E30A17]/10 opacity-30 pointer-events-none"></div>
        <div className="relative z-10 mb-4 sm:mb-0">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase tracking-widest">Approvals Management</h2>
          <p className="text-slate-300 mt-1 font-medium text-sm">Review courses and administer student enrollment placements.</p>
        </div>
        <div className="relative z-10 bg-[#11151F] flex rounded-xl border border-white/10 p-1 shadow-lg">
           <button 
             onClick={() => setActiveTab('pending')}
             className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-[#FFD700]/20 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'text-slate-300 hover:text-white'}`}
           >
             Pending Queue
           </button>
           <button 
             onClick={() => setActiveTab('active')}
             className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-[#008A32]/20 text-[#008A32] shadow-[0_0_15px_rgba(0,138,50,0.2)]' : 'text-slate-300 hover:text-white'}`}
           >
             Active Enrollments
           </button>
        </div>
      </div>
      
      {activeTab === 'pending' && (courses.length === 0 && pendingEnrollments.length === 0) ? (
          <div className="p-16 text-center rounded-3xl border border-white/10 bg-[#0B0E14]/90 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-[#11151F]/5 text-slate-200 border border-white/10 rounded-full flex items-center justify-center mb-6 relative group border border-[#008A32]/30 text-[#008A32]">
              <ClipboardCheck className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">Queue Clear</h3>
            <p className="text-slate-200 max-w-sm mb-8 text-sm font-medium">There are no pending course or enrollment approvals waiting for your review.</p>
          </div>
      ) : activeTab === 'pending' ? (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {courses.length > 0 && (
              <div className="rounded-3xl p-6 bg-[#11151F]/40 border border-white/5 backdrop-blur-xl shadow-2xl">
                <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-[#FFD700]"/> New Course Approvals ({courses.length})</h3>
                <div className="grid gap-6">
                  <AnimatePresence>
                  {courses.map(c => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={c.id} 
                      className="rounded-2xl border border-white/10 bg-[#0B0E14] shadow-inner overflow-hidden flex flex-col md:flex-row group transition-all"
                    >
                      <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative bg-black/40">
                        <img 
                          src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-80 md:opacity-50"></div>
                        <div className="absolute top-4 left-4 bg-[#0B0E14]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-black text-[#FFD700] uppercase tracking-wider shadow-sm border border-white/10">
                          {c.mainCategory || 'General'}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 relative z-10 -mt-6 md:mt-0 bg-[#0B0E14]/90 md:bg-transparent rounded-t-3xl md:rounded-none">
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-black text-white leading-snug break-words mb-2 uppercase tracking-wide">{c.title}</h3>
                          <div className="flex flex-wrap gap-4 mb-4 text-[10px] uppercase font-black tracking-widest text-slate-200">
                             <span className="flex items-center gap-1 border border-white/5 bg-[#11151F]/5 px-2 py-1 rounded">Instructor: <span className="text-white">{c.instructor?.name || 'Unknown'}</span></span>
                             <span className="flex items-center gap-1 border border-white/5 bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded">Status: Pending</span>
                          </div>
                          <p className="text-slate-200 line-clamp-2 md:line-clamp-3 mb-0 text-sm font-medium">{c.description}</p>
                        </div>
                        <div className="p-5 border-t border-white/5 bg-[#11151F]/50 flex flex-col sm:flex-row justify-between items-center gap-5">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Submitted: <span className="text-slate-300">{new Date(c.createdAt || c.updatedAt).toLocaleDateString()}</span></span>
                          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <button 
                              disabled={processing === c.id}
                              onClick={() => handleStatusUpdate(c.id, 'rejected')} 
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent text-[#E30A17] font-black text-xs uppercase tracking-widest rounded-xl border border-[#E30A17]/30 hover:bg-[#E30A17]/10 transition-colors shadow-sm disabled:opacity-50"
                            >
                              <XSquare className="w-4 h-4" /> Reject
                            </button>
                            <button 
                              disabled={processing === c.id}
                              onClick={() => handleStatusUpdate(c.id, 'approved')} 
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] transition-all shadow-md disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve & Publish
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
              <div className="rounded-3xl p-6 bg-[#11151F]/40 border border-white/5 backdrop-blur-xl shadow-2xl mt-4">
                <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-[#FFD700]"/> Enrollment Requests ({pendingEnrollments.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                  {pendingEnrollments.map(en => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={en.id} 
                      className="rounded-2xl border border-white/10 bg-[#0B0E14] p-5 flex flex-col justify-between hover:border-[#FFD700]/30 transition-colors group shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                           <h4 className="font-black text-white uppercase tracking-tight text-lg mb-1 break-words line-clamp-1 group-hover:text-[#FFD700] transition-colors">{en.courseTitle}</h4>
                           <span className="text-[9px] font-black uppercase text-slate-300 bg-[#11151F]/5 border border-white/10 px-2 py-0.5 rounded tracking-widest whitespace-nowrap">ID: {en.id.slice(0,6)}</span>
                        </div>
                        
                        <div className="bg-[#11151F] border border-white/5 p-3 rounded-xl mb-6 flex flex-col gap-1.5 mt-4">
                           <div className="flex items-center justify-between text-xs">
                             <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Student</span>
                             <span className="font-bold text-slate-300">{en.studentName || 'System Unknown'}</span>
                           </div>
                           <div className="flex items-center justify-between text-xs">
                             <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Email</span>
                             <span className="font-bold text-slate-200">{en.studentEmail || 'N/A'}</span>
                           </div>
                           <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5 mt-1.5">
                             <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Submitted On</span>
                             <span className="font-bold text-slate-200">{new Date(en.requestedAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10 mt-auto">
                        <button
                          disabled={processing === en.id}
                          onClick={() => handleEnrollmentStatusUpdate(en.id, 'rejected')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E30A17]/30 bg-transparent text-[#E30A17] text-xs font-black uppercase tracking-widest hover:bg-[#E30A17]/10 transition-colors disabled:opacity-50"
                        ><XSquare className="w-4 h-4"/> Reject</button>
                        <button
                          disabled={processing === en.id}
                          onClick={() => handleEnrollmentStatusUpdate(en.id, 'active')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] transition-all disabled:opacity-50"
                        ><CheckCircle2 className="w-4 h-4"/> Ensure Access</button>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
      ) : activeTab === 'active' && activeEnrollments.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-white/10 bg-[#0B0E14]/90 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-[#11151F]/5 text-slate-200 border border-white/10 rounded-full flex items-center justify-center mb-6 relative group border border-blue-500/30 text-blue-500">
              <BadgeInfo className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">No Active Enrollments</h3>
            <p className="text-slate-200 max-w-sm mb-8 text-sm font-medium">There are currently zero active students in the system.</p>
          </div>
      ) : (
          <div className="rounded-3xl p-6 bg-[#11151F]/40 border border-white/5 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#008A32]"/> Active Authorized Enrollments ({activeEnrollments.length})</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
              {activeEnrollments.map(en => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={en.id} 
                  className="rounded-2xl border border-[#008A32]/20 bg-[#0B0E14] p-5 flex flex-col justify-between hover:border-[#008A32]/50 transition-colors group shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#008A32]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#008A32]/10 transition-colors duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                       <h4 className="font-black text-white uppercase tracking-tight text-lg mb-1 break-words line-clamp-1">{en.courseTitle}</h4>
                       <span className="text-[9px] font-black uppercase text-[#008A32] bg-[#008A32]/10 border border-[#008A32]/30 px-2 py-0.5 rounded tracking-widest whitespace-nowrap">Active</span>
                    </div>
                    
                    <div className="bg-[#11151F] border border-white/5 p-3 rounded-xl mb-6 flex flex-col gap-1.5 mt-4">
                       <div className="flex items-center justify-between text-xs">
                         <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Student</span>
                         <span className="font-bold text-slate-300">{en.studentName || 'System Unknown'}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs">
                         <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Email</span>
                         <span className="font-bold text-slate-200">{en.studentEmail || 'N/A'}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5 mt-1.5">
                         <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Verified On</span>
                         <span className="font-bold text-slate-200">{new Date(en.requestedAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <button
                      disabled={processing === en.id}
                      onClick={() => handleEnrollmentStatusUpdate(en.id, 'rejected', true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-transparent text-slate-200 hover:text-[#E30A17] hover:border-[#E30A17]/30 text-[10px] font-black uppercase tracking-widest hover:bg-[#E30A17]/10 transition-all disabled:opacity-50"
                    ><Undo2 className="w-3.5 h-3.5"/> Revoke Access / Rollback</button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          </div>
      )}
    </motion.div>
  );
}


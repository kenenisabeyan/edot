import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, BookOpen, Award, ChevronRight, Clock, Activity, CalendarDays, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentLearners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState({}); // Stores active tab per learner ID

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const { data } = await api.get('/parent/learners');
        setLearners(data.data || []);
        
        // Initialize active tabs to 'overview'
        const initialTabs = {};
        (data.data || []).forEach(l => {
          initialTabs[l._id] = 'overview';
        });
        setActiveTab(initialTabs);
      } catch (err) {
        console.error('Failed to fetch learners data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, []);

  const setTab = (learnerId, tab) => {
    setActiveTab(prev => ({ ...prev, [learnerId]: tab }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
           <div className="absolute inset-2 rounded-full border-r-2 border-emerald-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>
      </div>
    );
  }

  if (learners.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-2xl mx-auto mt-12">
        <div className="w-24 h-24 bg-indigo-50/50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">No Learners Linked</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
          Your account is not currently linked to any student profiles. Please contact the school administrator to assign your child to your account.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10">
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">Learner Profiles</h1>
          <p className="text-indigo-200 text-lg max-w-xl">Deep dive into your assigned learners' academic portfolios, progress, and recent activity.</p>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        {learners.map((learner) => {
          const tab = activeTab[learner._id] || 'overview';
          const totalEnrollments = learner.enrolledCourses?.length || 0;
          const completedCourses = learner.enrolledCourses?.filter(c => c.passedFinalExam).length || 0;
          
          return (
            <motion.div variants={itemVariants} key={learner._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row hover:shadow-lg transition-shadow duration-300">
              
              {/* Sidebar Profile Panel */}
              <div className="xl:w-[340px] bg-slate-50 p-8 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col relative shrink-0">
                <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/5 rounded-tl-3xl"></div>
                
                <div className="flex flex-col items-center text-center relative z-10 mb-8 mt-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl mb-5 overflow-hidden ring-4 ring-indigo-50">
                    <img 
                      src={`http://localhost:5000/uploads/avatars/${learner.avatar || 'default-avatar.png'}`} 
                      alt={learner.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(learner.name) + '&background=ebf4ff&color=4338ca&size=200';
                      }}
                    />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{learner.name}</h2>
                  <p className="text-indigo-500 font-medium text-sm mt-1">{learner.email}</p>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex flex-col gap-2 mt-auto">
                   <button 
                     onClick={() => setTab(learner._id, 'overview')}
                     className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold transition-all ${tab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                   >
                     <BarChart2 className="w-5 h-5" /> Overview
                   </button>
                   <button 
                     onClick={() => setTab(learner._id, 'courses')}
                     className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-semibold transition-all ${tab === 'courses' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                   >
                     <div className="flex items-center gap-3"><BookOpen className="w-5 h-5" /> Enrolled Courses</div>
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${tab === 'courses' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{totalEnrollments}</span>
                   </button>
                   <button 
                     onClick={() => setTab(learner._id, 'activity')}
                     className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold transition-all ${tab === 'activity' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                   >
                     <Activity className="w-5 h-5" /> Activity Log
                   </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 xl:p-10 min-w-0 bg-white relative">
                 <AnimatePresence mode="wait">
                    
                    {/* TAB: OVERVIEW */}
                    {tab === 'overview' && (
                      <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 h-full flex flex-col">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-1">Academic Overview</h3>
                          <p className="text-slate-500 font-medium">Quick glance at current trajectory and totals.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -right-6 -top-6 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                                   <BookOpen className="w-32 h-32 transform -rotate-12" />
                                </div>
                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2 relative z-10">Total Enrolled</p>
                                <div className="flex items-baseline gap-2 relative z-10">
                                   <span className="text-5xl font-extrabold text-slate-900">{totalEnrollments}</span>
                                   <span className="text-slate-500 font-medium">courses</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -right-6 -top-6 text-emerald-100 group-hover:text-emerald-200 transition-colors">
                                   <Award className="w-32 h-32 transform -rotate-12" />
                                </div>
                                <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 relative z-10">Certifications</p>
                                <div className="flex items-baseline gap-2 relative z-10">
                                   <span className="text-5xl font-extrabold text-slate-900">{completedCourses}</span>
                                   <span className="text-slate-500 font-medium">completed</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-100 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                           <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
                           <h4 className="font-bold text-slate-700 text-lg mb-2">Detailed Analytics Locked</h4>
                           <p className="text-slate-500 max-w-sm">Deeper timeline analytics and predictive grading are available in the expanded premium parent tier coming soon.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: COURSES */}
                    {tab === 'courses' && (
                      <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-bold text-slate-800">Enrolled Courses</h3>
                        </div>
                        
                        {learner.enrolledCourses?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {learner.enrolledCourses.map((enrollment, idx) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                key={idx} 
                                className="group bg-white p-5 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                              >
                                <div className="flex items-start gap-4 mb-5">
                                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-sm relative group-hover:ring-2 ring-indigo-500 ring-offset-2 transition-all">
                                    <img 
                                      src={`http://localhost:5000${enrollment.course?.thumbnail || '/default.jpg'}`} 
                                      alt={enrollment.course?.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    {enrollment.passedFinalExam && (
                                       <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center">
                                          <CheckCircle className="w-6 h-6 text-emerald-500 bg-white rounded-full" />
                                       </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                      {enrollment.course?.title || 'Unknown Course'}
                                    </h4>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 line-clamp-1">
                                       <span className="w-2 h-2 rounded-full bg-slate-300"></span> {enrollment.course?.category || 'General'}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between items-end mb-2">
                                     <span className={`text-xs font-bold uppercase tracking-wider ${enrollment.progress === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
                                       {enrollment.progress === 100 ? 'Certified' : 'Progress'}
                                     </span>
                                     <span className="text-2xl font-extrabold text-slate-800 tabular-nums tracking-tight">
                                        {enrollment.progress || 0}<span className="text-sm text-slate-400 font-semibold">%</span>
                                     </span>
                                  </div>
                                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${enrollment.progress || 0}%` }}
                                      transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                      className={`h-full rounded-full ${enrollment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-64 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                             <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                             <p className="text-slate-500 font-medium text-lg">No courses enrolled yet.</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* TAB: ACTIVITY */}
                    {tab === 'activity' && (
                      <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-bold text-slate-800">Recent Activity</h3>
                        </div>
                        <div className="relative pl-4 border-l-2 border-indigo-100 space-y-8 py-2">
                           {/* Mocking activity timeline based on enrollments and progress */}
                           {learner.enrolledCourses?.length > 0 ? learner.enrolledCourses.map((enrollment, idx) => (
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="relative">
                                 <div className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${enrollment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm ml-4">
                                    <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-slate-800">
                                         {enrollment.progress === 100 ? 'Completed a Course' : 'Started a Course'}
                                       </h4>
                                       <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                       </span>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                      {learner.name.split(' ')[0]} {enrollment.progress === 100 ? 'successfully finished and earned a certificate for' : 'began their journey in'} <strong className="text-indigo-600">{enrollment.course?.title}</strong>.
                                    </p>
                                 </div>
                              </motion.div>
                           )) : (
                              <p className="text-slate-500 italic ml-4">No recent activity found.</p>
                           )}
                           
                           {/* Mock generic login activity */}
                           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="relative">
                                 <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white"></div>
                                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 ml-4 opacity-70 cursor-not-allowed">
                                    <h4 className="font-bold text-slate-600 text-sm">Account Created</h4>
                                    <p className="text-slate-500 text-xs mt-1">Learner profile was initialized.</p>
                                 </div>
                           </motion.div>
                        </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
              
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

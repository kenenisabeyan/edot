import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, BookOpen, Award, ChevronRight, Clock, Activity, CalendarDays, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentLearners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState({}); // Stores active tab per learner ID
  void motion;

  const [connectEmail, setConnectEmail] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');

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

  useEffect(() => {
    fetchLearners();
  }, []);

  const handleConnectLearner = async () => {
    if (!connectEmail) return;
    try {
      setConnecting(true);
      setConnectMsg('');
      const res = await api.post('/users/connect', { email: connectEmail });
      if (res.data.success) {
        setConnectMsg('Learner connected successfully!');
        setConnectEmail('');
        await fetchLearners();
        setTimeout(() => setConnectMsg(''), 3000);
      } else {
        setConnectMsg(res.data.message || 'Failed to connect.');
        setTimeout(() => setConnectMsg(''), 3000);
      }
    } catch (err) {
      setConnectMsg(err.response?.data?.message || 'Error connecting.');
      setTimeout(() => setConnectMsg(''), 3000);
    } finally {
      setConnecting(false);
    }
  };

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
      <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#0B0E14]">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 rounded-full border-t-2 border-[#FFD700] animate-spin"></div>
           <div className="absolute inset-2 rounded-full border-r-2 border-[#008A32] animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>
      </div>
    );
  }

  if (learners.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl border border-white/10 max-w-2xl mx-auto mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FFD700]/5 opacity-20 pointer-events-none blur-3xl"></div>
        <div className="w-24 h-24 bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-display font-black text-white mb-3 tracking-tight relative z-10">No Learners Linked</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed mb-8 relative z-10 font-medium">
          Your account is not currently linked to any student profiles. Please enter your child's email address below to connect.
        </p>
        
        <div className="max-w-md mx-auto mb-4 relative z-10 text-left">
          <input 
            type="email"
            value={connectEmail}
            onChange={(e) => setConnectEmail(e.target.value)}
            placeholder="Student's registered email"
            className="w-full pl-5 pr-32 py-4 bg-[#11151F] border border-white/10 text-white placeholder-slate-500 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-shadow shadow-inner"
          />
          <button 
            onClick={handleConnectLearner}
            disabled={connecting || !connectEmail}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] font-black uppercase tracking-widest text-xs px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {connecting ? 'Linking...' : 'Connect'}
          </button>
        </div>
        {connectMsg && (
          <p className={`text-sm font-bold uppercase tracking-widest relative z-10 max-w-md mx-auto ${(connectMsg.includes('Failed') || connectMsg.includes('Error') || connectMsg.includes('not found') || connectMsg.includes('Only') || connectMsg.includes('Already')) ? 'text-[#E30A17]' : 'text-[#008A32]'}`}>
            {connectMsg}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 min-h-screen">
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#008A32]/10 via-transparent to-[#FFD700]/10 opacity-30 pointer-events-none"></div>
        <div className="relative z-10 lg:flex lg:justify-between lg:items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-black mb-3 text-white drop-shadow-md">Learner Profiles</h1>
            <p className="text-slate-300 font-medium text-lg max-w-xl">Deep dive into your assigned learners' academic portfolios, progress, and recent activity.</p>
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-6 max-w-sm w-full relative group">
            <input 
              type="email"
              value={connectEmail}
              onChange={(e) => setConnectEmail(e.target.value)}
              placeholder="Connect another learner email..."
              className="w-full pl-5 pr-28 py-3.5 bg-black/40 border border-white/10 text-white placeholder-slate-500 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#FFD700] transition-all shadow-inner backdrop-blur-md"
            />
            <button 
              onClick={handleConnectLearner}
              disabled={connecting || !connectEmail}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#008A32] to-[#006622] text-white text-xs font-black uppercase tracking-widest px-4 rounded-xl shadow-[0_0_15px_rgba(0,138,50,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {connecting ? '...' : 'Add'}
            </button>
            {connectMsg && (
              <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl z-50 border ${connectMsg.includes('successfully') ? 'bg-[#008A32]/90 border-[#008A32] text-white backdrop-blur-md' : 'bg-[#E30A17]/90 border-[#E30A17] text-white backdrop-blur-md'}`}>
                {connectMsg}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        {learners.map((learner) => {
          const tab = activeTab[learner._id] || 'overview';
          const totalEnrollments = learner.enrolledCourses?.length || 0;
          const completedCourses = learner.enrolledCourses?.filter(c => c.passedFinalExam).length || 0;
          
          return (
            <motion.div variants={itemVariants} key={learner._id} className="bg-[#0B0E14]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col xl:flex-row hover:border-white/20 transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFD700]/5 rounded-br-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

              {/* Sidebar Profile Panel */}
              <div className="xl:w-[340px] bg-[#11151F]/80 backdrop-blur-md p-8 border-b xl:border-b-0 xl:border-r border-white/5 flex flex-col relative shrink-0">
                <div className="flex flex-col items-center text-center relative z-10 mb-8 mt-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full bg-white/5 border-2 border-white/10 shadow-2xl mb-5 overflow-hidden ring-4 ring-black/40">
                    <img 
                      src={`http://localhost:5000/uploads/avatars/${learner.avatar || 'default-avatar.png'}`} 
                      alt={learner.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(learner.name) + '&background=11151F&color=FFD700&size=200';
                      }}
                    />
                  </motion.div>
                  <h2 className="text-2xl font-display font-black text-white tracking-tight">{learner.name}</h2>
                  <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest mt-2">{learner.email}</p>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex flex-col gap-3 mt-auto relative z-10">
                   <button 
                     onClick={() => setTab(learner._id, 'overview')}
                     className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'overview' ? 'bg-[#FFD700] text-[#0f172a] shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'}`}
                   >
                     <BarChart2 className="w-4 h-4" /> Overview
                   </button>
                   <button 
                     onClick={() => setTab(learner._id, 'courses')}
                     className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'courses' ? 'bg-[#FFD700] text-[#0f172a] shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'}`}
                   >
                     <div className="flex items-center gap-3"><BookOpen className="w-4 h-4" /> Enrolled</div>
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${tab === 'courses' ? 'bg-[#0f172a]/20 text-[#0f172a]' : 'bg-white/10 text-white'}`}>{totalEnrollments}</span>
                   </button>
                   <button 
                     onClick={() => setTab(learner._id, 'activity')}
                     className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'activity' ? 'bg-[#FFD700] text-[#0f172a] shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'}`}
                   >
                     <Activity className="w-4 h-4" /> Activity Log
                   </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 xl:p-10 min-w-0 bg-transparent relative">
                 <AnimatePresence mode="wait">
                    
                    {/* TAB: OVERVIEW */}
                    {tab === 'overview' && (
                      <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 h-full flex flex-col">
                        <div>
                          <h3 className="text-2xl font-display font-black text-white mb-2">Academic Overview</h3>
                          <p className="text-slate-400 font-medium text-sm">Quick glance at current trajectory and totals.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-[#FFD700]/20 rounded-3xl p-8 relative overflow-hidden group hover:border-[#FFD700]/50 transition-colors shadow-xl">
                                <div className="absolute -right-6 -top-6 text-[#FFD700]/10 group-hover:text-[#FFD700]/20 transition-colors duration-500">
                                   <BookOpen className="w-36 h-36 transform -rotate-12 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-[#FFD700] font-black uppercase tracking-widest text-[10px] mb-3 relative z-10 bg-[#FFD700]/10 inline-block px-3 py-1 rounded-md border border-[#FFD700]/20">Total Enrolled</p>
                                <div className="flex items-baseline gap-2 relative z-10">
                                   <span className="text-6xl font-display font-black text-white drop-shadow-md">{totalEnrollments}</span>
                                   <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">courses</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-[#008A32]/20 rounded-3xl p-8 relative overflow-hidden group hover:border-[#008A32]/50 transition-colors shadow-xl">
                                <div className="absolute -right-6 -top-6 text-[#008A32]/10 group-hover:text-[#008A32]/20 transition-colors duration-500">
                                   <Award className="w-36 h-36 transform -rotate-12 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-[#008A32] font-black uppercase tracking-widest text-[10px] mb-3 relative z-10 bg-[#008A32]/10 inline-block px-3 py-1 rounded-md border border-[#008A32]/20">Certifications</p>
                                <div className="flex items-baseline gap-2 relative z-10">
                                   <span className="text-6xl font-display font-black text-white drop-shadow-md">{completedCourses}</span>
                                   <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">completed</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                           <CalendarDays className="w-12 h-12 text-slate-500 mb-4 group-hover:scale-110 transition-transform" />
                           <h4 className="font-bold text-white text-lg mb-2">Detailed Analytics Locked</h4>
                           <p className="text-slate-400 max-w-sm text-sm">Deeper timeline analytics and predictive grading are available in the expanded premium parent tier coming soon.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: COURSES */}
                    {tab === 'courses' && (
                      <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-display font-black text-white">Enrolled Courses</h3>
                        </div>
                        
                        {learner.enrolledCourses?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {learner.enrolledCourses.map((enrollment, idx) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                key={idx} 
                                className="group bg-[#11151F] border border-white/10 p-6 rounded-3xl hover:border-[#FFD700]/30 hover:shadow-[0_10px_30px_rgba(255,215,0,0.05)] transition-all duration-300 relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors"></div>
                                <div className="flex items-start gap-5 mb-6 relative z-10">
                                  <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden shrink-0 shadow-lg relative group-hover:ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#11151F] transition-all">
                                    <img 
                                      src={`http://localhost:5000${enrollment.course?.thumbnail || '/default.jpg'}`} 
                                      alt={enrollment.course?.title}
                                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80'; }}
                                    />
                                    {enrollment.passedFinalExam && (
                                       <div className="absolute inset-0 bg-[#008A32]/50 backdrop-blur-sm flex items-center justify-center">
                                          <CheckCircle className="w-6 h-6 text-white" />
                                       </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-lg leading-tight mb-2 truncate group-hover:text-[#FFD700] transition-colors">
                                      {enrollment.course?.title || 'Unknown Course'}
                                    </h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] flex items-center gap-2 line-clamp-1 bg-[#FFD700]/10 border border-[#FFD700]/20 px-2 py-1 rounded-md w-fit">
                                       {enrollment.course?.category || 'General'}
                                    </p>
                                  </div>
                                </div>

                                <div className="relative z-10">
                                  <div className="flex justify-between items-end mb-3">
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${enrollment.progress === 100 ? 'text-[#008A32]' : 'text-slate-400'}`}>
                                       {enrollment.progress === 100 ? 'Certified' : 'Progress Status'}
                                     </span>
                                     <span className="text-2xl font-display font-black text-white tabular-nums tracking-tight">
                                        {enrollment.progress || 0}<span className="text-sm text-slate-500 ml-1">%</span>
                                     </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-black rounded-full overflow-hidden shadow-inner border border-white/5">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${enrollment.progress || 0}%` }}
                                      transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                      className={`h-full rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)] ${enrollment.progress === 100 ? 'bg-gradient-to-r from-[#008A32] to-[#00b341]' : 'bg-gradient-to-r from-[#FFD700] to-[#EAB308]'}`}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-64 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5">
                             <BookOpen className="w-12 h-12 text-slate-500 mb-4" />
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No courses enrolled yet.</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* TAB: ACTIVITY */}
                    {tab === 'activity' && (
                      <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-display font-black text-white">Recent Activity</h3>
                        </div>
                        <div className="relative pl-6 border-l border-white/20 space-y-10 py-2">
                           {/* Mocking activity timeline based on enrollments and progress */}
                           {learner.enrolledCourses?.length > 0 ? learner.enrolledCourses.map((enrollment, idx) => (
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="relative">
                                 <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-[#11151F] ${enrollment.progress === 100 ? 'bg-[#008A32] shadow-[0_0_10px_rgba(0,138,50,0.6)]' : 'bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.6)]'}`}></div>
                                 <div className="bg-[#11151F] p-6 rounded-2xl border border-white/10 shadow-lg ml-6 hover:border-white/20 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                                       <h4 className="font-bold text-white text-lg leading-tight">
                                         {enrollment.progress === 100 ? 'Completed a Course' : 'Started a Course'}
                                       </h4>
                                       <span className="text-[10px] font-black text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md uppercase tracking-widest whitespace-nowrap">
                                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                       </span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                      {learner.name.split(' ')[0]} {enrollment.progress === 100 ? 'successfully finished and earned a certificate for' : 'began their journey in'} <strong className="text-[#FFD700]">{enrollment.course?.title}</strong>.
                                    </p>
                                 </div>
                              </motion.div>
                           )) : (
                              <p className="text-slate-500 italic ml-6 font-medium">No recent activity found.</p>
                           )}
                           
                           {/* Mock generic login activity */}
                           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="relative">
                                 <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-600 ring-4 ring-[#11151F]"></div>
                                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 ml-6 opacity-70">
                                    <h4 className="font-bold text-slate-300 text-base mb-1">Account Created</h4>
                                    <p className="text-slate-500 text-sm">Learner profile was initialized.</p>
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

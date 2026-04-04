import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, Layers, Radio, PlusCircle, Edit3, Settings, LogOut, 
  FolderOpen, LayoutDashboard, Clock, CheckCircle2, 
  AlertCircle, XSquare, PlayCircle, Send
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import edotLogo from '../assets/edot-logo.jpg';
import ActivityFeed from '../components/ActivityFeed';
import CustomDropdown from '../components/CustomDropdown';

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Programming', duration: 1, thumbnail: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  
  // Lesson state
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lessonData, setLessonData] = useState({ title: '', description: '', videoUrl: '', duration: 10 });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/instructor/dashboard');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await api.get('/instructor/analytics/detailed');
      setAnalytics(data.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await api.get('/instructor/courses');
      setCourses(data.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        await Promise.all([fetchCourses(), fetchStats(), fetchAnalytics()]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses, fetchStats, fetchAnalytics]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // Basic fallback thumbnail if empty
      const submissionData = { ...formData };
      if (!submissionData.thumbnail) {
        submissionData.thumbnail = 'default-course.jpg';
      }
      
      await api.post('/instructor/courses', submissionData);
      setFormData({ title: '', description: '', category: 'Programming', duration: 1, thumbnail: '' });
      fetchCourses();
      setActiveTab('courses'); // Redirect to courses list after creation
    } catch (err) {
      console.error('Failed to create course', err);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!activeCourseId) return;
    
    try {
      await api.post(`/instructor/courses/${activeCourseId}/lessons`, lessonData);
      setLessonData({ title: '', description: '', videoUrl: '', duration: 10 });
      setActiveCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error('Failed to add lesson', err);
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  void stats;
  const totalStudents = courses.reduce((acc, course) => acc + (course.totalStudents || 0), 0);
  const activeCourses = courses.filter(c => c.status === 'approved').length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': {
        const revenueData = analytics?.revenueData || [];
        const engagementData = analytics?.engagementData || [];

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-6">Instructor Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-2">Total Students</p>
                    <h3 className="text-4xl font-black text-white">{totalStudents}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#FFD700] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#008A32] rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#008A32] mb-2">Active Courses</p>
                    <h3 className="text-4xl font-black text-white">{activeCourses}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#008A32] rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">Total Creations</p>
                    <h3 className="text-4xl font-black text-white">{courses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6">Earnings (Last 6 Months)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} tickFormatter={(value) => `$${value}`} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }}
                        formatter={(value) => [`$${value}`, 'Earnings']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={3} dot={{r: 4, fill: '#FFD700', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6">Student Engagement</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }}
                        cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                      />
                      <Bar dataKey="students" fill="#008A32" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-white/10 shadow-2xl">
               <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">Quick Actions</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <button 
                  onClick={() => navigate('/instructor/builder')} 
                  className="flex items-center gap-4 p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-[#FFD700]/50 hover:bg-white/5 transition-all text-left group shadow-sm"
                 >
                   <div className="w-12 h-12 rounded-xl bg-white/5 text-[#FFD700] border border-[#FFD700]/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all">
                     <PlusCircle className="w-6 h-6" />
                   </div>
                   <div>
                     <span className="block font-bold text-white text-lg">Create New Course</span>
                     <span className="text-xs text-slate-400 uppercase tracking-widest font-black mt-1 block">Start building curriculum</span>
                   </div>
                 </button>
                 <button 
                  onClick={() => setActiveTab('courses')} 
                  className="flex items-center gap-4 p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-[#008A32]/50 hover:bg-white/5 transition-all text-left group shadow-sm"
                 >
                   <div className="w-12 h-12 rounded-xl bg-white/5 text-[#008A32] border border-[#008A32]/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,138,50,0.3)] transition-all">
                     <Edit3 className="w-6 h-6" />
                   </div>
                   <div>
                     <span className="block font-bold text-white text-lg">Manage Courses</span>
                     <span className="text-xs text-slate-400 uppercase tracking-widest font-black mt-1 block">Edit content framework</span>
                   </div>
                 </button>
               </div>
            </div>

            <div className="mt-8 bg-[#0B0E14]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
               <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Recent Activity</h3>
               <ActivityFeed isAdmin={false} limit={5} />
            </div>
          </div>
        );
      }
      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">My Courses</h2>
              <button 
                onClick={() => navigate('/instructor/builder')} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-[11px] rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              >
                <PlusCircle className="w-4 h-4" /> Create Course
              </button>
            </div>
            
            {courses.length === 0 ? (
               <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-12 text-center rounded-2xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-4">
                   <FolderOpen className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No courses created</h3>
                 <p className="text-slate-400 max-w-sm mb-6">Share your knowledge with the world by creating your first complete course.</p>
                 <button 
                  onClick={() => navigate('/instructor/builder')} 
                  className="px-8 py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                 >
                   Start Creating
                 </button>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {courses.map(c => (
                    <div key={c._id} className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row group transition-all hover:border-[#FFD700]/30 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-bl-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform"></div>
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-[#11151F]">
                         <img 
                          src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                         <div className="absolute top-3 left-3 bg-[#0B0E14]/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-[9px] font-black text-[#FFD700] uppercase tracking-widest border border-white/10">
                           {c.category}
                         </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 relative z-10">
                        <div className="p-6 md:p-8 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white leading-snug">{c.title}</h3>
                            <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                              c.status === 'approved' ? 'bg-[#008A32]/20 text-[#008A32] border-[#008A32]/30' : 
                              (c.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 
                              (c.status === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 
                              'bg-white/5 text-slate-400 border-white/10'))
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FFD700]" /> {c.duration} hours</span>
                            <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5 text-[#008A32]" /> {c.lessons?.length || 0} lessons</span>
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-500" /> {c.totalStudents || 0} students</span>
                          </p>
                          
                          <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-3 mb-0 font-medium">{c.description}</p>
                        </div>
                        
                        <div className="p-4 md:px-8 border-t border-white/10 bg-[#11151F]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                             Updated: {new Date(c.updatedAt).toLocaleDateString()}
                           </span>
                           
                           <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                             {(c.status === 'draft' || c.status === 'rejected') && (
                               <>
                                 <button 
                                  onClick={() => navigate('/instructor/builder/' + c._id)} 
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-colors"
                                 >
                                   <PlusCircle className="w-4 h-4" /> Add Lesson
                                 </button>
                                 <button 
                                  onClick={() => handleSubmitReview(c._id)} 
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-bold uppercase tracking-widest text-[10px] rounded-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
                                 >
                                   <Send className="w-4 h-4" /> Submit for Review
                                 </button>
                               </>
                             )}
                             {c.status === 'approved' && (
                                 <span className="inline-flex items-center gap-2 text-[#008A32] text-[10px] font-black uppercase tracking-widest bg-[#008A32]/10 px-4 py-2 rounded-lg border border-[#008A32]/20">
                                   <CheckCircle2 className="w-4 h-4" /> Live for Students
                                 </span>
                             )}
                             {c.status === 'pending' && (
                                 <span className="inline-flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
                                   <Clock className="w-4 h-4" /> Pending Admin Review
                                 </span>
                             )}
                             {c.status === 'rejected' && (
                                 <span className="inline-flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 sm:ml-2">
                                   <XSquare className="w-4 h-4" /> Changes Required
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
      case 'create':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-6">Create Curriculum</h2>
            <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleCreateCourse} className="space-y-6 relative z-10">
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Subject Matter Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    className="w-full px-6 py-4 bg-[#11151F] text-white font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all placeholder:text-slate-600" 
                    placeholder="E.g., Advanced JavaScript Patterns" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Detailed Framework <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                    className="w-full px-6 py-4 bg-[#11151F] text-white font-medium border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all resize-y placeholder:text-slate-600" 
                    rows="5" 
                    placeholder="Provide a comprehensive operational framework for this module."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Primary Domain</label>
                    <CustomDropdown
                      value={formData.category}
                      onChange={(val) => setFormData({...formData, category: val})}
                      options={[
                        { label: 'Programming', value: 'Programming' },
                        { label: 'Mathematics', value: 'Mathematics' },
                        { label: 'Science', value: 'Science' },
                        { label: 'Exam Prep', value: 'Exam Prep' },
                        { label: 'Business', value: 'Business' },
                        { label: 'Design', value: 'Design' }
                      ]}
                      className="w-full bg-[#11151F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Time to Mastery (Hours) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1" 
                      value={formData.duration} 
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})} 
                      required 
                      className="w-full px-6 py-4 bg-[#11151F] text-white font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Visual Asset Node (URL)</label>
                  <input 
                    type="url" 
                    value={formData.thumbnail} 
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                    className="w-full px-6 py-4 bg-[#11151F] text-white font-medium border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all placeholder:text-slate-600" 
                    placeholder="https://content-node.cloud/thumbnail.jpg" 
                  />
                  <p className="mt-2 text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-[#FFD700]" /> Will fallback to system default if empty.
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-end">
                   <button 
                    type="button" 
                    onClick={() => setActiveTab('courses')} 
                    className="px-8 py-3.5 bg-transparent text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-all order-2 sm:order-1"
                   >
                     Abort Setup
                   </button>
                   <button 
                    type="submit" 
                    className="px-8 py-3.5 bg-[#FFD700] text-[#0B0E14] font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-yellow-400 hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)] order-1 sm:order-2"
                   >
                     Initialize Protocol
                   </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-6">Instructor Profile</h2>
            <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-white/10 text-center sm:text-left">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFD700] to-yellow-600 text-[#0B0E14] flex items-center justify-center text-4xl font-black uppercase shrink-0 border border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  {user?.name?.charAt(0) || <Users className="w-10 h-10" />}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-black text-white mb-1">{user?.name}</h3>
                  <p className="text-slate-400 font-bold mb-4">{user?.email}</p>
                  <span className="inline-block px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-black rounded-lg uppercase tracking-widest border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                    {user?.role} Authority
                  </span>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Public Designation</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name} 
                    disabled 
                    className="w-full px-6 py-4 rounded-xl border border-white/10 bg-[#11151F] text-white font-bold opacity-70 cursor-not-allowed" 
                  />
                  <p className="mt-2 text-xs font-bold text-slate-500">Contact admin node to reassign your designation.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Communication Link</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email} 
                    disabled 
                    className="w-full px-6 py-4 rounded-xl border border-white/10 bg-[#11151F] text-white font-bold opacity-70 cursor-not-allowed" 
                  />
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItemClass = (tabName) => `
    w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 font-bold uppercase tracking-widest text-[11px] text-left border
    ${activeTab === tabName 
      ? 'bg-white/10 text-white border-white/20 shadow-md' 
      : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5 hover:text-white'
    }
  `;

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col md:flex-row font-sans text-slate-300">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-80 bg-[#11151F] text-white shrink-0 flex flex-col md:h-screen border-r border-white/10 sticky top-0">
        <div className="p-8 border-b border-white/10">
           <div className="flex items-center gap-2 mb-8 w-full">
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto rounded-lg shadow-sm" />
           </div>
           
           <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
             <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-yellow-600 text-[#0B0E14] rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-[#FFD700] font-black text-xl uppercase">
               {user?.name?.charAt(0) || 'I'}
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-lg text-white leading-tight truncate">{user?.name}</h3>
               <p className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest mt-0.5">{user?.role}</p>
             </div>
           </div>

           <nav className="space-y-3">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <LayoutDashboard className="w-5 h-5 shrink-0" /> Systems Overview
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <Layers className="w-5 h-5 shrink-0" /> Control Matrix
             </button>
             <button onClick={() => navigate('/instructor/builder')} className={navItemClass('create')}>
               <PlusCircle className="w-5 h-5 shrink-0" /> Generate Construct
             </button>
             <button onClick={() => setActiveTab('settings')} className={navItemClass('settings')}>
               <Settings className="w-5 h-5 shrink-0" /> Authority Core
             </button>
           </nav>
        </div>
        
        <div className="p-8 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-slate-400 hover:bg-[#E30A17]/10 hover:text-[#E30A17] hover:border-[#E30A17]/20 border border-transparent transition-all font-black uppercase tracking-widest text-[11px]"
          >
            <LogOut className="w-5 h-5 shrink-0" /> Terminate Link
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-6xl mx-auto relative">
          {renderContent()}
        </div>
      </main>

      {/* Add Lesson Modal Overlays */}
      {activeCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-[#0B0E14]/80 backdrop-blur-md" onClick={() => setActiveCourseId(null)}></div>
          
          <div className="bg-[#11151F] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 border-b border-white/10">
              <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-[#FFD700]" />
                Compile Module Entry
              </h2>
              <button 
                onClick={() => setActiveCourseId(null)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddLesson} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Module Designation <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={lessonData.title} 
                  onChange={e => setLessonData({...lessonData, title: e.target.value})} 
                  required 
                  className="w-full px-6 py-4 bg-[#0B0E14] text-white font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] outline-none transition-all placeholder:text-slate-600" 
                  placeholder="E.g., Quantum Algorithm Analysis" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Execution Protocol <span className="text-red-500">*</span></label>
                <textarea 
                  value={lessonData.description} 
                  onChange={e => setLessonData({...lessonData, description: e.target.value})} 
                  required 
                  className="w-full px-6 py-4 bg-[#0B0E14] text-white font-medium border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] outline-none transition-all resize-none placeholder:text-slate-600" 
                  rows="3" 
                  placeholder="Define operational expectations for this sector."
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Media Origin Vector <span className="text-red-500">*</span></label>
                  <input 
                    type="url" 
                    value={lessonData.videoUrl} 
                    onChange={e => setLessonData({...lessonData, videoUrl: e.target.value})} 
                    required 
                    className="w-full px-6 py-4 bg-[#0B0E14] text-white font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] outline-none transition-all placeholder:text-slate-600" 
                    placeholder="WSS:// or HTTP://" 
                  />
                </div>
                <div className="w-full sm:w-32 shrink-0">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">Cycle (m) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    min="1" 
                    value={lessonData.duration} 
                    onChange={e => setLessonData({...lessonData, duration: Number(e.target.value)})} 
                    required 
                    className="w-full px-6 py-4 bg-[#0B0E14] text-white font-black border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] outline-none transition-all text-center" 
                  />
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setActiveCourseId(null)}
                  className="flex-1 py-4 px-6 bg-transparent text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition-all shadow-sm"
                >
                  Terminate
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 px-6 bg-[#FFD700] text-[#0B0E14] font-black uppercase tracking-widest text-[11px] rounded-xl border border-[#FFD700] hover:bg-yellow-400 hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                >
                  Compile Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

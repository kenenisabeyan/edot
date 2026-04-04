import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BookOpen, CheckCircle2, Award, Search, LayoutDashboard, 
  Settings, LogOut, PlayCircle, Clock, Download, Target, Plus
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import edotLogo from '../assets/edot-logo.jpg';
import ProfileView from './ProfileView';
import ActivityFeed from '../components/ActivityFeed';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [growthNote, setGrowthNote] = useState('');
  const [privateLogs, setPrivateLogs] = useState([]);
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/student/enrollments');
        setEnrolledCourses(data.data || []);
      } catch (err) {
        console.error('Failed to fetch enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const fetchPrivateLogs = async () => {
    try {
      const { data } = await api.get('/activity');
      const filtered = data.data.filter(log => log.visibility === 'private');
      setPrivateLogs(filtered);
    } catch(err) { console.error('Failed to fetch private logs', err); }
  };

  const fetchAchievements = async () => {
    try {
      const { data } = await api.get('/achievements/me');
      setAchievements(data.data);
    } catch(err) { console.error('Failed to fetch achievements', err); }
  };

  useEffect(() => {
    if (activeTab === 'growth') {
       fetchPrivateLogs();
       fetchAchievements();
    }
  }, [activeTab]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!growthNote.trim()) return;
    try {
      await api.post('/activity', {
        action: 'Set a new personal micro-goal',
        type: 'learning',
        visibility: 'private',
        metadata: { goal: growthNote }
      });
      setGrowthNote('');
      fetchPrivateLogs();
    } catch(err) { console.error('Failed to log personal goal', err); }
  };

  const totalLessonsCompleted = enrolledCourses.reduce((total, course) => total + (course.completedLessons?.length || 0), 0);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDownloadCertificate = async (courseName) => {
    const img = new Image();
    img.src = '/edot-logo.png';
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve; // Continue even if logo fails
    });

    const doc = new jsPDF('landscape');
    const dateCompleted = new Date().toLocaleDateString();
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    try {
      doc.addImage(img, 'PNG', 133.5, 20, 30, 25);
    } catch {
      // ignore if image fails to load
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(40);
    doc.text('Certificate of Completion', 148.5, 60, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is proudly presented to', 148.5, 90, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(user?.name || 'Amazing Student', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text('For successfully completing the course:', 148.5, 130, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(courseName || 'Course', 148.5, 150, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${dateCompleted}`, 148.5, 180, { align: 'center' });
    
    doc.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

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
        const weeklyStats = [
          { name: 'Mon', minutes: 45 },
          { name: 'Tue', minutes: 0 },
          { name: 'Wed', minutes: 60 },
          { name: 'Thu', minutes: 120 },
          { name: 'Fri', minutes: 30 },
          { name: 'Sat', minutes: 90 },
          { name: 'Sun', minutes: 15 },
        ];

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#FFD700] mb-2">Courses Enrolled</p>
                    <h3 className="text-4xl font-black text-white">{enrolledCourses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#FFD700] rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#008A32] rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#008A32] mb-2">Lessons Completed</p>
                    <h3 className="text-4xl font-black text-white">{totalLessonsCompleted}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#008A32] rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-bl-full opacity-5 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2">Certificates Earned</p>
                    <h3 className="text-4xl font-black text-white">{completedCourses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-purple-400 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl mb-10">
              <h3 className="text-xl font-bold text-white mb-6">Weekly Learning Activity</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                    <RechartsTooltip 
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }}
                      formatter={(value) => [`${value} mins`, 'Time Spent']}
                    />
                    <Bar dataKey="minutes" fill="#008A32" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-widest text-white">Pick Up Where You Left Off</h3>
            </div>
            
            {enrolledCourses.length === 0 ? (
               <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-10 text-center rounded-2xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center">
                 <div className="w-16 h-16 bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-4">
                   <BookOpen className="w-8 h-8" />
                 </div>
                 <p className="text-slate-400 font-bold tracking-wide mb-6">You aren't enrolled in any courses yet to track progress.</p>
                 <Link to="/courses" className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)] inline-flex items-center gap-2">
                   <Search className="w-4 h-4" /> Browse Catalog
                 </Link>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.slice(0, 3).map((enrolled) => (
                    <div key={enrolled._id || enrolled.course?._id} className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl hover:border-[#FFD700]/50 transition-all group flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-bl-full opacity-5 pointer-events-none"></div>
                      <div className="flex-1 relative z-10">
                        <div className="w-12 h-12 bg-white/5 text-[#FFD700] rounded-xl border border-[#FFD700]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-white mb-6 line-clamp-2 leading-snug text-lg">{enrolled.course?.title || 'Unknown Course'}</h4>
                        
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                          <span>Progress</span>
                          <span className="text-[#FFD700]">{enrolled.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-[#11151F] rounded-full mb-8 overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                            style={{ width: `${enrolled.progress || 0}%` }}
                          >
                           <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-[progress_2s_ease-in-out_infinite]"></div>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/course/${enrolled.course?._id}`} 
                        className="w-full inline-flex justify-center items-center px-4 py-3 bg-white/5 text-white font-bold uppercase tracking-widest text-xs rounded-xl border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-colors relative z-10"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ))}
                </div>
            )}

            <div className="mt-10 bg-[#0B0E14]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
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
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">My Learning</h2>
              <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-[#FFD700] font-black uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-colors shadow-sm">
                <Search className="w-4 h-4" /> Find More Courses
              </Link>
            </div>
            
            {enrolledCourses.length === 0 ? (
               <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-12 text-center rounded-2xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-4">
                   <Search className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                 <p className="text-slate-400 max-w-sm mb-6">You haven't enrolled in any courses. Discover your next passion today.</p>
                 <Link to="/courses" className="px-8 py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                   Browse Catalog
                 </Link>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {enrolledCourses.map((enrolled) => (
                    <div 
                      key={enrolled._id || enrolled.course?._id} 
                      className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:border-[#FFD700]/30 transition-all"
                    >
                      <img 
                        src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                        alt={enrolled.course?.title} 
                        className="w-full md:w-48 h-48 md:h-32 object-cover rounded-xl bg-[#11151F] shrink-0 border border-white/5" 
                      />
                      
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-white leading-snug">{enrolled.course?.title || 'Unknown Course'}</h3>
                        </div>
                        <p className="text-slate-400 text-[13px] font-bold uppercase tracking-wide mb-4">
                          Instructor: <span className="font-black text-[#FFD700]">{enrolled.course?.instructor?.name || 'Unknown'}</span>
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 bg-[#11151F] rounded-full overflow-hidden shadow-inner relative">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-500 rounded-full transition-all duration-1000 ease-out relative" 
                              style={{ width: `${enrolled.progress || 0}%` }}
                            >
                              <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-[progress_2s_ease-in-out_infinite]"></div>
                            </div>
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-[#FFD700] shrink-0 min-w-[3ch]">{enrolled.progress || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto md:pl-6 md:border-l md:border-white/10 shrink-0 pt-4 md:pt-0">
                        <Link 
                          to={`/course/${enrolled.course?._id}`} 
                          className="w-full inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 transition-transform"
                        >
                          <PlayCircle className="w-5 h-5" /> Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        );
      case 'certificates':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">My Credentials</h2>
            </div>
            
            {completedCourses.length === 0 ? (
               <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-12 text-center rounded-2xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-white/5 text-purple-500 rounded-full flex items-center justify-center mb-4 border border-white/10">
                   <Award className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No credentials yet</h3>
                 <p className="text-slate-400 max-w-sm mb-6">Complete courses to 100% to earn your official certificates.</p>
                 <button 
                  onClick={() => setActiveTab('courses')}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                 >
                   Continue Learning
                 </button>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedCourses.map((enrolled) => (
                    <div 
                      key={enrolled._id || enrolled.course?._id} 
                      className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 flex flex-col h-full hover:border-purple-500/50 transition-all relative group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-bl-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform"></div>
                      <div className="w-20 h-20 bg-white/5 text-purple-400 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <Award className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-black text-white leading-snug text-center mb-2 line-clamp-2">
                        {enrolled.course?.title || 'Unknown Course'}
                      </h3>
                      <p className="text-purple-300 text-[10px] font-black uppercase tracking-widest text-center mb-8 flex-1">
                        Completed 100% Core Curriculum
                      </p>
                      
                      <button 
                        onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                        className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-white/5 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:bg-purple-500 hover:border-purple-400 transition-colors shadow-sm relative z-10"
                      >
                        <Download className="w-4 h-4" /> Export PDF
                      </button>
                    </div>
                  ))}
                </div>
            )}
          </div>
        );
      case 'growth':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Personal Growth Lab</h2>
                <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mt-1">Track off-grid micro-goals without observation.</p>
              </div>
            </div>

            {/* Trophy Case UI */}
            {achievements && (
              <div className="bg-[#0B0E14]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-2 relative z-10"><Award className="text-[#FFD700] w-6 h-6"/> Platform Standing</h3>
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="bg-[#11151F] border border-white/10 p-6 rounded-2xl flex-1 w-full flex flex-col items-center justify-center h-full hover:border-[#FFD700]/30 transition-colors">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Current Tier</p>
                    <h4 className="text-3xl font-black text-[#FFD700]">{achievements.rank}</h4>
                  </div>
                  <div className="bg-[#11151F] border border-white/10 p-6 rounded-2xl flex-1 w-full flex flex-col items-center justify-center h-full hover:border-[#008A32]/30 transition-colors">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Learning UX</p>
                    <h4 className="text-3xl font-black text-white">{achievements.learningPoints} <span className="text-xs text-[#008A32]">XP</span></h4>
                  </div>
                </div>

                {achievements.badges.length > 0 && (
                  <div className="mt-10 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-widest mb-4">Acquired Seals</p>
                    <div className="flex flex-wrap gap-4">
                      {achievements.badges.map((badge, idx) => (
                        <div key={idx} className="bg-[#11151F] border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-[#FFD700]/20 text-[#FFD700]">
                            <Award className="w-6 h-6"/>
                          </div>
                          <div>
                            <h4 className="font-bold text-white tracking-wide">{badge.title}</h4>
                            <p className="text-[11px] font-medium text-slate-400 max-w-[150px] truncate">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-10">
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-[#008A32]" /> Establish Objective</h3>
              <form onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  value={growthNote}
                  onChange={e => setGrowthNote(e.target.value)}
                  placeholder="e.g. Master React Hooks this weekend..."
                  className="flex-1 px-6 py-4 bg-[#11151F] text-white font-medium border border-white/10 rounded-xl focus:ring-2 focus:ring-[#008A32] outline-none transition-all placeholder:text-slate-600"
                  required
                />
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 inline-flex items-center justify-center gap-2 shrink-0">
                  <Plus className="w-5 h-5" /> Append
                </button>
              </form>
            </div>

            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">Execution Log</h3>
            <div className="space-y-4">
              {privateLogs.length === 0 ? (
                 <div className="bg-[#0B0E14]/50 border-2 border-dashed border-white/10 p-10 text-center rounded-2xl shadow-sm text-slate-500 font-bold tracking-wide">
                   Execution log empty. Record your first private victory.
                 </div>
              ) : (
                privateLogs.map(log => (
                  <div key={log._id} className="bg-[#11151F] border border-white/5 hover:border-[#008A32]/30 p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#0B0E14] bg-[#008A32] px-2 py-0.5 rounded-sm">Covert</span>
                         <span className="text-slate-500 text-[11px] font-bold tracking-widest uppercase">{new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                       </div>
                       <p className="font-bold text-white text-[15px]">{log.action}</p>
                       {log.metadata?.goal && (
                         <p className="text-slate-400 mt-2 font-medium italic border-l-2 border-[#008A32] pl-3">"{log.metadata.goal}"</p>
                       )}
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'settings':
        return <ProfileView />;
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
             <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-yellow-500 text-[#0B0E14] rounded-xl flex items-center justify-center shrink-0 shadow-lg font-black text-xl border border-[#FFD700]">
               {user?.name?.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-lg leading-tight truncate text-white">{user?.name}</h3>
               <p className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest mt-0.5">{user?.role}</p>
             </div>
           </div>

           <nav className="space-y-3">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <LayoutDashboard className="w-5 h-5 shrink-0" /> Overview
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <BookOpen className="w-5 h-5 shrink-0" /> My Learning
             </button>
             <button onClick={() => setActiveTab('certificates')} className={navItemClass('certificates')}>
               <Award className="w-5 h-5 shrink-0" /> Credentials
               {completedCourses.length > 0 && (
                 <span className="ml-auto bg-[#FFD700] text-[#0B0E14] text-[10px] font-black px-2 py-0.5 rounded-full">
                   {completedCourses.length}
                 </span>
               )}
             </button>
             <button onClick={() => setActiveTab('growth')} className={navItemClass('growth')}>
               <Target className="w-5 h-5 shrink-0" /> Growth Lab
             </button>
             <button onClick={() => setActiveTab('settings')} className={navItemClass('settings')}>
               <Settings className="w-5 h-5 shrink-0" /> Settings
             </button>
           </nav>
        </div>
        
        <div className="p-8 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-slate-400 hover:bg-[#E30A17]/10 hover:text-[#E30A17] hover:border-[#E30A17]/20 border border-transparent transition-all font-black uppercase tracking-widest text-[11px]"
          >
            <LogOut className="w-5 h-5 shrink-0" /> Disconnect Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

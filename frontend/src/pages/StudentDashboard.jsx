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
    } catch(e) {}
    
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
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
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
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Courses Enrolled</p>
                    <h3 className="text-3xl font-bold text-slate-900">{enrolledCourses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Lessons Completed</p>
                    <h3 className="text-3xl font-bold text-slate-900">{totalLessonsCompleted}</h3>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Certificates Earned</p>
                    <h3 className="text-3xl font-bold text-slate-900">{completedCourses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Weekly Learning Activity</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <RechartsTooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value} mins`, 'Time Spent']}
                    />
                    <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Pick Up Where You Left Off</h3>
            </div>
            
            {enrolledCourses.length === 0 ? (
               <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                   <BookOpen className="w-8 h-8" />
                 </div>
                 <p className="text-slate-600 text-lg mb-6">You aren't enrolled in any courses yet to track progress.</p>
                 <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2">
                   <Search className="w-5 h-5" /> Browse Catalog
                 </Link>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.slice(0, 3).map((enrolled) => (
                    <div key={enrolled._id || enrolled.course?._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                      <div className="flex-1">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-6 line-clamp-2 leading-snug text-lg">{enrolled.course?.title || 'Unknown Course'}</h4>
                        
                        <div className="flex justify-between text-sm font-medium mb-2 text-slate-600">
                          <span>Progress</span>
                          <span className="text-blue-600">{enrolled.progress || 0}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                            style={{ width: `${enrolled.progress || 0}%` }}
                          >
                           <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-[progress_2s_ease-in-out_infinite]"></div>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/course/${enrolled.course?._id}`} 
                        className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ))}
                </div>
            )}

            <div className="mt-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
               <ActivityFeed isAdmin={false} limit={5} />
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-display font-bold text-slate-900">My Learning</h2>
              <Link to="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                <Search className="w-4 h-4" /> Find More Courses
              </Link>
            </div>
            
            {enrolledCourses.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                   <Search className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                 <p className="text-slate-500 max-w-sm mb-6">You haven't enrolled in any courses. Discover your next passion today.</p>
                 <Link to="/courses" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                   Browse Catalog
                 </Link>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {enrolledCourses.map((enrolled) => (
                    <div 
                      key={enrolled._id || enrolled.course?._id} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                        alt={enrolled.course?.title} 
                        className="w-full md:w-48 h-48 md:h-32 object-cover rounded-xl bg-slate-100 shrink-0" 
                      />
                      
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 leading-snug">{enrolled.course?.title || 'Unknown Course'}</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">
                          Instructor: <span className="font-medium text-slate-700">{enrolled.course?.instructor?.name || 'Unknown'}</span>
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${enrolled.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-slate-700 shrink-0 min-w-[3ch]">{enrolled.progress || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto md:pl-6 md:border-l md:border-slate-100 shrink-0 pt-4 md:pt-0">
                        <Link 
                          to={`/course/${enrolled.course?._id}`} 
                          className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
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
              <h2 className="text-2xl font-display font-bold text-slate-900">My Certificates</h2>
            </div>
            
            {completedCourses.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
                   <Award className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No certificates yet</h3>
                 <p className="text-slate-500 max-w-sm mb-6">Complete courses to 100% to earn your certificates.</p>
                 <button 
                  onClick={() => setActiveTab('courses')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   Continue Learning
                 </button>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedCourses.map((enrolled) => (
                    <div 
                      key={enrolled._id || enrolled.course?._id} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col h-full"
                    >
                      <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto border-2 border-amber-100">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug text-center mb-2 line-clamp-2">
                        {enrolled.course?.title || 'Unknown Course'}
                      </h3>
                      <p className="text-slate-500 text-sm text-center mb-8 flex-1">
                        Completed 100% of the curriculum
                      </p>
                      
                      <button 
                        onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                        className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        <Download className="w-5 h-5" /> Download PDF
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Personal Growth Lab</h2>
                <p className="text-slate-500 mt-1">A private space to track your micro-goals and study streaks without observation.</p>
              </div>
            </div>

            {/* Trophy Case UI */}
            {achievements && (
              <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -z-0"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10"><Award className="text-amber-400 w-6 h-6"/> Your Trophy Case</h3>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex-1 w-full hover:bg-white/20 transition-colors">
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Current Rank</p>
                    <h4 className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">{achievements.rank}</h4>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex-1 w-full hover:bg-white/20 transition-colors">
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Learning Points</p>
                    <h4 className="text-3xl font-black text-white">{achievements.learningPoints} <span className="text-sm font-medium text-indigo-300">XP</span></h4>
                  </div>
                </div>

                {achievements.badges.length > 0 && (
                  <div className="mt-8 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-sm text-indigo-200 font-bold uppercase tracking-wider mb-4">Earned Badges</p>
                    <div className="flex flex-wrap gap-4">
                      {achievements.badges.map((badge, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Award className="w-6 h-6 text-white"/>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100">{badge.title}</h4>
                            <p className="text-xs text-indigo-200 max-w-[150px] truncate">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" /> Set a Micro-Goal</h3>
              <form onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  value={growthNote}
                  onChange={e => setGrowthNote(e.target.value)}
                  placeholder="e.g. Read chapter 3 tonight, without distractions..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm inline-flex items-center justify-center gap-2 shrink-0">
                  <Plus className="w-5 h-5" /> Save Goal
                </button>
              </form>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">Your Private Logbook</h3>
            <div className="space-y-4">
              {privateLogs.length === 0 ? (
                 <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-500">
                   Your growth lab is empty. Start by setting your first micro-goal!
                 </div>
              ) : (
                privateLogs.map(log => (
                  <div key={log._id} className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Private</span>
                         <span className="text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                       </div>
                       <p className="font-semibold text-slate-900">{log.action}</p>
                       {log.metadata?.goal && (
                         <p className="text-slate-700 mt-2 italic border-l-2 border-emerald-300 pl-3">"{log.metadata.goal}"</p>
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
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left
    ${activeTab === tabName 
      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 flex flex-col md:h-screen">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 mb-6 w-full px-2">
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto" />
           </div>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 uppercase font-bold text-xl">
               {user?.name?.charAt(0)}
             </div>
             <div>
               <h3 className="font-bold text-lg leading-tight truncate">{user?.name}</h3>
               <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{user?.role}</p>
             </div>
           </div>

           <nav className="space-y-2">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <LayoutDashboard className="w-5 h-5 shrink-0" /> Dashboard
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <BookOpen className="w-5 h-5 shrink-0" /> My Learning
             </button>
             <button onClick={() => setActiveTab('certificates')} className={navItemClass('certificates')}>
               <Award className="w-5 h-5 shrink-0" /> Certificates
               {completedCourses.length > 0 && (
                 <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
        
        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

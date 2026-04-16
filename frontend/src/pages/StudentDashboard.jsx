import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BookOpen, CheckCircle2, Award, Search, LayoutDashboard, 
  Settings, LogOut, Target, Plus, Bell, Monitor, TrendingUp, MoreHorizontal,
  PlayCircle, Download, ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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
  const [pendingSponsorships, setPendingSponsorships] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);

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
    const fetchPendingSponsorships = async () => {
      try {
        const { data } = await api.get('/support/pending');
        setPendingSponsorships(data.data || []);
      } catch (err) {
        console.error('Failed to fetch pending sponsorships', err);
      }
    };
    
    const fetchPendingConnections = async () => {
      try {
        const { data } = await api.get('/connections/pending');
        setPendingConnections(data.data || []);
      } catch (err) {
        console.error('Failed to fetch pending connections', err);
      }
    };
    
    fetchEnrollments();
    fetchPendingSponsorships();
    fetchPendingConnections();
  }, []);

  const handleConnectionRequest = async (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this explicit connection?`)) {
      try {
        await api.post(`/connections/${id}/${action}`);
        alert(`Connection definitively ${action}ed.`);
        setPendingConnections(pendingConnections.filter(c => c.id !== id));
      } catch (err) {
        alert("Action failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSponsorship = async (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this proxy connection?`)) {
      try {
        await api.post(`/support/${id}/${action}`);
        alert(`Sponsorship definitively ${action}ed.`);
        setPendingSponsorships(pendingSponsorships.filter(s => s.id !== id));
      } catch (err) {
        alert("Authorization failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

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

  const totalEnrolled = enrolledCourses.length;
  const totalLessonsCompleted = enrolledCourses.reduce((total, course) => total + (course.completedLessons?.length || 0), 0);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const averageProgress = totalEnrolled > 0 ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / totalEnrolled) : 0;

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
      // ignore
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
    
    doc.save(`${courseName.replace(/\\s+/g, '_')}_Certificate.pdf`);
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
        const monthlyStats = [
          { name: 'Jan', value: 0 },
          { name: 'Feb', value: 0 },
          { name: 'Mar', value: 0 },
          { name: 'Apr', value: 0 },
          { name: 'May', value: 0 },
          { name: 'Aug', value: 0 },
        ];

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#17252A]/60 via-[#13161B] to-[#13161B] border border-white/5 rounded-2xl p-10 mb-6 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h1 className="text-3xl lg:text-[34px] font-bold text-white mb-2 leading-tight tracking-tight">
                  Welcome back, {user?.name || 'Student'}! 💡<br/>Ready to learn?
                </h1>
                <button className="mt-6 px-5 py-2.5 bg-[#1E293B]/50 hover:bg-[#1E293B] border border-[#38bdf8]/30 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all hover:border-[#38bdf8]/60 shadow-lg">
                  <Plus className="w-4 h-4" /> Start a Lesson
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-[#FFD700]/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Pending Sponsorship Offers (Security & Privacy Gateway) */}
            {pendingSponsorships.length > 0 && (
                <div className="mb-6 space-y-4">
                  {pendingSponsorships.map(offer => (
                    <div key={offer.id} className="bg-indigo-900/20 border border-indigo-500/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_10px_30px_rgba(79,70,229,0.15)] animate-in slide-in-from-top-2 duration-500">
                       <div className="flex-1">
                          <h3 className="text-white font-bold text-lg flex items-center gap-2">
                             <ShieldCheck className="w-6 h-6 text-indigo-400" /> Secure Support Request
                          </h3>
                          <p className="text-indigo-200/80 text-sm mt-2 leading-relaxed max-w-2xl">
                             An encrypted proxy sponsorship request has been initiated by <strong>{offer.isAnonymous ? 'an Anonymous Benefactor' : offer.sponsorName}</strong>. 
                             Accepting this connects them to your academic progress log via restricted metrics and establishes a secure, admin-moderated message group. Refusing permanently dismisses the connection request.
                          </p>
                       </div>
                       <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                          <button onClick={() => handleSponsorship(offer.id, 'reject')} className="flex-1 sm:flex-none px-6 py-3 bg-[#13161B] border border-white/10 text-slate-300 font-bold text-sm rounded-xl hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all text-center">Decline Block</button>
                          <button onClick={() => handleSponsorship(offer.id, 'accept')} className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 border border-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all text-center">Formally Accept</button>
                       </div>
                    </div>
                  ))}
                </div>
            )}

            {/* Pending Admin/Parent Connections (Oversight Delegation) */}
            {pendingConnections.length > 0 && (
                <div className="mb-6 space-y-4">
                  {pendingConnections.map(conn => (
                    <div key={conn.id} className="bg-amber-900/20 border border-amber-500/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_10px_30px_rgba(245,158,11,0.15)] animate-in slide-in-from-top-2 duration-500">
                       <div className="flex-1">
                          <h3 className="text-white font-bold text-lg flex items-center gap-2">
                             <ShieldCheck className="w-6 h-6 text-amber-400" /> Secure Connection Request
                          </h3>
                          <p className="text-amber-200/80 text-sm mt-2 leading-relaxed max-w-2xl">
                             An encrypted proxy connection request has been initiated by <strong>{conn.requester?.name || 'Administrator'} ({conn.type})</strong>. 
                             Accepting this delegates oversight of your academic progress log to them via a restricted metrics dashboard and constructs an encrypted, moderated communication channel. Refusal is final.
                          </p>
                       </div>
                       <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                          <button onClick={() => handleConnectionRequest(conn.id, 'reject')} className="flex-1 sm:flex-none px-6 py-3 bg-[#13161B] border border-white/10 text-slate-300 font-bold text-sm rounded-xl hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all text-center">Decline Oversight</button>
                          <button onClick={() => handleConnectionRequest(conn.id, 'accept')} className="flex-1 sm:flex-none px-6 py-3 bg-amber-600 border border-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all text-center">Delegate Connection</button>
                       </div>
                    </div>
                  ))}
                </div>
            )}

            {/* 4 Mini Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 shadow-sm hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded shrink-0 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Enrolled Courses</span>
                </div>
                <h3 className="text-3xl font-bold text-white">{totalEnrolled}</h3>
              </div>

              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 shadow-sm hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded shrink-0 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Average Progress</span>
                </div>
                <h3 className="text-3xl font-bold text-white">{averageProgress}%</h3>
              </div>

              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 shadow-sm hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded shrink-0 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Completed Lessons</span>
                </div>
                <h3 className="text-3xl font-bold text-white">{totalLessonsCompleted}</h3>
              </div>

              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-5 shadow-sm hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded shrink-0 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Certificates</span>
                </div>
                <h3 className="text-3xl font-bold text-white">{completedCourses.length}</h3>
              </div>
            </div>

            {/* Bottom 3 Large Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {/* Progress Ring Card */}
              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                <div className="w-full text-left font-medium text-[13px] text-white mb-6">Academic Progress Ring</div>
                <div className="relative w-48 h-48 flex items-center justify-center mt-2 group">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="#38BDF8" strokeWidth="8" fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * averageProgress / 100)} 
                      className="drop-shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-1000" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{averageProgress}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Progress</span>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-[13px] text-white">Weekly Study Goal</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer hover:text-white">
                    Rachants <MoreHorizontal className="w-4 h-4"/>
                  </div>
                </div>
                <div className="flex justify-center text-[11px] font-medium text-slate-300 mb-6 gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.8)]"></div> Audey Asbea Yellow
                </div>
                <div className="flex-1 w-full relative min-h-[160px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={monthlyStats} margin={{ top: 5, right: 0, bottom: 0, left: -25 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dy={15} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} ticks={[0,25,50,75,100]} />
                       <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#FFD700'}} />
                     </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              {/* Certificates Claim */}
              <div className="bg-[#13161B] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-medium text-[13px] text-white">Certificates Claim</h3>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative mb-8 w-24 h-24 flex items-center justify-center mx-auto">
                     <div className="absolute w-[50px] h-[72px] bg-slate-400 rounded-lg shadow-sm -rotate-12 -translate-x-5 opacity-70 border border-white/10"></div>
                     <div className="absolute w-[50px] h-[72px] bg-slate-300 rounded-lg shadow-md -rotate-6 -translate-x-2 opacity-90 border border-white/10"></div>
                     <div className="absolute w-[56px] h-[80px] bg-slate-100 rounded-lg shadow-xl z-10 flex flex-col items-center justify-center border border-white/20">
                        <div className="w-7 h-7 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg relative z-20">
                           <div className="absolute w-1.5 h-4 bg-[#FFD700] -bottom-2 -left-0.5 transform -rotate-12 shadow-sm rounded-b-sm"></div>
                           <div className="absolute w-1.5 h-4 bg-[#FFD700] -bottom-2 -right-0.5 transform rotate-12 shadow-sm rounded-b-sm"></div>
                           <div className="w-3 h-3 rounded-full border-2 border-white/80 absolute"></div>
                        </div>
                     </div>
                  </div>
                  <button className="w-full py-3.5 bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold rounded-xl text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-center justify-center gap-2">
                    Claim Certificate
                  </button>
                </div>
              </div>
            </div>

            {/* Keep the Activity Feed for additional utility below the main view */}
            {enrolledCourses.length > 0 && (
              <div className="bg-[#13161B] rounded-2xl border border-white/5 p-8 mt-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <ActivityFeed isAdmin={false} limit={5} />
              </div>
            )}
          </div>
        );
      }
      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">My Learning</h2>
              <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-[#11151F]/5 text-[#FFD700] font-bold text-[13px] rounded-xl border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] transition-colors shadow-sm">
                <Search className="w-4 h-4" /> Find More Courses
              </Link>
            </div>
            
            {enrolledCourses.length === 0 ? (
               <div className="bg-[#13161B] p-12 text-center rounded-2xl border border-white/5 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-[#11151F]/5 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-white/5">
                   <Search className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                 <p className="text-slate-400 text-sm mb-6">You haven't enrolled in any courses. Discover your next passion today.</p>
                 <Link to="/courses" className="px-6 py-3 bg-[#FFD700] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                   Browse Catalog
                 </Link>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {enrolledCourses.map((enrolled) => (
                    <div 
                      key={enrolled.id || enrolled.course?.id} 
                      className="bg-[#13161B] rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:border-white/10 transition-all"
                    >
                      <img 
                        src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                        alt={enrolled.course?.title} 
                        className="w-full md:w-32 h-32 md:h-24 object-cover rounded-xl bg-[#11151F] shrink-0 border border-white/5" 
                      />
                      
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="font-bold text-white text-lg">{enrolled.course?.title || 'Unknown Course'}</h3>
                        </div>
                        <p className="text-slate-400 text-xs mb-4">
                          Instructor: <span className="font-medium text-white">{enrolled.course?.instructor?.name || 'Unknown'}</span>
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden relative">
                            <div 
                              className="h-full bg-[#FFD700] rounded-full transition-all duration-1000" 
                              style={{ width: `${enrolled.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-[#FFD700] shrink-0">{enrolled.progress || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0">
                        <Link 
                          to={`/course/${enrolled.course?.id}`} 
                          className="w-full inline-flex justify-center items-center px-6 py-2.5 bg-[#FFD700] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:bg-[#e6c200] transition-colors"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" /> Continue
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
              <h2 className="text-2xl font-bold text-white tracking-tight">My Credentials</h2>
            </div>
            
            {completedCourses.length === 0 ? (
               <div className="bg-[#13161B] p-12 text-center rounded-2xl border border-white/5 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-[#11151F]/5 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-white/5">
                   <Award className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No credentials yet</h3>
                 <p className="text-slate-400 text-sm mb-6">Complete courses to 100% to earn your official certificates.</p>
                 <button 
                  onClick={() => setActiveTab('courses')}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
                 >
                   Continue Learning
                 </button>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedCourses.map((enrolled) => (
                    <div 
                      key={enrolled.id || enrolled.course?.id} 
                      className="bg-[#13161B] rounded-2xl border border-white/5 shadow-sm p-6 flex flex-col h-full hover:border-blue-500/30 transition-all relative group"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-white text-center mb-2">
                        {enrolled.course?.title || 'Unknown Course'}
                      </h3>
                      <p className="text-blue-300 text-[11px] font-medium text-center mb-8 flex-1">
                        Completed 100% Core Curriculum
                      </p>
                      
                      <button 
                        onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                        className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-[#1E293B] hover:bg-blue-500 text-white font-bold text-sm rounded-xl border border-white/5 transition-colors"
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
         // Kept simplified for brevity, user mainly focused on the layout default
         return (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white">
                <h2 className="text-2xl font-bold text-white mb-6">Personal Growth Lab</h2>
                <div className="bg-[#13161B] p-6 rounded-2xl border border-white/5 mb-6">
                    <p className="text-slate-400 mb-4">Set isolated growth objectives away from course structures.</p>
                    <form onSubmit={handleAddGoal} className="flex gap-4">
                        <input 
                            type="text" value={growthNote} onChange={e => setGrowthNote(e.target.value)}
                            placeholder="Set a new objective..."
                            className="flex-1 px-4 py-2 bg-[#0B0E14] border border-white/10 rounded-lg text-white"
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold">Add</button>
                    </form>
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
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left
    ${activeTab === tabName 
      ? 'bg-[#1E293B] text-white shadow-sm' 
      : 'bg-transparent text-slate-400 hover:bg-[#11151F] hover:text-white'
    }
  `;

  return (
    <div className="min-h-screen bg-[#0d0f12] flex flex-col md:flex-row font-sans text-slate-300">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-64 bg-[#0d0f12] text-white shrink-0 flex flex-col md:h-screen border-r border-white/5 sticky top-0 font-sans">
        <div className="p-6 border-b border-white/5">
           <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto rounded opacity-90" />
        </div>
        
        <div className="p-6">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
           <nav className="space-y-1">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <LayoutDashboard className="w-4 h-4 shrink-0" /> Overview
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <BookOpen className="w-4 h-4 shrink-0" /> My Learning
             </button>
             <button onClick={() => setActiveTab('certificates')} className={navItemClass('certificates')}>
               <Award className="w-4 h-4 shrink-0" /> Credentials
             </button>
             <button onClick={() => setActiveTab('growth')} className={navItemClass('growth')}>
               <Target className="w-4 h-4 shrink-0" /> Growth Lab
             </button>
           </nav>
           
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">Preference</p>
           <nav className="space-y-1">
             <button onClick={() => setActiveTab('settings')} className={navItemClass('settings')}>
               <Settings className="w-4 h-4 shrink-0" /> Settings
             </button>
           </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Top Header mapped from image requirements */}
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 w-full">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Global Search (Students, Courses, Messages)..." 
                className="w-full pl-10 pr-20 py-2.5 bg-[#13161B] border border-white/5 rounded-xl text-xs outline-none text-white focus:ring-1 focus:ring-white/10 transition-all font-medium placeholder:text-slate-500 shadow-sm" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A1E26] text-[9px] px-2 py-1 rounded text-slate-400 font-bold border border-white/5">
                CTRL + K
              </div>
            </div>
            
            <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
              <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#E30A17] rounded-full border-2 border-[#0d0f12] text-[7px] flex items-center justify-center text-white font-bold">1</span>
              </div>
              
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/5 transition-colors">
                 <div className="w-9 h-9 rounded-full bg-white text-[#0B0E14] font-black flex items-center justify-center shadow-sm">
                   {user?.name?.charAt(0) || 'S'}
                 </div>
                 <div className="text-left hidden sm:block">
                   <div className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'Student'}</div>
                   <div className="text-[11px] font-medium text-slate-400 leading-none capitalize">{user?.role || 'Student'}</div>
                 </div>
              </div>
            </div>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CircleDollarSign,
  MoreVertical,
  ChevronDown,
  CalendarDays,
  Bell,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import AgendaCreationModal from '../components/AgendaCreationModal';
import ActivityFeed from '../components/ActivityFeed';
import ProudMomentsFeed from '../components/ProudMomentsFeed';
import ParentInsightGrid from '../components/ParentInsightGrid';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = (props) => {
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {containerWidth > 0 && <Responsive width={containerWidth} {...props} />}
    </div>
  );
};

export default function EDOTDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agendaEvents, setAgendaEvents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([
    { name: 'Present', value: 0, color: '#818cf8' },
    { name: 'Absent', value: 0, color: '#fbbf24' }
  ]);
  const [attendancePercentage, setAttendancePercentage] = useState('0%');
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [chartFilter, setChartFilter] = useState('Weekly');

  const userRole = user?.role ? user.role.toLowerCase().trim() : 'student';

  // React Grid Layout specific Admin Layout
  const [adminGridLayout, setAdminGridLayout] = useState(() => {
     const saved = localStorage.getItem('adminDashboardLayout');
     return saved ? JSON.parse(saved) : [
       { i: 'stats-courses', x: 0, y: 0, w: 3, h: 4, minW: 2 },
       { i: 'stats-students', x: 3, y: 0, w: 3, h: 4, minW: 2 },
       { i: 'stats-instructors', x: 6, y: 0, w: 3, h: 4, minW: 2 },
       { i: 'stats-revenue', x: 9, y: 0, w: 3, h: 4, minW: 2 },
       { i: 'chart-attendance', x: 0, y: 4, w: 5, h: 11 },
       { i: 'chart-performance', x: 5, y: 4, w: 7, h: 11 },
       { i: 'chart-growth', x: 0, y: 15, w: 12, h: 10 },
     ];
  });

  const onLayoutChange = (layout) => {
    setAdminGridLayout(layout);
    localStorage.setItem('adminDashboardLayout', JSON.stringify(layout));
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get(`/${userRole}/dashboard`);
        setStats(data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchExtraDynamicStats = async () => {
       if (userRole !== 'student' && userRole !== 'parent') {
          try {
             const attRes = await api.get('/attendance/aggregate');
             if (attRes.data.success && attRes.data.raw) {
                setAttendanceStats([
                   { name: 'Present', value: attRes.data.raw.present || 0, color: '#818cf8' },
                   { name: 'Absent', value: (attRes.data.raw.total || 0) - (attRes.data.raw.present || 0), color: '#fbbf24' }
                ]);
                const { present, total } = attRes.data.raw;
                if (total > 0) {
                   setAttendancePercentage(`${Math.round((present / total) * 100)}%`);
                } else setAttendancePercentage('0%');
             }
             const calRes = await api.get('/calendar');
             if (calRes.data.success) {
                setAgendaEvents(calRes.data.data.slice(0, 4));
             }
          } catch (error) {
             console.error('Failed to fetch aggregate or calendar data', error);
          }
       } else if (userRole === 'student' || userRole === 'parent') {
          try {
             const calRes = await api.get('/calendar');
             if (calRes.data.success) {
                setAgendaEvents(calRes.data.data.slice(0, 4));
             }
          } catch(e){}
       }
    };

    if (user) {
        fetchDashboardStats();
        fetchExtraDynamicStats();
    }
  }, [user, userRole]);

  // True Data Map
  const studentPerformanceData = stats?.studentPerformanceData || [];
  const classNames = stats?.courseNames || [];
  const teachingActivityData = stats?.teachingActivityData || [];

  const SmartCard = ({ title, value, percentage, isPositive, icon: Icon, colorTheme, className }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-indigo-500 text-blue-500 bg-blue-50 dark:bg-blue-500/10',
      green: 'from-emerald-400 to-teal-500 text-teal-500 bg-teal-50 dark:bg-teal-500/10',
      purple: 'from-purple-500 to-fuchsia-500 text-purple-500 bg-purple-50 dark:bg-purple-500/10',
      orange: 'from-orange-400 to-amber-500 text-orange-500 bg-orange-50 dark:bg-orange-500/10',
    };
    const theme = colorClasses[colorTheme] || colorClasses.blue;
    const gradient = theme.split(' text-')[0];
    const textBg = 'text-' + theme.split(' text-')[1];

    return (
      <Card hover={true} className={`rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group relative overflow-hidden dark:bg-slate-900 ${className || ''}`}>
        {/* Decorative corner glow */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 blur-xl transition-opacity`}></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${textBg} transition-transform group-hover:scale-110 duration-300`}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{title}</h3>
          </div>
          {percentage && (
             <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
               {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
               {percentage}%
             </div>
          )}
        </div>
        <div className="flex justify-between items-end relative z-10 mt-2">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h2>
        </div>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-xl pointer-events-none"></div>
          <p className="font-extrabold text-white mb-3 tracking-wide">{label}</p>
          <div className="space-y-2 relative z-10">
            {payload.map((entry, index) => {
               let displayName = entry.name;
               if (entry.dataKey === 'value1' && classNames[0]) displayName = classNames[0];
               if (entry.dataKey === 'value2' && classNames[1]) displayName = classNames[1];
               if (entry.dataKey === 'value3' && classNames[2]) displayName = classNames[2];
               
               return (
                <div key={index} className="flex items-center justify-between gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-slate-200">{displayName}</span>
                  </div>
                  <span className="font-extrabold text-white glass-card/10 px-2 py-0.5 rounded-md">{entry.value}</span>
                </div>
               );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-6"
    >
      
      {/* Hero Banner with SaaS Mesh Gradient */}
      <div className="bg-[#0F172A] rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 group">
        
        {/* Animated Mesh Gradients */}
        <div className="absolute top-0 -left-1/4 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6366F1]/40 via-[#0F172A]/0 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/20 via-[#0F172A]/0 to-transparent blur-3xl rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 max-w-2xl">
          <p className="text-[#6366F1] font-bold mb-3 uppercase tracking-widest text-[10px] flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse"></span>
             Global Command Center
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4 leading-tight tracking-tight text-white drop-shadow-md">
            {userRole === 'admin' ? `Welcome back, Admin ${user?.name || ''} 👋` :
             userRole === 'instructor' ? `Your classes are performing great! 🚀` :
             userRole === 'parent' ? (stats?.primaryLearner ? `Supporting ${stats.primaryLearner.name}'s journey 👋` : `Welcome back, Parent 👋`) :
             `Welcome back, ${user?.name || ''}! Ready to learn? 💡`}
          </h1>
          
          {userRole === 'parent' && stats?.primaryLearner ? (
             <div className="flex items-center gap-4 mt-6 glass-card/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-max shadow-lg">
                <div className="w-14 h-14 rounded-full border-2 border-white/80 shadow-md overflow-hidden shrink-0 bg-indigo-200 flex items-center justify-center">
                   <img 
                     src={`http://localhost:5000/uploads/avatars/${stats.primaryLearner.avatar || 'default-avatar.png'}`} 
                     alt={stats.primaryLearner.name} 
                     className="w-full h-full object-cover" 
                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(stats.primaryLearner.name) + '&background=random'; }}
                   />
                </div>
                <div>
                   <p className="text-indigo-50 font-medium text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      {stats.primaryLearner.name} is on a 5-day streak!
                   </p>
                   <p className="text-xs text-white/90 font-bold mt-1 tracking-wide bg-black/20 py-1 px-2 rounded-lg inline-block">
                     {stats.averageProgress}% Avg Progress &bull; {stats.completedLessons} Lessons
                   </p>
                </div>
             </div>
          ) : (
             <p className="text-indigo-100 font-medium max-w-lg leading-relaxed mb-6">
                Here's what's happening with your platform today. <span onClick={() => navigate('/dashboard/notice')} className="underline decoration-indigo-400 underline-offset-4 cursor-pointer hover:text-white transition-colors">
                  {((stats?.recentActivity?.length || 0) + (agendaEvents?.length || 0)) > 0 
                    ? `You have ${stats?.recentActivity?.length || 0} new notifications and ${agendaEvents?.length || 0} upcoming events` 
                    : "You are all caught up for today! No new notifications"}
                </span> to review.
             </p>
          )}
          {userRole !== 'parent' && (
             <button onClick={() => navigate(userRole === 'admin' ? '/dashboard/revenue' : '/dashboard/performance')} className="glass-card text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
               View Detailed Report <TrendingUp className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>

      {/* Modern Smart Stats Grid (For non-admins) */}
      {userRole !== 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {userRole === 'instructor' && stats ? (
            <>
              <SmartCard title="Active Classes" value={stats.activeCourses} icon={BookOpen} colorTheme="blue" />
              <SmartCard title="Total Students" value={stats.totalStudents} icon={Users} colorTheme="purple" />
              <SmartCard title="Total Lessons" value={stats.totalLessons} icon={GraduationCap} colorTheme="green" /> 
              <SmartCard title="Draft Courses" value={stats.totalCourses - stats.activeCourses} icon={CircleDollarSign} colorTheme="orange" />
            </>
          ) : userRole === 'parent' && stats ? (
            <>
              <SmartCard title="Total Learners" value={stats.totalLearners} icon={Users} colorTheme="blue" />
              <SmartCard title="Enrolled Courses" value={stats.totalEnrolledCourses} icon={BookOpen} colorTheme="purple" />
              <SmartCard title="Average Progress" value={`${stats.averageProgress}%`} icon={TrendingUp} colorTheme="green" /> 
              <SmartCard title="Completed Lessons" value={stats.completedLessons} icon={Award} colorTheme="orange" />
            </>
          ) : stats ? (
            <>
              <SmartCard title="Enrolled Courses" value={stats.totalEnrolled} icon={BookOpen} colorTheme="blue" />
              <SmartCard title="Average Progress" value={`${stats.averageProgress}%`} icon={TrendingUp} colorTheme="green" />
              <SmartCard title="Completed Lessons" value={stats.completedLessons} icon={Award} colorTheme="purple" /> 
              <SmartCard title="Certificates" value={stats.completedCourses || 0} icon={CheckCircle} colorTheme="orange" />
            </>
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500 font-medium animate-pulse">Loading dashboard elements...</div>
          )}
        </div>
      )}

      {/* ADMIN REACT-GRID-LAYOUT */}
      {userRole === 'admin' && stats && (
         <div className="-mx-2">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: adminGridLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onLayoutChange={onLayoutChange}
              draggableHandle=".drag-handle"
              margin={[24, 24]}
            >
              <div key="stats-courses" className="h-full relative group">
                <div className="absolute top-2 right-2 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </div>
                <SmartCard title="Total Premium Courses" value={stats.totalCourses} icon={BookOpen} colorTheme="blue" className="h-full" />
              </div>
              <div key="stats-students" className="h-full relative group">
                <div className="absolute top-2 right-2 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </div>
                 <SmartCard title="Global Active Students" value={stats.totalStudents} icon={Users} colorTheme="purple" className="h-full" />
              </div>
              <div key="stats-instructors" className="h-full relative group">
                <div className="absolute top-2 right-2 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </div>
                <SmartCard title="Verified Instructors" value={stats.totalInstructors} icon={GraduationCap} colorTheme="green" className="h-full" />
              </div>
              <div key="stats-revenue" className="h-full relative group">
                <div className="absolute top-2 right-2 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </div>
                <SmartCard title="Revenue Target (MRR)" value={stats.pendingCourses} icon={CircleDollarSign} percentage="92" isPositive={true} colorTheme="orange" className="h-full" />
              </div>

              {/* Attendance Chart */}
              <div key="chart-attendance" className="h-full relative group">
                <div className="absolute top-4 right-4 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
                <Card hover={false} className="h-full dark:bg-[#0F172A] p-6 !rounded-3xl border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-slate-800 dark:text-white">Global Attendance</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time presence map</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 flex flex-col justify-center items-center relative">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={attendanceStats} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={8}>
                           {attendanceStats.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                         <RechartsTooltip content={<CustomTooltip />} />
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-3xl font-display font-extrabold text-slate-800 dark:text-white">{attendancePercentage}</span>
                     </div>
                  </div>
                </Card>
              </div>

              {/* Performance Chart */}
              <div key="chart-performance" className="h-full relative group">
                <div className="absolute top-4 right-14 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
                <Card hover={false} className="h-full dark:bg-[#0F172A] p-6 !rounded-3xl border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                       <h3 className="font-display font-extrabold text-lg text-slate-800 dark:text-white">Performance Insights</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">GPA aggregations across regions</p>
                    </div>
                    <Button variant="outline" size="sm" icon={Filter} className="hidden sm:flex">Filter Data</Button>
                  </div>
                  <div className="flex-1 min-h-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={12}>
                          <defs>
                             <linearGradient id="barColor1" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#6366F1" stopOpacity={1}/>
                               <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.5}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.2} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                          <RechartsTooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} content={<CustomTooltip />} />
                          <Bar dataKey="value1" fill="url(#barColor1)" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="value2" fill="#10B981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Growth Chart */}
              <div key="chart-growth" className="h-full relative group">
                <div className="absolute top-4 right-14 p-1.5 glass-card dark:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab hover:bg-[#6366F1] hover:text-white drag-handle z-50 shadow-md">
                   <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
                <Card hover={false} className="h-full dark:bg-[#0F172A] p-6 !rounded-3xl border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-white">Platform Growth Engine</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time engagement retention MRR</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={teachingActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.15} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 8, fill: '#6366F1', stroke: '#fff', strokeWidth: 3 }} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                </Card>
              </div>

            </ResponsiveGridLayout>
         </div>
      )}

      {/* Main Content Split for Roles outside Admin */}
      {userRole !== 'admin' && (
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Column - Advanced Analytics */}
          <div className="flex-1 space-y-6">
          
          {(userRole === 'instructor') && (
            <>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Advanced Student Attendance pie */}
                <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 hover:shadow-md transition-shadow cursor-pointer relative" onClick={() => navigate('/dashboard/attendance')}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{user?.role === 'admin' ? 'Global Attendance' : 'Class Attendance'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time presence tracking</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent dark:bg-slate-800 rounded-xl transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  <div className="h-64 flex flex-col justify-center items-center relative">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={attendanceStats}
                           cx="50%"
                           cy="50%"
                           innerRadius={75}
                           outerRadius={100}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                           cornerRadius={8}
                         >
                           {attendanceStats.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                         <RechartsTooltip content={<CustomTooltip />} />
                       </PieChart>
                     </ResponsiveContainer>
                     {/* Center Label */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-4xl font-extrabold text-slate-800 dark:text-white drop-shadow-md">{attendancePercentage}</span>
                     </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="w-3.5 h-3.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></span> Present
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span> Absent
                     </div>
                  </div>
                </div>

                {/* Performance Analytics Bar Chart */}
                <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <div onClick={() => navigate('/dashboard/performance')} className="cursor-pointer group">
                       <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">Performance Insights</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 cursor-pointer">Average scores per subject</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => navigate('/dashboard/performance')} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 bg-transparent dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                         <Filter className="w-3.5 h-3.5" /> Filter
                       </button>
                    </div>
                  </div>
                  <div className="h-64">
                    {studentPerformanceData && studentPerformanceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={studentPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={12}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                          <RechartsTooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} content={<CustomTooltip />} />
                          <Bar dataKey="value1" fill="#6366f1" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="value2" fill="#a855f7" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="value3" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col h-full items-center justify-center text-center p-6 border-2 border-dashed border-indigo-100 dark:border-slate-800 rounded-3xl bg-indigo-50/50 dark:bg-slate-800/20">
                          <div className="w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                             <Award className="w-8 h-8 opacity-75" />
                          </div>
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Awaiting Scores</h4>
                          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">System metrics will automatically generate breathtaking charts here once student assessments are logged.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                     {classNames[0] && (
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <span className="w-3 h-3 rounded-full bg-indigo-500"></span> {classNames[0]}
                       </div>
                     )}
                     {classNames[1] && (
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <span className="w-3 h-3 rounded-full bg-purple-500"></span> {classNames[1]}
                       </div>
                     )}
                     {classNames[2] && (
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <span className="w-3 h-3 rounded-full bg-teal-500"></span> {classNames[2]}
                       </div>
                     )}
                  </div>
                </div>
              </div>

              {/* Teaching Activity Line Chart - Advanced */}
                <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <div onClick={() => navigate('/dashboard/teaching')} className="cursor-pointer group">
                      <h3 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{user?.role === 'admin' ? 'Platform Growth Analytics' : 'Teaching Activity Trends'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Measure your reach over time</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex text-xs font-bold">
                         {['Weekly', 'Monthly', 'Yearly'].map(filter => (
                           <button 
                             key={filter}
                             onClick={() => setChartFilter(filter)}
                             className={`px-4 py-1.5 rounded-lg transition-colors ${chartFilter === filter ? 'glass-card dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                           >
                             {filter}
                           </button>
                         ))}
                      </div>
                      <button onClick={() => navigate('/dashboard/teaching')} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                        <Download className="w-4 h-4" /> Export
                      </button>
                    </div>
                </div>
                <div className="h-[300px]">
                   {teachingActivityData && teachingActivityData.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={teachingActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }} />
                        </AreaChart>
                     </ResponsiveContainer>
                   ) : (
                     <div className="flex flex-col h-full items-center justify-center text-center p-8 border-2 border-dashed border-purple-100 dark:border-slate-800 rounded-3xl bg-gradient-to-b from-purple-50/50 to-transparent dark:from-slate-800/20 relative overflow-hidden">
                         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
                         <div className="w-20 h-20 mb-4 rounded-2xl glass-card dark:bg-slate-800 shadow-xl shadow-purple-500/10 flex items-center justify-center text-purple-500 relative z-10 border border-purple-50 dark:border-slate-700">
                            <TrendingUp className="w-10 h-10 opacity-80" />
                         </div>
                         <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-200 mb-2 relative z-10">Data Collection Active</h4>
                         <p className="text-sm text-slate-500 max-w-sm leading-relaxed relative z-10">We are currently gathering platform interaction data. A dynamic growth pipeline will seamlessly render here once thresholds are met.</p>
                     </div>
                   )}
                </div>
              </div>
            </>
          )}

          {/* PARENT SPECIFIC VIEW: Performance Tracking Line Chart */}
          {userRole === 'parent' && stats && (
            <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <div onClick={() => navigate('/dashboard/performance')} className="cursor-pointer group">
                  <h3 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">Learner Progress Journey</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track actual vs target goals</p>
                </div>
                <button onClick={() => navigate('/dashboard/performance')} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                  <Download className="w-4 h-4" /> Report
                </button>
              </div>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.performanceTimeline || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                      <RechartsTooltip 
                        content={<CustomTooltip />}
                        formatter={(value, name) => [value + '%', name === 'progress' ? 'Actual Progress' : 'Target Progress']}
                      />
                      <Line type="monotone" dataKey="progress" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={3} strokeDasharray="6 6" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-8 mt-6">
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span> Actual Progress
                 </div>
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500 border-dashed"></span> Target Goal
                 </div>
              </div>
            </div>
          )}

          {(!user || userRole === 'student') && (
            <>
              {/* Student Weekly Learning Activity */}
              <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Weekly Learning Activity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Time spent learning</p>
                  </div>
                </div>
                <div className="h-[280px]">
                  {stats?.weeklyLogData && stats.weeklyLogData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.weeklyLogData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                        <RechartsTooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} formatter={(value) => [`${value} mins`, 'Time Spent']} content={<CustomTooltip />} />
                        <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 font-medium text-sm text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                        No weekly learning records found
                    </div>
                  )}
                </div>
              </div>

               {/* Course Progress Summary */}
               <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Current Course Progress</h3>
                    <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">View All Course</button>
                  </div>
                  <div className="space-y-6">
                    {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                      stats.recentEnrollments.map((course, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${course.color || 'bg-indigo-500'}`}></div>
                               {course.courseTitle}
                            </span>
                            <span className={`${course.color ? course.color.replace('bg-', 'text-') : 'text-indigo-600'}`}>{course.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${course.color || 'bg-indigo-500'}`} style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                          <p className="text-slate-500 font-medium">No real course enrollments found</p>
                      </div>
                    )}
                  </div>
               </div>
            </>
          )}

        </div>

        {/* Right Column - Smart Widgets */}
        <div className="w-full xl:w-[360px] shrink-0 space-y-6">
           
           {/* Agenda Widget */}
           <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full max-h-[500px]">
             <div className="flex justify-between items-center mb-6 shrink-0">
               <div onClick={() => navigate('/dashboard/calendar')} className="cursor-pointer group">
                  <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2 group-hover:text-indigo-600 transition-colors"><CalendarDays className="w-5 h-5 text-indigo-500" /> Agenda</h3>
                  <p className="text-xs text-slate-500 mt-1">Your upcoming events</p>
               </div>
               <div className="flex gap-2">
                 {(userRole === 'admin' || userRole === 'instructor') && (
                   <button 
                     onClick={() => setShowAgendaModal(true)}
                     className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-xl transition-colors shadow-sm shadow-indigo-500/30 flex items-center gap-1"
                   >
                     + Create
                   </button>
                 )}
               </div>
             </div>
             
             <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                 {agendaEvents.length > 0 ? (
                  agendaEvents.map(event => {
                    const isMeeting = event.type === 'meeting';
                    const isExam = event.type === 'exam';
                    const isAdvice = event.type === 'advice';
                    const isSupport = event.type === 'support';
                    
                    const colorMap = {
                      meeting: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-900',
                      exam: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-900',
                      advice: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-900',
                      support: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
                      default: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900'
                    };

                    const styleClass = colorMap[event.type] || colorMap.default;

                    return (
                      <div key={event._id} className={`p-4 rounded-2xl border glass-card dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group flex gap-4 ${styleClass.split(' ')[4]}`}>
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${styleClass.split(' ').slice(0,4).join(' ')}`}>
                           <span className="text-[10px] font-bold uppercase">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                           <span className="text-lg font-extrabold">{new Date(event.date).getDate()}</span>
                        </div>
                        <div>
                           <div className="flex justify-between items-start mb-1">
                             <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${styleClass.split(' ').slice(0,4).join(' ')}`}>
                               {event.type || 'Announcement'}
                             </span>
                           </div>
                           <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={event.title}>{event.title}</h4>
                           <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold"><Clock className="w-3 h-3" /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div onClick={() => navigate('/dashboard/calendar')} className="h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group">
                    <div className="w-16 h-16 bg-transparent dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 rounded-full flex items-center justify-center mb-3 transition-colors">
                       <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm group-hover:text-indigo-500 transition-colors">You have a clear schedule today!</p>
                  </div>
                )}
             </div>
             
             <button onClick={() => navigate('/dashboard/calendar')} className="w-full mt-4 py-3.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                View Full Calendar
             </button>
             
           </div>

            {/* Smart Alerts / Activity Timeline */}
            <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div onClick={() => navigate('/dashboard/notice')} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {userRole === 'parent' ? 'Curated Support Flags' : 'Recent Activity'}
                  </h3>
                </div>
                <span onClick={() => navigate('/dashboard/notice')} className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider cursor-pointer hover:bg-indigo-200 transition-colors">Feed</span>
              </div>
              <ActivityFeed feedType={userRole === 'parent' ? 'insights' : (userRole === 'admin' ? 'all' : 'personal')} limit={5} />
            </div>

            {/* Parent Custom Overview Pipeline */}
            {userRole === 'parent' && stats?.primaryLearner && (
               <div className="mt-8">
                 <ParentInsightGrid studentId={stats.primaryLearner.id} />
               </div>
            )}
          </div>
        </div>
      )}

      <AgendaCreationModal 
        isOpen={showAgendaModal} 
        onClose={() => setShowAgendaModal(false)}
        onCreated={() => {}}
      />
    </motion.div>
  );
}

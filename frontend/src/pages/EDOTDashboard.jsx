import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CircleDollarSign,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle,
  MoreHorizontal,
  Mail
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';

export default function EDOTDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRole = user?.role ? user.role.toLowerCase().trim() : 'student';

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
    
    if (user) {
        fetchDashboardStats();
    }
  }, [user, userRole]);

  const SmartCard = ({ title, value, icon: Icon }) => {
    let glowClass = 'hover:shadow-[0_0_25px_rgba(0,138,50,0.15)]'; // Admin fallback
    if (userRole === 'admin') {
      glowClass = 'hover:shadow-glow-green'; // low-opacity Green glow
    } else if (userRole === 'instructor') {
      glowClass = 'hover:shadow-glow-green'; // Green glow
    } else if (userRole === 'student') {
      glowClass = 'hover:shadow-glow-yellow'; // Adey Abeba Yellow
    } else if (userRole === 'parent') {
      glowClass = 'hover:shadow-[0_0_25px_rgba(0,138,50,0.2)_0_0_25px_rgba(255,215,0,0.2)]'; // Mixed Green/Yellow
    }

    return (
      <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <Card hover={false} className={`rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${glowClass}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <h3 className="text-white font-medium text-sm tracking-wide">{title}</h3>
          </div>
          <div>
            <h2 className="text-4xl font-display font-bold text-white max-w-[90%] truncate">{value}</h2>
          </div>
        </Card>
      </motion.div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B0E14]/95 backdrop-blur-xl p-4 rounded-xl border border-white/10 relative shadow-2xl">
          <p className="font-bold text-white mb-3 text-sm">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: entry.color }}></span>
                <span className="text-white font-medium">{entry.name}:</span>
                <span className="font-bold text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Configure Role-Specific Data Architectures
  let headerConfig = {};
  let statsConfig = [];
  let gaugeConfig = {};
  let areaConfig = {};
  let widgetConfig = {};

  if (userRole === 'admin') {
    headerConfig = {
      gradient: 'bg-gradient-to-r from-[#008A32]/10 to-[#FFD700]/10',
      title: 'Welcome back, Admin Kenenisa Beyan 👋',
      subtitle: ''
    };
    statsConfig = [
      { title: 'Total Courses', value: stats?.totalCourses || 9, icon: BookOpen },
      { title: 'Active Students', value: stats?.totalStudents || 8, icon: Users },
      { title: 'Instructors', value: stats?.totalInstructors || 2, icon: Briefcase },
      { title: 'Pending Courses', value: stats?.pendingCourses || 0, icon: CircleDollarSign },
    ];
    gaugeConfig = {
      title: 'Global Attendance',
      valStr: '100%',
      valNum: 100,
      ringColor: '#008A32' // Lush Highland Green
    };
    areaConfig = {
      title: 'Performance Insights',
      data: stats?.studentPerformanceData || [
         { name: 'Jan', value1: 20, value2: 10 }, { name: 'Feb', value1: 40, value2: 30 }, { name: 'Mar', value1: 35, value2: 25 }, { name: 'Apr', value1: 80, value2: 50 }, { name: 'May', value1: 60, value2: 80 }, { name: 'Aug', value1: 90, value2: 60 }
      ],
      lines: [{ key: 'value1', name: 'Subject', color: '#008A32' }, { key: 'value2', name: 'Podcast', color: '#FFD700' }]
    };
    widgetConfig = {
      type: 'agenda',
      title: 'Agenda',
      subtitle: 'Upcoming sample data',
      items: [
        { label: 'SUPPORT', title: 'concept', desc: 'Event', badge: 'Apr 2', color: '#FFD700' }
      ]
    };
  } else if (userRole === 'instructor') {
    headerConfig = {
      gradient: 'bg-gradient-to-r from-[#008A32]/10 to-[#FFD700]/10',
      title: 'Hello, Instructor Kenenisa! 🎓',
      subtitle: ''
    };
    statsConfig = [
      { title: 'Total Courses Created', value: stats?.totalCourses || 9, icon: BookOpen },
      { title: 'Active Classes', value: stats?.activeCourses || 8, icon: Briefcase },
      { title: 'Students Enrolled', value: stats?.totalStudents || 15, icon: Users },
      { title: 'Teaching Activity Score', value: '95%', icon: TrendingUp },
    ];
    gaugeConfig = {
      title: 'Course Health Score',
      valStr: '100%\nHEALTHY',
      valNum: 100,
      ringColor: '#008A32' // Lush Highland Green
    };
    areaConfig = {
      title: 'Student Engagement Insights',
      data: [
         { name: 'Jan', value1: 20, value2: 10, value3: 30 }, { name: 'Feb', value1: 40, value2: 30, value3: 45 }, { name: 'Mar', value1: 35, value2: 25, value3: 60 }, { name: 'Apr', value1: 80, value2: 50, value3: 70 }, { name: 'May', value1: 60, value2: 80, value3: 90 }, { name: 'Aug', value1: 90, value2: 60, value3: 100 }
      ],
      lines: [{ key: 'value1', name: 'Math 101', color: '#008A32' }, { key: 'value2', name: 'History 202', color: '#FFD700' }, { key: 'value3', name: 'Bio 303', color: '#E30A17' }]
    };
    widgetConfig = {
      type: 'agenda',
      title: 'Agenda',
      subtitle: 'Upcoming teaching events',
      items: [
        { label: 'Class', title: 'conceptual card', desc: 'Event', badge: 'Apr 2', color: '#008A32' }
      ]
    };
  } else if (userRole === 'student') {
    headerConfig = {
      gradient: 'bg-gradient-to-r from-[#FFD700]/10 via-[#008A32]/10 to-[#E30A17]/10',
      title: 'Welcome back, kenokana beyan! 💡\nReady to learn?',
      subtitle: ''
    };
    statsConfig = [
      { title: 'Enrolled Courses', value: stats?.totalEnrolled || 0, icon: BookOpen },
      { title: 'Average Progress', value: `${stats?.averageProgress || 0}%`, icon: TrendingUp },
      { title: 'Completed Lessons', value: stats?.completedLessons || 0, icon: CheckCircle },
      { title: 'Certificates', value: stats?.completedCourses || 0, icon: Award },
    ];
    gaugeConfig = {
      title: 'Academic Progress Ring',
      valStr: '0%\nPROGRESS',
      valNum: 0,
      ringColor: '#FFD700' // Adey Abeba Yellow
    };
    areaConfig = {
      title: 'Weekly Study Goal',
      data: [ { name: 'Jan', value1: 0 }, { name: 'Feb', value1: 0 }, { name: 'Mar', value1: 0 }, { name: 'Apr', value1: 0 }, { name: 'May', value1: 0 }, { name: 'Aug', value1: 0 } ],
      lines: [{ key: 'value1', name: 'Adey Abeba Yellow', color: '#FFD700' }]
    };
    widgetConfig = {
      type: 'claim',
      title: 'Certificates Claim',
      action: 'Claim Certificate'
    };
  } else {
    // Parent
    headerConfig = {
      gradient: 'bg-gradient-to-r from-[#008A32]/10 to-[#FFD700]/10',
      title: 'Welcome, Family Guardian! 🛡️\nHeart-centered follow-up for student success.',
      subtitle: ''
    };
    statsConfig = [
      { title: 'Students Monitored', value: stats?.totalLearners || 1, icon: Users },
      { title: 'Average Attendance', value: '100%', icon: BookOpen },
      { title: 'Growth Milestone', value: '1', icon: TrendingUp },
      { title: 'Support Tickets', value: '0', icon: Mail },
    ];
    gaugeConfig = {
      title: 'Family Growth Circle',
      valStr: '100%\nGrowth',
      valNum: 100,
      ringColor: '#008A32' // Mixed Green
    };
    areaConfig = {
      title: 'Milestone Timeline',
      data: [
         { name: 'Jan', value1: 0, value2: 0 }, { name: 'Feb', value1: 40, value2: 30 }, { name: 'Mar', value1: 40, value2: 35 }, { name: 'Apr', value1: 85, value2: 60 }, { name: 'May', value1: 65, value2: 60 }, { name: 'Aug', value1: 95, value2: 100 }
      ],
      lines: [{ key: 'value1', name: 'Lush Highland Green', color: '#008A32' }, { key: 'value2', name: 'Adey Ababa Yellow', color: '#FFD700' }]
    };
    widgetConfig = {
      type: 'communication',
      title: 'Communication',
      action: 'Message Instructor'
    };
  }

  // Generate Recharts pie gauge structure
  const gaugeData = [
    { name: 'Active', value: gaugeConfig.valNum, color: gaugeConfig.ringColor },
    { name: 'Empty', value: 100 - gaugeConfig.valNum, color: '#1E293B' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1600px] mx-auto pb-10"
    >
      {/* 1. Welcome Banner (Heritage Glow) */}
      <div className={`rounded-2xl p-8 border border-white/5 relative overflow-hidden backdrop-blur-xl bg-white/5`}>
        {/* Heritage Mesh Glow placed completely underneath text */}
        <div className={`absolute inset-0 opacity-10 pointer-events-none ${headerConfig.gradient}`}></div>
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2 whitespace-pre-line tracking-tight leading-tight">
            {headerConfig.title}
          </h1>
          {headerConfig.subtitle && (
            <p className="text-white text-lg font-medium">{headerConfig.subtitle}</p>
          )}

          <div className="mt-5">
            {userRole === 'admin' && (
              <button className="px-4 py-2 rounded-lg border border-[#FFD700] text-[#FFD700] font-semibold hover:bg-[#FFD700]/20 shadow-glow-yellow">
                + Quick Action
              </button>
            )}
            {userRole === 'instructor' && (
              <button className="px-4 py-2 rounded-lg border border-[#008A32] text-[#008A32] font-semibold hover:bg-[#008A32]/20 shadow-glow-green">
                + Create New Course
              </button>
            )}
            {userRole === 'student' && (
              <button className="px-4 py-2 rounded-lg border border-[#FFD700] text-[#0f172a] font-semibold hover:bg-[#FFD700]/20 shadow-glow-yellow">
                + Start a Lesson
              </button>
            )}
            {userRole === 'parent' && (
              <button className="px-4 py-2 rounded-lg border border-[#FFD700] text-[#FFD700] font-semibold hover:bg-[#FFD700]/20 shadow-glow-yellow">
                ✉️ Message Instructor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Stats Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsConfig.map((stat, i) => (
          <SmartCard key={i} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* 3. Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Widget: Radial Gauge */}
        <Card hover={false} className="lg:col-span-3 rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center relative min-h-[350px]">
          <h3 className="font-semibold text-sm text-white absolute top-6 left-6">{gaugeConfig.title}</h3>
          
          <div className="w-full flex-1 flex flex-col justify-center items-center relative mt-8">
             <ResponsiveContainer width="100%" height="90%">
               <PieChart>
                 <Pie 
                   data={gaugeData} 
                   cx="50%" 
                   cy="50%" 
                   innerRadius={70} 
                   outerRadius={90} 
                   paddingAngle={0} 
                   dataKey="value" 
                   stroke="none" 
                   cornerRadius={userRole === 'student' ? 40 : 0} 
                   startAngle={90} 
                   endAngle={-270}
                 >
                   {gaugeData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pt-2">
                {gaugeConfig.valStr.split('\n').map((line, i) => (
                  <span key={i} className={i === 0 ? "text-3xl font-display font-bold text-white mb-1" : "text-xs font-bold text-slate-400 uppercase tracking-widest"}>
                    {line}
                  </span>
                ))}
             </div>
          </div>
        </Card>

        {/* Right Widget: Line/Area Chart */}
        <Card hover={false} className="lg:col-span-6 rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="font-semibold text-sm text-white">{areaConfig.title}</h3>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">
              Recharts <MoreHorizontal className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-white mb-4">
             {areaConfig.lines.map((line, i) => (
               <span key={i} className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }}></div> 
                 {line.name}
               </span>
             ))}
          </div>

          <div className="flex-1 w-full relative min-h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaConfig.data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    {areaConfig.lines.map((line, i) => (
                      <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={line.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={line.color} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  {areaConfig.lines.map((line, i) => (
                    <Area key={i} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2.5} fillOpacity={1} fill={`url(#color${i})`} activeDot={{ r: 5, fill: line.color, stroke: '#fff', strokeWidth: 2 }} />
                  ))}
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </Card>

        {/* Agenda / Claim Widget (Bottom Right) */}
        <Card hover={false} className="lg:col-span-3 rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg flex flex-col min-h-[350px]">
           {widgetConfig.type === 'agenda' && (
             <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-sm text-white">{widgetConfig.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{widgetConfig.subtitle}</p>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 space-y-3">
                  {widgetConfig.items.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-bold text-slate-900 px-2 py-0.5 rounded-sm uppercase" style={{ backgroundColor: item.color }}>{item.label}</span>
                         <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{item.badge}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1.5">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                      <div className="flex -space-x-2 mt-4 mt-auto">
                        {['A', 'B', 'C'].map((av, idx) => (
                           <div key={idx} className="w-6 h-6 rounded-full border-2 border-[#151e2b] bg-slate-700 flex items-center justify-center overflow-hidden">
                             <img src={`https://ui-avatars.com/api/?name=${av}&background=random&size=24`} alt="user" />
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
             </>
           )}

           {widgetConfig.type === 'claim' && (
             <>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-semibold text-sm text-slate-200">{widgetConfig.title}</h3>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 mb-6 opacity-80">
                     {/* Placeholder logic mirroring Master Spec SVG expectations for Certificates */}
                     <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="20" y="25" width="40" height="50" rx="4" fill="#E2E8F0" />
                        <rect x="30" y="15" width="45" height="55" rx="4" fill="#CBD5E1" />
                        <rect x="40" y="20" width="50" height="60" rx="4" fill="#F8FAFC" />
                        <circle cx="65" cy="50" r="12" fill="#FFD700" />
                        <circle cx="65" cy="50" r="9" fill="#FDE047" />
                        <circle cx="65" cy="50" r="6" fill="#FEF08A" />
                        <path d="M57 60 L61 75 L65 70 L69 75 L73 60" fill="#FFD700" />
                     </svg>
                  </div>
                  <button className="w-full py-3 bg-[#FFD700] hover:bg-[#EAB308] text-slate-900 font-bold rounded-xl transition-colors text-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    {widgetConfig.action}
                  </button>
                </div>
             </>
           )}

           {widgetConfig.type === 'communication' && (
             <>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-semibold text-sm text-white">{widgetConfig.title}</h3>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#008A32]/20 to-[#FFD700]/20 flex items-center justify-center border border-[#008A32]/30">
                     <Mail className="w-10 h-10 text-[#FFD700]" />
                  </div>
                  <button className="w-full py-3 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-slate-900 font-bold rounded-xl transition-all text-sm shadow-[inset_0_0_15px_rgba(255,215,0,0.1)]">
                    {widgetConfig.action}
                  </button>
                </div>
             </>
           )}
        </Card>

      </div>
    </motion.div>
  );
}

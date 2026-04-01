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
  Award
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

export default function EDOTDashboard() {
  const { user } = useAuth();
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

  // Mock Data
  const studentPerformanceData = [
    { name: 'Mon', value1: 40, value2: 30, value3: 20 },
    { name: 'Tue', value1: 50, value2: 40, value3: 30 },
    { name: 'Wed', value1: 45, value2: 35, value3: 25 },
    { name: 'Thu', value1: 60, value2: 50, value3: 40 },
    { name: 'Fri', value1: 55, value2: 45, value3: 35 },
  ];

  const teachingActivityData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 30 },
    { name: 'Mar', value: 60 },
    { name: 'Apr', value: 45 },
    { name: 'May', value: 70 },
    { name: 'Jun', value: 65 },
  ];

  const attendanceData = [
    { name: 'Present', value: 80, color: '#a78bfa' },
    { name: 'Absent', value: 20, color: '#fcd34d' }
  ];

  const StatCard = ({ title, value, percentage, isPositive, icon: Icon, iconColor, bgColor }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        {percentage && (
           <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
             {isPositive ? '+' : '-'}{percentage}%
           </span>
        )}
      </div>
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2dd4bf] to-[#6366f1] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-lg">
          <p className="text-teal-100 font-medium mb-2 uppercase tracking-wider text-sm">Dashboard</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {userRole === 'admin' ? `Welcome back, Admin ${user?.name || ''}` :
             userRole === 'instructor' ? `Your teaching classes are performing great!` :
             userRole === 'parent' ? (stats?.primaryLearner ? `Welcome back! You’re supporting ${stats.primaryLearner.name} 👋` : `Welcome back, Parent 👋`) :
             `Welcome back, ${user?.name || ''}! Ready to learn?`}
          </h1>
          
          {userRole === 'parent' && stats?.primaryLearner ? (
            <div className="flex items-center gap-4 mt-2 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-max">
               <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 bg-indigo-50 flex items-center justify-center">
                  <img 
                    src={`http://localhost:5000/uploads/avatars/${stats.primaryLearner.avatar || 'default-avatar.png'}`} 
                    alt={stats.primaryLearner.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(stats.primaryLearner.name) + '&background=random'; }}
                  />
               </div>
               <div>
                  <p className="text-teal-50 font-medium text-sm">Here is {stats.primaryLearner.name}'s latest learning progress and activities.</p>
                  <p className="text-xs text-white/80 font-bold mt-1 tracking-wide">{stats.averageProgress}% Average Progress &bull; {stats.completedLessons} Lessons Completed</p>
               </div>
            </div>
          ) : (
             <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-full font-medium transition-colors border border-white/30">
               View Details
             </button>
          )}
        </div>
        {/* Decorative elements to mimic the 3D illustration in the image */}
        <div className="absolute right-[-20px] top-[-30px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute right-[10%] bottom-[-20px] w-40 h-40 bg-indigo-500/40 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userRole === 'admin' && stats ? (
          <>
            <StatCard title="Total Courses" value={stats.totalCourses} isPositive={true} />
            <StatCard title="Total Students" value={stats.totalStudents} isPositive={true} />
            <StatCard title="Total Instructors" value={stats.totalInstructors} isPositive={true} /> 
            <StatCard title="Total Income" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} isPositive={true} />
          </>
        ) : userRole === 'instructor' && stats ? (
          <>
            <StatCard title="Active Classes" value={stats.activeCourses} isPositive={true} />
            <StatCard title="Total Students" value={stats.totalStudents} isPositive={true} />
            <StatCard title="Total Lessons" value={stats.totalLessons} isPositive={true} /> 
            <StatCard title="Total Drafts" value={stats.totalCourses - stats.activeCourses} isPositive={false} />
          </>
        ) : userRole === 'parent' && stats ? (
          <>
            <StatCard title="Total Learners" value={stats.totalLearners} isPositive={true} />
            <StatCard title="Total Enrolled Courses" value={stats.totalEnrolledCourses} isPositive={true} />
            <StatCard title="Average Progress" value={`${stats.averageProgress}%`} isPositive={true} /> 
            <StatCard title="Completed Lessons" value={stats.completedLessons} isPositive={true} />
          </>
        ) : stats ? (
          <>
            <StatCard title="Enrolled Courses" value={stats.totalEnrolled} isPositive={true} />
            <StatCard title="Average Progress" value={`${stats.averageProgress}%`} isPositive={true} />
            <StatCard title="Completed Lessons" value={stats.completedLessons} isPositive={true} /> 
            <StatCard title="Certificates" value={stats.completedCourses || 0} isPositive={true} />
          </>
        ) : (
          <div className="col-span-full text-center py-4 text-slate-500">Loading stats...</div>
        )}
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column - Charts */}
        <div className="flex-1 space-y-6">
          
          {(userRole === 'admin' || userRole === 'instructor') && (
            <>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Student Attendance */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">{user?.role === 'admin' ? 'Global Attendance' : 'Class Attendance'}</h3>
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  <div className="h-64 flex flex-col justify-center items-center relative">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={attendanceData}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={95}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                         >
                           {attendanceData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       </PieChart>
                     </ResponsiveContainer>
                     {/* Center Label */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-800">80%</span>
                     </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#a78bfa]"></span> Present
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#fcd34d]"></span> Absent
                     </div>
                  </div>
                </div>

                {/* Student Performance */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">Student Performance</h3>
                    <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      Weekly <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={studentPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={10}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value1" fill="#818cf8" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="value2" fill="#fbbf24" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="value3" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#818cf8]"></span> Class A
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#fbbf24]"></span> Class B
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-[#38bdf8]"></span> Class C
                     </div>
                  </div>
                </div>
              </div>

              {/* Teaching Activity Line Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">{user?.role === 'admin' ? 'Platform Growth' : 'Teaching Activity'}</h3>
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    Monthly <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[280px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={teachingActivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* PARENT SPECIFIC VIEW: Performance Tracking Line Chart */}
          {userRole === 'parent' && stats && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Learner Performance Progress</h3>
                <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  Last 7 Weeks <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.performanceTimeline || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        formatter={(value, name) => [value + '%', name === 'progress' ? 'Actual Progress' : 'Target Progress']}
                      />
                      <Line type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-indigo-600"></span> Actual Progress
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-slate-400 border border-slate-400 border-dashed"></span> Target Goal
                 </div>
              </div>
            </div>
          )}

          {(!user || userRole === 'student') && (
            <>
              {/* Student Weekly Learning Activity */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">Weekly Learning Activity</h3>
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    This Week <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { name: 'Mon', minutes: 45 }, { name: 'Tue', minutes: 0 }, { name: 'Wed', minutes: 60 }, { name: 'Thu', minutes: 120 }, { name: 'Fri', minutes: 30 }, { name: 'Sat', minutes: 90 }, { name: 'Sun', minutes: 15 }
                    ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value) => [`${value} mins`, 'Time Spent']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="minutes" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

               {/* Course Progress Summary */}
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">Current Course Progress</h3>
                  <div className="space-y-6">
                    {(stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? stats.recentEnrollments : [
                      { courseTitle: 'Introduction to React', progress: 75 },
                      { courseTitle: 'Advanced UI/UX Design', progress: 40 },
                      { courseTitle: 'Backend Development Node.js', progress: 15 }
                    ]).map((course, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-slate-700">
                          <span>{course.courseTitle}</span>
                          <span className="text-indigo-600">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </>
          )}

        </div>

        {/* Right Column - Widgets */}
        <div className="w-full xl:w-[320px] shrink-0 space-y-6">
           
           {/* Mini Calendar Widget */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800">March 2030</h3>
               <button className="text-slate-400 hover:text-slate-600"><CalendarDays className="w-5 h-5" /></button>
             </div>
             
             <div className="grid grid-cols-7 gap-1 text-xs font-medium text-slate-400 mb-2">
               <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
             </div>
             <div className="grid grid-cols-7 gap-1 text-sm font-semibold text-slate-700">
               {/* Just mocking days perfectly aligned to show intent */}
               <div className="p-2 text-slate-300">24</div>
               <div className="p-2 text-slate-300">25</div>
               <div className="p-2 text-slate-300">26</div>
               <div className="p-2 text-slate-300">27</div>
               <div className="p-2 text-slate-300">28</div>
               <div className="p-2 text-slate-300">1</div>
               <div className="p-2">2</div>
               {Array.from({length: 28}, (_, i) => (
                 <div key={i} className={`p-2 rounded-full flex items-center justify-center ${
                   i + 3 === 20 ? 'bg-indigo-600 text-white' : 
                   i + 3 === 14 ? 'bg-amber-100 text-amber-600' : 
                   ''
                 }`}>
                   {i + 3}
                 </div>
               ))}
               <div className="p-2 text-slate-300">1</div>
             </div>
           </div>

           {/* Agenda Widget */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800">Agenda</h3>
               <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
             </div>
             <div className="space-y-4">
               {(userRole === 'parent' && stats?.primaryLearner ? [
                 { time: 'Tomorrow, 10:00 AM', title: `${stats.primaryLearner.name.split(' ')[0]}'s Math Final Exam`, color: 'bg-rose-50 border-rose-200', text: 'text-rose-800', dot: 'bg-rose-500', id: 1 },
                 { time: 'Friday, 02:00 PM', title: 'Parent-Teacher Meeting', color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500', id: 2 },
                 { time: 'Next Monday', title: 'Science Project Due', color: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500', id: 3 }
               ] : [
                 { time: '09:00 AM - 10:00 AM', title: 'Meeting with Ato Abebe', id: 1, dot: 'bg-slate-400' },
                 { time: '11:00 AM - 12:00 PM', title: 'Meskel Celebration Prep', color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500', id: 2 },
                 { time: '01:00 PM - 02:00 PM', title: 'Prepare for Tomorrow\'s Debate', id: 3, dot: 'bg-slate-400' }
               ]).map(agenda => (
                 <div key={agenda.id} className={`p-4 rounded-2xl border ${agenda.color || 'bg-slate-50 border-slate-100'}`}>
                   <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                     <span className={`w-2 h-2 rounded-full ${agenda.dot}`}></span>
                     {agenda.time}
                   </p>
                   <h4 className={`font-bold ${agenda.text || 'text-slate-800'} leading-tight`}>{agenda.title}</h4>
                 </div>
               ))}
             </div>
             <button className="w-full mt-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                View All
             </button>
           </div>

            {/* PARENT SPECIFIC WIDGET: Smart Notifications */}
            {userRole === 'parent' && stats && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-lg text-slate-800">Smart Alerts</h3>
                  </div>
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">{stats.recentActivity?.length || 0} New</span>
                </div>
                <div className="space-y-4">
                  {(stats.recentActivity || []).map(activity => (
                    <div key={activity.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start flex-col">
                      <div className="flex items-center gap-2 mb-1 w-full text-xs font-bold uppercase tracking-wide">
                        {activity.type === 'course_completed' && <span className="text-emerald-500 flex items-center gap-1"><Award className="w-3 h-3" /> COMPLETED</span>}
                        {activity.type === 'quiz_passed' && <span className="text-amber-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PASSED QUIZ</span>}
                        {activity.type === 'lesson_watched' && <span className="text-indigo-500 flex items-center gap-1"><Clock className="w-3 h-3" /> RECENT ACTIVITY</span>}
                      </div>
                      <h4 className="text-slate-800 font-bold text-sm mb-1">{activity.studentName} {activity.type === 'course_completed' ? 'finished the course:' : activity.type.includes('quiz') ? 'scored '+ activity.score+'% on' : 'just finished watching'} <span className="text-indigo-600">{activity.title}</span></h4>
                      <p className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded inline-block mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

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
  CalendarDays
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function SchoolHubDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const role = user?.role || 'student';
        const { data } = await api.get(`/${role}/dashboard`);
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
  }, [user]);

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
        {/* We can put an icon or graphic here if strictly adhering, mockups show numbers boldly. */}
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
            {user?.role === 'admin' ? `Welcome back, Admin ${user?.name || ''}` :
             user?.role === 'instructor' ? `Your teaching classes are performing great!` :
             `Welcome back, ${user?.name || ''}! Ready to learn?`}
          </h1>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-full font-medium transition-colors border border-white/30">
            View Details
          </button>
        </div>
        {/* Decorative elements to mimic the 3D illustration in the image */}
        <div className="absolute right-[-20px] top-[-30px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute right-[10%] bottom-[-20px] w-40 h-40 bg-indigo-500/40 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {user?.role === 'admin' && stats ? (
          <>
            <StatCard title="Total Courses" value={stats.totalCourses} isPositive={true} />
            <StatCard title="Total Students" value={stats.totalStudents} isPositive={true} />
            <StatCard title="Total Instructors" value={stats.totalInstructors} isPositive={true} /> 
            <StatCard title="Total Income" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} isPositive={true} />
          </>
        ) : user?.role === 'instructor' && stats ? (
          <>
            <StatCard title="Active Classes" value={stats.activeCourses} isPositive={true} />
            <StatCard title="Total Students" value={stats.totalStudents} isPositive={true} />
            <StatCard title="Total Lessons" value={stats.totalLessons} isPositive={true} /> 
            <StatCard title="Total Drafts" value={stats.totalCourses - stats.activeCourses} isPositive={false} />
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
          
          {(user?.role === 'admin' || user?.role === 'instructor') && (
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

          {(!user || user?.role === 'student') && (
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
               {[
                 { time: '09:00 AM - 10:00 AM', title: 'Meeting with Ato Abebe', id: 1 },
                 { time: '11:00 AM - 12:00 PM', title: 'Meskel Celebration Prep', color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', id: 2 },
                 { time: '01:00 PM - 02:00 PM', title: 'Prepare for Tomorrow\'s Debate', id: 3 }
               ].map(agenda => (
                 <div key={agenda.id} className={`p-4 rounded-2xl border ${agenda.color || 'bg-slate-50 border-slate-100'}`}>
                   <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                     <span className={`w-2 h-2 rounded-full ${agenda.color ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
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
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Download, Filter, ArrowLeft, TrendingUp, Users, BookOpen, CircleDollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AnalyticsReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
     revenueData: [],
     engagementData: [],
     courseCompletionData: [],
     totalRevenue: 0,
     totalActiveLearners: 0,
     totalCourseCompletions: 0
  });

  const COLORS = ['#10b981', '#6366f1', '#f59e0b'];

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
       try {
          const userRole = user?.role ? user.role.toLowerCase().trim() : 'student';
          // Since this page is advanced, student will default to empty data arrays or a restricted backend route
          const { data } = await api.get(`/${userRole}/analytics/detailed`);
          if (data.success) {
             setReportData(data.data);
          }
       } catch (error) {
          console.error("Failed to fetch precise detailed analytics", error);
       } finally {
          setLoading(false);
       }
    };

    if (user) {
        fetchDetailedAnalytics();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header section with back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detailed Data Report</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive overview of platform analytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-transparent hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-indigo-500/20">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
           <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Report Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 glass-card/10 rounded-full blur-2xl"></div>
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-4">
                   <div className="p-2 glass-card/20 rounded-xl backdrop-blur-sm"><CircleDollarSign className="w-6 h-6" /></div>
                   <span className="flex items-center gap-1 text-sm font-bold glass-card/20 px-2 py-1 rounded-full backdrop-blur-sm"><TrendingUp className="w-3 h-3" /> 24%</span>
                 </div>
                 <h2 className="text-3xl font-extrabold mb-1">${(reportData.totalRevenue || 0).toLocaleString()}</h2>
                 <p className="text-indigo-100 font-medium">{user?.role === 'admin' ? 'Total Quarterly Revenue' : 'Total Course Earnings'}</p>
               </div>
             </div>
             
             <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl"><Users className="w-6 h-6" /></div>
               </div>
               <div>
                 <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-1">{reportData.totalActiveLearners || 0}</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">Active Learners</p>
               </div>
             </div>

             <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                 <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl"><BookOpen className="w-6 h-6" /></div>
               </div>
               <div>
                 <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-1">{reportData.totalCourseCompletions || 0}</h2>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">Course Completions</p>
               </div>
             </div>
           </div>

           {/* Detailed Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue Trajectory</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Platform Engagement</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students" />
                      <Bar dataKey="teachers" fill="#10b981" radius={[4, 4, 0, 0]} name="Teachers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
           </div>

           {/* Footer Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center">
                <div className="h-48 w-1/2">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={reportData.courseCompletionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {(reportData.courseCompletionData || []).map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-4">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Course Status Overview</h3>
                   <div className="space-y-3">
                     {(reportData.courseCompletionData || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                           </div>
                           <span className="font-bold text-slate-800 dark:text-white">{item.value}</span>
                        </div>
                     ))}
                   </div>
                </div>
             </div>

             <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm flex flex-col justify-center">
               <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mb-2">Automated Insight</h3>
               <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed text-sm mb-4">
                 Platform performance is actively monitored. Automated insights will generate here automatically once enough interaction data aligns with system thresholds.
               </p>
               <button className="self-start text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                 Create Reminder Campaign
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-[#11151F]/5 hover:bg-[#11151F]/10 rounded-full transition-colors text-slate-200 hover:text-white border border-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-black text-white tracking-wide">Detailed Data Report</h1>
            <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mt-1">Comprehensive overview of platform analytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#11151F]/5 hover:bg-[#11151F]/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/10">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#008A32] to-[#006622] hover:shadow-[0_0_15px_rgba(0,138,50,0.4)] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
           <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Report Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gradient-to-br from-[#FFD700] to-yellow-600 rounded-3xl p-6 text-black shadow-[0_0_30px_rgba(255,215,0,0.2)] relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer">
               <div className="absolute right-0 top-0 w-32 h-32 bg-[#11151F]/20 rounded-full blur-2xl group-hover:bg-[#11151F]/30 transition-all"></div>
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-4">
                   <div className="p-2 bg-black/10 rounded-xl backdrop-blur-sm shadow-inner"><CircleDollarSign className="w-6 h-6" /></div>
                   <span className="flex items-center gap-1 text-[10px] font-black bg-black/10 px-2 py-1 rounded-md backdrop-blur-sm uppercase tracking-wider"><TrendingUp className="w-3 h-3" /> +24%</span>
                 </div>
                 <h2 className="text-4xl font-black mb-1">${(reportData.totalRevenue || 0).toLocaleString()}</h2>
                 <p className="text-black/70 font-bold uppercase tracking-widest text-xs mt-2">{user?.role === 'admin' ? 'Total Quarterly Revenue' : 'Total Course Earnings'}</p>
               </div>
             </div>
             
             <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
               <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-[#008A32]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                 <div className="p-3 bg-[#008A32]/10 border border-[#008A32]/30 text-[#008A32] rounded-xl"><Users className="w-6 h-6" /></div>
               </div>
               <div className="relative z-10">
                 <h2 className="text-4xl font-black text-white mb-2">{reportData.totalActiveLearners || 0}</h2>
                 <p className="text-[#008A32] font-bold text-xs uppercase tracking-widest">Active Learners</p>
               </div>
             </div>

             <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
               <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-blue-500/100/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                 <div className="p-3 bg-blue-500/100/10 border border-blue-500/30 text-blue-400 rounded-xl"><BookOpen className="w-6 h-6" /></div>
               </div>
               <div className="relative z-10">
                 <h2 className="text-4xl font-black text-white mb-2">{reportData.totalCourseCompletions || 0}</h2>
                 <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">Course Completions</p>
               </div>
             </div>
           </div>

           {/* Detailed Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Revenue Trajectory</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Platform Engagement</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }} />
                      <Bar dataKey="students" fill="#008A32" radius={[6, 6, 0, 0]} name="Students" barSize={20} />
                      <Bar dataKey="teachers" fill="#4B5563" radius={[6, 6, 0, 0]} name="Teachers" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
           </div>

           {/* Footer Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex items-center">
                <div className="h-48 w-1/2">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={reportData.courseCompletionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                         {(reportData.courseCompletionData || []).map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0B0E14', color: '#fff' }} />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-6">
                   <h3 className="text-lg font-bold text-white mb-5">Course Overview</h3>
                   <div className="space-y-4">
                     {(reportData.courseCompletionData || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color || COLORS[idx%COLORS.length] }}></span>
                              <span className="text-slate-200 font-bold uppercase tracking-widest text-[10px]">{item.name}</span>
                           </div>
                           <span className="font-black text-white">{item.value}</span>
                        </div>
                     ))}
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0B0E14] p-8 rounded-3xl border border-white/5 shadow-inner flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
               <h3 className="text-xl font-bold text-[#FFD700] mb-3 relative z-10">Automated Insight AI</h3>
               <p className="text-slate-200 font-medium leading-relaxed text-sm mb-6 relative z-10">
                 Platform performance is actively monitored. Automated insights will generate here automatically once enough interaction data aligns with algorithmic thresholds.
               </p>
               <button className="self-start text-xs font-black uppercase tracking-widest bg-[#11151F]/10 text-white px-6 py-3 rounded-xl hover:bg-[#11151F]/20 transition-all border border-white/10 relative z-10 hover:shadow-lg">
                 Generate Briefing
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

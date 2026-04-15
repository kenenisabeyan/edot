import React, { useState, useEffect } from 'react';
import { HeartHandshake, Users, GraduationCap, ArrowRight, ShieldCheck, HandCoins, Search, CheckCircle2, Wallet, RefreshCw, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const response = await api.get('/support/dashboard');
      if (response.data.success) {
        setData(response.data.data);
        setLastUpdated('just now');
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error connecting to Server');
      console.error('Support API Error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Simulate real-time timestamp decay
    const interval = setInterval(() => {
      setLastUpdated('1 min ago');
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const staticStatsConfigs = [
    { label: 'Total Contributions', key: 'totalContributions', icon: Wallet, gradient: 'from-emerald-500/20 to-[#11151F]', color: 'text-emerald-400', format: (v) => `$${v.toLocaleString()}` },
    { label: 'Active Sponsors', key: 'activeSponsors', icon: HeartHandshake, gradient: 'from-indigo-500/20 to-[#11151F]', color: 'text-indigo-400', format: (v) => v },
    { label: 'Supported Students', key: 'supportedStudents', icon: GraduationCap, gradient: 'from-cyan-500/20 to-[#11151F]', color: 'text-cyan-400', format: (v) => v },
    { label: 'Active Support Cycles', key: 'activeCycles', icon: RefreshCw, gradient: 'from-amber-500/20 to-[#11151F]', color: 'text-amber-400', format: (v) => v },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/3 h-10 bg-[#11151F] rounded-lg animate-pulse" />
          <div className="w-40 h-12 bg-[#11151F] rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-[#11151F] rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-[#11151F] rounded-3xl animate-pulse w-full" />
        <div className="h-96 bg-[#11151F] rounded-3xl animate-pulse w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  const { stats = null, supportedStudents = [], recentImpact = [], currentCycle = null } = data || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <HeartHandshake className="w-8 h-8 text-indigo-500" />
              Support & Sponsorship
            </h1>
            <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-black tracking-widest rounded-lg flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-indigo-400/90 mt-3 font-semibold tracking-wide text-lg flex items-center gap-3">
            “Supporting continuous learning for every student.”
            <span className="text-xs text-slate-300 font-medium tracking-normal flx items-center">
              • Updated {lastUpdated}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchDashboardData(true)} 
            className="p-3 rounded-xl bg-[#11151F] border border-white/5 text-slate-200 hover:text-white hover:bg-white/5 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2 border-0">
            <HandCoins className="w-5 h-5" />
            Become a Sponsor
          </button>
        </div>
      </div>

      {/* Metrics Row (SECTION 1 - SUPPORT POOL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {staticStatsConfigs.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} border-0 flex flex-col shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform relative overflow-hidden group`}>
            {/* Soft decorative blur */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${stat.color} pointer-events-none group-hover:opacity-40 transition-opacity`} />
            
            <div className="flex items-center gap-3 mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
              <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">{stat.label}</p>
            </div>
            
            <div>
              <h3 className="text-4xl font-black text-white">{stats ? stat.format(stats[stat.key]) : '0'}</h3>
            </div>
          </div>
        ))}
      </div>

      {currentCycle && (
      <div className="bg-[#11151F] border-0 rounded-3xl p-8 shadow-2xl shadow-indigo-900/10 relative overflow-hidden group mb-8">
        {/* SECTION 3 - SUPPORT CYCLE TRACKING */}
        {/* Soft immersive background flare */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-indigo-400" />
              Active Support Cycle
            </h2>
            <p className="text-sm text-slate-200 mt-2 font-medium">Tracking the current primary sponsorship journey.</p>
          </div>
          <div>
             <span className="inline-flex px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-0 rounded-xl shadow-md">
                Contribution Status: {currentCycle.funded}% Funded
             </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-center bg-[#0B0E14] border-0 rounded-2xl p-6 relative z-10 shadow-lg">
          {/* Student Focus */}
          <div className="flex items-center gap-5 min-w-[280px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center font-black text-2xl text-indigo-400 border-0 shadow-inner">
              {currentCycle.studentName?.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] text-slate-200 font-bold uppercase tracking-widest mb-1">Currently Supported</p>
              <h4 className="font-bold text-white tracking-wide text-lg leading-tight mb-0.5">{currentCycle.studentName}</h4>
              <p className="text-xs text-indigo-400 font-bold">{currentCycle.courseName}</p>
            </div>
          </div>

          {/* Horizontal Step Timeline */}
          <div className="flex-1 w-full pt-6 pb-2 px-2 sm:px-8">
             <div className="relative flex justify-between items-center w-full">
                {/* Background Track */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-[#11151F] border border-white/5 rounded-full z-0"></div>
                {/* Active Progress Track */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-indigo-500 rounded-full z-0 shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-1000" style={{ width: `${Math.max(10, currentCycle.progress)}%` }}></div>

                {/* Nodes */}
                {[
                  { label: "Funding Started", completed: true, active: false },
                  { label: "Learning in Progress", completed: currentCycle.progress > 0, active: currentCycle.progress > 0 && currentCycle.progress < 75 },
                  { label: "Near Completion", completed: currentCycle.progress >= 75, active: currentCycle.progress >= 75 && currentCycle.progress < 100 },
                  { label: "Completed", completed: currentCycle.progress === 100, active: currentCycle.progress === 100 }
                ].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#0B0E14] transition-all duration-500 ${step.completed ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110' : 'bg-[#11151F]'}`}>
                      {step.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    {/* Node Text */}
                    <div className="absolute top-12 text-center w-24 sm:w-32 -ml-12 sm:-ml-16">
                       <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step.active ? 'text-white' : step.completed ? 'text-indigo-400' : 'text-slate-400'}`}>
                         {step.label}
                       </p>
                    </div>
                  </div>
                ))}
             </div>
             {/* Spacer to accommodate absolute positioned labels */}
             <div className="h-10"></div> 
          </div>
        </div>
      </div>
      )}

      {/* Content Tabs */}
      <div className="bg-[#11151F] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-white/5 px-8">
          <button 
            onClick={() => setActiveTab('students')}
            className={`py-6 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'students' ? 'text-indigo-400' : 'text-slate-200 hover:text-white'}`}
          >
            Supported Students
            {activeTab === 'students' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-400 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('impact')}
            className={`py-6 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'impact' ? 'text-emerald-400' : 'text-slate-200 hover:text-white'}`}
          >
            Recent Impact Log
            {activeTab === 'impact' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-400 rounded-t-full shadow-[0_-2px_10px_rgba(52,211,153,0.5)]" />}
          </button>
        </div>

        {/* Tab Content: Supported Students */}
        {activeTab === 'students' && (
          <div className="p-8 space-y-6">
            
            {/* Search/Filter Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search learners securely..."
                  className="w-full pl-12 pr-4 py-3 bg-[#0B0E14] border border-white/5 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {supportedStudents.map((student) => (
                <div key={student.id} className="bg-[#0B0E14] p-6 rounded-[2rem] border-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all group duration-300 flex flex-col h-full bg-gradient-to-b from-[#11151F]/40 to-transparent">
                  
                  {/* Top Row: Avatar & Metadata */}
                  <div className="flex justify-between items-start mb-6 w-full">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full ${student.avatar} flex items-center justify-center font-black text-lg border-0 shadow-inner`}>
                        {student.name.charAt(0)}
                      </div>
                      
                      {/* Basic Info */}
                      <div>
                        <h4 className="font-bold text-white tracking-wide">{student.name}</h4>
                        <p className="text-xs text-slate-200 mt-1 font-medium">{student.course}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                      {student.status === 'active' && <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-0 rounded-xl shadow-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active</span>}
                      {student.status === 'at-risk' && <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border-0 rounded-xl shadow-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> At Risk</span>}
                      {student.status === 'completed' && <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-500 border-0 rounded-xl shadow-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Completed</span>}
                    </div>
                  </div>
                  
                  {/* Bottom Row: Animated Progress */}
                  <div className="mt-auto pt-2">
                    <div className="flex justify-between items-end text-xs font-bold mb-3">
                      <span className="text-slate-200 uppercase tracking-widest text-[10px]">Academic Progress</span>
                      <span className={`${student.progress === 100 ? 'text-cyan-500' : 'text-slate-300'}`}>{student.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#11151F] border-0 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${student.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : student.status === 'at-risk' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} 
                        style={{ width: `${student.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Impact Log */}
        {activeTab === 'impact' && (
          <div className="p-8">
             <div className="space-y-4">
               {recentImpact.map((log) => (
                 <div key={log.id} className="flex items-center justify-between p-5 bg-[#0B0E14] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors">
                   <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                       <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div>
                       <p className="text-white font-medium">
                         <span className="font-bold text-emerald-400">{log.sponsor}</span> supported <span className="font-bold">{log.student}</span>
                       </p>
                       <p className="text-sm text-slate-200 mt-1">{log.type}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{log.date}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* SECTION 4 - EMOTIONAL IMPACT & TRANSPARENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Trust & Transparency Banner */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-[#0B0E14] p-8 rounded-[2rem] border-0 shadow-2xl flex gap-6 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center border-0 text-emerald-500 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">100% Direct Impact Protocol</h3>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">All students are independently verified. Every sponsorship contribution actively circumvents overhead and is instantly routed to secure educational access, vital learning apparatus, and core instructional resources. No middlemen.</p>
          </div>
        </div>

        {/* The Impact Panel (Secret Weapon 🔥) */}
        <div className="bg-gradient-to-l from-indigo-900/30 to-[#0B0E14] p-8 rounded-[2rem] border-0 shadow-2xl relative overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-indigo-500" /> 
              Real Human Impact
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-[#11151F] border-0 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-transform">
                <Users className="w-6 h-6 text-indigo-500 mb-2 opacity-80" />
                <h4 className="text-3xl font-black text-white mb-1">{stats?.supportedStudents || 0}</h4>
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Students Supported</p>
              </div>

              <div className="p-5 bg-[#11151F] border-0 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-transform">
                <GraduationCap className="w-6 h-6 text-cyan-500 mb-2 opacity-80" />
                <h4 className="text-3xl font-black text-white mb-1">{supportedStudents?.filter(s => s.status === 'completed').length || 0}</h4>
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest leading-tight">Courses Completed</p>
              </div>

              <div className="p-5 bg-[#11151F] border-0 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-transform">
                <RefreshCw className="w-6 h-6 text-emerald-500 mb-2 opacity-80" />
                <h4 className="text-3xl font-black text-white mb-1">{stats?.activeCycles || 0}</h4>
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest leading-tight">Lives In Progress</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

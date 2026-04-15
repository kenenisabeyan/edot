import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { Activity, LogIn, BookOpen, CheckCircle, Settings, MessageSquare, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ActivityFeed({ isAdmin = false, feedType, limit = 5 }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterType = feedType || (isAdmin ? 'all' : 'personal');

  const fetchActivities = useCallback(async () => {
    try {
      const endpoint = filterType === 'all' ? '/activity/all' : filterType === 'insights' ? '/activity/insights' : '/activity';
      const res = await api.get(endpoint);
      if (res.data.success) {
        setActivities(res.data.data.slice(0, limit));
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [filterType, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleFlag = async (id, flagType) => {
    try {
      await api.put(`/activity/${id}/flag`, { insightFlag: flagType });
      fetchActivities(); // refresh instantly
    } catch(err) {
      console.error('Failed to flag activity', err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'auth': return <LogIn className="w-5 h-5 text-[#FFD700]" />;
      case 'course': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'enrollment': return <CheckCircle className="w-5 h-5 text-[#008A32]" />;
      case 'learning': return <Activity className="w-5 h-5 text-purple-400" />;
      case 'communication': return <MessageSquare className="w-5 h-5 text-pink-400" />;
      case 'system': return <Settings className="w-5 h-5 text-slate-200" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getBgColorForType = (type) => {
    switch (type) {
      case 'auth': return 'bg-[#FFD700]/10 border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]';
      case 'course': return 'bg-blue-500/100/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'enrollment': return 'bg-[#008A32]/10 border-[#008A32]/30 shadow-[0_0_15px_rgba(0,138,50,0.1)]';
      case 'learning': return 'bg-purple-500/100/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
      case 'communication': return 'bg-pink-500/10 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]';
      case 'system': return 'bg-[#11151F]/40 backdrop-blur-xl0/10 border-white/5';
      default: return 'bg-[#11151F]/40 backdrop-blur-xl0/10 border-white/5';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[#0B0E14]/40 rounded-2xl border border-white/5 p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-[#11151F]/5 border border-white/10 rounded-full flex items-center justify-center mb-3">
          <Activity className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">No recent activities found.</p>
        <p className="text-xs text-slate-300 mt-1">Activities will appear here once actions are taken.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="flex gap-4 items-start relative group">
          {index !== activities.length - 1 && (
            <div className="absolute left-6 top-10 bottom-[-1rem] w-px bg-[#11151F]/5 -z-10 group-hover:bg-[#FFD700]/20 transition-colors"></div>
          )}
          <div className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300 relative z-10 ${getBgColorForType(activity.type)}`}>
            {getIconForType(activity.type)}
          </div>
          <div className="flex-1 bg-[#11151F]/80 p-4 rounded-2xl border border-white/5 shadow-lg shadow-black/20 hover:border-white/10 transition-colors backdrop-blur-sm">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h4 className="font-bold text-white leading-tight">{activity.action}</h4>
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider shrink-0 whitespace-nowrap bg-[#11151F]/5 px-2.5 py-1 rounded-md border border-white/5">
                {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {isAdmin && activity.user && (
              <p className="text-xs text-slate-200 mb-2 font-medium">
                <span className="text-slate-300 font-bold uppercase tracking-widest text-[9px]">User:</span> {activity.user.name} <span className="text-[9px] font-black tracking-widest uppercase bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] px-1.5 py-0.5 rounded ml-1">{activity.user.role}</span>
              </p>
            )}
            {activity.details && (
              <p className="text-xs font-medium text-slate-300 mt-2 bg-[#0B0E14] p-3 rounded-xl border border-white/5 shadow-inner">
                {activity.details}
              </p>
            )}

            {/* Privacy & Insight indicators */}
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center gap-2">
                 {activity.visibility === 'private' && <span className="text-[9px] uppercase font-black tracking-widest text-slate-300 bg-[#11151F]/5 border border-white/10 px-2 py-1 rounded-md shadow-sm">Private</span>}
                 {activity.visibility === 'insight' && (
                   <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded-md shadow-sm flex items-center gap-1 border ${activity.insightFlag === 'achievement' ? 'text-[#008A32] bg-[#008A32]/10 border-[#008A32]/20' : activity.insightFlag === 'concern' ? 'text-[#E30A17] bg-[#E30A17]/10 border-[#E30A17]/20' : 'text-blue-400 bg-blue-500/100/10 border-blue-500/20'}`}>
                     {activity.insightFlag === 'achievement' ? <TrendingUp className="w-3 h-3"/> : activity.insightFlag === 'concern' ? <AlertTriangle className="w-3 h-3"/> : null}
                     Insight: {activity.insightFlag || 'Curated'}
                   </span>
                 )}
               </div>
               
               {/* Instructor/Admin Flag controls */}
               {(user?.role === 'instructor' || user?.role === 'admin') && filterType === 'all' && activity.visibility !== 'insight' && (
                 <div className="flex gap-2">
                   <button onClick={() => handleFlag(activity.id, 'achievement')} className="text-[10px] font-black uppercase tracking-widest text-[#008A32] hover:bg-[#008A32]/20 bg-[#008A32]/10 border border-[#008A32]/20 px-3 py-1 rounded-md transition-colors">Flag Achievement</button>
                   <button onClick={() => handleFlag(activity.id, 'concern')} className="text-[10px] font-black uppercase tracking-widest text-[#E30A17] hover:bg-[#E30A17]/20 bg-[#E30A17]/10 border border-[#E30A17]/20 px-3 py-1 rounded-md transition-colors">Flag Concern</button>
                 </div>
               )}

               {/* Parent Support Portal action */}
               {user?.role === 'parent' && activity.visibility === 'insight' && activity.insightFlag === 'concern' && (
                 <div className="flex gap-2">
                   <button onClick={() => navigate('/dashboard/message')} className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:bg-[#FFD700]/20 bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                     <MessageSquare className="w-3 h-3" /> Contact Faculty
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

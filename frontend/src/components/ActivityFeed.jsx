import React, { useEffect, useState } from 'react';
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

  const fetchActivities = async () => {
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
  };

  useEffect(() => {
    fetchActivities();
  }, [filterType, limit]);

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
      case 'auth': return <LogIn className="w-5 h-5 text-indigo-500" />;
      case 'course': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'enrollment': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'learning': return <Activity className="w-5 h-5 text-amber-500" />;
      case 'communication': return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'system': return <Settings className="w-5 h-5 text-slate-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBgColorForType = (type) => {
    switch (type) {
      case 'auth': return 'bg-indigo-50 border-indigo-100';
      case 'course': return 'bg-blue-50 border-blue-100';
      case 'enrollment': return 'bg-emerald-50 border-emerald-100';
      case 'learning': return 'bg-amber-50 border-amber-100';
      case 'communication': return 'bg-purple-50 border-purple-100';
      case 'system': return 'bg-slate-50 border-slate-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Activity className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No recent activities found.</p>
        <p className="text-sm text-slate-400 mt-1">Activities will appear here once actions are taken.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity._id || index} className="flex gap-4 items-start relative group">
          {index !== activities.length - 1 && (
            <div className="absolute left-6 top-10 bottom-[-1rem] w-px bg-slate-200 -z-10"></div>
          )}
          <div className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300 ${getBgColorForType(activity.type)}`}>
            {getIconForType(activity.type)}
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h4 className="font-semibold text-slate-900 leading-tight">{activity.action}</h4>
              <span className="text-xs font-medium text-slate-400 shrink-0 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md">
                {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {isAdmin && activity.user && (
              <p className="text-sm text-slate-500 mb-1">
                <span className="font-medium text-slate-700">User:</span> {activity.user.name} <span className="text-xs uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{activity.user.role}</span>
              </p>
            )}
            {activity.details && (
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {activity.details}
              </p>
            )}

            {/* Privacy & Insight indicators */}
            <div className="flex items-center justify-between mt-3">
               <div className="flex items-center gap-2">
                 {activity.visibility === 'private' && <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Private</span>}
                 {activity.visibility === 'insight' && (
                   <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${activity.insightFlag === 'achievement' ? 'text-emerald-700 bg-emerald-100' : activity.insightFlag === 'concern' ? 'text-rose-700 bg-rose-100' : 'text-blue-700 bg-blue-100'}`}>
                     {activity.insightFlag === 'achievement' ? <TrendingUp className="w-3 h-3"/> : activity.insightFlag === 'concern' ? <AlertTriangle className="w-3 h-3"/> : null}
                     Insight: {activity.insightFlag || 'Curated'}
                   </span>
                 )}
               </div>
               
               {/* Instructor/Admin Flag controls */}
               {(user?.role === 'instructor' || user?.role === 'admin') && filterType === 'all' && activity.visibility !== 'insight' && (
                 <div className="flex gap-2">
                   <button onClick={() => handleFlag(activity._id, 'achievement')} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded transition-colors">Flag Achievement</button>
                   <button onClick={() => handleFlag(activity._id, 'concern')} className="text-xs text-rose-600 hover:text-rose-800 font-medium bg-rose-50 px-2 py-1 rounded transition-colors">Flag Concern</button>
                 </div>
               )}

               {/* Parent Support Portal action */}
               {user?.role === 'parent' && activity.visibility === 'insight' && activity.insightFlag === 'concern' && (
                 <div className="flex gap-2">
                   <button onClick={() => navigate('/dashboard/message')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                     <MessageSquare className="w-3 h-3" /> Contact Instructor
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

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teachingService } from '../services/api';
import SummaryCard from '../components/cards/SummaryCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Clock, Video, Users, MessageSquare } from 'lucide-react';

export default function TeachingActivity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchTeaching = async () => {
      try {
        const role = user?.role ? user.role.toLowerCase() : 'student';
        const data = await teachingService.getTeachingActivity(role);
        const mapped = (data || []).map(item => ({
            name: item.name,
            hours: item.hours || 0, // Relies strictly on future real backend data
            engagements: item.students || 0
        }));
        setActivityData(mapped);
      } catch (error) {
        console.error("Failed to load teaching activity", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTeaching();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Teaching Activity</h1>
          <p className="text-sm text-slate-500">Track instructor hours and platform engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard 
          title="Hours Taught" 
          value="N/A" 
          icon={Clock} 
          colorTheme="blue" 
        />
        <SummaryCard 
          title="Active Classes" 
          value="N/A" 
          icon={Video} 
          colorTheme="purple" 
        />
        <SummaryCard 
          title="Student Reach" 
          value="N/A" 
          icon={Users} 
          colorTheme="green" 
        />
        <SummaryCard 
          title="Forum Replies" 
          value="N/A" 
          icon={MessageSquare} 
          colorTheme="orange" 
        />
      </div>

      <div className="glass-card dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Teaching Velocity</h3>
        <div className="h-80">
          {activityData && activityData.length > 0 && activityData.some(d => d.hours > 0 || d.engagements > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#a855f7', fontSize: 13, fontWeight: 600}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }} />
                <Line yAxisId="left" type="monotone" dataKey="hours" name="Teaching Hours" stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="engagements" name="Student Engagements" stroke="#a855f7" strokeWidth={4} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex flex-col items-center justify-center p-4 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl w-full h-full">
                  <p className="text-slate-500 font-medium">No teaching velocity data logged</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

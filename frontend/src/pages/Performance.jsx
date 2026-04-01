import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { performanceService } from '../services/api';
import SummaryCard from '../components/cards/SummaryCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Target, Users, BookOpen, Award, Filter } from 'lucide-react';

export default function Performance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState([]);
  const [activeLearners, setActiveLearners] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const role = user?.role ? user.role.toLowerCase() : 'student';
        const data = await performanceService.getPerformanceData(role);
        setEngagementData(data.engagementData || []);
        setActiveLearners(data.totalActiveLearners || 0);
        setTotalCompletions(data.totalCourseCompletions || 0);
      } catch (error) {
        console.error("Failed to load performance data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPerformance();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Performance Insights</h1>
          <p className="text-sm text-slate-500">Analyze learner growth and engagement</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard 
          title="Active Learners" 
          value={activeLearners} 
          icon={Users} 
          colorTheme="blue" 
        />
        <SummaryCard 
          title="Course Completions" 
          value={totalCompletions} 
          icon={Award} 
          colorTheme="purple" 
        />
        <SummaryCard 
          title="Avg. Assessment Score" 
          value="85%" 
          percentage={2} 
          isPositive={true} 
          icon={Target} 
          colorTheme="green" 
        />
        <SummaryCard 
          title="Enrolled Courses" 
          value="120" 
          icon={BookOpen} 
          colorTheme="orange" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Engagement Trend */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Engagement vs Enrollment</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }} />
                <Bar dataKey="students" name="Active Students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="teachers" name="Active Teachers" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Top Course Performers</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition border-b border-transparent">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {item}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">React Masterclass</h4>
                  <p className="text-xs text-slate-500 font-medium">92% Average Score</p>
                </div>
                <div className="text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                  Top 5%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { performanceService } from '../services/api';
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
  const [avgScore, setAvgScore] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const role = user?.role ? user.role.toLowerCase() : 'student';
        const [perfRes, reportsRes] = await Promise.all([
           performanceService.getPerformanceData(role),
           api.get('/attendance/reports').catch(() => ({ data: { data: [] } }))
        ]);
        
        const data = perfRes || {};
        setEngagementData(data.engagementData || []);
        setActiveLearners(data.totalActiveLearners || 0);
        setTotalCompletions(data.totalCourseCompletions || 0);

        // Process real backend performance data from accumulated semester reports!
        const reports = reportsRes.data?.data || [];
        let totalScore = 0;
        let scoreCount = 0;
        let allStudents = [];

        reports.forEach(report => {
           if (report.studentRecords && report.studentRecords.length > 0) {
              report.studentRecords.forEach(sr => {
                 if (sr.attendancePercentage) {
                    totalScore += Number(sr.attendancePercentage);
                    scoreCount++;
                 }
                 if (sr.student && sr.student.name) {
                    allStudents.push({
                       name: sr.student.name,
                       score: Number(sr.attendancePercentage) || 0,
                       course: report.course?.title || 'Course',
                       grade: sr.finalGrade || 'Pending'
                    });
                 }
              });
           }
        });

        // Compute true average platform performance
        setAvgScore(scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0);

        // Pick top performers
        const sorted = allStudents.sort((a, b) => b.score - a.score).slice(0, 5);
        // unique names only taking their best score
        const uniquePerformers = [];
        const seen = new Set();
        sorted.forEach(s => {
           if (!seen.has(s.name)) {
              seen.add(s.name);
              uniquePerformers.push(s);
           }
        });
        setTopPerformers(uniquePerformers);

      } catch (error) {
        console.error("Failed to load performance data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPerformance();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-wide">Performance Insights</h1>
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mt-1">Analyze learner growth, attendance accuracy, and engagement</p>
        </div>
        <button className="flex items-center gap-2 bg-[#11151F]/5 border border-white/10 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black text-white shadow-sm hover:bg-[#11151F]/10 transition-colors">
          <Filter className="w-4 h-4" /> Filter Analytics
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
          title="Total Completions" 
          value={totalCompletions} 
          icon={Award} 
          colorTheme="purple" 
        />
        <SummaryCard 
          title="Avg. Performance Score" 
          value={`${avgScore}%`} 
          icon={Target} 
          colorTheme="green" 
        />
        <SummaryCard 
          title="Enrolled Activity" 
          value={activeLearners} 
          icon={BookOpen} 
          colorTheme="orange" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Engagement Trend */}
        <div className="xl:col-span-2 bg-[#0B0E14]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-8">Engagement vs Enrollment Timeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }} />
                <Bar dataKey="students" name="Active Students" fill="#4B5563" radius={[6, 6, 0, 0]} />
                <Bar dataKey="teachers" name="Active Instructors" fill="#FFD700" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 bg-[#11151F]/5">
             <h3 className="text-xl font-bold text-white">Top Course Performers</h3>
             <p className="text-[10px] text-slate-200 font-bold uppercase tracking-widest mt-1">Based on aggregated historic metrics</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-4">
             {topPerformers.length > 0 ? (
                topPerformers.map((student, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-[#11151F] border border-white/5 px-4 py-3 rounded-2xl hover:border-white/10 transition-colors">
                      <div>
                         <h4 className="font-bold text-white text-sm">{student.name}</h4>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">{student.course}</p>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[#008A32] font-black text-sm">{student.score}%</span>
                         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 bg-[#11151F]/5 px-2 py-0.5 rounded border border-white/5 mt-1">{student.grade}</span>
                      </div>
                   </div>
                ))
             ) : (
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/10 rounded-2xl w-full h-full bg-[#11151F]/5 shadow-inner">
                    <p className="text-slate-200 font-bold uppercase tracking-widest text-xs text-center">No historic performance data recorded yet</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

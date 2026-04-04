import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { revenueService } from '../services/api';
import SummaryCard from '../components/cards/SummaryCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CircleDollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from 'lucide-react';

export default function Revenue() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [realCourses, setRealCourses] = useState([]);
  const [kpis, setKpis] = useState({ total: 0, growth: 0 });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const role = user?.role ? user.role.toLowerCase() : 'student';
        
        // Fetch base trajectory metrics
        const data = await revenueService.getRevenueMetrics(role);
        
        // Fetch actual courses to compute REAL total revenue
        let coursesRes = [];
        try {
           if (role === 'admin') coursesRes = await api.get('/admin/courses');
           else if (role === 'instructor') coursesRes = await api.get('/instructor/courses');
           else coursesRes = await api.get('/courses');
        } catch(e) { }

        const courses = coursesRes?.data?.data || coursesRes?.data || [];
        setRealCourses(courses);

        // Compute pure real revenue
        let totalNetRevenue = 0;
        let totalActiveSubs = 0;

        courses.forEach(course => {
           let studentsCount = course.totalStudents || (course.enrolledStudents ? course.enrolledStudents.length : 0);
           let coursePrice = Number(course.price) || 0;
           totalNetRevenue += studentsCount * coursePrice;
           totalActiveSubs += studentsCount;
        });

        // Set KPIs
        setKpis({
            total: totalNetRevenue,
            activeLearners: totalActiveSubs,
            growth: 0
        });

        setRevenueData(data);
      } catch (error) {
        console.error("Failed to load revenue data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRevenue();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-widest uppercase">Finance & Revenue</h1>
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mt-1">Track platform monetization and subscription flow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Net Computed" 
          value={`$${kpis.total.toLocaleString()}`} 
          isPositive={true} 
          icon={CircleDollarSign} 
          colorTheme="blue" 
        />
        <SummaryCard 
          title="Active Paid Subscriptions" 
          value={kpis.activeLearners} 
          percentage={null} 
          isPositive={true} 
          icon={Activity} 
          colorTheme="green" 
        />
        <SummaryCard 
          title="Transaction Loss" 
          value="$0" 
          isPositive={false} 
          icon={ArrowDownRight} 
          colorTheme="orange" 
        />
      </div>

      <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-8">Revenue Trajectory Timeline</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008A32" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#008A32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', background: '#0B0E14', color: '#fff', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="revenue" stroke="#008A32" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Based on computed active course enrollments</p>
        </div>
        <div className="p-0 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#11151F] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-5 border-b border-white/5">Date</th>
                <th className="p-5 border-b border-white/5">Course Allocation</th>
                <th className="p-5 border-b border-white/5">Amount Computed</th>
                <th className="p-5 border-b border-white/5">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-white">
              {realCourses.length > 0 && realCourses.some(c => c.price > 0 && c.totalStudents > 0) ? (
                 realCourses.filter(c => c.price > 0 && c.totalStudents > 0).map((course, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 text-slate-400">{new Date(course.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 font-bold">{course.title}</td>
                      <td className="p-5 text-[#FFD700] tracking-wider">${(course.price * course.totalStudents).toLocaleString()}</td>
                      <td className="p-5"><span className="bg-[#008A32]/20 text-[#008A32] border border-[#008A32]/30 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">Settled</span></td>
                    </tr>
                 ))
              ) : (
                 <tr className="border-b border-white/5">
                   <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center opacity-50">
                         <CreditCard className="w-10 h-10 text-slate-500 mb-4" />
                         <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No monetized enrollments found.</span>
                      </div>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

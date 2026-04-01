import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { revenueService } from '../services/api';
import SummaryCard from '../components/cards/SummaryCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CircleDollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

export default function Revenue() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [kpis, setKpis] = useState({ total: 0, growth: 0 });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const role = user?.role ? user.role.toLowerCase() : 'student';
        const data = await revenueService.getRevenueMetrics(role);
        const kpiData = await revenueService.getRevenueKPIs(role);
        setRevenueData(data);
        setKpis(kpiData);
      } catch (error) {
        console.error("Failed to load revenue data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRevenue();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Revenue Analytics</h1>
          <p className="text-sm text-slate-500">Track and manage financial performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Net Revenue" 
          value={`$${kpis.total.toLocaleString()}`} 
          percentage={kpis.growth} 
          isPositive={true} 
          icon={CircleDollarSign} 
          colorTheme="blue" 
        />
        <SummaryCard 
          title="Active Subscriptions" 
          value={kpis.activeLearners} 
          percentage={5} 
          isPositive={true} 
          icon={ArrowUpRight} 
          colorTheme="green" 
        />
        <SummaryCard 
          title="Refunded" 
          value="$120" 
          percentage={1} 
          isPositive={false} 
          icon={ArrowDownRight} 
          colorTheme="orange" 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue Trajectory</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 dark:text-slate-300">
              <tr className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4">Today, 2:30 PM</td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CreditCard className="w-4 h-4"/></div>
                  Course Enrollment: React Basics
                </td>
                <td className="p-4 font-bold text-emerald-500">+$49.99</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completed</span></td>
              </tr>
              <tr className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4">Yesterday</td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CreditCard className="w-4 h-4"/></div>
                  Course Enrollment: Node.js Advanced
                </td>
                <td className="p-4 font-bold text-emerald-500">+$89.00</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function FinanceFees() {
  const collectionData = [
    { name: 'Jan', collection: 0, expenses: 0 }
  ];

  const studentFees = [];

  const StatBox = ({ title, value, percentage, type }) => (
    <div className={`p-6 rounded-3xl border border-slate-100 shadow-sm ${type === 'primary' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`font-medium text-sm ${type === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>{title}</h3>
        {percentage && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            type === 'primary' ? 'bg-indigo-500/50 text-white' : 
            percentage.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {percentage}%
          </span>
        )}
      </div>
      <h2 className={`text-3xl font-bold ${type === 'primary' ? 'text-white' : 'text-slate-800'}`}>{value}</h2>
      <p className={`text-xs mt-2 ${type === 'primary' ? 'text-indigo-200' : 'text-slate-400'}`}>Total Collection</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fees Collection</h1>
          <p className="text-slate-500 text-sm mt-1">Manage school fee collections and expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800">Fees Collection</h3>
             <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600">
               Monthly <ChevronDown className="w-4 h-4" />
             </button>
           </div>
           
           <div className="text-center mb-4">
             <p className="text-slate-500 text-sm font-medium">Pending Financial API integration</p>
             <p className="text-2xl font-bold text-slate-800">Current Scope</p>
           </div>
           
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={collectionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorColor" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="collection" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorColor)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:grid-rows-2">
           <div className="grid grid-cols-2 gap-4">
             <StatBox title="Total" value="$0" type="primary" />
             <StatBox title="Paid" value="$0" type="default" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <StatBox title="Pending" value="$0" type="default" />
             <StatBox title="Overdue" value="$0" type="default" />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-800">Fees Collection List</h3>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Invoice ID..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100">
               Status <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100">
               All Classes <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                </th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Tuition Fee</th>
                <th className="px-6 py-4">Action Fee</th>
                <th className="px-6 py-4">Miscellaneous</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentFees.length > 0 ? studentFees.map(fee => (
                <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {fee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{fee.name}</p>
                        <p className="text-xs text-slate-400">{fee.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fee.class}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{fee.tuition}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{fee.action}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{fee.misc}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{fee.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold w-20 
                      ${fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                        fee.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                       <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                 <tr className="border-b border-slate-50 dark:border-slate-800/50">
                    <td colSpan="9" className="p-8 text-center text-slate-500 font-medium">No fee collection data recorded yet.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
           <p>Showing 1 to 6 of 6 entries</p>
           <div className="flex gap-1">
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50">Prev</button>
             <button className="px-3 py-1 flex items-center justify-center border border-indigo-500 bg-indigo-50 text-indigo-600 rounded font-medium">1</button>
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:bg-slate-50">2</button>
             <button className="px-3 py-1 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

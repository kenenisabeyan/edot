import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCard({ title, value, percentage, isPositive, icon: Icon, colorTheme = 'blue', onClick }) {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-500 text-blue-500 bg-blue-50 dark:bg-blue-500/10',
    green: 'from-emerald-400 to-teal-500 text-teal-500 bg-teal-50 dark:bg-teal-500/10',
    purple: 'from-purple-500 to-fuchsia-500 text-purple-500 bg-purple-50 dark:bg-purple-500/10',
    orange: 'from-orange-400 to-amber-500 text-orange-500 bg-orange-50 dark:bg-orange-500/10',
  };
  const theme = colorClasses[colorTheme] || colorClasses.blue;
  const gradient = theme.split(' text-')[0];
  const textBg = 'text-' + theme.split(' text-')[1];

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1' : ''}`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 blur-xl transition-opacity`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${textBg} transition-transform group-hover:scale-110 duration-300`}>
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{title}</h3>
        </div>
        {percentage && (
           <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
             {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
             {percentage}%
           </div>
        )}
      </div>
      <div className="flex justify-between items-end relative z-10 mt-2">
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h2>
      </div>
    </div>
  );
}

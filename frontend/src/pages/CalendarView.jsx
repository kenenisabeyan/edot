import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarView() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 2); // simplified calendar logic for mockup
  
  const events = [
    { date: 4, title: 'Maths Exam', type: 'exam', color: 'bg-indigo-500' },
    { date: 12, title: 'PTA Meeting', type: 'meeting', color: 'bg-amber-500' },
    { date: 18, title: 'Science Fair', type: 'event', color: 'bg-emerald-500' },
    { date: 24, title: 'School Holiday', type: 'holiday', color: 'bg-rose-500' },
    { date: 25, title: 'School Holiday', type: 'holiday', color: 'bg-rose-500' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-500 text-sm mt-1">Manage events and schedules.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/30">
          <Plus className="w-5 h-5" /> Add New Event
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
         {/* Calendar Header */}
         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-slate-800">September 2030</h2>
             <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
               <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 border-r border-slate-200"><ChevronLeft className="w-5 h-5" /></button>
               <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Today</button>
               <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 border-l border-slate-200"><ChevronRight className="w-5 h-5" /></button>
             </div>
           </div>
           
           <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold bg-indigo-50 text-indigo-600 rounded-lg">Month</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Week</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Day</button>
           </div>
         </div>

         {/* Calendar Grid */}
         <div className="flex-1 p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
               {daysOfWeek.map(day => (
                 <div key={day} className="text-center font-bold text-slate-500 uppercase tracking-wider text-xs">
                   {day}
                 </div>
               ))}
            </div>
            
            <div className="grid grid-cols-7 gap-4 h-[calc(100%-2rem)]">
              {dates.map((date, index) => {
                const isCurrentMonth = date > 0 && date <= 30;
                const displayDate = date <= 0 ? 31 + date : date > 30 ? date - 30 : date;
                const dayEvents = isCurrentMonth ? events.filter(e => e.date === displayDate) : [];
                const isToday = isCurrentMonth && displayDate === 14; // Mock today

                return (
                  <div key={index} className={`min-h-[100px] p-2 rounded-2xl border ${isCurrentMonth ? 'bg-white border-slate-100' : 'bg-slate-50 border-transparent'} relative group hover:border-indigo-200 transition-colors`}>
                     <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                       isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40' : 
                       isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                     }`}>
                       {displayDate}
                     </div>
                     
                     <div className="space-y-1">
                       {dayEvents.map((evt, i) => (
                         <div key={i} className={`text-xs px-2 py-1 rounded w-full truncate text-white font-medium ${evt.color}`}>
                           {evt.title}
                         </div>
                       ))}
                     </div>

                     {isCurrentMonth && (
                       <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 text-slate-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-indigo-50 hover:text-indigo-600">
                         <Plus className="w-4 h-4" />
                       </button>
                     )}
                  </div>
                );
              })}
            </div>
         </div>
      </div>
    </div>
  );
}

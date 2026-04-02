import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AgendaCreationModal from '../components/AgendaCreationModal';

export default function CalendarView() {
  const { user } = useAuth();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 2);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/calendar');
        if (data.data && data.data.length > 0) {
           // map backend dates if needed, for calendar UI we just mock map it to dummy dates for visual test
           setEvents(data.data.map((evt, idx) => ({ ...evt, date: (idx * 5) % 28 + 1 })));
        } else {
           // Localized Ethiopian Fallback
           setEvents([
             { date: 4, title: 'National Exam Prep', type: 'exam', color: 'bg-indigo-500' },
             { date: 12, title: 'PTA Meeting Ato Kebede', type: 'meeting', color: 'bg-amber-500' },
             { date: 18, title: 'Science Fair', type: 'event', color: 'bg-emerald-500' },
             { date: 24, title: 'Meskel Celebration', type: 'holiday', color: 'bg-rose-500' },
             { date: 25, title: 'School Holiday', type: 'holiday', color: 'bg-rose-500' },
           ]);
        }
      } catch (err) {
        console.error('Failed to fetch calendar events', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Calendar</h1>
          <p className="text-slate-300 text-sm mt-1">Manage events and schedules.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#008A32]/20 shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Event
          </button>
        )}
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#0B0E14] shadow-sm overflow-hidden flex-1 flex flex-col">
         {/* Calendar Header */}
         <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
           <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-white">September 2030</h2>
             <div className="flex items-center bg-white/5 rounded-lg border border-white/10 overflow-hidden shadow-sm">
               <button className="p-2 text-slate-400 hover:bg-white/10 hover:text-[#FFD700] border-r border-white/10"><ChevronLeft className="w-5 h-5" /></button>
               <button className="px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-[#FFD700]">Today</button>
               <button className="p-2 text-slate-400 hover:bg-white/10 hover:text-[#FFD700] border-l border-white/10"><ChevronRight className="w-5 h-5" /></button>
             </div>
           </div>
           
           <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold bg-[#FFD700]/10 text-[#FFD700] rounded-lg border border-[#FFD700]/20">Month</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg">Week</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg">Day</button>
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
                  <div key={index} className={`min-h-[100px] p-2 rounded-2xl border ${isCurrentMonth ? 'bg-white/5 border-white/5' : 'bg-transparent border-transparent opacity-30'} relative group hover:border-[#FFD700]/50 transition-colors`}>
                     <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                       isToday ? 'bg-[#FFD700] text-[#0B0E14] shadow-md shadow-[#FFD700]/40' : 
                       isCurrentMonth ? 'text-white' : 'text-slate-500'
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
                       <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 text-slate-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-[#FFD700]/20 hover:text-[#FFD700]">
                         <Plus className="w-4 h-4" />
                       </button>
                     )}
                  </div>
                );
              })}
            </div>
          </div>
       </div>

       <AgendaCreationModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onAgendaCreated={(evt) => setEvents([...events, { ...evt, date: new Date(evt.date).getDate() }])}
       />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AgendaCreationModal from '../components/AgendaCreationModal';

export default function CalendarView() {
  const { user } = useAuth();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/calendar');
      if (data.data) {
         setEvents(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
     setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const calendarGrids = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
      if (i < firstDay) return null; // Empty padding for correct alignment
      return i - firstDay + 1; // Actual dates 1, 2, 3...
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
             <h2 className="text-xl font-bold text-white uppercase tracking-widest">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
             <div className="flex items-center bg-white/5 rounded-lg border border-white/10 overflow-hidden shadow-sm">
               <button onClick={handlePrevMonth} className="p-2 text-slate-400 hover:bg-white/10 hover:text-[#FFD700] border-r border-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
               <button onClick={handleToday} className="px-4 py-2 text-sm font-black tracking-widest uppercase text-slate-300 hover:bg-white/10 hover:text-[#FFD700] transition-colors">Today</button>
               <button onClick={handleNextMonth} className="p-2 text-slate-400 hover:bg-white/10 hover:text-[#FFD700] border-l border-white/10 transition-colors"><ChevronRight className="w-5 h-5" /></button>
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
              {calendarGrids.map((displayDate, index) => {
                const isCurrentMonth = displayDate !== null;
                const isToday = isCurrentMonth && 
                                displayDate === today.getDate() && 
                                currentDate.getMonth() === today.getMonth() && 
                                currentDate.getFullYear() === today.getFullYear();

                // Find real events matching the exact parsed true dates
                const dayEvents = isCurrentMonth ? events.filter(e => {
                   if (!e.date) return false;
                   const evtDate = new Date(e.date);
                   return evtDate.getDate() === displayDate && 
                          evtDate.getMonth() === currentDate.getMonth() && 
                          evtDate.getFullYear() === currentDate.getFullYear();
                }) : [];

                return (
                  <div key={index} className={`min-h-[100px] p-2 rounded-2xl border ${isCurrentMonth ? 'bg-white/5 border-white/5 hover:border-[#FFD700]/50' : 'bg-transparent border-transparent'} relative group transition-colors`}>
                     {isCurrentMonth && (
                       <>
                         <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                           isToday ? 'bg-[#FFD700] text-[#0B0E14] shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 
                           'text-white'
                         }`}>
                           {displayDate}
                         </div>
                         
                         <div className="space-y-2">
                           {dayEvents.map((evt, i) => (
                             <div key={i} className={`text-[9px] uppercase tracking-widest px-2 py-1.5 rounded-md w-full truncate font-black border border-white/10 ${evt.color || 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                               {evt.title}
                             </div>
                           ))}
                         </div>

                         <button 
                           onClick={() => setShowModal(true)} 
                           className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 text-slate-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-[#FFD700]/20 hover:text-[#FFD700]"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                       </>
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
          onAgendaCreated={(evt) => {
             // Directly add into UI and refetch to ensure perfect DB sync
             setEvents([...events, evt]);
             fetchEvents();
          }}
       />
    </div>
  );
}

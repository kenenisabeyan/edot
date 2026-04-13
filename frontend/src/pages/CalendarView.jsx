import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Activity } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AgendaCreationModal from '../components/AgendaCreationModal';

export default function CalendarView() {
  const { user } = useAuth();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
      if (i < firstDay) return null; 
      return i - firstDay + 1; 
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto pb-4">
      {/* Header Matrix */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2 border-b border-white/10 pb-6 mt-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase flex items-center gap-3">
             <CalendarIcon className="w-8 h-8 text-[#FFD700]" /> Calendar
          </h1>
          <p className="text-slate-200 font-medium text-sm mt-2">Manage events, live sessions, and schedules.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 transition-all shadow-sm w-full md:w-auto outline-none focus:ring-2 focus:ring-[#008A32]/50"
          >
            <Plus className="w-4 h-4" /> Add New Event
          </button>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0B0E14]/80 backdrop-blur-3xl shadow-2xl overflow-hidden flex-1 flex flex-col relative z-10">
         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#008A32]/5 to-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
         
         {/* Command Bar */}
         <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center bg-[#11151F]/40 backdrop-blur-md gap-4">
           <div className="flex items-center gap-6">
             <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                {monthNames[currentDate.getMonth()]} <span className="text-[#FFD700]">{currentDate.getFullYear()}</span>
             </h2>
             <div className="hidden md:flex items-center bg-[#0B0E14] rounded-xl border border-white/10 overflow-hidden shadow-inner flex-shrink-0">
               <button onClick={handlePrevMonth} className="p-2.5 text-slate-300 hover:bg-[#11151F]/5 hover:text-[#FFD700] border-r border-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
               <button onClick={handleToday} className="px-5 py-2.5 text-[10px] font-black tracking-widest uppercase text-slate-200 hover:bg-[#11151F]/5 hover:text-[#FFD700] transition-colors">Jump to Today</button>
               <button onClick={handleNextMonth} className="p-2.5 text-slate-300 hover:bg-[#11151F]/5 hover:text-[#FFD700] border-l border-white/10 transition-colors"><ChevronRight className="w-5 h-5" /></button>
             </div>
           </div>
           
           <div className="flex gap-2 bg-[#0B0E14] p-1.5 rounded-xl border border-white/10 shadow-inner">
              <button className="px-5 py-2 text-[10px] uppercase tracking-widest font-black bg-[#FFD700] text-[#0B0E14] rounded-lg shadow-sm">Month</button>
              <button className="px-5 py-2 text-[10px] uppercase tracking-widest font-bold text-slate-300 hover:text-white rounded-lg transition-colors">Week</button>
           </div>
         </div>

         {/* Chrono Grid */}
         <div className="flex-1 p-6 relative">
            <div className="grid grid-cols-7 gap-4 mb-4">
               {daysOfWeek.map(day => (
                 <div key={day} className="text-center font-black text-slate-300/70 uppercase tracking-widest text-[10px]">
                   {day}
                 </div>
               ))}
            </div>
            
            <div className="grid grid-cols-7 gap-3 sm:gap-4 h-[calc(100%-2rem)]">
              {calendarGrids.map((displayDate, index) => {
                const isCurrentMonth = displayDate !== null;
                const isToday = isCurrentMonth && 
                                displayDate === today.getDate() && 
                                currentDate.getMonth() === today.getMonth() && 
                                currentDate.getFullYear() === today.getFullYear();

                const dayEvents = isCurrentMonth ? events.filter(e => {
                   if (!e.date) return false;
                   const evtDate = new Date(e.date);
                   return evtDate.getDate() === displayDate && 
                          evtDate.getMonth() === currentDate.getMonth() && 
                          evtDate.getFullYear() === currentDate.getFullYear();
                }) : [];

                return (
                  <div key={index} className={`min-h-[120px] p-2.5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                      isCurrentMonth 
                      ? 'bg-[#11151F]/40 border-white/5 hover:border-[#FFD700]/30 hover:bg-[#11151F]/80 shadow-sm' 
                      : 'bg-transparent border-transparent'
                  }`}>
                     {isCurrentMonth && (
                       <>
                         <div className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-xl mb-3 transition-colors ${
                           isToday 
                           ? 'bg-[#FFD700] text-[#0B0E14] shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
                           : 'bg-[#0B0E14] text-white border border-white/5 group-hover:border-[#FFD700]/30 group-hover:text-[#FFD700]'
                         }`}>
                           {displayDate}
                         </div>
                         
                         <div className="space-y-2 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                           {dayEvents.map((evt, i) => (
                             <div key={i} className={`flex items-start gap-1.5 p-2 rounded-lg border backdrop-blur-md shadow-sm ${
                                evt.color || 'bg-blue-500/100/10 text-blue-400 border-blue-500/20'
                             }`}>
                               <Activity className="w-3 h-3 shrink-0 mt-0.5" />
                               <div className="flex-1 min-w-0">
                                 <p className="text-[10px] font-black uppercase tracking-wider truncate leading-tight mb-0.5">{evt.title}</p>
                                 <p className="text-[9px] font-bold opacity-70 truncate">{evt.time || 'All Day'}</p>
                               </div>
                             </div>
                           ))}
                         </div>

                         {(user?.role === 'admin' || user?.role === 'instructor') && (
                           <button 
                             onClick={() => setShowModal(true)} 
                             className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-[#0B0E14] border border-white/10 text-slate-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-all hidden md:flex hover:bg-[#008A32]/20 hover:text-[#008A32] hover:border-[#008A32]/30 shadow-inner"
                           >
                             <Plus className="w-4 h-4" />
                           </button>
                         )}
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
             setEvents([...events, evt]);
             fetchEvents();
          }}
       />
    </div>
  );
}

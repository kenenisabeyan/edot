import React, { useState, useEffect } from 'react';
import { getRecentPublicUsers } from '../utils/api';
import { MoreHorizontal, Calendar, Bell, BookOpen, AlertCircle, HeartHandshake, Users, X, CheckCircle, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgendaWidget({ events, userRole, isAdmin, onDelete, onCreateClick }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState('10k+');

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getRecentPublicUsers();
      if (data && data.success) {
        setRecentUsers(data.users || []);
        if (data.totalCount > 10000) {
           setTotalUsers('10k+');
        } else if (data.totalCount > 0) {
           setTotalUsers(data.totalCount.toString());
        }
      }
    };
    fetchUsers();
  }, []);

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === 'default-avatar.png') return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
  };

  const getEventParticipants = (evt) => {
    let participants = recentUsers;
    if (!evt.targetAudiences?.includes('all')) {
       participants = recentUsers.filter(u => {
           const target = evt.targetAudiences || [];
           if (target.includes(u.role)) return true;
           // If instructor post targeting 'my_students', fallback to students for display
           if (target.includes('my_students') && u.role === 'student') return true;
           return false;
       });
    }
    return participants;
  };

  const renderAvatarStack = (evt, isModal = false) => {
    const participants = getEventParticipants(evt);
    return (
      <div className="flex -space-x-1.5 relative z-10">
        {participants.length > 0 ? (
          participants.slice(0, 3).map((u, i) => {
            const colors = ['bg-blue-500/100', 'bg-emerald-500/100', 'bg-rose-500/100'];
            const zIndexes = ['z-30', 'z-20', 'z-10'];
            const avatar = getAvatarUrl(u.avatar);
            return (
              <div key={u.id || i} className={`${isModal ? 'w-8 h-8 border-2' : 'w-5 h-5 border'} rounded-full border-[#0B0E14] ${colors[i % colors.length]} overflow-hidden flex items-center justify-center shrink-0 relative ${zIndexes[i]}`}>
                {avatar ? (
                  <img src={avatar} alt={u.name || "User Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-white font-bold ${isModal ? 'text-xs' : 'text-[10px]'}`}>{u.name ? u.name[0].toUpperCase() : 'U'}</span>
                )}
              </div>
            );
          })
        ) : (
          <>
            <div className={`${isModal ? 'w-8 h-8 border-2' : 'w-5 h-5 border'} rounded-full border-[#0B0E14] bg-blue-500/100 overflow-hidden flex items-center justify-center shrink-0 relative z-30`}><span className={`text-white font-bold ${isModal ? 'text-xs' : 'text-[10px]'}`}>K</span></div>
            <div className={`${isModal ? 'w-8 h-8 border-2' : 'w-5 h-5 border'} rounded-full border-[#0B0E14] bg-emerald-500/100 overflow-hidden flex items-center justify-center shrink-0 relative z-20`}><span className={`text-white font-bold ${isModal ? 'text-xs' : 'text-[10px]'}`}>N</span></div>
            <div className={`${isModal ? 'w-8 h-8 border-2' : 'w-5 h-5 border'} rounded-full border-[#0B0E14] bg-rose-500/100 overflow-hidden flex items-center justify-center shrink-0 relative z-10`}><span className={`text-white font-bold ${isModal ? 'text-xs' : 'text-[10px]'}`}>A</span></div>
          </>
        )}
        <div className={`${isModal ? 'w-8 h-8 border-2' : 'w-5 h-5 border'} rounded-full border-[#0B0E14] bg-gradient-to-br from-[#008A32] to-[#00A13B] flex items-center justify-center z-0 font-black text-white shrink-0 relative ${isModal ? 'text-[8px]' : 'text-[7px]'}`}>
          {totalUsers}
        </div>
      </div>
    );
  };

  const getCategoryIcon = (type) => {
    switch(type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'exam': return <BookOpen className="w-4 h-4" />;
      case 'announcement': return <Bell className="w-4 h-4" />;
      case 'advice': return <AlertCircle className="w-4 h-4" />;
      case 'support': return <HeartHandshake className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (type) => {
    switch(type) {
      case 'meeting': return 'bg-blue-500/100/20 text-blue-400 border-blue-500/30';
      case 'exam': return 'bg-rose-500/100/20 text-rose-400 border-rose-500/30';
      case 'announcement': return 'bg-indigo-500/100/20 text-indigo-400 border-indigo-500/30';
      case 'advice': return 'bg-amber-500/100/20 text-amber-400 border-amber-500/30';
      case 'support': return 'bg-emerald-500/100/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-[#11151F]/40 backdrop-blur-xl0/20 text-slate-200 border-slate-500/30';
    }
  };

  // Filter logic on the client as a strict fallback
  const filteredEvents = events.filter(evt => {
    if (isAdmin) return true;
    if (evt.targetAudiences?.includes('all')) return true;
    if (evt.targetAudiences?.includes(userRole)) return true;
    if (userRole === 'student' && evt.targetAudiences?.includes('my_students')) return true;
    if (userRole === 'instructor' && evt.targetAudiences?.includes('my_students')) return true;
    if (userRole === 'instructor' && evt.createdBy === 'self' /* pseudo logic for creators */) return true;
    return false;
  });

  return (
    <>
      <div className="flex flex-col h-full bg-[#11151F]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-lg relative min-h-[350px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-5 shrink-0">
          <div>
            <h3 className="font-semibold text-lg text-white font-display tracking-tight">Agenda Details</h3>
            <p className="text-xs text-slate-200 mt-0.5">{filteredEvents.length} items scheduled</p>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-300" />
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-2 max-h-[260px]">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-10">
              <Calendar className="w-10 h-10 text-slate-200 mb-2" />
              <p className="text-sm font-medium text-slate-300">No agenda items at the moment.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const isInstructorPost = evt.targetAudiences?.includes('my_students');
              return (
                 <div 
                   key={evt.id} 
                   onClick={() => setSelectedEvent(evt)}
                   className="p-3.5 rounded-xl bg-[#0B0E14]/60 border border-white/5 hover:border-white/10 hover:bg-[#0B0E14]/80 transition-all cursor-pointer group flex flex-col gap-2 relative overflow-hidden"
                 >
                   <div className="flex justify-between items-start gap-3">
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${getCategoryColor(evt.type)}`}>
                            {evt.type || 'Announcement'}
                          </span>
                          <span className="text-[10px] text-slate-200 font-bold uppercase tracking-wider">
                            {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          {isInstructorPost && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-500/100/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
                               <Presentation className="w-2.5 h-2.5" /> Instructor Post
                            </span>
                          )}
                       </div>
                       <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors">{evt.title}</h4>
                       
                       <div className="flex items-center gap-1.5 mt-2">
                         {renderAvatarStack(evt)}
                         <span className="text-[10px] text-slate-200 font-medium ml-1 flex items-center gap-1">
                            involving {(evt.targetAudiences || []).join(', ')}
                         </span>
                       </div>
                     </div>
                     
                     <div className="flex flex-col items-end gap-1">
                       {/* Admin Delete Action */}
                       {(isAdmin || evt.createdBy === 'self' || evt.canDelete) && onDelete && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); onDelete(evt.id); }} 
                           className="text-[10px] bg-rose-500/100/10 text-rose-400 px-2 py-1 rounded hover:bg-rose-500/100/20 hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100"
                         >
                           Delete
                         </button>
                       )}
                     </div>
                   </div>
                 </div>
              )
            })
          )}
        </div>

        {/* Footer Action */}
        {(isAdmin || userRole === 'instructor') && onCreateClick && (
          <div className="shrink-0 pt-4 mt-1 border-t border-white/5">
            <button 
              onClick={onCreateClick} 
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#0B0E14] text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0B0E14] transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              + Create Agenda Event
            </button>
          </div>
        )}
      </div>

      {/* Glassmorphic Details Popup Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#11151F]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
               {/* Modal Header */}
               <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#0B0E14]/50">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-inner ${getCategoryColor(selectedEvent.type)}`}>
                       {getCategoryIcon(selectedEvent.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white tracking-tight">{selectedEvent.title}</h4>
                      <p className="text-xs text-slate-200 mt-0.5">{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedEvent.time || '12:00 PM'}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#11151F]/5 text-slate-200 hover:text-white transition-colors">
                   <X className="w-4 h-4" />
                 </button>
               </div>
               
               {/* Modal Content */}
               <div className="p-6">
                 <div className="min-h-[100px]">
                    <h5 className="text-xs text-slate-300 uppercase tracking-widest font-bold mb-3 border-b border-white/5 pb-2">Full Details</h5>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedEvent.description || "No specific details or instructions provided for this event."}
                    </p>
                 </div>
                 
                 <div className="mt-8 flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5">
                   {renderAvatarStack(selectedEvent, true)}
                   <span className="text-xs font-medium text-slate-200">Targeting {(selectedEvent.targetAudiences || []).join(', ')}</span>
                 </div>
               </div>

               {/* Modal Footer / Acknowledge */}
               <div className="p-5 border-t border-white/5 bg-[#0B0E14]/40 flex justify-end">
                 <button 
                   onClick={() => setSelectedEvent(null)}
                   className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/100/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/20 hover:bg-emerald-500/100 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                 >
                   <CheckCircle className="w-4 h-4" /> Acknowledge & Close
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

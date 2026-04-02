import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Bell, AlertCircle, HeartHandshake, Users } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AgendaCreationModal({ isOpen, onClose, onAgendaCreated }) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'announcement',
    targetAudiences: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'meeting', label: 'Meeting', icon: Users, color: 'bg-blue-500' },
    { id: 'exam', label: 'Exam', icon: BookOpen, color: 'bg-rose-500' },
    { id: 'announcement', label: 'Announcement', icon: Bell, color: 'bg-indigo-500' },
    { id: 'advice', label: 'Advice', icon: AlertCircle, color: 'bg-amber-500' },
    { id: 'support', label: 'Support', icon: HeartHandshake, color: 'bg-emerald-500' }
  ];

  const handleAudienceToggle = (target) => {
    if (target === 'all') {
      if (formData.targetAudiences.includes('all')) {
        setFormData({ ...formData, targetAudiences: [] });
      } else {
        setFormData({ ...formData, targetAudiences: ['all'] });
      }
      return;
    }

    let updated = [...formData.targetAudiences].filter(t => t !== 'all');
    if (updated.includes(target)) {
      updated = updated.filter(t => t !== target);
    } else {
      updated.push(target);
    }
    setFormData({ ...formData, targetAudiences: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.targetAudiences.length === 0) {
      setError('Please select at least one target audience.');
      return;
    }
    
    // Combine date and time
    const dateTimeCombined = new Date(`${formData.date}T${formData.time || '00:00'}`);

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: dateTimeCombined,
        type: formData.type,
        color: categories.find(c => c.id === formData.type)?.color || 'bg-indigo-500',
        targetAudiences: formData.targetAudiences
      };
      
      const res = await api.post('/calendar', payload);
      if (res.data.success) {
        onAgendaCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agenda. Ensure you have permissions.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="glass-card rounded-3xl w-full max-w-2xl shadow-xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Create New Agenda
           </h2>
           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
           {error && (
             <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
             </div>
           )}

           <form id="agendaForm" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                 <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">Target Audience</h3>
                 <div className="flex flex-wrap gap-3">
                    <button 
                       type="button"
                       onClick={() => handleAudienceToggle('all')}
                       className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${formData.targetAudiences.includes('all') ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'glass-card border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                       All Users Broadcast
                    </button>
                    <button 
                       type="button"
                       onClick={() => handleAudienceToggle('student')}
                       className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${formData.targetAudiences.includes('student') ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'glass-card border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                       Students
                    </button>
                    <button 
                       type="button"
                       onClick={() => handleAudienceToggle('parent')}
                       className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${formData.targetAudiences.includes('parent') ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'glass-card border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                       Parents
                    </button>
                    {isAdmin && (
                      <button 
                         type="button"
                         onClick={() => handleAudienceToggle('instructor')}
                         className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${formData.targetAudiences.includes('instructor') ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'glass-card border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                      >
                         Instructors
                      </button>
                    )}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wide">Agenda Details</h3>
                 
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                   <input 
                     type="text" required 
                     value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                     className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium" 
                     placeholder="e.g., Parent-Teacher Meeting, Final Math Exam"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                     <div className="relative">
                        <input 
                          type="date" required 
                          value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium" 
                        />
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                     <div className="relative">
                        <input 
                          type="time" required 
                          value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium" 
                        />
                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {categories.map(cat => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({...formData, type: cat.id})}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.type === cat.id ? `bg-transparent border-${cat.color.split('-')[1]}-500 shadow-sm` : 'glass-card border-slate-100 hover:border-slate-300'}`}
                          >
                             <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${formData.type === cat.id ? cat.color + ' text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                               <IconComponent className="w-4 h-4" />
                             </div>
                             <span className={`text-[10px] uppercase tracking-wider font-bold ${formData.type === cat.id ? 'text-slate-800' : 'text-slate-400'}`}>{cat.label}</span>
                          </button>
                        )
                      })}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Description / Instructions (Optional)</label>
                   <textarea 
                     rows="3"
                     value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                     className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium resize-none" 
                     placeholder="Add any specific advice, support contexts, links, or instructions here..."
                   ></textarea>
                 </div>
              </div>
           </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0 bg-transparent/50 rounded-b-3xl flex justify-end gap-3">
           <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">
              Cancel
           </button>
           <button 
             type="submit" 
             form="agendaForm" 
             disabled={loading}
             className="px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
           >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Broadcast Agenda
           </button>
        </div>
      </div>
    </div>
  );
}

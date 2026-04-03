import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Bell, AlertCircle, HeartHandshake, Users, ChevronDown, Check } from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'meeting', label: 'Meeting', icon: Users, color: 'bg-blue-500' },
    { id: 'exam', label: 'Exam', icon: BookOpen, color: 'bg-rose-500' },
    { id: 'announcement', label: 'Announcement', icon: Bell, color: 'bg-indigo-500' },
    { id: 'advice', label: 'Advice', icon: AlertCircle, color: 'bg-amber-500' },
    { id: 'support', label: 'Support', icon: HeartHandshake, color: 'bg-emerald-500' }
  ];

  const adminOptions = [
    { label: 'Broadcast: All Platform Users', value: ['all'] },
    { label: 'Single Role: Students Only', value: ['student'] },
    { label: 'Single Role: Instructors Only', value: ['instructor'] },
    { label: 'Single Role: Parents Only', value: ['parent'] },
    { label: 'Single Role: Admins Only', value: ['admin'] },
    { label: 'Joint Roles: Instructors & Admins', value: ['instructor', 'admin'] },
    { label: 'Joint Roles: Students & Instructors', value: ['student', 'instructor'] },
    { label: 'Joint Roles: Students & Parents', value: ['student', 'parent'] },
  ];

  const instructorOptions = [
    { label: 'My Students', value: ['my_students'] },
    { label: 'Joint Roles: Students & Parents', value: ['student', 'parent'] },
    { label: 'All Students', value: ['student'] }
  ];

  const audienceOptions = user?.role === 'admin' ? adminOptions : instructorOptions;

  const handleSelectAudience = (valueArray) => {
    setFormData({ ...formData, targetAudiences: valueArray });
    setIsDropdownOpen(false);
  };

  const getSelectedLabel = () => {
    if (formData.targetAudiences.length === 0) return 'Select Target Audience...';
    // Deep match the array
    const match = audienceOptions.find(opt => 
      opt.value.length === formData.targetAudiences.length && 
      opt.value.every((val, index) => val === formData.targetAudiences[index])
    );
    return match ? match.label : formData.targetAudiences.join(', ');
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

  return (
    <div className="fixed inset-0 bg-[#0B0E14]/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
      <div className="bg-[#11151F]/80 backdrop-blur-2xl rounded-3xl w-full max-w-2xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FFD700]" /> Create New Agenda
           </h2>
           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
           {error && (
             <div className="p-4 mb-6 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
             </div>
           )}

           <form id="agendaForm" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4 relative">
                 <h3 className="font-bold text-sm text-slate-300 border-b border-white/5 pb-2 uppercase tracking-wide">Target Audience</h3>
                 
                 <div className="relative">
                   <button 
                     type="button" 
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                     className="w-full px-4 py-3 bg-[#0B0E14]/50 border border-white/10 rounded-xl text-sm text-white font-medium flex justify-between items-center hover:border-white/20 transition-colors focus:ring-2 focus:ring-[#FFD700]/50 outline-none"
                   >
                     {getSelectedLabel()}
                     <ChevronDown className="w-4 h-4 text-slate-400" />
                   </button>
                   
                   {isDropdownOpen && (
                     <div className="absolute z-10 top-full left-0 mt-2 w-full bg-[#1A1F2D] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                       {audienceOptions.map((opt, i) => (
                         <button
                           key={i}
                           type="button"
                           onClick={() => handleSelectAudience(opt.value)}
                           className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between group"
                         >
                           {opt.label}
                           {getSelectedLabel() === opt.label && <Check className="w-4 h-4 text-[#FFD700]" />}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
              </div>

              <div className="space-y-4 mt-8">
                 <h3 className="font-bold text-sm text-slate-300 border-b border-white/5 pb-2 uppercase tracking-wide">Agenda Details</h3>
                 
                 <div>
                   <label className="block text-sm font-bold text-slate-400 mb-2">Title</label>
                   <input 
                     type="text" required 
                     value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                     className="w-full px-4 py-3 bg-[#0B0E14]/50 border border-white/10 text-white rounded-xl text-sm focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 font-medium outline-none placeholder:text-slate-600" 
                     placeholder="e.g., Parent-Teacher Meeting, Final Math Exam"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-bold text-slate-400 mb-2">Date</label>
                     <div className="relative">
                        <input 
                          type="date" required 
                          value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-[#0B0E14]/50 border border-white/10 text-white rounded-xl text-sm focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 font-medium outline-none color-scheme-dark" 
                        />
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-400 mb-2">Time</label>
                     <div className="relative">
                        <input 
                          type="time" required 
                          value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-[#0B0E14]/50 border border-white/10 text-white rounded-xl text-sm focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 font-medium outline-none color-scheme-dark" 
                        />
                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {categories.map(cat => {
                        const IconComponent = cat.icon;
                        const isSelected = formData.type === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({...formData, type: cat.id})}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isSelected ? `bg-white/5 border-${cat.color.split('-')[1]}-500 shadow-sm` : 'bg-[#0B0E14]/50 border-white/5 hover:border-white/20'}`}
                          >
                             <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${isSelected ? cat.color + ' text-white shadow-md' : 'bg-white/5 text-slate-500'}`}>
                               <IconComponent className="w-4 h-4" />
                             </div>
                             <span className={`text-[10px] uppercase tracking-wider font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>{cat.label}</span>
                          </button>
                        )
                      })}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-400 mb-2">Description / Instructions (Optional)</label>
                   <textarea 
                     rows="3"
                     value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                     className="w-full px-4 py-3 bg-[#0B0E14]/50 border border-white/10 text-white rounded-xl text-sm focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 font-medium resize-none outline-none placeholder:text-slate-600" 
                     placeholder="Add any specific advice, support contexts, links, or instructions here..."
                   ></textarea>
                 </div>
              </div>
           </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 shrink-0 bg-transparent rounded-b-3xl flex justify-end gap-3 glass-card">
           <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
           </button>
           <button 
             type="submit" 
             form="agendaForm" 
             disabled={loading}
             className="px-8 py-2.5 rounded-xl font-bold text-[#0B0E14] bg-[#FFD700] hover:bg-[#e6c200] shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-colors disabled:opacity-50 flex items-center gap-2"
           >
              {loading && <div className="w-4 h-4 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin"></div>}
              Broadcast
           </button>
        </div>
      </div>
    </div>
  );
}

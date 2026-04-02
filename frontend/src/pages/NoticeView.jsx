import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BellRing, Pin, Plus, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NoticeView() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', audience: 'all' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notices');
      setNotices(data.data || []);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/notices', newNotice);
      setNewNotice({ title: '', content: '', audience: 'all' });
      setShowCreateForm(false);
      await fetchNotices();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  // Only admins and instructors can create notices
  const canCreate = user?.role === 'admin' || user?.role === 'instructor';

  if (loading && notices.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Global Notices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Official announcements and platform-wide updates.</p>
        </div>
        
        {canCreate && !showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-5 h-5" /> Let's Broadcast
          </button>
        )}
      </div>

      {/* Create Notice Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <BellRing className="w-5 h-5 text-indigo-500" /> Draft New Notice
             </h2>
             <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm">Cancel</button>
          </div>
          
          {errorMsg && (
             <div className="mb-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="w-5 h-5" /> {errorMsg}
             </div>
          )}

          <form onSubmit={handleCreateNotice} className="space-y-5 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Announcement Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. End of Semester Examinations"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Audience</label>
                    <select 
                      value={newNotice.audience}
                      onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold capitalize appearance-none cursor-pointer"
                    >
                      <option value="all">Entire Platform (All Users)</option>
                      <option value="student">Students Only</option>
                      <option value="instructor">Instructors Only</option>
                      <option value="admin">Administrators Only</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message Content</label>
                <textarea 
                  required
                  placeholder="Type your official announcement here..."
                  rows={4}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium"
                ></textarea>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto disabled:opacity-70"
                >
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send className="w-4 h-4" /> Publish Notice</>}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      {notices.length === 0 && !showCreateForm ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
             <BellRing className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're caught up!</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">There are no official announcements at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-6 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all relative group">
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Pin className="w-6 h-6 transform group-hover:-rotate-12 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-4">{notice.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-lg ${
                            notice.audience === 'all' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                            notice.audience === 'student' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            notice.audience === 'instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                        }`}>
                          {notice.audience === 'all' ? 'Global' : notice.audience}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                          {new Date(notice.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-sm font-medium">{notice.content}</p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Check, X, ShieldAlert, BadgeCheck, Users, Search } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';

export default function TeachersList() {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending'); // 'pending' or 'approved'

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data } = await api.get('/admin/instructors');
      if (data.success) {
        setInstructors(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch instructors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/instructor/${id}/approve`);
      fetchInstructors(); // Refresh UI
    } catch (error) {
      console.error('Failed to approve instructor', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/instructor/${id}/reject`);
      fetchInstructors(); // Refresh UI
    } catch (error) {
      console.error('Failed to reject instructor', error);
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div></div>;

  const filteredInstructors = instructors.filter(i => i.status === tab || (tab === 'approved' && !i.status));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Instructor Management</h1>
          <p className="text-sm text-slate-500">Approve registrations and manage faculty</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button 
          onClick={() => setTab('pending')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg transition ${tab === 'pending' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Pending Approval ({instructors.filter(i => i.status === 'pending').length})
        </button>
        <button 
          onClick={() => setTab('approved')}
          className={`px-4 py-2 font-bold text-sm rounded-t-lg transition ${tab === 'approved' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Approved Instructors ({instructors.filter(i => i.status === 'approved' || !i.status).length})
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Instructor</th>
                <th className="p-4">Email</th>
                <th className="p-4">Assigned Students</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {filteredInstructors.length === 0 ? (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No {tab} instructors found.</td>
                </tr>
              ) : filteredInstructors.map(inst => (
                <tr key={inst._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <UserAvatar user={inst} className="w-10 h-10 text-sm" />
                    {inst.name}
                  </td>
                  <td className="p-4 text-slate-500">{inst.email}</td>
                  <td className="p-4">
                     <span className="flex items-center gap-2 font-bold"><Users className="w-4 h-4 text-slate-400" /> {inst.assignedStudents?.length || 0}</span>
                  </td>
                  <td className="p-4">
                     {inst.status === 'pending' ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-full text-xs flex items-center gap-1 w-max"><ShieldAlert className="w-3 h-3"/> Pending</span>
                     ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs flex items-center gap-1 w-max"><BadgeCheck className="w-3 h-3"/> Approved</span>
                     )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {tab === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(inst._id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReject(inst._id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

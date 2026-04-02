import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShieldCheck, Users, CheckCircle2, XCircle, Search } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';

export default function UsersManagement() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setErrorMsg(null);
      const { data } = await api.get('/admin/users');
      setUsersList(data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Error occurred fetching users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  const assignInstructor = async (studentId, instructorId) => {
    if (!instructorId) return;
    try {
      await api.put(`/admin/student/${studentId}/assign`, { instructorId });
      fetchUsers();
    } catch (err) {
      console.error('Failed to assign instructor', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E30A17]" />
            Global User Management
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Approve registrations and promote user roles across the platform.
          </p>
        </div>
        <div className="bg-[#008A32]/10 px-4 py-2 rounded-xl text-sm font-bold text-[#008A32] flex items-center gap-2 border border-[#008A32]/20 shadow-sm">
          <ShieldCheck className="w-4 h-4" /> Super Admin Access Active
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="pb-4 border-b border-white/5 flex justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FFD700] transition-shadow text-white placeholder-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
                <tr className="bg-white/5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role Management</th>
                  <th className="px-6 py-4">Assign Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {errorMsg ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#E30A17] font-bold">Error: {errorMsg}</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">No users found.</td>
                  </tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={u} className="w-8 h-8 text-xs" />
                        <span className="font-semibold text-white">{u.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    
                    {/* Status Control */}
                    <td className="px-6 py-4">
                      {u.status === 'pending' ? (
                        <div className="flex gap-2 relative z-10 w-max">
                            <button onClick={() => updateUserStatus(u._id, 'approved')} className="text-xs font-bold bg-[#008A32]/10 text-[#008A32] hover:bg-[#008A32]/20 px-3 py-1.5 rounded-lg border border-[#008A32]/20 transition-colors shadow-sm">Approve</button>
                            <button onClick={() => updateUserStatus(u._id, 'rejected')} className="text-xs font-bold bg-[#E30A17]/10 text-[#E30A17] hover:bg-[#E30A17]/20 px-3 py-1.5 rounded-lg border border-[#E30A17]/20 transition-colors shadow-sm">Reject</button>
                        </div>
                      ) : (
                        <span className={`inline-flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          u.status === 'approved' ? 'bg-[#008A32]/10 text-[#008A32] border-[#008A32]/20' : 
                          u.status === 'rejected' ? 'bg-[#E30A17]/10 text-[#E30A17] border-[#E30A17]/20' : 
                          'bg-white/5 text-slate-300 border-white/10'
                        }`}>
                          {u.status === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : u.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : null}
                          {u.status}
                        </span>
                      )}
                    </td>
                  
                  {/* Role Control */}
                  <td className="px-6 py-4">
                      <select 
                        value={u.role} 
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        disabled={u._id === user?._id}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-bold capitalize focus:outline-none focus:ring-2 focus:ring-[#FFD700] cursor-pointer appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_10px_center] bg-[length:10px_10px] ${
                          u.role === 'admin' 
                            ? 'bg-[#E30A17]/10 text-[#E30A17] border-[#E30A17]/20' 
                            : u.role === 'instructor' 
                            ? 'bg-[#008A32]/10 text-[#008A32] border-[#008A32]/20' 
                            : 'bg-white/5 text-slate-300 border-white/10'
                        } ${u._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={u._id === user?._id ? "Cannot change your own role" : "Change User Role"}
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* Assignment Control */}
                  <td className="px-6 py-4">
                    {u.role === 'student' ? (
                      <select 
                        value={u.assignedInstructor?._id || u.assignedInstructor || ''}
                        onChange={(e) => assignInstructor(u._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-[#0B0E14] text-white border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] cursor-pointer w-full max-w-[150px]"
                      >
                        <option value="" disabled>Assign Inst...</option>
                        {usersList.filter(uList => uList.role === 'instructor').map(inst => (
                          <option key={inst._id} value={inst._id}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-500 text-sm italic">N/A</span>
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

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [notice, setNotice] = useState('');

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

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, role } = newUser;
      if (!name || !email || !password) {
        setNotice('Name, email, and password are required.');
        return;
      }
      await api.post('/admin/users', { name, email, password, role });
      setNewUser({ name: '', email: '', password: '', role: 'student' });
      setShowAddForm(false);
      setNotice('User added successfully.');
      fetchUsers();
    } catch (err) {
      console.error('Failed to create user', err);
      setNotice(err.response?.data?.message || 'Could not create user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete user permanently? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setNotice('User deleted.');
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
      setNotice('Failed to delete user.');
    }
  };

  const resetUserPassword = async (userId) => {
    const tempPassword = `${Math.random().toString(36).slice(-8)}A!`;
    try {
      await api.post(`/admin/users/${userId}/reset-password`, { newPassword: tempPassword });
      window.alert(`Temporary password set: ${tempPassword}`);
    } catch (err) {
      console.error('Failed to reset password', err);
      setNotice('Failed to reset password.');
    }
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
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
        <div className="pb-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-3">
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
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-4 py-2 rounded-lg border border-[#FFD700]/50 bg-[#FFD700]/15 text-[#FFD700] font-semibold hover:bg-[#FFD700]/30"
          >
            {showAddForm ? 'Close Add User' : 'Add New User'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={createUser} className="mt-4 mb-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              className="col-span-1 md:col-span-1 px-3 py-2 rounded-lg border border-white/10 bg-black/10 text-white"
              required
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
              className="col-span-1 md:col-span-1 px-3 py-2 rounded-lg border border-white/10 bg-black/10 text-white"
              required
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Temporary password"
              className="col-span-1 md:col-span-1 px-3 py-2 rounded-lg border border-white/10 bg-black/10 text-white"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
              className="col-span-1 md:col-span-1 px-3 py-2 rounded-lg border border-white/10 bg-black/10 text-white"
              required
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="col-span-1 md:col-span-1 px-4 py-2 rounded-lg bg-[#008A32] text-white font-semibold hover:bg-[#00712a]"
            >
              Create User
            </button>
          </form>
        )}

        {notice && (
          <div className="mb-4 p-3 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/25 text-[#FFD700] text-sm font-semibold">{notice}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
                <tr className="bg-white/5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role Management</th>
                  <th className="px-6 py-4">Assign Target</th>
                  <th className="px-6 py-4">Actions</th>
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
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => resetUserPassword(u._id)} className="text-xs px-2.5 py-1 rounded-lg bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 border border-yellow-500/20">Reset PW</button>
                      <button onClick={() => deleteUser(u._id)} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/20">Delete</button>
                      <button onClick={() => showUserDetails(u)} className="text-xs px-2.5 py-1 rounded-lg bg-slate-500/15 text-slate-300 hover:bg-slate-500/25 border border-slate-500/20">Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/20">
            <h3 className="text-sm font-bold text-[#FFD700]">User Detail</h3>
            <p className="text-sm text-slate-200">Name: {selectedUser.name}</p>
            <p className="text-sm text-slate-200">Email: {selectedUser.email}</p>
            <p className="text-sm text-slate-200">Role: {selectedUser.role}</p>
            <p className="text-sm text-slate-200">Status: {selectedUser.status}</p>
            <p className="text-sm text-slate-200">Parent Of: {(selectedUser.children || []).map(c => c.name).join(', ') || 'None'}</p>
            <button onClick={() => setSelectedUser(null)} className="mt-2 text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

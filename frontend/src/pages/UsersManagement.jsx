import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShieldCheck, Users, CheckCircle2, XCircle, Search } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import UserIntelligenceModal from '../components/UserIntelligenceModal';
import CustomDropdown from '../components/CustomDropdown';

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
            <CustomDropdown
              value={newUser.role}
              onChange={(val) => setNewUser((prev) => ({ ...prev, role: val }))}
              options={[
                { label: 'Student', value: 'student' },
                { label: 'Parent', value: 'parent' },
                { label: 'Instructor', value: 'instructor' },
                { label: 'Admin', value: 'admin' }
              ]}
              className="col-span-1 md:col-span-1"
            />
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
                      {u._id === user?._id ? (
                        <div className="opacity-50 cursor-not-allowed">
                           <CustomDropdown value={u.role} onChange={() => {}} options={[{ label: u.role, value: u.role }]} />
                        </div>
                      ) : (
                        <CustomDropdown
                          value={u.role}
                          onChange={(val) => updateRole(u._id, val)}
                          options={[
                            { label: 'Student', value: 'student' },
                            { label: 'Parent', value: 'parent' },
                            { label: 'Instructor', value: 'instructor' },
                            { label: 'Admin', value: 'admin' }
                          ]}
                          className="w-32"
                        />
                      )}
                  </td>

                  {/* Assignment Control */}
                  <td className="px-6 py-4">
                    {u.role === 'student' ? (
                      <CustomDropdown
                        value={u.assignedInstructor?._id || u.assignedInstructor || ''}
                        onChange={(val) => assignInstructor(u._id, val)}
                        options={usersList.filter(uList => uList.role === 'instructor').map(inst => ({ 
                          label: inst.name, 
                          value: inst._id,
                          render: (
                            <div className="flex items-center gap-3 w-full py-0.5">
                              <div className="w-8 h-8 rounded-full bg-[#008A32]/20 text-[#008A32] flex items-center justify-center font-bold text-xs shrink-0 border border-[#008A32]/30 shadow-sm uppercase">
                                  {inst.name ? inst.name.charAt(0) : '?'}
                              </div>
                              <div className="flex flex-col text-left flex-1 min-w-0">
                                <span className="font-bold text-white text-xs truncate">{inst.name}</span>
                                <span className="text-[10px] text-slate-400 truncate mt-0.5">{inst.email}</span>
                              </div>
                            </div>
                          )
                        }))}
                        placeholder="Assign Inst..."
                        searchable={true}
                        className="w-44"
                      />
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

        <UserIntelligenceModal 
          isOpen={!!selectedUser} 
          userId={selectedUser?._id} 
          onClose={() => setSelectedUser(null)} 
          onRefreshUsers={fetchUsers} 
          globalUsersList={usersList} 
        />
      </div>
    </div>
  );
}

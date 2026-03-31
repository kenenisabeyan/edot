import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ShieldAlert, Users, BookOpen, Clock, Settings, LogOut, CheckCircle2, XCircle, UserCog, AlertTriangle, ShieldCheck, Check, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import edotLogo from '../assets/edot-logo.jpg';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchPendingCourses()]).finally(() => setLoading(false));
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsersList(data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchPendingCourses = async () => {
    try {
      const { data } = await api.get('/admin/courses/pending');
      setPendingCourses(data.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
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

  const updateCourseStatus = async (courseId, status) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status });
      fetchPendingCourses();
    } catch (err) {
      console.error('Failed to update course', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const instructorsCount = usersList.filter(u => u.role === 'instructor').length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        const revenueData = [
          { name: 'Jan', revenue: 4200 },
          { name: 'Feb', revenue: 5500 },
          { name: 'Mar', revenue: 7200 },
          { name: 'Apr', revenue: 6800 },
          { name: 'May', revenue: 9500 },
          { name: 'Jun', revenue: 12500 },
        ];
        const studentsCount = usersList.length - instructorsCount - usersList.filter(u => u.role === 'admin').length;
        const adminCount = usersList.filter(u => u.role === 'admin').length;
        const userDistributionData = [
          { name: 'Students', value: studentsCount, color: '#3b82f6' },
          { name: 'Instructors', value: instructorsCount, color: '#a855f7' },
          { name: 'Admins', value: adminCount, color: '#ef4444' },
        ];
        
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Admin Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                    <h3 className="text-3xl font-bold text-slate-900">{usersList.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Instructors</p>
                    <h3 className="text-3xl font-bold text-slate-900">{instructorsCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <UserCog className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Pending Approvals</p>
                    <h3 className="text-3xl font-bold text-slate-900">{pendingCourses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview (YTD)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">User Distribution</h3>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                  onClick={() => setActiveTab('users')} 
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left group"
                 >
                   <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                     <Users className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="block font-semibold">Manage Users</span>
                     <span className="text-sm text-slate-500 group-hover:text-blue-600">Change roles, block access</span>
                   </div>
                 </button>
                 <button 
                  onClick={() => setActiveTab('courses')} 
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left group"
                 >
                   <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                     <BookOpen className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="block font-semibold">Review Courses</span>
                     <span className="text-sm text-slate-500 group-hover:text-amber-600">{pendingCourses.length} awaiting approval</span>
                   </div>
                 </button>
               </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-display font-bold text-slate-900">User Management</h2>
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Super Admin Access
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u, idx) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex flex-shrink-0 items-center justify-center font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{u.email}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={u.role} 
                            onChange={(e) => updateRole(u._id, e.target.value)}
                            disabled={u._id === user?._id}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_10px_center] bg-[length:10px_10px] ${
                              u.role === 'admin' 
                                ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500' 
                                : u.role === 'instructor' 
                                ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-500' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-slate-500'
                            } ${u._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={u._id === user?._id ? "Cannot change your own role" : "Change User Role"}
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-slate-900">Course Approvals</h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {pendingCourses.length} Pending
              </span>
            </div>

            {pendingCourses.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                 <p className="text-slate-500 max-w-sm">There are no pending courses awaiting your review. Check back later.</p>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {pendingCourses.map(c => (
                    <div key={c._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row group">
                      
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-slate-100">
                        <img 
                          src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 uppercase tracking-wider shadow-sm">
                          {c.category}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="text-xl font-bold text-slate-900 leading-snug">{c.title}</h3>
                          <span className="shrink-0 flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
                             <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        </div>
                        
                        <p className="text-slate-500 text-sm mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="flex items-center gap-1"><UserCog className="w-4 h-4" /> Instructor: <span className="font-semibold text-slate-700">{c.instructor?.name || 'Unknown'}</span></span>
                          <span className="text-slate-300">•</span>
                          <span>{c.duration} hours</span>
                          <span className="text-slate-300">•</span>
                          <span>{c.lessons?.length || 0} lessons</span>
                        </p>
                        
                        <p className="text-slate-600 mb-6 flex-1 line-clamp-3">{c.description}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                           <button 
                            onClick={() => updateCourseStatus(c._id, 'approved')} 
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                           >
                             <Check className="w-5 h-5" /> Approve & Publish
                           </button>
                           <button 
                            onClick={() => updateCourseStatus(c._id, 'rejected')} 
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 hover:-translate-y-0.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                           >
                             <XCircle className="w-5 h-5" /> Reject
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        );
      case 'logs':
        const mockLogs = [
          { id: 1, action: 'User Registration', user: 'john@example.com', time: '10 mins ago', status: 'Success' },
          { id: 2, action: 'Course Approved', user: 'Admin System', time: '1 hour ago', status: 'Success' },
          { id: 3, action: 'Failed Login Attempt', user: 'unknown@ip', time: '2 hours ago', status: 'Warning' },
          { id: 4, action: 'Database Backup', user: 'System Auto', time: '5 hours ago', status: 'Success' },
          { id: 5, action: 'Payment Gateway Error', user: 'System', time: '1 day ago', status: 'Error' },
        ];
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">System Logs</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-700 flex items-center gap-2"><Activity className="w-4 h-4" /> Activity Feed</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Export CSV</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {mockLogs.map(log => (
                  <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{log.action}</p>
                      <p className="text-sm text-slate-500">{log.user} &bull; {log.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {log.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Administrator Settings</h2>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100 text-center sm:text-left">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 border-4 border-white shadow-md shrink-0">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h3>
                  <p className="text-slate-500 mb-3">{user?.email}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider border border-red-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 mb-8">
                 <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                 <div>
                   <h4 className="font-semibold text-amber-900 mb-1">Administrative Privileges Active</h4>
                   <p className="text-sm text-amber-800/80">You have full system access. Actions taken here immediately affect the production environment and all users. Please proceed with caution.</p>
                 </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name} 
                    disabled 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed" 
                  />
                  <p className="mt-1.5 text-xs text-slate-500">Contact IT support to change your administrator display name.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email} 
                    disabled 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItemClass = (tabName) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left
    ${activeTab === tabName 
      ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 flex flex-col md:h-screen">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 mb-6 w-full px-2">
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto" />
           </div>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
               <ShieldAlert className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-bold text-lg leading-tight truncate">{user?.name}</h3>
               <p className="text-red-400 text-xs font-bold uppercase tracking-wider">{user?.role}</p>
             </div>
           </div>

           <nav className="space-y-2">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <ShieldCheck className="w-5 h-5 shrink-0" /> Overview
             </button>
             <button onClick={() => setActiveTab('users')} className={navItemClass('users')}>
               <Users className="w-5 h-5 shrink-0" /> Manage Users
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <BookOpen className="w-5 h-5 shrink-0" /> Course Approvals
               {pendingCourses.length > 0 && (
                 <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                   {pendingCourses.length}
                 </span>
               )}
             </button>
             <button onClick={() => setActiveTab('logs')} className={navItemClass('logs')}>
               <Activity className="w-5 h-5 shrink-0" /> System Logs
             </button>
             <button onClick={() => setActiveTab('settings')} className={navItemClass('settings')}>
               <Settings className="w-5 h-5 shrink-0" /> Settings
             </button>
           </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

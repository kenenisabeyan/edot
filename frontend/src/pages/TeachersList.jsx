import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit2, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import api from '../utils/api';

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [deptFilter, setDeptFilter] = useState('');
  const [expandedTeacherId, setExpandedTeacherId] = useState(null);

  // New Instructor Modal state
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: '', email: '', password: '', department: '', phone: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      if (data.success) {
        setTeachers(data.data.filter(u => u.role === 'instructor'));
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to completely remove ${name} from EDOT? This cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        setTeachers(teachers.filter(t => t._id !== id));
      } catch (err) {
        console.error('Failed to delete teacher', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/admin/users', { ...newInstructor, role: 'instructor' });
      if (data.success) {
        setTeachers([{...data.data, taughtCourses: []}, ...teachers]);
        setShowModal(false);
        setNewInstructor({ name: '', email: '', password: '', department: '', phone: '' });
      }
    } catch (err) {
      console.error('Failed to create instructor', err);
      alert(err.response?.data?.message || 'Failed to create instructor');
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedTeacherId === id) setExpandedTeacherId(null);
    else setExpandedTeacherId(id);
  };

  // derived state for search & explicit dept filters
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? t.department === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  // Extract unique departments for the filter dropdown
  const uniqueDepts = [...new Set(teachers.map(t => t.department).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Instructors Management</h1>
          <p className="text-slate-500 text-sm mt-1">You have {teachers.length} authorized instructors</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative">
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-colors shadow-sm ${showFilters || deptFilter ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               <Filter className="w-4 h-4" /> {deptFilter ? `Dept: ${deptFilter}` : 'Filter'}
             </button>
             {showFilters && (
               <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl z-10 p-2">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-1">By Dept</div>
                 <button 
                    onClick={() => { setDeptFilter(''); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!deptFilter ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                 >All Departments</button>
                 {uniqueDepts.map(d => (
                    <button 
                      key={d}
                      onClick={() => { setDeptFilter(d); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${deptFilter === d ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >{d}</button>
                 ))}
               </div>
             )}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/30 justify-center"
          >
            <Plus className="w-4 h-4" /> New Instructor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by instructor name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-full py-12">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
               No instructors found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Instructor Name</th>
                  <th className="px-6 py-4">Department & Contact</th>
                  <th className="px-6 py-4">Taught Curriculum</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map(teacher => (
                  <React.Fragment key={teacher._id}>
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {teacher.avatar && teacher.avatar !== 'default-avatar.png' ? (
                            <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                              {teacher.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-slate-800">{teacher.name}</p>
                            <p className="text-xs text-slate-400">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-700">{teacher.department || 'General'}</span>
                           <span className="text-xs text-slate-400">{teacher.phone ? `Phone: ${teacher.phone}` : 'No Phone'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleExpand(teacher._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${expandedTeacherId === teacher._id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          <BookOpen className="w-4 h-4" /> 
                          {teacher.taughtCourses?.length || 0} Courses 
                          {expandedTeacherId === teacher._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-semibold">Verified</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(teacher._id, teacher.name)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <button className="p-1.5 text-slate-400 group-hover:hidden"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    {/* Expandable Row for Taught Courses */}
                    {expandedTeacherId === teacher._id && (
                      <tr className="bg-slate-50/80 border-b border-slate-100 shadow-inner">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="pl-12 border-l-2 border-indigo-200 ml-4 py-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Courses Authenticated by this Instructor</h4>
                            {teacher.taughtCourses?.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {teacher.taughtCourses.map((course, idx) => (
                                  <div key={idx} className="bg-white p-3 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-700 truncate" title={course.title}>
                                          {course.title || 'Deleted Course'}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                          Status: {course.status}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="shrink-0">
                                       <span className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${course.isPublished ? 'bg-emerald-500' : 'bg-amber-400'}`} title={course.isPublished ? 'Published' : 'Draft'}></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                               <p className="text-sm text-slate-500 italic">This instructor has not created any courses yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Instructor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">Assign New Instructor</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
             </div>
             <form onSubmit={handleCreateInstructor} className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name *</label>
                  <input required type="text" value={newInstructor.name} onChange={e => setNewInstructor({...newInstructor, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address *</label>
                  <input required type="email" value={newInstructor.email} onChange={e => setNewInstructor({...newInstructor, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Temporary Password *</label>
                  <input required minLength="6" type="text" value={newInstructor.password} onChange={e => setNewInstructor({...newInstructor, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min 6 characters" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Department</label>
                    <input type="text" value={newInstructor.department} onChange={e => setNewInstructor({...newInstructor, department: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Computer Science" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Phone</label>
                    <input type="text" value={newInstructor.phone} onChange={e => setNewInstructor({...newInstructor, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Optional" />
                  </div>
               </div>
               <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={creating} className="flex-1 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
                    {creating ? 'Saving...' : 'Create Instructor'}
                  </button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}

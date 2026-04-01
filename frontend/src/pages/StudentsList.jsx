import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit2, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import api from '../utils/api';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [batchFilter, setBatchFilter] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  // New Student Modal state
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', password: '', batch: '', section: '', phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      if (data.success) {
        setStudents(data.data.filter(u => u.role === 'student'));
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to completely remove the student ${name} from EDOT? This cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        setStudents(students.filter(t => t._id !== id));
      } catch (err) {
        console.error('Failed to delete student', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/admin/users', { ...newStudent, role: 'student' });
      if (data.success) {
        setStudents([{...data.data, enrolledCourses: []}, ...students]);
        setShowModal(false);
        setNewStudent({ name: '', email: '', password: '', batch: '', section: '', phone: '' });
      }
    } catch (err) {
      console.error('Failed to create student', err);
      alert(err.response?.data?.message || 'Failed to create student');
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedStudentId === id) setExpandedStudentId(null);
    else setExpandedStudentId(id);
  };

  // derived state for search & explicit batch filters
  const filteredStudents = students.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter ? t.batch === batchFilter : true;
    return matchesSearch && matchesBatch;
  });

  // Extract unique batches for the filter dropdown
  const uniqueBatches = [...new Set(students.map(s => s.batch).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students Management</h1>
          <p className="text-slate-500 text-sm mt-1">You have {students.length} enrolled students</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative">
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-colors shadow-sm ${showFilters || batchFilter ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               <Filter className="w-4 h-4" /> {batchFilter ? `Batch: ${batchFilter}` : 'Filter'}
             </button>
             {showFilters && (
               <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl z-10 p-2">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-1">By Batch</div>
                 <button 
                    onClick={() => { setBatchFilter(''); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!batchFilter ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                 >All Batches</button>
                 {uniqueBatches.map(b => (
                    <button 
                      key={b}
                      onClick={() => { setBatchFilter(b); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${batchFilter === b ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >{b}</button>
                 ))}
               </div>
             )}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/30 justify-center"
          >
            <Plus className="w-4 h-4" /> New Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name or email..." 
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
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
               No students found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Batch & Section</th>
                  <th className="px-6 py-4">Enrolled Courses</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <React.Fragment key={student._id}>
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.avatar && student.avatar !== 'default-avatar.png' ? (
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-slate-800">{student.name}</p>
                            <p className="text-xs text-slate-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-700">{student.batch || '-'}</span>
                           <span className="text-xs text-slate-400">{student.section ? `Section: ${student.section}` : 'No Section'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleExpand(student._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${expandedStudentId === student._id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          <BookOpen className="w-4 h-4" /> 
                          {student.enrolledCourses?.length || 0} Courses 
                          {expandedStudentId === student._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-semibold">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(student._id, student.name)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <button className="p-1.5 text-slate-400 group-hover:hidden"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    {/* Expandable Row for Courses */}
                    {expandedStudentId === student._id && (
                      <tr className="bg-slate-50/80 border-b border-slate-100 shadow-inner">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="pl-12 border-l-2 border-indigo-200 ml-4 py-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Enrolled Course Curriculum</h4>
                            {student.enrolledCourses?.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {student.enrolledCourses.map((enrollment, idx) => (
                                  <div key={idx} className="bg-white p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                      <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-bold text-slate-700 truncate" title={enrollment.course?.title}>
                                        {enrollment.course ? enrollment.course.title : 'Deleted Course'}
                                      </p>
                                      <div className="w-full bg-slate-100 h-1.5 mt-1.5 rounded-full overflow-hidden">
                                         <div className="bg-emerald-500 h-full" style={{ width: `${enrollment.progress || 0}%`}}></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                               <p className="text-sm text-slate-500 italic">This student is not enrolled in any courses yet.</p>
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

      {/* New Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">Add New Student</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
             </div>
             <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name *</label>
                  <input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address *</label>
                  <input required type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Temporary Password *</label>
                  <input required minLength="6" type="text" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min 6 characters" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Batch</label>
                    <input type="text" value={newStudent.batch} onChange={e => setNewStudent({...newStudent, batch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Section</label>
                    <input type="text" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., A" />
                  </div>
               </div>
               <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={creating} className="flex-1 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
                    {creating ? 'Saving...' : 'Create Student'}
                  </button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}

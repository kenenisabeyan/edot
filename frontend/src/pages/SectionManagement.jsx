import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Layers, Plus, Link as LinkIcon, Users, UserPlus, BookOpen, Trash2, ShieldAlert, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SectionManagement() {
  const { user } = useAuth();
  
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [validators, setValidators] = useState({ instructors: [], students: [] });
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', course: '', instructor: '' });
  
  // Section specifics
  const [selectedSection, setSelectedSection] = useState(null);
  const [studentToAdd, setStudentToAdd] = useState('');

  useEffect(() => {
    fetchCoreData();
  }, []);

  const fetchCoreData = async () => {
    try {
      setLoading(true);
      // Fetch sections
      const secRes = await api.get('/sections');
      if (secRes.data?.success) setSections(secRes.data.data);

      // Fetch courses
      const courseRes = await api.get('/courses');
      if (courseRes.data?.success || Array.isArray(courseRes.data?.data)) {
        setCourses(courseRes.data.data || []);
      }

      // Fetch users to segregate instructors and students
      const usersRes = await api.get('/admin/users'); // fallback to admin users route
      if (usersRes.data?.success) {
         const allUsers = usersRes.data.data || [];
         setValidators({
           instructors: allUsers.filter(u => u.role === 'instructor' || u.role === 'admin'),
           students: allUsers.filter(u => u.role === 'student')
         });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sections', formData);
      if (res.data?.success) {
         setFormData({ name: '', course: '', instructor: '' });
         fetchCoreData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating section');
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/sections/${id}`);
      fetchCoreData();
      if (selectedSection?._id === id) setSelectedSection(null);
    } catch (error) {
       alert(error.response?.data?.message || 'Error deleting section');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedSection || !studentToAdd) return;
    try {
      await api.post(`/sections/${selectedSection._id}/add-student`, { studentId: studentToAdd });
      setStudentToAdd('');
      fetchCoreData(); // refresh
      // refresh local ref
      const updated = await api.get(`/sections/${selectedSection._id}`);
      setSelectedSection(updated.data.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding student');
    }
  };

  const handleRemoveStudent = async (sectionId, studentId) => {
    try {
      await api.delete(`/sections/${sectionId}/students/${studentId}`);
      fetchCoreData();
      if (selectedSection?._id === sectionId) {
         const updated = await api.get(`/sections/${sectionId}`);
         setSelectedSection(updated.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing student');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
         <Loader className="w-10 h-10 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto text-slate-200">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Section <span className="text-[#008A32]">Management</span></h1>
        <p className="text-slate-400 font-medium">Create groupings, assign instructors, and organize students tightly into cohorts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Form & Management */}
         <div className="lg:col-span-1 space-y-8">
            {/* Create Card */}
            <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#008A32]/10 rounded-full blur-[40px]"></div>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-[#FFD700]" /> New Section
               </h3>
               
               <form onSubmit={handleCreateSection} className="space-y-5">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Section Name</label>
                   <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Batch 1, Group A" required className="w-full bg-[#0B0E14] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#008A32]/50 transition-colors" />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Course</label>
                   <div className="relative">
                     <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required className="w-full bg-[#0B0E14] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 appearance-none focus:outline-none focus:border-[#008A32]/50 transition-colors">
                       <option value="" disabled>Select a course...</option>
                       {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                     </select>
                     <BookOpen className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Instructor</label>
                   <div className="relative">
                     <select value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full bg-[#0B0E14] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 appearance-none focus:outline-none focus:border-[#008A32]/50 transition-colors">
                       <option value="">No explicit assignment</option>
                       {validators.instructors.map(ins => <option key={ins._id} value={ins._id}>{ins.name || ins.email}</option>)}
                     </select>
                     <ShieldAlert className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                   </div>
                 </div>

                 <button type="submit" className="w-full mt-2 bg-[#0B0E14] text-[#008A32] font-bold py-3 rounded-xl border border-[#008A32]/30 hover:bg-[#008A32] hover:text-white transition-all shadow-[0_0_15px_rgba(0,138,50,0.1)] flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4" /> Create Section
                 </button>
               </form>
            </div>

            {/* Selected Section Detail / Enrollment */}
            {selectedSection && (
              <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2.5rem] p-6 lg:p-8 animate-fade-in-up">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                   <span className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-[#FFD700]" /> Student Roster</span>
                   <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">{selectedSection.name}</span>
                 </h3>
                 
                 <form onSubmit={handleAddStudent} className="flex flex-col gap-3 mb-6">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enroll New Learner</label>
                   <select value={studentToAdd} onChange={e => setStudentToAdd(e.target.value)} required className="w-full bg-[#0B0E14] border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#FFD700]/50 transition-colors appearance-none">
                     <option value="" disabled>Search & Select Student...</option>
                     {validators.students.filter(stu => !selectedSection.students.find(s => s._id === stu._id)).map(stu => (
                        <option key={stu._id} value={stu._id}>{stu.name} - {stu.email}</option>
                     ))}
                   </select>
                   <button type="submit" className="w-full bg-[#FFD700]/10 text-[#FFD700] py-2.5 rounded-xl border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0B0E14] transition-all font-bold text-sm">
                     + Add to {selectedSection.name}
                   </button>
                 </form>

                 <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-hide border-t border-white/5 pt-4">
                   <p className="text-xs font-bold text-slate-500 tracking-wider mb-3">{selectedSection.students.length} Learners Enrolled</p>
                   {selectedSection.students.map(student => (
                     <div key={student._id} className="flex items-center justify-between bg-[#0B0E14]/60 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">{student.name?.[0]?.toUpperCase()}</div>
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-white">{student.name}</span>
                           <span className="text-[10px] text-slate-400">{student.email}</span>
                         </div>
                       </div>
                       <button onClick={() => handleRemoveStudent(selectedSection._id, student._id)} className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                   {selectedSection.students.length === 0 && (
                     <div className="text-center text-slate-500 text-sm py-4 italic">No students linked to this array yet.</div>
                   )}
                 </div>
              </div>
            )}
         </div>

         {/* Sections List */}
         <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2"><LinkIcon className="w-5 h-5 text-[#008A32]" /> Course Mappings</h3>
           
           {courses.map(course => {
             const courseSections = sections.filter(s => s.course?._id === course._id);
             if (courseSections.length === 0) return null;

             return (
               <div key={course._id} className="bg-[#11151F]/30 border border-white/5 rounded-3xl p-5 md:p-6 mb-6">
                 <h4 className="text-lg font-black text-white mb-5 uppercase tracking-tight flex items-center gap-3 border-b border-white/5 pb-4">
                   {course.title}
                   <span className="text-[10px] font-bold bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded-full border border-[#FFD700]/20">{courseSections.length} Sections</span>
                 </h4>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {courseSections.map(sec => (
                     <div 
                       key={sec._id} 
                       onClick={() => setSelectedSection(sec)}
                       className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedSection?._id === sec._id ? 'bg-[#008A32]/10 border-[#008A32]/40 shadow-[0_0_20px_rgba(0,138,50,0.1)]' : 'bg-[#0B0E14]/60 border-white/5 hover:border-white/10 hover:bg-[#0B0E14]'}`}
                     >
                        <div className="flex justify-between items-start mb-3">
                           <div>
                             <h5 className="font-bold text-white text-base group-hover:text-[#FFD700] transition-colors">{sec.name}</h5>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                               Instructor: {sec.instructor ? sec.instructor.name : <span className="text-rose-400">Unassigned</span>}
                             </p>
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec._id); }} className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-white/5 hover:bg-rose-500/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/30">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                           <Users className="w-4 h-4 text-slate-500" />
                           <span className="text-xs font-medium text-slate-300">{sec.students?.length || 0} Learners Managed</span>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             )
           })}

           {sections.length === 0 && (
              <div className="bg-[#11151F]/30 border border-white/10 rounded-3xl p-16 text-center text-slate-400 font-medium italic">
                No sections exist in the database. Construct the first cohort via the form.
              </div>
           )}
         </div>
      </div>
    </div>
  );
}

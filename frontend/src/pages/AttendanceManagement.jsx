import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, UserX, Clock, Save, ShieldAlert, Award, FileText } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeTab, setActiveTab] = useState('daily');
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [usersToTrack, setUsersToTrack] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [courseHistory, setCourseHistory] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Report state
  const [finalGrades, setFinalGrades] = useState({});
  const [attendancePercentages, setAttendancePercentages] = useState({});
  const [term, setTerm] = useState('Fall 2026');
  const [submittedReports, setSubmittedReports] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/admin/courses' : '/instructor/courses';
        const { data } = await api.get(endpoint);
        setCourses(data.data || []);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };
    if (user) fetchCourses();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    
    const fetchStudentsAndRecords = async () => {
      setLoading(true);
      try {
        const userEndpoint = user?.role === 'admin' ? '/admin/users' : '/instructor/students';
        const [userRes, recordRes] = await Promise.all([
          api.get(userEndpoint),
          api.get(`/attendance/course/${selectedCourse}`)
        ]);

        const selectedCourseObj = courses.find(c => c._id === selectedCourse);
        let courseUsers = [];

        if (user?.role === 'admin') {
           const allUsers = userRes.data.data || [];
           const students = allUsers.filter(s => s.role === 'student' && s.enrolledCourses && s.enrolledCourses.some(ec => (ec.course?._id || ec.course) === selectedCourse));
           
           const instructorId = selectedCourseObj?.instructor?._id || selectedCourseObj?.instructor;
           const instructor = allUsers.find(u => u._id === instructorId);
           
           if (instructor) courseUsers.push({ ...instructor, category: 'Instructor' });
           students.forEach(s => courseUsers.push({ ...s, category: 'Student' }));
        } else {
           const students = (userRes.data.data || []).filter(s => s.enrolledCourses && s.enrolledCourses.some(ec => (ec.course?._id || ec.course) === selectedCourse));
           students.forEach(s => courseUsers.push({ ...s, category: 'Student' }));
        }
        
        setUsersToTrack(courseUsers);

        // Check if there's an existing record for this date
        const targetDateStr = new Date(date).toISOString().split('T')[0];
        const existingRecords = recordRes.data.data || [];
        setCourseHistory(existingRecords.sort((a,b) => new Date(b.date) - new Date(a.date)));
        
        const todaysRecord = existingRecords.find(r => 
           new Date(r.date).toISOString().split('T')[0] === targetDateStr
        );

        let initialAttendance = {};
        if (todaysRecord) {
           todaysRecord.records.forEach(rc => {
              initialAttendance[rc.student?._id || rc.student] = rc.status;
           });
        }
        
        courseUsers.forEach(s => {
           if (!initialAttendance[s._id]) initialAttendance[s._id] = 'Present';
        });

        setAttendance(initialAttendance);

        // Auto compute percentages
        const totals = {};
        const presences = {};
        
        existingRecords.forEach(rec => {
           rec.records.forEach(r => {
              const sid = r.student?._id || r.student;
              if (!totals[sid]) totals[sid] = 0;
              if (!presences[sid]) presences[sid] = 0;
              
              totals[sid] += 1;
              if (r.status === 'Present' || r.status === 'Late') {
                 presences[sid] += 1;
              }
           });
        });

        const autoPercentages = {};
        Object.keys(totals).forEach(sid => {
           autoPercentages[sid] = Math.round((presences[sid] / totals[sid]) * 100);
        });
        setAttendancePercentages(autoPercentages);
        
        // Try to fetch existing saved semester reports to persist data (Final Grades)
        if (activeTab === 'report') {
            const reportRes = await api.get('/attendance/reports');
            if (reportRes.data && reportRes.data.data) {
                const targetReports = reportRes.data.data.filter(r => (r.course?._id || r.course) === selectedCourse);
                setSubmittedReports(targetReports);

                if (targetReports.length > 0) {
                   const existingGrades = {};
                   targetReports[0].studentRecords.forEach(sr => {
                      const sid = sr.student?._id || sr.student;
                      if (sr.finalGrade && sr.finalGrade !== 'Pending') {
                         existingGrades[sid] = sr.finalGrade;
                      }
                   });
                   // Only set initial grades if not already typing them
                   setFinalGrades(prev => Object.keys(prev).length === 0 ? existingGrades : prev);
                }
            }
        }
        
      } catch (err) {
        console.error('Failed to fetch attendance data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndRecords();
  }, [selectedCourse, date, user, activeTab, refreshTrigger]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setMessage('');
    
    try {
      const recordsToSubmit = Object.keys(attendance).map(studentId => ({
         student: studentId,
         status: attendance[studentId]
      }));

      await api.post('/attendance', {
         course: selectedCourse,
         date: new Date(date),
         records: recordsToSubmit
      });

      // Auto-save semester attendance silently
      try {
         const autoRecordsToSubmit = usersToTrack.filter(u => u.category === 'Student').map(student => {
            const sid = student._id;
            let tot = 0; let pres = 0;
            courseHistory.forEach(rec => {
               if(new Date(rec.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]) return;
               rec.records.forEach(r => {
                  if((r.student?._id || r.student) === sid) {
                     tot++;
                     if(r.status === 'Present' || r.status === 'Late') pres++;
                  }
               });
            });
            tot++;
            if (attendance[sid] === 'Present' || attendance[sid] === 'Late') pres++;
            
            return {
               student: sid,
               attendancePercentage: Math.round((pres/tot)*100) || 0,
               finalGrade: finalGrades[sid] || 'Pending',
               remarks: ''
            };
         });
         await api.post('/attendance/report', { courseId: selectedCourse, term, studentRecords: autoRecordsToSubmit });
      } catch(e) {
         console.warn("Silent sync of semester report failed:", e);
      }

      setMessage('Daily Record and Semester Feed saved successfully!');
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save attendance.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setMessage('');
    
    try {
      const recordsToSubmit = usersToTrack.filter(u => u.category === 'Student').map(student => ({
         student: student._id,
         attendancePercentage: attendancePercentages[student._id] || Number(attendancePercentages[student._id]) || 0,
         finalGrade: finalGrades[student._id] || 'Pending',
         remarks: ''
      }));

      await api.post('/attendance/report', {
         courseId: selectedCourse,
         term,
         studentRecords: recordsToSubmit
      });

      setMessage('Semester report submitted to Admin successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to submit report.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wide">Class Attendance</h1>
          <p className="text-[#FFD700] text-sm mt-1 font-semibold uppercase tracking-widest">Track and manage role-based daily presence</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl shadow-inner mt-4 md:mt-0 items-center">
           <button onClick={() => setActiveTab('daily')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'daily' ? 'bg-[#FFD700] text-black shadow-md' : 'text-slate-400 hover:text-white'}`}><Clock className="w-4 h-4"/> Daily Record</button>
           <button onClick={() => setActiveTab('report')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'report' ? 'bg-[#FFD700] text-black shadow-md' : 'text-slate-400 hover:text-white'}`}><FileText className="w-4 h-4"/> Semester Report</button>
        </div>
      </div>

      <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-5 items-end">
         <div className="w-full md:w-1/2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Course Hub</label>
              <CustomDropdown
                value={selectedCourse}
                onChange={setSelectedCourse}
                options={courses.map(c => ({ 
                  label: c.title, 
                  value: c._id,
                  render: (
                    <div className="flex items-center gap-3 w-full py-0.5">
                      <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 bg-black/40 border border-white/10 shadow-sm">
                        <img src={c.thumbnail && c.thumbnail !== 'default-course.jpg' && c.thumbnail !== '' ? c.thumbnail : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80'} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80' }} />
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <span className="font-bold text-white truncate text-xs">{c.title}</span>
                        <span className="text-[9px] text-[#FFD700] capitalize flex items-center gap-1.5 mt-0.5 font-bold">
                          {c.category || 'Course'}
                        </span>
                      </div>
                    </div>
                  )
                }))}
                placeholder="-- Choose a course --"
                searchable={true}
              />
         </div>
         {activeTab === 'daily' ? (
           <>
             <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date & Time Stamp</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 font-medium placeholder-slate-500"
                  />
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-[#FFD700]" />
                </div>
             </div>
             <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0">
                <button 
                  onClick={handleSave}
                  disabled={!selectedCourse || saving || usersToTrack.length === 0}
                  className="w-full bg-gradient-to-r from-[#008A32] to-[#006622] hover:shadow-[0_0_15px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                  Save Daily Log
                </button>
             </div>
           </>
         ) : (
           <>
             <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Academic Term</label>
                <input 
                  type="text" 
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 font-medium"
                  placeholder="e.g. Fall 2026"
                />
             </div>
             {user?.role === 'instructor' && (
               <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <button 
                    onClick={handleSubmitReport}
                    disabled={!selectedCourse || saving || usersToTrack.filter(u => u.category === 'Student').length === 0}
                    className="w-full bg-gradient-to-r from-[#008A32] to-[#006622] hover:shadow-[0_0_15px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FileText className="w-5 h-5" />}
                    Submit to Admin
                  </button>
               </div>
             )}
           </>
         )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-bold text-sm text-center border shadow-sm ${message.includes('success') ? 'bg-[#008A32]/10 border-[#008A32]/30 text-[#008A32]' : 'bg-[#E30A17]/10 border-[#E30A17]/30 text-[#E30A17]'}`}>
          {message}
        </div>
      )}

      {!selectedCourse ? (
        <div className="bg-[#0B0E14] rounded-3xl border border-white/10 p-12 text-center flex flex-col items-center shadow-lg">
           <Calendar className="w-16 h-16 text-slate-600 mb-4" />
           <h3 className="text-xl font-bold text-white">No Course Selected</h3>
           <p className="text-slate-400 mt-2">Please select a course to view and manage its daily attendance records.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
           <div className="w-10 h-10 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
        </div>
      ) : usersToTrack.length === 0 ? (
        <div className="bg-[#0B0E14] rounded-3xl border border-white/10 p-12 text-center flex flex-col items-center shadow-lg">
           <UserX className="w-16 h-16 text-slate-600 mb-4" />
           <h3 className="text-xl font-bold text-white">No Users Found</h3>
           <p className="text-slate-400 mt-2">There are no users to track in this course.</p>
        </div>
      ) : activeTab === 'report' && user?.role === 'admin' ? (
        <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6">
           <h3 className="font-bold text-xl text-white mb-4">Submitted Reports for {courses.find(c => c._id === selectedCourse)?.title}</h3>
           {submittedReports.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No reports have been submitted for this course yet.</div>
           ) : (
              <div className="space-y-6">
                {submittedReports.map((report) => (
                  <div key={report._id} className="border border-white/5 rounded-2xl bg-white/5 p-4">
                     <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <span className="font-bold text-[#FFD700]">Term: {report.term}</span>
                        <span className="text-xs font-black bg-[#008A32]/20 text-[#008A32] px-2 py-1 rounded uppercase">Status: {report.status}</span>
                     </div>
                     <table className="w-full text-left text-sm">
                       <thead>
                         <tr className="text-slate-400 capitalize">
                           <th className="pb-2">Student</th>
                           <th className="pb-2">Attendance %</th>
                           <th className="pb-2">Final Grade</th>
                         </tr>
                       </thead>
                       <tbody className="text-white font-medium divide-y divide-white/5">
                         {report.studentRecords.map(rec => (
                           <tr key={rec._id}>
                             <td className="py-2">{rec.student ? rec.student.name : 'Unknown User'}</td>
                             <td className="py-2 text-[#FFD700]">{rec.attendancePercentage}%</td>
                             <td className="py-2 text-[#008A32] font-black">{rec.finalGrade}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                ))}
              </div>
           )}
        </div>
      ) : activeTab === 'report' ? (
        <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-2">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10">
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Enrolled Student</th>
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Attendance %</th>
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Final Result/Grade</th>
                 </tr>
               </thead>
               <tbody>
                 {usersToTrack.filter(u => u.category === 'Student').map((u) => (
                   <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className="p-5">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 border bg-[#008A32]/10 text-[#008A32] border-[#008A32]/30">
                           {u.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-white group-hover:text-[#FFD700] transition-colors">{u.name}</span>
                           <span className="text-slate-400 text-xs font-medium">{u.email}</span>
                         </div>
                       </div>
                     </td>
                     <td className="p-5 w-40">
                        <div className="relative">
                          <input 
                            type="number" 
                            min="0" max="100"
                            placeholder="0-100"
                            value={attendancePercentages[u._id] || ''}
                            onChange={(e) => setAttendancePercentages(prev => ({...prev, [u._id]: e.target.value}))}
                            className="w-full pl-4 pr-8 py-2 bg-black/40 border border-white/10 text-[#FFD700] font-bold rounded-lg focus:outline-none focus:border-[#FFD700]/50"
                          />
                          <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                        </div>
                     </td>
                     <td className="p-5 w-48">
                        <CustomDropdown
                          value={finalGrades[u._id] || 'Pending'}
                          onChange={(val) => setFinalGrades(prev => ({...prev, [u._id]: val}))}
                          options={[
                            { label: 'A (Excellent)', value: 'A' },
                            { label: 'B (Good)', value: 'B' },
                            { label: 'C (Average)', value: 'C' },
                            { label: 'D (Poor)', value: 'D' },
                            { label: 'F (Fail)', value: 'F' },
                            { label: 'Pending', value: 'Pending' }
                          ]}
                          placeholder="Assign Grade"
                        />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      ) : (
        <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-2">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10">
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest">User Details</th>
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Category</th>
                   <th className="p-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {usersToTrack.map((u) => (
                   <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className="p-5">
                       <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0 border ${u.category === 'Instructor' ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'bg-[#008A32]/10 text-[#008A32] border-[#008A32]/30'}`}>
                           {u.category === 'Instructor' ? <ShieldAlert className="w-4 h-4" /> : u.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                           <span className="font-bold text-white group-hover:text-[#FFD700] transition-colors">{u.name}</span>
                           <span className="text-slate-400 text-xs font-medium">{u.email}</span>
                         </div>
                       </div>
                     </td>
                     <td className="p-5">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${
                          u.category === 'Instructor' ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30' : 'bg-white/5 text-slate-300 border-white/10'
                        }`}>
                           {u.category}
                        </span>
                     </td>
                     <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                           {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                             <button
                               key={status}
                               onClick={() => handleStatusChange(u._id, status)}
                               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                 attendance[u._id] === status 
                                    ? status === 'Present' ? 'bg-[#008A32] text-white shadow-[0_0_15px_rgba(0,138,50,0.5)] border border-[#008A32]'
                                    : status === 'Absent' ? 'bg-[#E30A17] text-white shadow-[0_0_15px_rgba(227,10,23,0.5)] border border-[#E30A17]'
                                    : status === 'Late' ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.5)] border border-[#FFD700]'
                                    : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-500'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                               }`}
                             >
                                {status === 'Present' && <CheckCircle className="w-3 h-3" />}
                                {status === 'Absent' && <XCircle className="w-3 h-3" />}
                                {status === 'Late' && <Clock className="w-3 h-3" />}
                                {status}
                             </button>
                           ))}
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {selectedCourse && activeTab === 'daily' && courseHistory.length > 0 && (
        <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="font-bold text-xl text-white mb-4">Saved Attendance History</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {courseHistory.map(record => {
               const dayDateStr = new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
               const presentCount = record.records.filter(r => r.status === 'Present' || r.status === 'Late').length;
               const absentCount = record.records.filter(r => r.status === 'Absent' || r.status === 'Excused').length;
               const instructorName = record.instructor ? `${record.instructor.name} (${record.instructor.role})` : 'Not Recorded';

               return (
                 <div 
                   key={record._id} 
                   className="border border-white/10 rounded-2xl bg-white/5 p-4 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-l-[#FFD700]" 
                   onClick={() => {
                      const d = new Date(record.date);
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      setDate(d.toISOString().slice(0, 16));
                   }}
                 >
                    <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                        <div>
                           <span className="font-bold text-white block">{dayDateStr}</span>
                           <span className="text-[10px] text-[#FFD700] uppercase tracking-wider font-bold">Instructor: {instructorName}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Logged {new Date(record.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-3 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                       {record.records.map(r => (
                          <div key={r._id} className="flex justify-between items-center bg-[#0B0E14]/40 border border-white/5 px-3 py-2 rounded-lg hover:border-white/10 transition-colors">
                             <span className="text-xs text-white font-medium mr-2 truncate">
                               {r.student?.name || 'Unknown'} 
                               <span className="text-slate-500 font-bold uppercase tracking-wider ml-1.5 text-[9px]">({r.student?.role || 'Student'})</span>
                             </span>
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 shadow-sm ${
                                r.status === 'Present' || r.status === 'Late' ? 'bg-[#008A32]/20 text-[#008A32] border border-[#008A32]/30' : 'bg-[#E30A17]/20 text-[#E30A17] border border-[#E30A17]/30'
                             }`}>{r.status}</span>
                          </div>
                       ))}
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                       <span className="text-[10px] font-black bg-[#008A32]/20 text-[#008A32] px-2.5 py-1 rounded-md uppercase tracking-wider flex-1 text-center">{presentCount} PRESENT</span>
                       <span className="text-[10px] font-black bg-[#E30A17]/20 text-[#E30A17] px-2.5 py-1 rounded-md uppercase tracking-wider flex-1 text-center">{absentCount} ABSENT</span>
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
}

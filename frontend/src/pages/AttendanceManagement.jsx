import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, UserX, Clock, Save, ChevronDown } from 'lucide-react';

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
        // Fetch all students for instructor/admin, then filter locally for the specific course
        const studentEndpoint = user?.role === 'admin' ? '/admin/users?role=student' : '/instructor/students';
        const [studentRes, recordRes] = await Promise.all([
          api.get(studentEndpoint),
          api.get(`/attendance/course/${selectedCourse}`)
        ]);

        let courseStudents = [];
        if (user?.role === 'admin') {
           // Admin path might require a custom filter, but for MVP we assume students track their enrollments
           courseStudents = (studentRes.data.data || []).filter(s => 
              s.enrolledCourses && s.enrolledCourses.some(ec => 
                 (ec.course?._id || ec.course) === selectedCourse
              )
           );
        } else {
           courseStudents = (studentRes.data.data || []).filter(s => 
              s.enrolledCourses && s.enrolledCourses.some(ec => 
                 (ec.course?._id || ec.course) === selectedCourse
              )
           );
        }
        
        setStudents(courseStudents);

        // Check if there's an existing record for this date
        const targetDateStr = new Date(date).toISOString().split('T')[0];
        const existingRecords = recordRes.data.data || [];
        
        const todaysRecord = existingRecords.find(r => 
           new Date(r.date).toISOString().split('T')[0] === targetDateStr
        );

        let initialAttendance = {};
        if (todaysRecord) {
           todaysRecord.records.forEach(rc => {
              initialAttendance[rc.student._id || rc.student] = rc.status;
           });
        }
        
        // Fill missing defaults
        courseStudents.forEach(s => {
           if (!initialAttendance[s._id]) initialAttendance[s._id] = 'Present';
        });

        setAttendance(initialAttendance);
      } catch (err) {
        console.error('Failed to fetch attendance data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndRecords();
  }, [selectedCourse, date, user]);

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

      setMessage('Attendance saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save attendance.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Class Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage student daily presence.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
         <div className="w-full md:w-1/2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
            <div className="relative">
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium"
              >
                <option value="">-- Choose a course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
         </div>
         <div className="w-full md:w-1/3">
            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
         </div>
         <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0">
            <button 
              onClick={handleSave}
              disabled={!selectedCourse || saving || students.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
              Save Attendance
            </button>
         </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-bold text-sm text-center ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {message}
        </div>
      )}

      {!selectedCourse ? (
        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center">
           <Calendar className="w-16 h-16 text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">No Course Selected</h3>
           <p className="text-slate-500 mt-1">Please select a course to view and manage its daily attendance records.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
           <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center">
           <UserX className="w-16 h-16 text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">No Students Found</h3>
           <p className="text-slate-500 mt-1">There are no students currently enrolled in this course.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="p-4 font-bold text-slate-600 text-sm">Student Name</th>
                   <th className="p-4 font-bold text-slate-600 text-sm">Email</th>
                   <th className="p-4 font-bold text-slate-600 text-sm text-center">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {students.map((student) => (
                   <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                     <td className="p-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 font-bold text-indigo-600 flex items-center justify-center shrink-0">
                           {student.name.charAt(0).toUpperCase()}
                         </div>
                         <span className="font-semibold text-slate-800">{student.name}</span>
                       </div>
                     </td>
                     <td className="p-4 text-slate-500 text-sm">{student.email}</td>
                     <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                           {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                             <button
                               key={status}
                               onClick={() => handleStatusChange(student._id, status)}
                               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                 attendance[student._id] === status 
                                    ? status === 'Present' ? 'bg-emerald-500 text-white shadow-md'
                                    : status === 'Absent' ? 'bg-rose-500 text-white shadow-md'
                                    : status === 'Late' ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-indigo-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
    </div>
  );
}

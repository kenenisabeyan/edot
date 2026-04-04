import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { PlusCircle, Search } from 'lucide-react';

export default function InstructorClasses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/instructor/courses');
        setCourses(data.data || []);
      } catch (err) {
        console.error('Failed to fetch instructor courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">My Classes</h2>
        <Link to="/dashboard/builder" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-[11px] rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
          <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-12 text-center rounded-3xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No classes yet</h3>
            <p className="text-slate-400 max-w-sm mb-6">Create your first course to start teaching.</p>
            <Link to="/dashboard/builder" className="px-8 py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              Create Course
            </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:border-[#FFD700]/30 transition-all relative group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] opacity-5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                <img 
                  src={course.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : course.thumbnail} 
                  alt={course.title} 
                  className="w-full md:w-48 h-48 md:h-32 object-cover rounded-2xl bg-[#11151F] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                
                <div className="flex-1 w-full relative z-10">
                  <h3 className="text-xl font-bold text-white leading-snug mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest">
                    <span className={`px-3 py-1.5 rounded-sm border ${
                        course.status === 'approved' ? 'bg-[#008A32]/20 text-[#008A32] border-[#008A32]/30' :
                        course.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                        course.status === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                        'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{course.totalStudents || 0} Students</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:pl-6 md:border-l md:border-white/10 shrink-0 pt-4 md:pt-0 relative z-10">
                  <Link 
                    to={`/dashboard/builder/${course._id}`} 
                    className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-white/5 text-[#FFD700] font-black uppercase tracking-widest text-[10px] rounded-xl border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-colors shadow-sm drop-shadow-md"
                  >
                    Edit Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

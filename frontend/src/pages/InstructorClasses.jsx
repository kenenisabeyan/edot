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
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">My Classes</h2>
        <Link to="/instructor/builder" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4338ca] text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No classes yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Create your first course to start teaching.</p>
            <Link to="/instructor/builder" className="px-6 py-2.5 bg-[#4338ca] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
              Create Course
            </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="glass-card rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:shadow-md transition-shadow"
              >
                <img 
                  src={course.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : course.thumbnail} 
                  alt={course.title} 
                  className="w-full md:w-48 h-48 md:h-32 object-cover rounded-2xl bg-slate-100 shrink-0" 
                />
                
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                    <span className={`px-2.5 py-1 rounded-md ${
                        course.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        course.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        course.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-600">{course.totalStudents || 0} Students</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:pl-6 md:border-l md:border-slate-100 shrink-0 pt-4 md:pt-0">
                  <Link 
                    to={`/instructor/builder/${course._id}`} 
                    className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 glass-card border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-transparent transition-colors shadow-sm"
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

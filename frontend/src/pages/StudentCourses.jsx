import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, PlayCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';

export default function StudentCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/student/enrollments');
        setEnrolledCourses(data.data || []);
      } catch (err) {
        console.error('Failed to fetch enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleDownloadCertificate = (courseName) => {
    const doc = new jsPDF('landscape');
    const dateCompleted = new Date().toLocaleDateString();
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(40);
    doc.text('Certificate of Completion', 148.5, 60, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is proudly presented to', 148.5, 90, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(user?.name || 'Amazing Student', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text('For successfully completing the course:', 148.5, 130, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(courseName || 'Course', 148.5, 150, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${dateCompleted}`, 148.5, 180, { align: 'center' });
    
    doc.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">My Learning</h2>
        <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all shadow-sm backdrop-blur-md">
          <Search className="w-4 h-4" /> Find More Courses
        </Link>
      </div>
      
      {enrolledCourses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-black/40 shadow-sm flex flex-col items-center justify-center backdrop-blur-md">
            <div className="w-20 h-20 bg-white/5 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-slate-400 max-w-sm mb-6">You haven't enrolled in any courses. Discover your next passion today.</p>
            <Link to="/courses" className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Browse Catalog
            </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-5">
            {enrolledCourses.map((enrolled) => (
              <div 
                key={enrolled._id || enrolled.course?._id} 
                className="rounded-3xl border border-white/10 bg-gradient-to-r from-black/60 to-black/40 shadow-md backdrop-blur-xl overflow-hidden flex flex-col md:flex-row p-5 items-start md:items-center gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all group"
              >
                <div className="relative w-full md:w-56 shrink-0 overflow-hidden rounded-2xl aspect-video md:aspect-auto md:h-32 border border-white/5">
                  <img 
                    src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                    alt={enrolled.course?.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
                
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-xl font-bold text-white leading-snug truncate group-hover:text-indigo-300 transition-colors">{enrolled.course?.title || 'Unknown Course'}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-5 font-medium">
                    Instructor: <span className="text-slate-300">{enrolled.course?.instructor?.name || 'Unknown'}</span>
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)] relative" 
                        style={{ width: `${enrolled.progress || 0}%` }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-300 shrink-0 min-w-[3ch] text-right">{enrolled.progress || 0}%</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:pl-8 md:border-l md:border-white/10 shrink-0 pt-4 md:pt-0 flex flex-col gap-3">
                  {enrolled.progress === 100 && (
                    <button 
                      onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                      className="w-full inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 font-semibold rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-sm min-w-[140px]"
                    >
                      <Download className="w-4 h-4" /> Certificate
                    </button>
                  )}
                  <Link 
                    to={`/course/${enrolled.course?._id}`} 
                    className={`w-full inline-flex justify-center items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all shadow-sm min-w-[140px] ${enrolled.progress === 100 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500'}`}
                  >
                    <PlayCircle className="w-4 h-4" /> {enrolled.progress === 100 ? 'Review' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">My Learning</h2>
        <Link to="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
          <Search className="w-4 h-4" /> Find More Courses
        </Link>
      </div>
      
      {enrolledCourses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500 max-w-sm mb-6">You haven't enrolled in any courses. Discover your next passion today.</p>
            <Link to="/courses" className="px-6 py-2.5 bg-[#4338ca] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
              Browse Catalog
            </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {enrolledCourses.map((enrolled) => (
              <div 
                key={enrolled._id || enrolled.course?._id} 
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-6 hover:shadow-md transition-shadow"
              >
                <img 
                  src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                  alt={enrolled.course?.title} 
                  className="w-full md:w-48 h-48 md:h-32 object-cover rounded-2xl bg-slate-100 shrink-0" 
                />
                
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">{enrolled.course?.title || 'Unknown Course'}</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                    Instructor: <span className="font-medium text-slate-700">{enrolled.course?.instructor?.name || 'Unknown'}</span>
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4338ca] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${enrolled.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 shrink-0 min-w-[3ch]">{enrolled.progress || 0}%</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:pl-6 md:border-l md:border-slate-100 shrink-0 pt-4 md:pt-0 space-y-3">
                  {enrolled.progress === 100 && (
                    <button 
                      onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                      className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Download className="w-5 h-5" /> Certificate
                    </button>
                  )}
                  <Link 
                    to={`/course/${enrolled.course?._id}`} 
                    className={`w-full inline-flex justify-center items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors shadow-sm ${enrolled.progress === 100 ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' : 'bg-[#4338ca] text-white hover:bg-indigo-700'}`}
                  >
                    <PlayCircle className="w-5 h-5" /> {enrolled.progress === 100 ? 'Review' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, PlayCircle, Download, BookOpen } from 'lucide-react';
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
    
    // Obelisk Night theme styled Certificate natively generated:
    doc.setFillColor(11, 14, 20); // #0B0E14
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(255, 215, 0); // #FFD700
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text('CERTIFICATE OF EXECUTION', 148.5, 60, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('This verifies that', 148.5, 90, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 138, 50); // #008A32
    doc.text(user?.name || 'Advanced Learner', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Highly successfully completed the masterclass:', 148.5, 130, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 215, 0); // #FFD700
    doc.text(courseName || 'Course', 148.5, 150, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Authenticated Log: ${dateCompleted}`, 148.5, 180, { align: 'center' });
    
    doc.save(`${courseName.replace(/\s+/g, '_')}_EDOT_Certificate.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-black bg-gradient-to-r from-[#FFD700] to-[#008A32] text-transparent bg-clip-text tracking-tight uppercase">My Learning</h2>
           <p className="text-slate-400 font-medium mt-1 text-sm">Continue executing your curriculums.</p>
        </div>
        <Link to="/courses" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 bg-[#11151F] text-slate-300 font-black tracking-widest text-xs uppercase hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 hover:text-[#FFD700] transition-all shadow-inner backdrop-blur-md">
          <Search className="w-4 h-4" /> Find Curriculums
        </Link>
      </div>
      
      {enrolledCourses.length === 0 ? (
          <div className="p-16 text-center rounded-[2rem] border border-white/5 bg-[#11151F] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors duration-1000"></div>

            <div className="w-24 h-24 bg-[#FFD700]/10 text-[#FFD700] rounded-2xl flex items-center justify-center mb-6 border border-[#FFD700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)] relative z-10 group-hover:scale-105 transition-transform duration-500">
              <BookOpen className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">Library Empty</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg relative z-10 font-medium">You haven't enrolled in any curriculums yet. Empower yourself and start your journey today.</p>
            <Link to="/courses" className="px-8 py-4 bg-[#FFD700] text-[#0B0E14] font-black tracking-widest text-xs uppercase rounded-xl hover:bg-[#e5c100] transition-colors shadow-[0_0_20px_rgba(255,215,0,0.2)] relative z-10">
              Browse Catalog
            </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6">
            {enrolledCourses.map((enrolled) => (
              <div 
                key={enrolled._id || enrolled.course?._id} 
                className="rounded-3xl border border-white/5 bg-[#11151F]/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden flex flex-col md:flex-row p-6 items-start md:items-center gap-8 hover:border-[#008A32]/30 hover:bg-[#11151F] transition-all group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#008A32]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                <div className="relative w-full md:w-64 shrink-0 overflow-hidden rounded-2xl aspect-video md:aspect-auto md:h-36 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <img 
                    src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                    alt={enrolled.course?.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-[#0B0E14]/40 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div className="flex-1 w-full min-w-0 relative z-10 mt-2 md:mt-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-black text-white leading-snug truncate group-hover:text-[#FFD700] transition-colors tracking-tight">{enrolled.course?.title || 'Unknown Course'}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-6 font-bold uppercase tracking-widest text-[10px]">
                    Instructor: <span className="text-[#008A32] ml-1">{enrolled.course?.instructor?.name || 'Assigned Agent'}</span>
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-[#0B0E14] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,138,50,0.6)] relative overflow-hidden bg-gradient-to-r from-[#008A32] to-[#FFD700]" 
                        style={{ width: `${enrolled.progress || 0}%` }}
                      >
                         <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 skew-x-[-20deg] translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#FFD700] shrink-0 min-w-[3ch] text-right tracking-widest">{enrolled.progress || 0}%</span>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:pl-8 md:border-l md:border-white/5 shrink-0 pt-6 md:pt-0 flex flex-col gap-3 relative z-10">
                  {enrolled.progress === 100 && (
                    <button 
                      onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                      className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-[#FFD700]/10 text-[#FFD700] uppercase tracking-widest text-[10px] font-black rounded-xl border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0B0E14] transition-all shadow-sm min-w-[160px] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    >
                      <Download className="w-4 h-4" /> Certificate
                    </button>
                  )}
                  <Link 
                    to={`/course/${enrolled.course?._id}`} 
                    className={`w-full inline-flex justify-center items-center gap-2 px-6 py-3 uppercase tracking-widest text-[10px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] min-w-[160px] ${enrolled.progress === 100 ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white' : 'bg-[#008A32] text-white hover:bg-[#007028] hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] border border-[#008A32]'}`}
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

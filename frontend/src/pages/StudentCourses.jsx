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
      {/* Top Banner (Wabi Style but EDOT Branded) */}
      <div className="mb-10 w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#008A32]/10 via-[#0B0E14] to-[#11151F] border border-white/10 p-10 flex flex-col items-center justify-center text-center shadow-lg">
        <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#008A32]/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <h2 className="text-2xl sm:text-4xl font-display font-medium text-white mb-2 relative z-10 transition-transform">
          Explore Personalized Courses <br className="hidden sm:block" />
          <span className="font-black text-[#FFD700]">Designed to Match Your Goals</span>
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 hidden">
        {/* Hidden original header to keep structure if needed */}
      </div>
      
      {enrolledCourses.length === 0 ? (
          <div className="p-16 text-center rounded-[2rem] border border-white/5 bg-[#11151F] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors duration-1000"></div>

            <div className="w-24 h-24 bg-[#FFD700]/10 text-[#FFD700] rounded-2xl flex items-center justify-center mb-6 border border-[#FFD700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)] relative z-10 group-hover:scale-105 transition-transform duration-500">
              <BookOpen className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">Library Empty</h3>
            <p className="text-slate-200 max-w-md mx-auto mb-8 text-lg relative z-10 font-medium">You haven't enrolled in any curriculums yet. Empower yourself and start your journey today.</p>
            <Link to="/courses" className="px-8 py-4 bg-[#FFD700] text-[#0B0E14] font-black tracking-widest text-xs uppercase rounded-xl hover:bg-[#e5c100] transition-colors shadow-[0_0_20px_rgba(255,215,0,0.2)] relative z-10">
              Browse Catalog
            </Link>
          </div>
      ) : (
          <div className="flex flex-col gap-6">
            {enrolledCourses.map((enrolled) => (
              <div 
                key={enrolled.id || enrolled.course?.id} 
                className="w-full bg-[#11151F] border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-[#151a26] flex flex-col md:flex-row gap-6 items-start md:items-center group"
              >
                {/* Left: Square Icon/Image */}
                <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#0B0E14] border border-white/5 flex items-center justify-center p-3 shadow-inner relative overflow-hidden group-hover:border-[#FFD700]/30 transition-colors">
                   <img 
                      src={enrolled.course?.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80' : enrolled.course?.thumbnail} 
                      alt={enrolled.course?.title}
                      className="w-full h-full object-cover rounded-xl"
                   />
                </div>

                {/* Middle: Title & Description */}
                <div className="flex-1 min-w-0">
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">{enrolled.course?.title || 'Course Details'}</h3>
                   <p className="text-slate-200 text-sm line-clamp-2 md:line-clamp-3 mb-4 max-w-3xl leading-relaxed">
                      {enrolled.course?.description || 'Continue your learning journey with this comprehensive curriculum designed to build your skills and complete your personalized goals.'}
                   </p>
                   
                   {/* Progress Indicator */}
                   <div className="max-w-md flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#008A32] to-[#FFD700]" 
                          style={{ width: `${enrolled.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-[#FFD700] w-10">{enrolled.progress || 0}%</span>
                   </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col gap-3 justify-end items-end md:items-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                   {enrolled.progress === 100 && (
                     <button 
                       onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                       className="w-full md:w-40 flex items-center justify-center gap-2 px-4 py-3 border border-[#FFD700]/50 text-[#FFD700] rounded-xl hover:bg-[#FFD700] hover:text-[#0B0E14] font-bold text-xs uppercase tracking-wider transition-colors"
                     >
                       <Download className="w-4 h-4" /> Certificate
                     </button>
                   )}
                   <Link 
                     to={`/course/${enrolled.course?.id}`} 
                     className={`w-full md:w-40 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${enrolled.progress === 100 ? 'bg-[#11151F]/5 text-slate-300 border-white/10 hover:bg-[#11151F]/10 hover:text-white' : 'bg-[#008A32] text-white border-[#008A32] hover:bg-[#007028]'}`}
                   >
                     {enrolled.progress === 100 ? 'Review' : 'Continue Course'}
                   </Link>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

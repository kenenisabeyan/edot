import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import { Award, Download } from 'lucide-react';
import api from '../utils/api';

export default function CertificatesView() {
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await api.get('/users/mycourses');
        const enrolled = data.enrolledCourses || [];
        const completed = enrolled.filter(e => {
            if (e.progress < 100) return false;
            // Strict Validation: If course requires exam, student must pass it
            if (e.course?.isExamRequired && !e.passedFinalExam) return false;
            return true;
        });
        setCompletedCourses(completed);

        // Mark certificates as seen to clear navbar notification badges
        try {
          await api.put('/users/mark-certificates-seen');
        } catch (markErr) {
          console.error('Failed to mark certificates as seen', markErr);
        }
      } catch (err) {
        console.error('Failed to fetch user completed courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownloadCertificate = async (courseName) => {
    const img = new Image();
    img.src = '/edot-logo.png';
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve; // Continue even if logo fails
    });

    const doc = new jsPDF('landscape');
    const dateCompleted = new Date().toLocaleDateString();
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    try {
      doc.addImage(img, 'PNG', 133.5, 20, 30, 25);
    } catch(e) {}
    
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
    <div className="animate-in fade-in flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Certificates</h1>
          <p className="text-slate-500 text-sm mt-1">Download and share your achievements.</p>
        </div>
      </div>

      {completedCourses.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
             <Award className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No certificates yet</h3>
           <p className="text-slate-500 max-w-sm mb-6">Complete a course 100% and pass the final exam (if required) to earn your first certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.map((enrolled) => (
            <div key={enrolled.course?._id} className="glass-card rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-slate-100 p-8 flex flex-col items-center justify-center relative">
                <Award className="w-16 h-16 text-indigo-400 mb-4 drop-shadow-sm" />
                <h3 className="font-bold text-center text-slate-800 line-clamp-2">{enrolled.course?.title}</h3>
                <div className="absolute inset-0 glass-card/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button 
                    onClick={() => handleDownloadCertificate(enrolled.course?.title)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition-transform transform scale-95 group-hover:scale-100"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-transparent/50">
                <div className="text-sm font-medium text-slate-500">Issued to</div>
                <div className="text-sm font-bold text-slate-700">{user?.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

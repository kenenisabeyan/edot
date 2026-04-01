import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, BookOpen, Award, ChevronRight, Clock } from 'lucide-react';

export default function ParentLearners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const { data } = await api.get('/parent/learners');
        setLearners(data.data || []);
      } catch (err) {
        console.error('Failed to fetch learners data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (learners.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Learners Found</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          You currently have no learners assigned to your account. Please contact the school administrator to link your child's profile to your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Learners</h1>
        <p className="text-slate-500">Track the academic progress and activity of your assigned learners.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {learners.map((learner) => (
          <div key={learner._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row">
            
            {/* Learner Profile Section */}
            <div className="xl:w-1/3 bg-slate-50 p-8 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-100 shadow-sm mb-4 overflow-hidden relative">
                <img 
                  src={`http://localhost:5000/uploads/avatars/${learner.avatar || 'default-avatar.png'}`} 
                  alt={learner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(learner.name) + '&background=random';
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{learner.name}</h2>
              <p className="text-slate-500 text-sm font-medium mb-6">{learner.email}</p>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-bold text-xl">{learner.enrolledCourses?.length || 0}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Enrollments</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="font-bold text-xl">
                      {learner.enrolledCourses?.filter(c => c.passedFinalExam).length || 0}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Completed</p>
                </div>
              </div>
            </div>

            {/* Courses Progress Section */}
            <div className="xl:w-2/3 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Course Progress</h3>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {learner.enrolledCourses?.length || 0} Total
                </span>
              </div>
              
              {learner.enrolledCourses?.length > 0 ? (
                <div className="space-y-6">
                  {learner.enrolledCourses.map((enrollment, idx) => (
                    <div key={idx} className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
                      
                      <div className="w-full sm:w-24 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img 
                          src={`http://localhost:5000${enrollment.course?.thumbnail}`} 
                          alt={enrollment.course?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full">
                        <h4 className="font-bold text-slate-800 text-base truncate mb-1">
                          {enrollment.course?.title || 'Unknown Course'}
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                           <span className="flex items-center gap-1">
                             <Clock className="w-3.5 h-3.5" />
                             Last updated: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                           </span>
                        </div>
                      </div>

                      <div className="w-full sm:w-[180px] shrink-0">
                        <div className="flex justify-between text-sm font-bold mb-2">
                           <span className={enrollment.progress === 100 ? 'text-emerald-600' : 'text-slate-700'}>
                             {enrollment.progress === 100 ? 'Completed' : 'In Progress'}
                           </span>
                           <span className="text-indigo-600">{enrollment.progress || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${enrollment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${enrollment.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex shrink-0">
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                   <p className="text-slate-500 font-medium">No courses enrolled yet.</p>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

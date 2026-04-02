import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, Layers, Radio, PlusCircle, Edit3, Settings, LogOut, 
  FolderOpen, LayoutDashboard, Clock, CheckCircle2, 
  AlertCircle, XSquare, PlayCircle, Send
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import edotLogo from '../assets/edot-logo.jpg';
import ActivityFeed from '../components/ActivityFeed';

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Programming', duration: 1, thumbnail: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  
  // Lesson state
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lessonData, setLessonData] = useState({ title: '', description: '', videoUrl: '', duration: 10 });

  useEffect(() => {
    Promise.all([fetchCourses(), fetchStats(), fetchAnalytics()]).finally(() => setLoading(false));
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/instructor/dashboard');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/instructor/analytics/detailed');
      setAnalytics(data.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/instructor/courses');
      setCourses(data.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // Basic fallback thumbnail if empty
      const submissionData = { ...formData };
      if (!submissionData.thumbnail) {
        submissionData.thumbnail = 'default-course.jpg';
      }
      
      await api.post('/instructor/courses', submissionData);
      setFormData({ title: '', description: '', category: 'Programming', duration: 1, thumbnail: '' });
      fetchCourses();
      setActiveTab('courses'); // Redirect to courses list after creation
    } catch (err) {
      console.error('Failed to create course', err);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!activeCourseId) return;
    
    try {
      await api.post(`/instructor/courses/${activeCourseId}/lessons`, lessonData);
      setLessonData({ title: '', description: '', videoUrl: '', duration: 10 });
      setActiveCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error('Failed to add lesson', err);
    }
  };

  const handleSubmitReview = async (courseId) => {
    try {
      await api.put(`/instructor/courses/${courseId}/submit`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to submit for review', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const totalStudents = courses.reduce((acc, course) => acc + (course.totalStudents || 0), 0);
  const activeCourses = courses.filter(c => c.status === 'approved').length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        const revenueData = analytics?.revenueData || [];
        const engagementData = analytics?.engagementData || [];

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Instructor Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Students</p>
                    <h3 className="text-3xl font-bold text-slate-900">{totalStudents}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Active Courses</p>
                    <h3 className="text-3xl font-bold text-slate-900">{activeCourses}</h3>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Creations</p>
                    <h3 className="text-3xl font-bold text-slate-900">{courses.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Earnings (Last 6 Months)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`$${value}`, 'Earnings']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Student Engagement</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                  onClick={() => navigate('/instructor/builder')} 
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left group"
                 >
                   <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                     <PlusCircle className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="block font-semibold">Create New Course</span>
                     <span className="text-sm text-slate-500 group-hover:text-purple-600">Start building your next curriculum</span>
                   </div>
                 </button>
                 <button 
                  onClick={() => setActiveTab('courses')} 
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left group"
                 >
                   <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                     <Edit3 className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="block font-semibold">Manage Courses</span>
                     <span className="text-sm text-slate-500 group-hover:text-blue-600">Edit content and add lessons</span>
                   </div>
                 </button>
               </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
               <ActivityFeed isAdmin={false} limit={5} />
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-display font-bold text-slate-900">My Courses</h2>
              <button 
                onClick={() => navigate('/instructor/builder')} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Create Course
              </button>
            </div>
            
            {courses.length === 0 ? (
               <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                   <FolderOpen className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No courses created</h3>
                 <p className="text-slate-500 max-w-sm mb-6">Share your knowledge with the world by creating your first complete course.</p>
                 <button 
                  onClick={() => navigate('/instructor/builder')} 
                  className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                 >
                   Start Creating
                 </button>
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                  {courses.map(c => (
                    <div key={c._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-md">
                      
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-slate-100">
                         <img 
                          src={c.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : c.thumbnail} 
                          alt={c.title} 
                          className="w-full h-full object-cover" 
                        />
                         <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 uppercase tracking-wider shadow-sm">
                           {c.category}
                         </div>
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="p-6 md:p-8 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 leading-snug">{c.title}</h3>
                            <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                              c.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              (c.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              (c.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-slate-50 text-slate-700 border-slate-200'))
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          
                          <p className="text-slate-500 text-sm mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {c.duration} hours</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> {c.lessons?.length || 0} lessons</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {c.totalStudents || 0} students</span>
                          </p>
                          
                          <p className="text-slate-600 line-clamp-2 md:line-clamp-3 mb-0">{c.description}</p>
                        </div>
                        
                        <div className="p-4 md:px-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                           <span className="text-xs font-medium text-slate-500">
                             Last updated: {new Date(c.updatedAt).toLocaleDateString()}
                           </span>
                           
                           <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                             {(c.status === 'draft' || c.status === 'rejected') && (
                               <>
                                 <button 
                                  onClick={() => navigate('/instructor/builder/' + c._id)} 
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 hover:text-purple-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                 >
                                   <PlusCircle className="w-4 h-4" /> Add Lesson
                                 </button>
                                 <button 
                                  onClick={() => handleSubmitReview(c._id)} 
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                 >
                                   <Send className="w-4 h-4" /> Submit for Review
                                 </button>
                               </>
                             )}
                             {c.status === 'approved' && (
                                 <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                   <CheckCircle2 className="w-4 h-4" /> Live for Students
                                 </span>
                             )}
                             {c.status === 'pending' && (
                                 <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                   <Clock className="w-4 h-4" /> Pending Admin Review
                                 </span>
                             )}
                             {c.status === 'rejected' && (
                                 <span className="inline-flex items-center gap-1.5 text-red-600 text-sm font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 sm:ml-2">
                                   <XSquare className="w-4 h-4" /> Changes Required
                                 </span>
                             )}
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        );
      case 'create':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Create New Course</h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleCreateCourse} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Course Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                    placeholder="E.g., Complete JavaScript Bootcamp" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Detailed Description <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-y" 
                    rows="5" 
                    placeholder="What will students learn in this course? Detail the curriculum and learning outcomes."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Exam Prep">Exam Prep</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Total Estimated Duration (Hours) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1" 
                      value={formData.duration} 
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail Image URL (Optional)</label>
                  <input 
                    type="url" 
                    value={formData.thumbnail} 
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                    placeholder="https://example.com/beautiful-course-cover.jpg" 
                  />
                  <p className="mt-2 text-sm text-slate-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Leave blank to use a default high-quality placeholder image.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end">
                   <button 
                    type="button" 
                    onClick={() => setActiveTab('courses')} 
                    className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm order-2 sm:order-1"
                   >
                     Cancel
                   </button>
                   <button 
                    type="submit" 
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-sm order-1 sm:order-2"
                   >
                     Save Course as Draft
                   </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Instructor Profile</h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100 text-center sm:text-left">
                <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl font-bold uppercase shrink-0 border-4 border-white shadow-md">
                  {user?.name?.charAt(0) || <Users className="w-10 h-10" />}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h3>
                  <p className="text-slate-500 mb-3">{user?.email}</p>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider border border-purple-200">
                    {user?.role} Account
                  </span>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Public Display Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name} 
                    disabled 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed" 
                  />
                  <p className="mt-1.5 text-xs text-slate-500">Contact admin to change your registered instructor name.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email} 
                    disabled 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItemClass = (tabName) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left
    ${activeTab === tabName 
      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 flex flex-col md:h-screen">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 mb-6 w-full px-2">
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto" />
           </div>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/20 overflow-hidden font-bold text-xl uppercase">
               {user?.name?.charAt(0) || 'I'}
             </div>
             <div>
               <h3 className="font-bold text-lg leading-tight truncate">{user?.name}</h3>
               <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">{user?.role}</p>
             </div>
           </div>

           <nav className="space-y-2">
             <button onClick={() => setActiveTab('overview')} className={navItemClass('overview')}>
               <LayoutDashboard className="w-5 h-5 shrink-0" /> Overview
             </button>
             <button onClick={() => setActiveTab('courses')} className={navItemClass('courses')}>
               <Layers className="w-5 h-5 shrink-0" /> My Courses
             </button>
             <button onClick={() => navigate('/instructor/builder')} className={navItemClass('create')}>
               <PlusCircle className="w-5 h-5 shrink-0" /> Create Course
             </button>
             <button onClick={() => setActiveTab('settings')} className={navItemClass('settings')}>
               <Settings className="w-5 h-5 shrink-0" /> Settings
             </button>
           </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto relative">
          {renderContent()}
        </div>
      </main>

      {/* Add Lesson Modal Overlays */}
      {activeCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveCourseId(null)}></div>
          
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-purple-600" />
                Add New Lesson
              </h2>
              <button 
                onClick={() => setActiveCourseId(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddLesson} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Lesson Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={lessonData.title} 
                  onChange={e => setLessonData({...lessonData, title: e.target.value})} 
                  required 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                  placeholder="E.g., Introduction to Syntax" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Brief Description <span className="text-red-500">*</span></label>
                <textarea 
                  value={lessonData.description} 
                  onChange={e => setLessonData({...lessonData, description: e.target.value})} 
                  required 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none" 
                  rows="3" 
                  placeholder="What will students accomplish in this specific lesson?"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Video/Content URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url" 
                    value={lessonData.videoUrl} 
                    onChange={e => setLessonData({...lessonData, videoUrl: e.target.value})} 
                    required 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                    placeholder="https://content-host.com/video" 
                  />
                </div>
                <div className="w-full sm:w-32 shrink-0">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (m) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    min="1" 
                    value={lessonData.duration} 
                    onChange={e => setLessonData({...lessonData, duration: Number(e.target.value)})} 
                    required 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setActiveCourseId(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

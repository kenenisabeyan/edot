import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, Save, 
  BookOpen, LayoutList, DollarSign, PlusCircle, 
  PlayCircle, Trash2, Tag, Image as ImageIcon, Send, FileText
} from 'lucide-react';
import QuizBuilder from '../components/QuizBuilder';

export default function InstructorCourseBuilder() {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing an existing course
  
  const [courseId, setCourseId] = useState(id || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Step 1 & 2 Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'Beginner',
    duration: 1,
    thumbnail: '',
    price: 0,
    requirements: [''],
    whatYouWillLearn: [''],
    tags: [''],
    isExamRequired: false,
    finalExam: []
  });

  // Step 3 Data (Lessons)
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', videoUrl: '', duration: 10, readingMaterials: '', quiz: [] });
  const [showLessonForm, setShowLessonForm] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/courses/${courseId}`);
      if (data.course) {
        setFormData({
          title: data.course.title || '',
          description: data.course.description || '',
          category: data.course.category || 'Programming',
          level: data.course.level || 'Beginner',
          duration: data.course.duration || 1,
          thumbnail: data.course.thumbnail || '',
          price: data.course.price || 0,
          requirements: data.course.requirements?.length ? data.course.requirements : [''],
          whatYouWillLearn: data.course.whatYouWillLearn?.length ? data.course.whatYouWillLearn : [''],
          tags: data.course.tags?.length ? data.course.tags : [''],
          isExamRequired: data.course.isExamRequired || false,
          finalExam: data.course.finalExam || []
        });
        setLessons(data.course.lessons || []);
      }
    } catch (err) {
      console.error('Failed to fetch course details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  const saveCourseData = async () => {
    setSaving(true);
    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim() !== ''),
        tags: formData.tags.filter(item => item.trim() !== '')
      };

      if (!courseId) {
        const { data } = await api.post('/instructor/courses', cleanedData);
        setCourseId(data.data._id);
        navigate(`/dashboard/builder/${data.data._id}`, { replace: true });
      } else {
        await api.put(`/instructor/courses/${courseId}`, cleanedData);
      }
      return true;
    } catch (err) {
      console.error('Failed to save course', err);
      alert(err.response?.data?.message || 'Failed to save course details');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1 || currentStep === 2) {
      const success = await saveCourseData();
      if (success) setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = async () => {
    await saveCourseData();
    setCurrentStep(currentStep - 1);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!courseId) return;
    
    setSaving(true);
    try {
      const { data } = await api.post(`/instructor/courses/${courseId}/lessons`, lessonForm);
      setLessons([...lessons, data.data]);
      setLessonForm({ title: '', description: '', videoUrl: '', duration: 10, readingMaterials: '', quiz: [] });
      setShowLessonForm(false);
    } catch (err) {
      console.error('Failed to add lesson', err);
      alert(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    const success = await saveCourseData();
    if (success && courseId) {
      setSaving(true);
      try {
        await api.put(`/instructor/courses/${courseId}/submit`);
        navigate('/dashboard/my-courses'); // Go back to dashboard after submitting
      } catch (err) {
        console.error('Failed to submit course', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // uploadRoutes currently leverages 'image' multer mapping for all types.

    setSaving(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        if (field === 'videoUrl') {
          setLessonForm(prev => ({ ...prev, videoUrl: data.filePath }));
        } else if (field === 'readingMaterials') {
          const extension = file.name.split('.').pop();
          const docLink = `[Attached Resource: ${file.name}](${data.filePath})`;
          setLessonForm(prev => ({ 
            ...prev, 
            readingMaterials: prev.readingMaterials 
              ? `${prev.readingMaterials}\n\n${docLink}` 
              : docLink
          }));
        } else if (field === 'thumbnail') {
          setFormData(prev => ({ ...prev, thumbnail: data.filePath }));
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload file. Limit is 1GB. Please try again.');
    } finally {
      setSaving(false);
      e.target.value = ''; // Reset input
    }
  };

  const steps = [
    { title: 'Information', icon: <BookOpen className="w-5 h-5" /> },
    { title: 'Details', icon: <Tag className="w-5 h-5" /> },
    { title: 'Curriculum', icon: <LayoutList className="w-5 h-5" /> },
    { title: 'Pricing', icon: <DollarSign className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col text-white">
      {/* Top Navbar specifically for the builder */}
      <header className="border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard/my-courses')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium text-sm border-r border-white/10 pr-4"
            >
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
            <h1 className="font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {formData.title || 'Untitled Course'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">
              {saving ? 'Saving...' : 'Draft saved'}
            </span>
            <button 
              onClick={saveCourseData}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 border border-white/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#FFD700] to-[#E30A17] rounded-full -z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${
                      isActive ? 'bg-[#0B0E14] text-[#FFD700] border-2 border-[#FFD700]' :
                      isCompleted ? 'bg-[#008A32] text-white border-2 border-[#008A32]' : 'bg-[#0B0E14] text-slate-500 border border-white/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                    </div>
                    <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#FFD700]' : isCompleted ? 'text-[#008A32]' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Area */}
          <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-white mb-6">General Information</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Course Title <span className="text-[#E30A17]">*</span></label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                      className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all placeholder:text-slate-600 font-semibold" 
                      placeholder="E.g., Complete Modern JavaScript Bootcamp" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Detailed Description <span className="text-[#E30A17]">*</span></label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      required 
                      className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all resize-y placeholder:text-slate-600 font-medium" 
                      rows="4" 
                      placeholder="What will students learn in this course? Detail the curriculum and learning outcomes."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})} 
                        className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all appearance-none cursor-pointer font-medium"
                      >
                        <option value="Programming">Programming</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Exam Prep">Exam Prep</option>
                        <option value="Languages">Languages</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Level</label>
                      <select 
                        value={formData.level} 
                        onChange={e => setFormData({...formData, level: e.target.value})} 
                        className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all appearance-none cursor-pointer font-medium"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">Duration (Hours) <span className="text-[#E30A17]">*</span></label>
                      <input 
                        type="number" 
                        min="1" 
                        value={formData.duration} 
                        onChange={e => setFormData({...formData, duration: Number(e.target.value)})} 
                        required 
                        className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all font-semibold" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Media & Details */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                  <h2 className="text-2xl font-display font-bold text-white mb-6">Media & Additional Details</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#FFD700]" /> Course Thumbnail URL
                    </label>
                    <input 
                      type="url" 
                      value={formData.thumbnail} 
                      onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                      className="w-full px-4 py-3 bg-[#0B0E14] text-white rounded-xl border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all placeholder:text-slate-600 font-medium" 
                      placeholder="https://example.com/beautiful-course-cover.jpg" 
                    />
                    {formData.thumbnail && (
                      <div className="mt-4 rounded-xl overflow-hidden shadow-sm border border-white/10 max-w-sm h-48 bg-black/50 relative">
                        <img src={formData.thumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' }} />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* What You'll Learn */}
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">What will students learn?</label>
                      {formData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-3">
                          <input 
                            type="text" 
                            value={item}
                            onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all text-sm placeholder:text-slate-600"
                            placeholder={`Learning outcome ${index + 1}`}
                          />
                          <button 
                            onClick={() => removeArrayItem('whatYouWillLearn', index)}
                            className="p-2.5 text-slate-500 hover:text-[#E30A17] hover:bg-[#E30A17]/10 rounded-lg transition-colors border border-transparent hover:border-[#E30A17]/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addArrayItem('whatYouWillLearn')}
                        className="text-sm font-bold text-[#FFD700] hover:text-[#FFD700]/80 flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Outcome
                      </button>
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Prerequisites / Requirements</label>
                      {formData.requirements.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-3">
                          <input 
                            type="text" 
                            value={item}
                            onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all text-sm placeholder:text-slate-600"
                            placeholder={`Requirement ${index + 1}`}
                          />
                          <button 
                            onClick={() => removeArrayItem('requirements', index)}
                            className="p-2.5 text-slate-500 hover:text-[#E30A17] hover:bg-[#E30A17]/10 rounded-lg transition-colors border border-transparent hover:border-[#E30A17]/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addArrayItem('requirements')}
                        className="text-sm font-bold text-[#FFD700] hover:text-[#FFD700]/80 flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Requirement
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Curriculum */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Curriculum Builder</h2>
                  <p className="text-slate-400 mb-6">Organize your course content into engaging video lessons.</p>
                  
                  {lessons.length > 0 ? (
                    <div className="space-y-3 mb-8">
                      {lessons.map((lesson, idx) => (
                        <div key={lesson._id || idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-white/20 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center shrink-0 font-bold border border-[#FFD700]/20">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{lesson.title}</h4>
                            <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                              <PlayCircle className="w-3.5 h-3.5" /> {lesson.duration} mins
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-10 text-center mb-6">
                      <LayoutList className="w-12 h-12 text-[#FFD700] mx-auto mb-3 opacity-50" />
                      <h3 className="text-lg font-bold text-white mb-1">No lessons yet</h3>
                      <p className="text-slate-400 mb-4 text-sm max-w-sm mx-auto">Start building your curriculum by adding your first video lesson module.</p>
                    </div>
                  )}

                  {!showLessonForm ? (
                    <button 
                      onClick={() => setShowLessonForm(true)}
                      className="w-full py-4 bg-white/5 border border-dashed border-[#FFD700]/50 rounded-xl text-[#FFD700] font-bold hover:bg-[#FFD700]/10 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <PlusCircle className="w-5 h-5" /> Add New Lesson
                    </button>
                  ) : (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-in zoom-in-95 duration-200">
                      <h3 className="font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" /> New Lesson Module
                      </h3>
                      <form onSubmit={handleAddLesson} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1.5">Lesson Title <span className="text-[#E30A17]">*</span></label>
                          <input 
                            type="text" 
                            required 
                            value={lessonForm.title}
                            onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                            className="w-full px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-300 mb-1.5">Description <span className="text-[#E30A17]">*</span></label>
                          <textarea 
                            required 
                            value={lessonForm.description}
                            onChange={e => setLessonForm({...lessonForm, description: e.target.value})}
                            className="w-full px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none resize-y"
                            rows="2"
                          ></textarea>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-300 mb-1.5">Video URL <span className="text-[#E30A17]">*</span></label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                required 
                                value={lessonForm.videoUrl}
                                onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                                placeholder="Paste URL or upload file"
                                className="flex-1 px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none min-w-0"
                              />
                              <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-[#FFD700] border border-white/10 px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center shrink-0">
                                {saving ? '...' : 'Upload'}
                                <input 
                                  type="file" 
                                  accept="video/mp4,video/x-m4v,video/*"
                                  className="hidden" 
                                  onChange={(e) => handleFileUpload(e, 'videoUrl')} 
                                  disabled={saving}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="w-full sm:w-32 shrink-0">
                            <label className="block text-sm font-bold text-slate-300 mb-1.5">Duration (m) <span className="text-[#E30A17]">*</span></label>
                            <input 
                              type="number" 
                              required min="1"
                              value={lessonForm.duration}
                              onChange={e => setLessonForm({...lessonForm, duration: Number(e.target.value)})}
                              className="w-full px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5 mt-4">
                            <label className="block text-sm font-bold text-slate-300 flex items-center gap-1.5"><FileText className="w-4 h-4 text-blue-400"/> Reading Materials & Notes</label>
                            <label className="cursor-pointer text-xs font-bold text-[#FFD700] hover:text-white flex items-center gap-1">
                              Upload Document
                              <input 
                                type="file" 
                                accept=".pdf,.doc,.docx,.zip"
                                className="hidden" 
                                onChange={(e) => handleFileUpload(e, 'readingMaterials')} 
                                disabled={saving}
                              />
                            </label>
                          </div>
                          <textarea 
                            value={lessonForm.readingMaterials}
                            onChange={e => setLessonForm({...lessonForm, readingMaterials: e.target.value})}
                            className="w-full px-4 py-2.5 bg-[#0B0E14] text-white rounded-lg border border-white/10 focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none min-h-[100px] placeholder:text-slate-600"
                            placeholder="Add markdown notes, links, or text for students to read. Uploading a document inserts its link here."
                          ></textarea>
                        </div>
                        
                        <div className="mt-4">
                          <QuizBuilder 
                            quiz={lessonForm.quiz} 
                            setQuiz={(newQuiz) => setLessonForm({...lessonForm, quiz: newQuiz})} 
                            title="End of Lesson Mini-Quiz" 
                          />
                        </div>

                        <div className="flex gap-3 pt-6">
                          <button 
                            type="button" 
                            onClick={() => setShowLessonForm(false)}
                            className="flex-1 py-2.5 px-4 bg-white/5 text-slate-300 font-bold rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={saving}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#008A32]/20 border border-[#008A32] transition-colors disabled:opacity-50"
                          >
                            Save Lesson
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Pricing & Publish */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Pricing & Publishing</h2>
                  <p className="text-slate-400 mb-8">Set your course value and submit it for administrative review.</p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-20 h-20 bg-[#008A32]/10 rounded-full flex gap-1 items-center justify-center text-[#008A32] shadow-sm shrink-0 border-4 border-[#008A32]/20">
                        <DollarSign className="w-10 h-10" />
                      </div>
                      <div className="flex-1 w-full text-center sm:text-left">
                        <label className="block text-sm font-bold text-[#FFD700] mb-2">Set Course Price (USD)</label>
                        <div className="relative max-w-xs mx-auto sm:mx-0">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="w-5 h-5 text-[#008A32]" />
                          </div>
                          <input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-[#0B0E14] text-white rounded-xl border-2 border-[#008A32]/30 focus:ring-1 focus:ring-[#008A32] focus:border-[#008A32] outline-none transition-all shadow-inner"
                          />
                        </div>
                        <p className="mt-3 text-sm text-slate-400">Set to 0 to make this course free for all students.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-[#FFD700]" /> Final Course Certification Exam
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">You can require a final exam for students to earn their certificate.</p>
                    <label className="flex items-center gap-3 mb-6 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.isExamRequired}
                        onChange={e => setFormData({...formData, isExamRequired: e.target.checked})}
                        className="w-5 h-5 text-[#008A32] bg-[#0B0E14] border-white/20 rounded focus:ring-[#008A32] focus:ring-offset-[#0B0E14]"
                      />
                      <span className="font-bold text-slate-300">Require Final Exam for Certification</span>
                    </label>

                    {formData.isExamRequired && (
                      <div className="mt-4">
                        <QuizBuilder 
                          quiz={formData.finalExam} 
                          setQuiz={(newQuiz) => setFormData({...formData, finalExam: newQuiz})} 
                          title="Comprehensive Final Exam Questions" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-[#008A32]" /> Pre-flight Checklist
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300 ml-7 list-disc">
                      <li>Course title and detailed description are complete.</li>
                      <li>At least one lesson module has been added to the curriculum.</li>
                      <li>Course thumbnail is assigned (or default will be used).</li>
                    </ul>
                  </div>

                </div>
              )}

            </div>
            
            {/* Form Footer / Navigation */}
            <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1 || saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0B0E14] text-slate-300 font-bold rounded-xl border border-white/20 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              
              <div className="w-full sm:w-auto flex gap-3">
                {currentStep < 4 ? (
                  <button 
                    onClick={nextStep}
                    disabled={saving || (currentStep === 1 && !formData.title)}
                    className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#D4B300] text-[#0B0E14] font-bold rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[#FFD700]"
                  >
                    Save & Continue <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitForReview}
                    disabled={saving || lessons.length === 0}
                    className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#008A32]/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[#008A32]"
                  >
                    <Send className="w-5 h-5" /> Submit for Review
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

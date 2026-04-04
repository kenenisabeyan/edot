import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Users, Clock, BookOpen, ArrowRight, Search, Filter, Shield } from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-56" }) => (
  <div className={`bg-[#0B0E14] flex flex-col items-center justify-center text-slate-600 relative overflow-hidden group ${className}`}>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center">[ Thumbnail: {text} ]</span>
  </div>
);

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Set default filter to All. The user requested 6 precise categories.
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Hardcoded UI Categories per requirement
  const uiCategories = [
    'All',
    'Social Science', 
    'Mathematics & Natural Science', 
    'Programming & Technology', 
    'Natural Language', 
    'Business', 
    'Personal Development'
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses/public');
        setCourses(data.courses);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setError('Systems currently scaling. Please stand by or check connection.');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-32 pb-20">

        {/* HERO */}
        <section className="text-center max-w-4xl mx-auto px-6 mb-16 relative">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <span className="text-[10px] font-black text-[#008A32] tracking-[0.2em] uppercase">Industry-Leading Curriculum</span>
          </div>
          
          <h1 className="text-5xl md:text-[5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
             Explore Our <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Global Masterclasses</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
             Whether you're advancing in programming, grasping natural sciences, or optimizing your personal business skills—we have the blueprint for your execution.
          </p>
        </section>

        {/* CONTROLS */}
        <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
          <div className="bg-[#11151F]/80 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-white/10">
             
             <div className="w-full md:w-1/3 relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#008A32] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search programs..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-[#0B0E14] border border-white/5 rounded-[1.5rem] text-white font-medium focus:outline-none focus:border-[#008A32]/50 transition-all shadow-inner"
               />
             </div>

             <div className="w-full md:w-2/3 flex items-center gap-4 overflow-hidden">
               <Filter className="text-slate-500 w-5 h-5 shrink-0 ml-2" />
               <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full">
                 {uiCategories.map((cat, i) => (
                   <button 
                     key={i}
                     onClick={() => setCategoryFilter(cat)}
                     className={`px-5 py-3 text-[11px] font-black rounded-[1rem] whitespace-nowrap transition-all uppercase tracking-widest border ${
                       categoryFilter === cat 
                         ? 'bg-gradient-to-r from-[#008A32] to-[#006e28] text-white border-transparent shadow-lg' 
                         : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             </div>

          </div>
        </section>

        {/* RESULTS GRID */}
        <section className="max-w-7xl mx-auto px-6 relative z-20">
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-white/10 border-t-[#008A32] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-[#11151F] text-slate-300 font-bold p-8 rounded-[2rem] text-center border border-[#FF0000]/30 shadow-xl max-w-2xl mx-auto flex flex-col items-center gap-4">
              <Shield className="w-10 h-10 text-[#FF0000]" />
              {error}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-32 bg-[#11151F]/40 backdrop-blur-xl rounded-[3rem] border border-white/5">
              <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">No Active Modules Discovered</h3>
              <p className="text-slate-600 mt-4 font-medium">Adjust your technical parameters or try a broader search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div 
                  key={course._id} 
                  className="bg-[#11151F]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:bg-[#11151F]/80 hover:border-[#008A32]/30 hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-2"
                >
                  {/* Card Header Image */}
                  <div className="h-56 relative overflow-hidden border-b border-white/5">
                    {course.thumbnail ? (
                       <img 
                         src={course.thumbnail} 
                         alt={course.title} 
                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-0"
                       />
                    ) : (
                       <ImagePlaceholder text={`Course: ${course.title}`} className="h-full w-full" />
                    )}
                    
                    <div className="absolute top-4 left-4 bg-[#0B0E14]/90 backdrop-blur-md border border-[#008A32]/30 text-[#008A32] font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-20">
                      {course.category || 'General'}
                      {(course.category === 'Business' || course.category === 'Personal Development') && ' (Sale)'}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-xs font-bold shrink-0 items-center z-20">
                      <span className="bg-[#0B0E14]/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full flex gap-2 items-center shadow-lg">
                        <Clock className="w-3.5 h-3.5 text-[#FFD700]" /> {(course.lessons?.length || 0) * 15} Min
                      </span>
                      <span className="bg-[#0B0E14]/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full flex gap-2 items-center shadow-lg">
                        <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" /> {course.lessons?.length || 0} Modules
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#008A32] transition-colors tracking-tight">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-8 flex-1 font-medium leading-relaxed line-clamp-3">
                      {course.description || "In-depth modular training focusing on real-world execution."}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.1em] mb-8">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Users className="w-4 h-4 text-[#FFD700]" />
                      </div>
                      <span className="group-hover:text-slate-300 transition-colors uppercase">{course.instructor?.name || 'EDOT Authority'}</span>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="font-black text-2xl text-white">ETB {course.price || 'Free'}</span>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="bg-white text-[#0B0E14] px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#008A32] hover:text-white transition-all flex items-center gap-2 shadow-lg group/btn"
                      >
                        Enroll <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <CTA 
          title="Accelerate Your Future" 
          description="Get immediate access to all premium modules and certified instructors."
          buttonText="Browse Pricing Plans"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}

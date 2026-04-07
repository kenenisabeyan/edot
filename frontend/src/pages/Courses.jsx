import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, BookOpen, ArrowRight, Search, Filter, Shield, 
  Zap, CheckCircle, Star, Target, Rocket, GraduationCap
} from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-56" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border-b border-white/5 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
  </div>
);

import { foundationCategories as initialFoundation, advancedCategories as initialAdvanced, allCategories as initialAllCategories } from '../constants/courseCategories';

const CourseCard = ({ course, advancedCategories, layout = 'grid' }) => {
  const isAdvanced = advancedCategories.includes(course.category);
  const targetAudience = course.targetAudience || (isAdvanced ? 'University / Corporate' : 'School');
  const widthClass = layout === 'scroll' ? 'w-[85vw] sm:w-[320px] md:w-[380px] shrink-0' : 'w-full';

  return (
    <div 
      className={`bg-[#11151F]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#008A32]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,138,50,0.15)] transition-all duration-500 flex flex-col group p-3 ${widthClass}`}
    >
      <div className="h-56 relative overflow-hidden bg-[#0B0E14] rounded-[2rem]">
        {course.thumbnail ? (
           <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
        ) : (
           <ImagePlaceholder text={`Thumbnail`} className="h-full w-full" />
        )}
        
        <div className="absolute top-4 left-4 bg-[#0B0E14]/90 backdrop-blur text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg">
          {course.category || 'General'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-5">
           <span className="bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white border border-[#008A32]/50 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-md">
              {course.level || 'Beginner'}
           </span>
           <span className="bg-white/5 text-slate-300 border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
              Target: {targetAudience}
           </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2">{course.title}</h3>
        
        <div className="flex items-center gap-3 mb-8 text-sm text-slate-400 font-medium">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#11151F] to-[#0B0E14] flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
              <Users className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
           </div>
           <span className="font-semibold group-hover:text-white transition-colors">{course.instructor?.name || 'EDOT Educator'}</span>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
          <div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Price</span>
             <span className="font-black text-2xl text-[#FFD700]">ETB {course.price || 'Free'}</span>
          </div>
          <Link to={`/course/${course._id}`} className="bg-[#11151F] text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD700] hover:text-black border border-white/10 hover:border-[#FFD700]/50 shadow-lg transition-all flex items-center gap-2">
            Enroll <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const foundationCategories = initialFoundation.map(c => c.name);
  const advancedCategories = initialAdvanced.map(c => c.name);
  const allCategories = initialAllCategories;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data.courses || []);
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
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const featuredCourses = courses.slice(0, 3);

  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans overflow-x-hidden text-slate-100 relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto px-6 pt-24 mb-20 relative z-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">Course Selection Hub</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
             Find the Right Course <br/> <span className="text-white">for Your Journey.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
             Whether you're starting your first day of school or stepping into an enterprise career, we have the perfect pathway for you.
          </p>
          <div className="flex justify-center gap-4">
             <a href="#course-catalog" className="px-8 py-4 bg-[#008A32] text-white rounded-xl font-bold hover:bg-[#007028] shadow-[0_0_20px_rgba(0,138,50,0.3)] transition-all flex items-center gap-2">
               Explore Courses <ArrowRight className="w-4 h-4" />
             </a>
          </div>
        </section>

        {/* 4. LEARNING PATH (Visual Progression) */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">The EDOT Progression</h2>
             <p className="text-slate-400 font-medium mt-4">A clear, continuous path from early basics to high-level mastery.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Progress Line */}
             <div className="hidden md:block absolute top-[40%] left-16 right-16 h-1 bg-white/5 -z-10"></div>
             
             {[
               { level: "1. The Foundation", icon: <BookOpen className="w-8 h-8"/>, desc: "Master the essential building blocks. Perfect for School learners.", color: "text-[#008A32]", bg: "bg-[#008A32]/10" },
               { level: "2. The Deep Dive", icon: <Target className="w-8 h-8"/>, desc: "Intermediate exploration of complex topics. University standard.", color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
               { level: "3. Professional Execution", icon: <Rocket className="w-8 h-8"/>, desc: "Advanced certifications and real-world career growth methodologies.", color: "text-white", bg: "bg-white/10" }
             ].map((path, i) => (
               <div key={i} className="bg-[#11151F]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative z-10 hover:border-white/30 transition-all shadow-sm flex flex-col items-center text-center group overflow-hidden">
                  <div className={`w-20 h-20 rounded-full ${path.bg} ${path.color} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform shadow-inner`}>
                     {path.icon}
                  </div>
                  <h3 className="font-black text-2xl text-white mb-3 tracking-tight">{path.level}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{path.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 5. FEATURED COURSES */}
        {!loading && featuredCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mb-32 bg-[#11151F]/40 backdrop-blur-2xl py-20 rounded-[3rem] border border-white/5 relative z-20">
             <div className="flex flex-col items-center text-center gap-3 mb-16">
                <div className="flex items-center gap-2 text-[#FFD700] font-black uppercase tracking-widest text-[10px] bg-[#FFD700]/10 border border-[#FFD700]/20 px-4 py-2 rounded-full">
                   <Star className="w-4 h-4 fill-[#FFD700]" /> Highly Recommended
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">Featured Courses</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {featuredCourses.map(course => (
                 <div key={`feat-${course._id}`} className="bg-[#0B0E14] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all flex flex-col group">
                    <div className="h-56 relative overflow-hidden border-b border-white/5">
                      {course.thumbnail ? (
                         <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100" />
                      ) : (
                         <ImagePlaceholder text={course.title} className="h-full w-full rounded-none border-0" />
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                       <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2 title-font">{course.title}</h3>
                       <div className="flex items-center justify-between mb-8">
                         <span className="text-[#008A32] font-black bg-[#008A32]/10 border border-[#008A32]/20 px-3 py-1 rounded-md text-[10px] uppercase tracking-widest">{course.level || 'Intermediate'}</span>
                         <span className="text-slate-400 text-sm font-semibold">{course.instructor?.name || 'EDOT Expert'}</span>
                       </div>
                       <Link to={`/course/${course._id}`} className="mt-auto block text-center bg-white/5 border border-white/10 text-white hover:bg-[#FFD700] hover:text-black py-3.5 rounded-xl font-black text-sm transition-colors uppercase tracking-widest">
                         Inspect Details
                       </Link>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* 2. CATEGORY FILTER & 3. COURSE CARDS */}
        <section id="course-catalog" className="max-w-7xl mx-auto px-6 relative z-20 mb-32 pt-10">
          
          <div className="text-center mb-12">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Browse All Courses</h2>
          </div>

          <div className="mb-16">
             {/* Unified Search Bar */}
             <div className="w-full relative group max-w-4xl mx-auto mb-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-3xl">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-[#FFD700] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search courses, skills, or subjects..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-20 pr-8 py-6 bg-[#11151F]/80 backdrop-blur-2xl border border-white/10 rounded-3xl text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all text-xl shadow-inner"
               />
               {searchTerm && (
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FFD700] uppercase tracking-widest bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30 animate-in fade-in">
                   {filteredCourses.length} results
                 </div>
               )}
             </div>
             
             {/* Modern Sleek Categorized Pill Filter Bar */}
             <div className="flex flex-col items-center">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Filter className="w-3 h-3"/> Filter by Discipline</h4>
                 <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
                    <button 
                      onClick={() => setCategoryFilter('All')}
                      className={`px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-md ${categoryFilter === 'All' ? 'bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-black shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105' : 'bg-[#11151F] text-slate-400 border border-white/10 hover:border-white/30 hover:bg-[#1a1f2e]'}`}
                    >
                      All Modules
                    </button>
                    {allCategories.map((cat, i) => {
                      const isFoundation = foundationCategories.includes(cat);
                      return (
                        <button 
                          key={i}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-5 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all border shadow-md flex items-center gap-2 ${
                            categoryFilter === cat 
                              ? isFoundation 
                                ? 'bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white border-[#008A32] shadow-[0_0_20px_rgba(0,138,50,0.4)] scale-105' 
                                : 'bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-black border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105'
                              : 'bg-[#11151F] text-slate-400 border-white/10 hover:border-white/30 hover:bg-[#1a1f2e]'
                          }`}
                        >
                          {isFoundation ? <CheckCircle className={`w-3 h-3 ${categoryFilter === cat ? 'text-white' : 'text-[#008A32]'}`} /> : <Zap className={`w-3 h-3 ${categoryFilter === cat ? 'text-black' : 'text-[#FFD700]'}`} />}
                          {cat}
                        </button>
                      );
                    })}
                 </div>
             </div>
          </div>
          
          {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="w-10 h-10 border-4 border-[#11151F] border-t-[#008A32] rounded-full animate-spin"></div>
             </div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-500 font-medium p-8 rounded-3xl text-center border border-red-500/20 max-w-2xl mx-auto flex flex-col items-center gap-4">
               <Shield className="w-10 h-10" />
               <p>{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-24 bg-[#11151F]/40 rounded-[3rem] border border-white/5">
               <h3 className="text-2xl font-black text-slate-400">No matching modules found</h3>
               <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or category filters.</p>
            </div>
          ) : categoryFilter === 'All' && !searchTerm ? (
             <div className="flex flex-col gap-24">
               {allCategories.map(category => {
                 const categoryCourses = courses.filter(c => c.category === category);
                 if (categoryCourses.length === 0) return null;
                 
                 const isFoundation = foundationCategories.includes(category);
                 const themeColor = isFoundation ? 'text-[#008A32]' : 'text-[#FFD700]';
                 const themeBorder = isFoundation ? 'border-[#008A32]' : 'border-[#FFD700]';
                 const themeBg = isFoundation ? 'bg-[#008A32]/10' : 'bg-[#FFD700]/10';

                 return (
                   <div key={category} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                         <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeBg} ${themeColor} font-black text-[9px] uppercase tracking-widest shadow-sm mb-3 border ${themeBorder}/20`}>
                               {isFoundation ? 'Foundation Focus' : 'Advanced Market'}
                            </div>
                            <h3 className={`text-3xl md:text-4xl font-black text-white tracking-tight`}>{category}</h3>
                         </div>
                         <button 
                           onClick={() => setCategoryFilter(category)}
                           className="text-slate-400 hover:text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors bg-[#11151F] px-4 py-2 rounded-full border border-white/10 hover:border-white/30"
                         >
                           View All {categoryCourses.length} <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                      
                      {/* Horizontal Scrollable Row for Market Feel */}
                      <div className="w-full overflow-x-auto pb-8 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex gap-8 w-max">
                           {categoryCourses.map((course) => (
                              <CourseCard key={course._id} course={course} advancedCategories={advancedCategories} layout="scroll" />
                           ))}
                        </div>
                      </div>
                   </div>
                 )
               })}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
              {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} advancedCategories={advancedCategories} layout="grid" />
              ))}
            </div>
          )}
        </section>

        {/* 6. CTA */}
        <div className="relative z-20">
           <CTA 
             title="Start learning at your level and grow step by step" 
             description="Build your personalized curriculum. Create an account to access advanced algorithmic progress tracking and credentials."
             buttonText="Deploy Journey"
             buttonLink="/register"
           />
        </div>

      </div>
    </div>
  );
}

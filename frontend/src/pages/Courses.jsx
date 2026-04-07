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

import { foundationCategories as initialFoundation, advancedCategories as initialAdvanced } from '../constants/courseCategories';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const foundationCategories = initialFoundation.map(c => c.name);
  const advancedCategories = initialAdvanced.map(c => c.name);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses/public');
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

          <div className="bg-[#11151F]/60 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-sm border border-white/10 flex flex-col gap-8 mb-16">
             <div className="w-full relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-[#FFD700] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by title or topic..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all text-lg"
               />
             </div>
             
             {/* Unified Filter UI grouped into Foundation and Advanced */}
             <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Filter Categories</h4>
                <div className="flex flex-col lg:flex-row gap-6">
                   <button 
                     onClick={() => setCategoryFilter('All')}
                     className={`px-8 py-3 h-fit rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shrink-0 border ${categoryFilter === 'All' ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-[#0B0E14] text-slate-400 border-white/10 hover:border-white/30'}`}
                   >
                     All
                   </button>
                   
                   <div className="flex-1 bg-gradient-to-br from-[#008A32]/10 to-transparent border border-[#008A32]/20 p-5 rounded-2xl">
                      <div className="text-[#008A32] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Foundation Focus</div>
                      <div className="flex flex-wrap gap-2">
                        {foundationCategories.map((cat, i) => (
                           <button 
                             key={`f-${i}`}
                             onClick={() => setCategoryFilter(cat)}
                             className={`px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all border ${
                               categoryFilter === cat ? 'bg-[#008A32] text-white border-[#008A32] shadow-[0_0_10px_rgba(0,138,50,0.3)]' : 'bg-[#0B0E14] text-slate-400 border-white/10 hover:border-white/30'
                             }`}
                           >
                             {cat}
                           </button>
                        ))}
                      </div>
                   </div>

                   <div className="flex-1 bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 p-5 rounded-2xl">
                      <div className="text-[#FFD700] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4"/> Advanced Tech & Biz</div>
                      <div className="flex flex-wrap gap-2">
                        {advancedCategories.map((cat, i) => (
                           <button 
                             key={`a-${i}`}
                             onClick={() => setCategoryFilter(cat)}
                             className={`px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all border ${
                               categoryFilter === cat ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-[#0B0E14] text-slate-400 border-white/10 hover:border-white/30'
                             }`}
                           >
                             {cat}
                           </button>
                        ))}
                      </div>
                   </div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredCourses.map((course) => {
                const isAdvanced = advancedCategories.includes(course.category);
                const targetAudience = course.targetAudience || (isAdvanced ? 'University / Corporate' : 'School');

                return (
                 <div 
                   key={course._id} 
                   className="bg-[#0B0E14] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#008A32]/40 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,138,50,0.1)] transition-all duration-300 flex flex-col group p-3"
                 >
                   <div className="h-56 relative overflow-hidden bg-[#11151F] rounded-[2rem]">
                     {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                     ) : (
                        <ImagePlaceholder text={`Thumbnail`} className="h-full w-full" />
                     )}
                     
                     <div className="absolute top-4 left-4 bg-[#0B0E14]/90 backdrop-blur text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10">
                       {course.category || 'General'}
                     </div>
                   </div>

                   <div className="p-6 flex-1 flex flex-col">
                     <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="bg-[#008A32]/10 text-[#008A32] border border-[#008A32]/20 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                           {course.level || 'Beginner'}
                        </span>
                        <span className="bg-white/5 text-slate-300 border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                           Target: {targetAudience}
                        </span>
                     </div>

                     <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#008A32] transition-colors line-clamp-2">{course.title}</h3>
                     
                     <div className="flex items-center gap-3 mb-8 text-sm text-slate-400 font-medium">
                        <div className="w-8 h-8 rounded-full bg-[#11151F] flex items-center justify-center shrink-0 border border-white/10">
                           <Users className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-semibold">{course.instructor?.name || 'EDOT Educator'}</span>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                       <div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Price</span>
                          <span className="font-black text-2xl text-[#FFD700]">ETB {course.price || 'Free'}</span>
                       </div>
                       <Link to={`/course/${course._id}`} className="bg-[#008A32] text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#007028] shadow-[0_0_15px_rgba(0,138,50,0.2)] transition-colors flex items-center gap-2">
                         Enroll <ArrowRight className="w-4 h-4"/>
                       </Link>
                     </div>
                   </div>
                 </div>
                )
              })}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, Clock, BookOpen, ArrowRight, Search, Filter, Shield, 
  Zap, CheckCircle, Star, BarChart, Route, PlayCircle 
} from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-56" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] flex flex-col items-center justify-center text-slate-600 relative overflow-hidden group ${className}`}>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-400 transition-colors">[ Thumbnail: {text} ]</span>
  </div>
);

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  const featuredCourses = courses.slice(0, 3); // Top 3 as featured

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto px-6 pt-20 mb-20 relative">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <Zap className="w-4 h-4 text-[#FFD700]" />
             <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">The Global Knowledge Market</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
             Deploy Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Execution Arsenal.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
             Enroll in elite, industry-vetted digital modules. From foundational sciences to enterprise programming and corporate strategy.
          </p>
          <div className="flex justify-center gap-4">
             <a href="#course-catalog" className="px-8 py-4 bg-white text-[#0B0E14] rounded-xl font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all flex items-center gap-2">Explore Catalog <ArrowRight className="w-4 h-4" /></a>
          </div>
        </section>

        {/* 6. BENEFITS OF EDOT COURSES */}
        <section className="py-12 border-y border-white/5 bg-[#11151F]/40 backdrop-blur-xl mb-24">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 divide-x divide-white/5">
              {[
                { title: "Instructor-Vetted", desc: "No filler content." },
                { title: "Lifetime Access", desc: "Learn at your velocity." },
                { title: "Active Telemetry", desc: "Track progress live." },
                { title: "Verified Certs", desc: "ISO-standard backing." }
              ].map((benefit, i) => (
                <div key={i} className="px-6 flex flex-col items-center text-center">
                   <CheckCircle className="w-6 h-6 text-[#008A32] mb-4" />
                   <h4 className="font-black text-white uppercase text-xs tracking-widest mb-1">{benefit.title}</h4>
                   <p className="text-slate-500 font-medium text-xs">{benefit.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 5. LEARNING PATHS */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Structured Learning Vectors</h2>
             <p className="text-slate-400 font-medium mt-4">Progress sequentially through our rigorous global standard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
             <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gradient-to-r from-[#11151F] via-[#008A32]/30 to-[#11151F] -translate-y-1/2 z-0"></div>
             {[
               { level: "01. Foundation Tracks", icon: <BookOpen />, desc: "Establish absolute core competency. Built for junior learners establishing academic excellence." },
               { level: "02. Core Execution", icon: <PlayCircle />, desc: "Bridge the gap between theory and industry application. Intermediate upskilling." },
               { level: "03. Enterprise Mastery", icon: <BarChart />, desc: "Advanced operational parameters. Cloud architecture, business scaling, and senior leadership." }
             ].map((path, i) => (
               <div key={i} className="bg-[#0B0E14] border border-white/10 rounded-[2.5rem] p-10 relative z-10 hover:border-[#008A32]/50 transition-colors shadow-2xl group flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#11151F] border border-[#008A32]/30 flex items-center justify-center text-[#008A32] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,138,50,0.2)]">
                     {path.icon}
                  </div>
                  <h3 className="font-black text-xl text-white mb-3 tracking-tight">{path.level}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{path.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 4. FEATURED COURSES */}
        {!loading && featuredCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mb-32">
             <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-4">
                <Star className="w-6 h-6 text-[#FFD700] fill-current" />
                <h2 className="text-3xl font-black text-white tracking-tight">Top Performing Modules</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {featuredCourses.map(course => (
                 <div key={`feat-${course._id}`} className="bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-[#FFD700]/20 rounded-[2rem] overflow-hidden hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] transition-all flex flex-col group">
                    <div className="h-48 relative overflow-hidden border-b border-white/5">
                      {course.thumbnail ? (
                         <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      ) : (
                         <ImagePlaceholder text={`Featured: ${course.title}`} className="h-full w-full rounded-none" />
                      )}
                      <div className="absolute top-4 right-4 bg-[#FFD700] text-[#0B0E14] font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">
                        Trending
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                       <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2">{course.title}</h3>
                       <div className="flex items-center gap-2 mb-6">
                         <div className="flex text-[#FFD700]"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                         <span className="text-slate-400 font-bold text-[10px]">({course.rating || '4.9'})</span>
                       </div>
                       <Link to={`/course/${course._id}`} className="mt-auto block text-center bg-white/5 border border-white/10 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-colors">
                         Inspect Course
                       </Link>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* 2 & 3. SEARCH, FILTERS & MAIN GRID */}
        <section id="course-catalog" className="max-w-7xl mx-auto px-6 relative z-20 mb-32 pt-10">
          
          <div className="text-center mb-12">
             <h2 className="text-4xl font-black text-white tracking-tight">Browse The Index</h2>
          </div>

          <div className="bg-[#11151F]/80 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-white/10 mb-12">
             <div className="w-full md:w-1/3 relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#008A32] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search modules..."
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
                  className="bg-[#11151F]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:bg-[#11151F]/80 hover:border-[#008A32]/30 hover:shadow-[0_0_40px_rgba(0,138,50,0.15)] transition-all duration-500 flex flex-col group hover:-translate-y-2"
                >
                  <div className="h-52 relative overflow-hidden border-b border-white/5">
                    {course.thumbnail ? (
                       <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-0" />
                    ) : (
                       <ImagePlaceholder text={`Course: ${course.title}`} className="h-full w-full border-b border-white/10" />
                    )}
                    
                    <div className="absolute top-4 left-4 bg-[#0B0E14]/90 backdrop-blur-md border border-[#008A32]/30 text-[#008A32] font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-[0.5rem] shadow-lg z-20">
                      {course.category || 'General'}
                      {(course.category === 'Business' || course.category === 'Personal Development') && ' (Sale)'}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md"><Route className="w-3 h-3"/> {course.level || 'Intermediate'}</span>
                       <span className="flex items-center gap-1 text-[#FFD700] text-xs font-bold"><Star className="w-3 h-3 fill-current" /> {course.rating || '4.8'}</span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#008A32] transition-colors tracking-tight line-clamp-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20"><Users className="w-3 h-3 text-[#FFD700]" /></div>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{course.instructor?.name || 'EDOT Authority'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-8 bg-[#0B0E14]/50 p-3 rounded-xl border border-white/5">
                       <div className="flex flex-col gap-1">
                          <span className="text-slate-500 text-[9px] uppercase tracking-widest font-black">Duration</span>
                          <span className="text-slate-300 font-bold flex items-center gap-1 text-xs"><Clock className="w-3 h-3 text-[#008A32]"/> {(course.lessons?.length || 0) * 15} Min</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-slate-500 text-[9px] uppercase tracking-widest font-black">Modules</span>
                          <span className="text-slate-300 font-bold flex items-center gap-1 text-xs"><BookOpen className="w-3 h-3 text-[#008A32]"/> {course.lessons?.length || 0} Lessons</span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                      <span className="font-black text-2xl text-white">ETB {course.price || 'Free'}</span>
                      <Link to={`/course/${course._id}`} className="bg-white text-[#0B0E14] px-6 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#008A32] hover:text-white transition-all flex items-center gap-2 shadow-lg group/btn">
                        Enroll <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. CTA */}
        <CTA 
          title="Accelerate Your Trajectory." 
          description="Get immediate access to all premium modules, learning paths, and certified global instructors."
          buttonText="Register Instantly"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}

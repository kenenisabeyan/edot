import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, BookOpen, ArrowRight, Search, Filter, Shield, 
  Zap, Star, Target, Rocket, ChevronDown, Clock, PlayCircle,
  Globe, Calculator, UserCheck, LayoutGrid
} from 'lucide-react';
import CTA from '../components/CTA';
import edotLogo from '../assets/edot-logo.jpg';

import COURSE_CATEGORIES, { MAIN_CATEGORIES } from '../constants/courseCategories';

const CATEGORY_DETAILS = {
  "Social Science": {
    icon: Globe,
    color: "#F97316", // Orange from Home
    description: "Explore human society, history, and behavior.",
    coursesCount: "120+"
  },
  "Mathematics & Natural Science": {
    icon: Calculator,
    color: "#3B82F6", // Blue from Home
    description: "Master foundational and advanced math & science.",
    coursesCount: "150+"
  },
  "Natural Language": {
    icon: BookOpen,
    color: "#A855F7", // Purple from Home
    description: "Enhance communication, literature, and linguistics.",
    coursesCount: "90+"
  },
  "Programming & Technology": {
    icon: Rocket,
    color: "#6366F1", // Indigo from Home
    description: "Break into tech with full-stack, AI, and cloud.",
    coursesCount: "250+"
  },
  "Business & Entrepreneurship": {
    icon: Target,
    color: "#FFD700", // Gold from Home
    description: "Develop business acumen and leadership skills.",
    coursesCount: "180+"
  },
  "Personal Development": {
    icon: UserCheck,
    color: "#22C55E", // Green from Home
    description: "Invest in your growth with scientific habits.",
    coursesCount: "110+"
  }
};

const CategoryInfographicItem = ({ cat, idx, isLeft, onClick }) => {
  const details = CATEGORY_DETAILS[cat] || CATEGORY_DETAILS["Programming & Technology"];
  
  return (
    <button 
      onClick={onClick}
      className={`group w-full flex items-center drop-shadow-xl hover:-translate-y-1 transition-all duration-300 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Number Hexagon */}
      <div 
        className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 shadow-inner relative z-10"
        style={{ backgroundColor: details.color, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      >
        <span className="text-white font-black text-lg md:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{`0${idx + 1}`}</span>
      </div>

      {/* Label Container */}
      <div 
        className={`flex-1 flex items-center h-12 md:h-14 bg-gradient-to-r from-[#11151F] to-[#1a1f2e] border border-white/10 relative z-0 ${isLeft ? '-ml-4 pl-8 pr-6' : '-mr-4 pr-8 pl-6'}`}
        style={{ 
           boxShadow: `inset 0 0 10px ${details.color}20`,
           clipPath: isLeft 
             ? 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)' // Left item points right
             : 'polygon(5% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 50%)' // Right item points left
        }}
      >
         {/* Top border colored line */}
         <div className="absolute top-0 left-0 right-0 h-[2px] opacity-80" style={{ backgroundColor: details.color }}></div>
         
         <span className={`text-white font-bold text-xs md:text-[13px] uppercase tracking-wider truncate w-full ${isLeft ? 'text-left' : 'text-right'} group-hover:text-white/80 transition-colors drop-shadow-sm`}>
            {cat}
         </span>
      </div>
    </button>
  );
};

const CentralEDOTLogo = () => (
  <div className="flex flex-col items-center justify-center relative w-28 h-36 md:w-36 md:h-44 z-20 hover:scale-[1.05] transition-transform duration-500">
    <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700] to-[#F97316] opacity-30 blur-2xl rounded-full"></div>
    {/* Shield Shape matching HTML5 shield ratio */}
    <div 
       className="w-full h-full bg-gradient-to-b from-[#008A32] to-[#00A13B] shadow-[0_0_40px_rgba(0,138,50,0.6)] flex flex-col items-center justify-center p-1 relative z-10"
       style={{ clipPath: 'polygon(50% 100%, 10% 85%, 0 0, 100% 0, 90% 85%)' }}
    >
       <div 
         className="w-full h-full bg-[#11151F] flex flex-col items-center justify-center relative"
         style={{ clipPath: 'polygon(50% 100%, 10% 85%, 0 0, 100% 0, 90% 85%)' }}
       >
         {/* Inner geometric accent like the original HTML5 logo but EDOT colored */}
         <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 pointer-events-none border-l border-white/5"></div>
         
         <div className="relative z-10 text-center -mt-4">
           <span className="text-white font-black text-2xl md:text-3xl tracking-[0.1em] drop-shadow-md pb-1 border-b-2 border-[#FFD700]">EDOT</span>
           <img src={edotLogo} alt="EDOT Hub" className="w-16 h-16 md:w-24 md:h-24 object-contain mt-3 mx-auto drop-shadow-lg rounded-sm" />
         </div>
       </div>
    </div>
  </div>
);

const ImagePlaceholder = ({ text, className = "h-56" }) => (
  <div className={`bg-[#0B0E14] border-b border-white/5 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
  </div>
);

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="bg-[#11151F]/60 backdrop-blur-md rounded-[1.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,138,50,0.15)] transition-all duration-500 flex flex-col group border border-white/5 hover:border-[#008A32]/40 h-full">
      {/* Thumbnail */}
      <div className="h-48 relative overflow-hidden bg-[#0B0E14]">
        {course.thumbnail && course.thumbnail !== 'default-course.jpg' ? (
           <img 
             src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:5000${course.thumbnail}`} 
             alt={course.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" 
           />
        ) : (
           <ImagePlaceholder text={`Course Thumbnail`} className="h-full w-full" />
        )}
        
        {/* Overlay Level Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#FFD700] font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg">
          {course.level || 'All Levels'}
        </div>

        {/* Overlay Category */}
        <div className="absolute bottom-3 left-3 bg-[#0B0E14]/90 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md border border-white/10 z-10">
          {course.mainCategory || 'General'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Subcategory */}
        <div className="text-[#008A32] font-black text-[10px] uppercase tracking-widest mb-2">
            {course.subCategory || 'General Topic'}
        </div>

        <h3 className="text-[18px] font-black text-white mb-3 leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4 text-xs text-slate-200 font-medium">
           <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1a202c] to-[#2d3748] flex items-center justify-center shrink-0 border border-white/10">
              <Users className="w-3 h-3 text-slate-200" />
           </div>
           <span className="truncate">{course.instructor?.name || 'EDOT Educator'}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-300 font-bold">
           <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5 text-slate-200"/> {Math.floor(Math.random() * 20) + 5} Modules</span>
           <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-200"/> {Math.floor(Math.random() * 10) + 2}h {Math.floor(Math.random() * 60)}m</span>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-white/10 flex items-end justify-between mt-auto">
          <div>
             <span className="font-black text-xl text-white group-hover:text-[#FFD700] transition-colors">
               {course.price ? `ETB ${course.price}` : 'Free'}
             </span>
          </div>
          <div className="bg-[#008A32]/10 text-[#008A32] w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#008A32] group-hover:text-white transition-colors">
             <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/courses/categorized');
        const statsMap = {};
        if (data && data.success && data.data) {
           data.data.forEach(s => {
             statsMap[s.mainCategory] = s;
           });
        }
        setCategoryStats(statsMap);
      } catch (err) {
        console.error('Failed to fetch category stats', err);
      }
    };
    fetchStats();
  }, []);

  const fetchCourses = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = {
        page: isLoadMore ? page + 1 : 1,
        limit: 9, // Increased limit for grid
      };
      
      if (categoryFilter !== 'All') params.mainCategory = categoryFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get('/courses', { params });
      
      if (isLoadMore) {
        setCourses(prev => [...prev, ...data.courses]);
        setPage(page + 1);
      } else {
        setCourses(data.courses);
        setPage(1);
      }
      
      setTotalCount(data.total);
      setHasMore(data.currentPage < data.totalPages);
      setError('');
    } catch (err) {
      console.error('Failed to fetch courses', err);
      setError('Systems currently scaling. Please stand by or check connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCourses(false);
  }, [categoryFilter, debouncedSearch]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) fetchCourses(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-slate-100 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0,138,50,0.15), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,215,0,0.1), transparent 40%)' }} />

      <div className="relative z-10 pt-24">

        {/* HERO SECTION */}
        <section className="relative px-6 py-20 pb-28 text-center max-w-5xl mx-auto flex flex-col items-center justify-center">
           <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Star className="w-3.5 h-3.5 text-[#008A32] fill-[#008A32]" />
              <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Learn from the Best</span>
           </div>
           
           <h1 className="text-4xl md:text-[4rem] font-black text-white tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6">
             What do you want to <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#E5C100]">learn today?</span>
           </h1>
           <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8">
             Discover thousands of premium courses covering tech, business, arts, and more. Taught by world-class EDOT instructors.
           </p>

           {/* Central Search */}
           <div className="w-full max-w-3xl relative group shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2rem] animate-in fade-in zoom-in-95 duration-500 delay-150">
             <div className="absolute inset-0 bg-gradient-to-r from-[#008A32] to-[#FFD700] rounded-[2rem] opacity-30 blur-md group-hover:opacity-50 transition-opacity"></div>
             <div className="relative bg-[#11151F] border border-white/10 rounded-[2rem] flex items-center p-2 pl-6 overflow-hidden">
               <Search className="w-6 h-6 text-slate-200 z-10" />
               <input 
                 type="text" 
                 placeholder="Search for courses, skills, or mentors..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="flex-1 bg-transparent border-none text-white px-4 py-4 md:py-5 text-lg focus:outline-none placeholder:text-slate-300 z-10 relative"
               />
               <button 
                 onClick={() => document.getElementById('course-catalog').scrollIntoView({ behavior: 'smooth' })}
                 className="bg-[#008A32] hover:bg-[#00A13B] text-white px-8 py-4 md:py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg transition-colors z-10"
               >
                 Search
               </button>
             </div>
           </div>
        </section>

        {/* TOP CATEGORIES SECTION */}
        <section className="px-6 py-16 bg-[#11151F]/60 border-y border-white/5 backdrop-blur-3xl relative overflow-hidden">
           {/* Subtle background tech pattern to enhance the infographic vibe */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

           <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                   My Courses Category
                 </h2>
                 <p className="text-slate-200 font-medium mt-4">Discover the fundamental tags of your EDOT education.</p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-6 max-w-6xl mx-auto px-4">
                 
                 {/* Left Side: Categories 1 to 3 */}
                 <div className="flex flex-col gap-6 w-full md:w-[35%] flex-1 z-10">
                    {MAIN_CATEGORIES.slice(0, 3).map((cat, idx) => (
                       <CategoryInfographicItem 
                          key={cat} 
                          cat={cat} 
                          idx={idx} 
                          isLeft={true} 
                          onClick={() => {
                              setCategoryFilter(cat);
                              document.getElementById('course-catalog').scrollIntoView({ behavior: 'smooth' });
                          }} 
                       />
                    ))}
                 </div>

                 {/* Central Shield */}
                 <div className="shrink-0 scale-95 md:scale-100 z-20 my-4 md:my-0">
                    <CentralEDOTLogo />
                 </div>

                 {/* Right Side: Categories 4 to 6 */}
                 <div className="flex flex-col gap-6 w-full md:w-[35%] flex-1 z-10">
                    {MAIN_CATEGORIES.slice(3, 6).map((cat, idx) => (
                       <CategoryInfographicItem 
                          key={cat} 
                          cat={cat} 
                          idx={idx + 3} 
                          isLeft={false} 
                          onClick={() => {
                              setCategoryFilter(cat);
                              document.getElementById('course-catalog').scrollIntoView({ behavior: 'smooth' });
                          }} 
                       />
                    ))}
                 </div>

              </div>
           </div>
        </section>

        {/* MAIN COURSE CATALOG */}
        <section id="course-catalog" className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh]">
          
          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
             <div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                  {categoryFilter === 'All' ? 'All Courses' : `${categoryFilter} Courses`}
                </h2>
                <p className="text-slate-200 font-medium">
                  {totalCount} {totalCount === 1 ? 'course' : 'courses'} available to elevate your skills.
                </p>
             </div>

             {/* Pill Filters */}
             <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setCategoryFilter('All')}
                  className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-2 ${categoryFilter === 'All' ? 'bg-white text-black shadow-md' : 'bg-[#11151F] text-slate-300 border border-white/10 hover:border-white/30'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5"/> All
                </button>
                {MAIN_CATEGORIES.map((cat, i) => (
                    <button 
                      key={i}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider text-[11px] transition-all ${
                        categoryFilter === cat 
                            ? 'bg-white text-black shadow-md' 
                            : 'bg-[#11151F] text-slate-300 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      {cat.split(' ')[0]} {/* Shortened name for pills */}
                    </button>
                ))}
             </div>
          </div>

          {/* Grid Content */}
          {loading ? (
             <div className="flex flex-col justify-center items-center h-64 gap-4">
               <div className="w-12 h-12 border-4 border-[#11151F] border-t-[#FFD700] rounded-full animate-spin"></div>
               <span className="text-slate-300 font-bold uppercase tracking-widest text-xs animate-pulse">Loading amazing content...</span>
             </div>
          ) : error ? (
             <div className="bg-red-500/10 text-red-500 font-medium p-8 rounded-3xl text-center border border-red-500/20 max-w-2xl mx-auto flex flex-col items-center gap-4">
               <Shield className="w-10 h-10" />
               <p>{error}</p>
             </div>
          ) : courses.length === 0 ? (
             <div className="text-center py-24 bg-[#11151F]/40 rounded-[2rem] border border-white/5 shadow-inner">
               <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
               <h3 className="text-2xl font-black text-slate-300 mb-2">No courses found</h3>
               <p className="text-slate-300 font-medium max-w-md mx-auto">We couldn't find any courses matching your search or filter. Try a different term or browse all categories.</p>
               <button onClick={() => {setSearchTerm(''); setCategoryFilter('All');}} className="mt-8 px-8 py-3 bg-[#11151F] border border-white/10 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors focus:ring-4 focus:ring-white/10">
                 Clear Filters
               </button>
             </div>
          ) : (
             <div className="flex flex-col items-center">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-700 mb-16">
                   {courses.map((course) => (
                       <CourseCard key={course.id} course={course} />
                   ))}
                 </div>

                 {hasMore && (
                   <button 
                     onClick={handleLoadMore}
                     disabled={loadingMore}
                     className="px-10 py-4 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest transition-all bg-[#11151F] text-white border border-white/10 hover:border-white/30 hover:bg-[#1a202c] focus:ring-4 focus:ring-white/10 flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px]"
                   >
                     {loadingMore ? 'Loading More...' : `Show More Courses (${totalCount - courses.length})`}
                     {!loadingMore && <ChevronDown className="w-4 h-4" />}
                   </button>
                 )}
             </div>
          )}

        </section>

        {/* CTA */}
        <div className="relative z-20 mt-12 pb-12">
           <CTA 
             title="Teach what you love. Join EDOT Instructors." 
             description="Share your knowledge with our global community of passionate learners and start earning."
             buttonText="Become an Instructor"
             buttonLink="/register"
           />
        </div>

      </div>
    </div>
  );
}

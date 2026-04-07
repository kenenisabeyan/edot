import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, BookOpen, ArrowRight, Search, Filter, Shield, 
  Zap, CheckCircle, Star, Target, Rocket, ChevronDown
} from 'lucide-react';
import CTA from '../components/CTA';

// Import new centralized category data
import { MAIN_CATEGORIES } from '../constants/courseCategories';

const ImagePlaceholder = ({ text, className = "h-56" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border-b border-white/5 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
  </div>
);

const CourseCard = ({ course, layout = 'grid' }) => {
  const widthClass = layout === 'scroll' ? 'w-[85vw] sm:w-[320px] md:w-[380px] shrink-0' : 'w-full';

  return (
    <div className={`bg-[#11151F]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#008A32]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,138,50,0.15)] transition-all duration-500 flex flex-col group p-3 ${widthClass}`}>
      <div className="h-56 relative overflow-hidden bg-[#0B0E14] rounded-[2rem]">
        {course.thumbnail && course.thumbnail !== 'default-course.jpg' ? (
           <img src={course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:5000${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
        ) : (
           <ImagePlaceholder text={`Thumbnail`} className="h-full w-full" />
        )}
        
        <div className="absolute top-4 left-4 bg-[#0B0E14]/90 backdrop-blur text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg truncate max-w-[200px]">
          {course.mainCategory || 'General'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-5">
           <span className="bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white border border-[#008A32]/50 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-md">
              {course.level || 'Beginner'}
           </span>
           <span className="bg-white/5 text-slate-300 border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
              {course.subCategory || 'General'}
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
             <span className="font-black text-2xl text-[#FFD700]">{course.price ? `ETB ${course.price}` : 'Free'}</span>
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Use debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCourses = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = {
        page: isLoadMore ? page + 1 : 1,
        limit: 6,
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

        {/* 2. CATEGORY FILTER & 3. COURSE CARDS */}
        <section id="course-catalog" className="max-w-7xl mx-auto px-6 relative z-20 mb-32 pt-10">
          <div className="text-center mb-12">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Browse API Catalog</h2>
          </div>

          <div className="mb-16">
             {/* Unified Search Bar */}
             <div className="w-full relative group max-w-4xl mx-auto mb-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-3xl">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-[#FFD700] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search dynamically fetched courses via backend..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-20 pr-8 py-6 bg-[#11151F]/80 backdrop-blur-2xl border border-white/10 rounded-3xl text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all text-xl shadow-inner"
               />
               {!loading && totalCount > 0 && (
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#FFD700] uppercase tracking-widest bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30 animate-in fade-in">
                   {totalCount} active items
                 </div>
               )}
             </div>
             
             {/* Modern Sleek Categorized Pill Filter Bar */}
             <div className="flex flex-col items-center">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Filter className="w-3 h-3"/> API Driven Discipline Filter</h4>
                 <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
                    <button 
                      onClick={() => setCategoryFilter('All')}
                      className={`px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-md ${categoryFilter === 'All' ? 'bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-black shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105' : 'bg-[#11151F] text-slate-400 border border-white/10 hover:border-white/30 hover:bg-[#1a1f2e]'}`}
                    >
                      Explore All
                    </button>
                    {MAIN_CATEGORIES.map((cat, i) => (
                        <button 
                          key={i}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-5 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all border shadow-md flex items-center gap-2 ${
                            categoryFilter === cat 
                                ? 'bg-gradient-to-r from-[#008A32] to-[#00A13B] text-white border-[#008A32] shadow-[0_0_20px_rgba(0,138,50,0.4)] scale-105' 
                                : 'bg-[#11151F] text-slate-400 border-white/10 hover:border-white/30 hover:bg-[#1a1f2e]'
                          }`}
                        >
                          <Zap className={`w-3 h-3 ${categoryFilter === cat ? 'text-white' : 'text-[#FFD700]'}`} />
                          {cat}
                        </button>
                    ))}
                 </div>
             </div>
          </div>
          
          {loading ? (
             <div className="flex flex-col justify-center items-center h-64 gap-4">
               <div className="w-10 h-10 border-4 border-[#11151F] border-t-[#008A32] rounded-full animate-spin"></div>
               <span className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Running Backend Query...</span>
             </div>
          ) : error ? (
             <div className="bg-red-500/10 text-red-500 font-medium p-8 rounded-3xl text-center border border-red-500/20 max-w-2xl mx-auto flex flex-col items-center gap-4">
               <Shield className="w-10 h-10" />
               <p>{error}</p>
             </div>
          ) : courses.length === 0 ? (
             <div className="text-center py-24 bg-[#11151F]/40 rounded-[3rem] border border-white/5 animate-in fade-in duration-500">
               <h3 className="text-2xl font-black text-slate-400">No matching modules found inside the Database.</h3>
               <p className="text-slate-500 mt-2 font-medium">Try clearing the search string or adjusting the active category.</p>
               <button onClick={() => {setSearchTerm(''); setCategoryFilter('All');}} className="mt-8 px-6 py-2 border border-white/10 rounded-full text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5">Reset Filters</button>
             </div>
          ) : (
             <div className="flex flex-col items-center">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-in fade-in zoom-in-95 duration-500 mb-12">
                   {courses.map((course) => (
                       <CourseCard key={course._id} course={course} layout="grid" />
                   ))}
                 </div>

                 {hasMore && (
                   <button 
                     onClick={handleLoadMore}
                     disabled={loadingMore}
                     className="px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all bg-[#0B0E14] text-white border border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 flex items-center justify-center gap-2 group shadow-lg"
                   >
                     {loadingMore ? 'Fetching...' : `Load Remaining (${totalCount - courses.length})`}
                     <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                   </button>
                 )}
             </div>
          )}
        </section>

        {/* CTA */}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, BookOpen, ArrowRight, ArrowLeft, Search, Filter, Shield, 
  Zap, CheckCircle, Star, Target, Rocket, ChevronDown
} from 'lucide-react';
import CTA from '../components/CTA';

// Import new centralized category data
import COURSE_CATEGORIES, { MAIN_CATEGORIES } from '../constants/courseCategories';

const CATEGORY_DETAILS = {
  "Social Science": {
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
    description: "Explore the complexities of human society, history, and behavior through comprehensive social science programs.",
    duration: "Flexible (1-3 months)",
    students: "850+"
  },
  "Mathematics & Natural Science": {
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
    description: "Master foundational and advanced concepts in mathematics, physics, and natural sciences.",
    duration: "Flexible (2-6 months)",
    students: "1200+"
  },
  "Natural Language": {
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
    description: "Enhance communication skills, dive deep into literature, linguistics, and foreign language.",
    duration: "Flexible (1-4 months)",
    students: "900+"
  },
  "Programming & Technology": {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    description: "Break into tech with courses ranging from full-stack web development to AI and machine learning.",
    duration: "Flexible (3-6 months)",
    students: "2500+"
  },
  "Business & Entrepreneurship": {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    description: "Develop critical business acumen, leadership skills, and entrepreneurial mindset for the economy.",
    duration: "Flexible (1-3 months)",
    students: "1500+"
  },
  "Personal Development": {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    description: "Invest in your personal growth with courses designed to boost leadership and time management.",
    duration: "Flexible (1-2 months)",
    students: "3000+"
  }
};

const CategoryCard = ({ category, onLearnMore, stats }) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS["Programming & Technology"];
  
  const subCategories = stats?.subCategories?.length > 0 
      ? stats.subCategories.slice(0, 3) 
      : (COURSE_CATEGORIES[category] || []).slice(0, 3);
  
  const hasMoreSubs = stats?.subCategories?.length > 3 || (COURSE_CATEGORIES[category] || []).length > 3;
  const durationText = stats ? (stats.durationRange || "Flexible") : details.duration;
  const studentsText = stats ? stats.totalStudents.toString() : details.students;
  
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex flex-col group p-3.5 w-full border border-slate-100">
      <div className="h-52 relative overflow-hidden rounded-[1.5rem] mb-4">
        <img src={details.image} alt={category} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
      </div>

      <div className="flex-1 flex flex-col px-3">
        <h3 className="text-[20px] font-bold text-slate-900 mb-2">{category}</h3>
        <p className="text-slate-500 text-[14px] mb-5 line-clamp-2 leading-relaxed">{details.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-6 mt-auto">
           {subCategories.map((sub, i) => (
             <span key={i} className="bg-[#FFF1EB] text-[#F97316] px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-wide">
                {sub}
             </span>
           ))}
           {hasMoreSubs && (
             <span className="bg-[#FFF1EB] text-[#F97316] px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-wide">
               More...
             </span>
           )}
        </div>

        <div className="flex items-center justify-between mt-auto mb-5 text-[12px] text-slate-400 font-medium tracking-wide">
          <span>Duration: {durationText}</span>
          <span>Students: {studentsText}</span>
        </div>

        <button 
          onClick={() => onLearnMore(category)} 
          className="w-full py-4 rounded-xl font-bold text-[14px] text-[#F97316] border-[1.5px] border-[#F97316] hover:bg-[#F97316] hover:text-white transition-all duration-300 flex items-center justify-center -mb-1"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

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
  const [viewMode, setViewMode] = useState('categories');
  const [courses, setCourses] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
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

        {/* WHAT YOU'LL LEARN SECTION */}
        <section className="py-24 px-6 relative z-20">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24 animate-in slide-in-from-bottom-5 duration-700">
                 <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mx-auto shadow-xl mb-6">
                    <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">Curriculum Overview</span>
                 </div>
                 <h2 className="text-4xl md:text-[3.5rem] font-black text-white tracking-tight leading-tight mb-6">
                   What You'll Learn with <span className="text-[#F97316]">EDOT</span> Courses
                 </h2>
                 <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto">
                   Master in-demand skills from foundational learning to advanced career growth — all in one place.
                 </p>
              </div>

              {/* 6 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 px-4 md:px-0">
                 
                 {/* Card 1: Social Science */}
                 <div className="bg-white rounded-[2rem] p-10 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col items-center text-center group border border-slate-100 relative shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                       <CheckCircle className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Social Science</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Explore human societies, history, and behavior through comprehensive programs.</p>
                 </div>

                 {/* Card 2: Math & Science (Highlighted 1) */}
                 <div className="rounded-[2.5rem] p-[3px] relative hover:-translate-y-4 transition-all duration-500 lg:-translate-y-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-indigo-500 to-[#F97316]/30 rounded-[2.5rem] blur-[3px] transition-all duration-700 opacity-80 group-hover:opacity-100"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E2E8F0] via-indigo-400 to-[#FFE4D6] rounded-[2.5rem] transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:via-indigo-300"></div>
                    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] rounded-[2.3rem] p-10 h-full flex flex-col items-center text-center relative z-10">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-8 border-[6px] border-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                           <Star className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Mathematics & Science</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Master foundational and advanced concepts in mathematics, physics, and natural sciences.</p>
                    </div>
                 </div>

                 {/* Card 3: Natural Language */}
                 <div className="bg-white rounded-[2rem] p-10 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col items-center text-center group border border-slate-100 relative shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                       <BookOpen className="w-10 h-10 text-purple-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Natural Language</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Enhance communication skills, dive deep into literature, linguistics, and language.</p>
                 </div>

                 {/* Card 4: Business & Entrepreneurship */}
                 <div className="bg-white rounded-[2rem] p-10 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col items-center text-center group border border-slate-100 relative shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                       <Target className="w-10 h-10 text-green-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Business & Strategy</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Develop critical business acumen, dynamic leadership skills, and entrepreneurial mindsets.</p>
                 </div>

                 {/* Card 5: Programming & Tech (Highlighted 2) */}
                 <div className="rounded-[2.5rem] p-[3px] relative hover:-translate-y-4 transition-all duration-500 lg:-translate-y-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-[#F97316]/70 to-[#F97316]/40 rounded-[2.5rem] blur-[3px] transition-all duration-700 opacity-80 group-hover:opacity-100"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E2E8F0] via-[#F97316] to-[#FFE4D6] rounded-[2.5rem] transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:via-[#F97316]"></div>
                    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] rounded-[2.3rem] p-10 h-full flex flex-col items-center text-center relative z-10">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-8 border-[6px] border-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                           <Rocket className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Programming & Tech</h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Break into tech with full-stack web development, AI, and deployment sessions.</p>
                    </div>
                 </div>

                 {/* Card 6: Personal Development */}
                 <div className="bg-white rounded-[2rem] p-10 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col items-center text-center group border border-slate-100 relative shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                       <Users className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[22px] font-black text-slate-900 mb-5 leading-tight">Personal Development</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-[15px]">Invest in your growth with scientifically proven habits and psychological tools.</p>
                 </div>
                 
              </div>
           </div>
        </section>

        {/* 2. CATEGORY FILTER & 3. COURSE CARDS */}
        <section id="course-catalog" className="max-w-7xl mx-auto px-6 relative z-20 mb-32 pt-10">
          <div className="text-center mb-12">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
               {viewMode === 'categories' ? 'Program Categories' : `Catalog: ${categoryFilter}`}
             </h2>
          </div>

          {viewMode === 'categories' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-in fade-in zoom-in-95 duration-500 mb-12">
               {MAIN_CATEGORIES.map(cat => (
                 <CategoryCard 
                   key={cat} 
                   category={cat} 
                   stats={categoryStats[cat]}
                   onLearnMore={(selectedCat) => {
                     setCategoryFilter(selectedCat);
                     setViewMode('courses');
                     setSearchTerm('');
                     setTimeout(() => {
                       document.getElementById('course-catalog').scrollIntoView({ behavior: 'smooth' });
                     }, 100);
                   }} 
                 />
               ))}
             </div>
          ) : (
             <>
               <div className="mb-16">
                 <button 
                   onClick={() => setViewMode('categories')}
                   className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-6 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest"
                 >
                   <ArrowLeft className="w-4 h-4" /> Back to Categories
                 </button>
                 
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
             </>
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

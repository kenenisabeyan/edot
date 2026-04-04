import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Clock, BookOpen, User, ArrowRight, Heart, Star, PlayCircle, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [favorites, setFavorites] = useState({});

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (debouncedSearch) queryParams.append('search', debouncedSearch);

      const { data } = await api.get(`/courses?${queryParams.toString()}`);
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters.category, debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStars = (rating = 4) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={12} className={i < rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-white/10'} />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0B0E14] text-slate-300 font-sans"
    >
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="pt-24 pb-16 text-center relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-[#FFD700] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#008A32] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-widest leading-tight relative z-10">
          Learn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-500">Construct.</span> Command.
        </h1>
        <p className="text-slate-400 mt-6 max-w-2xl mx-auto font-medium text-lg relative z-10">
          Access high-performance intelligence modules designed for real-world dominance.
        </p>
      </motion.div>

      {/* FILTER SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 relative z-20">
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] w-5 h-5 pointer-events-none" />
            <input
              placeholder="Query intelligence database..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-[#0B0E14]/80 text-white font-bold border border-white/10 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="w-full md:w-64 shrink-0">
            <CustomDropdown
              value={filters.category}
              onChange={(val) => setFilters({ ...filters, category: val })}
              placeholder="All Domains"
              options={[
                { label: 'Global Data', value: '' },
                { label: 'Programming', value: 'Programming' },
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Science', value: 'Science' },
                { label: 'Exam Prep', value: 'Exam Prep' }
              ]}
              className="py-1"
            />
          </div>
        </div>
      </div>

      {/* CONTENT MATRIX */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 relative z-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl shadow-xl h-80 flex flex-col">
                <div className="h-40 bg-white/5 rounded-xl mb-4" />
                <div className="h-5 bg-white/10 mb-3 w-3/4 rounded-md" />
                <div className="h-4 bg-white/10 mb-2 w-1/2 rounded-md" />
                <div className="mt-auto flex justify-between">
                   <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                   <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
           <div className="bg-[#0B0E14]/50 backdrop-blur-xl p-16 text-center rounded-3xl border-2 border-dashed border-white/10 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto mt-10">
             <div className="w-24 h-24 bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-6">
               <Focus className="w-12 h-12" />
             </div>
             <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Zero Matches Found</h3>
             <p className="text-slate-400 font-medium">Try broadening your search parameters or query a different intelligence category.</p>
           </div>
        ) : (
          <AnimatePresence>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group hover:border-[#FFD700]/40 transition-all flex flex-col h-full relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-bl-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <div className="relative h-48 overflow-hidden bg-[#11151F]">
                    <img 
                      src={course.thumbnail === 'default-course.jpg' || !course.thumbnail ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : course.thumbnail} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                      alt={course.title}
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 bg-[#0B0E14]/80 backdrop-blur-md px-3 py-1.5 rounded-md text-[9px] font-black text-[#FFD700] uppercase tracking-widest border border-white/10">
                      {course.category || 'General'}
                    </div>

                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(course._id); }} 
                      className="absolute top-3 right-3 bg-[#0B0E14]/80 backdrop-blur-md p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors z-10"
                    >
                      <Heart className={`w-4 h-4 ${favorites[course._id] ? 'text-[#E30A17] fill-[#E30A17]' : 'text-slate-400'}`} />
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-[#0B0E14]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#FFD700]" /> {course.duration}h
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-[#FFD700] transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-0.5">
                        {renderStars(course.rating || 4)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {course.studentsEnrolled || 0} enrolled
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 font-medium">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center pt-5 border-t border-white/10 mt-auto">
                      <span className="text-xl font-black text-white tracking-tight">
                        {course.price ? `$${course.price}` : <span className="text-[#008A32]">FREE</span>}
                      </span>

                      <Link 
                        to={`/course/${course._id}`} 
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg border border-white/10 hover:bg-[#FFD700] hover:text-[#0B0E14] hover:border-[#FFD700] transition-all group/btn shadow-sm"
                      >
                        Launch <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Clock, BookOpen, User, ArrowRight } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);

      const { data } = await api.get(`/courses?${queryParams.toString()}`);
      setCourses(data.courses);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      {/* Header Section */}
      <div className="bg-slate-900 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Explore EDOT Learning Paths</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover high-quality courses designed to build real skills, boost your confidence, and prepare you for academic and real-world success.
          </p>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search your next skill or course..." 
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:w-64 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select 
                value={filters.category}
                onChange={handleCategoryChange}
                className="w-full pl-10 pr-8 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all cursor-pointer"
              >
                <option value="">All Learning Categories</option>
                <option value="Programming">Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Exam Prep">Exam Preparation</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses available right now</h3>
              <p className="text-slate-500">Try searching with different keywords or explore other categories to find what fits your learning goals.</p>
              <button 
                onClick={() => setFilters({ category: '', search: '' })}
                className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
               >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course._id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={course.thumbnail === 'default-course.jpg' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' : course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white text-blue-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md border border-slate-100">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Clock className="w-4 h-4" /> {course.duration}h Learning
                      </span>
                    </div>
                    
                    <Link to={`/course/${course._id}`} className="block mb-2 group-hover:text-blue-600 transition-colors">
                      <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          {course.instructor?.name ? course.instructor.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                          {course.instructor?.name || 'EDOT Instructor'}
                        </span>
                      </div>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Start Learning <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
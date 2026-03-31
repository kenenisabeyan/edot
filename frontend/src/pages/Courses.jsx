import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Clock, BookOpen, User, ArrowRight, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    fetchCourses();
  }, [filters.category, debouncedSearch]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (debouncedSearch) queryParams.append('search', debouncedSearch);

      const { data } = await api.get(`/courses?${queryParams.toString()}`);
      setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStars = (rating = 4) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-white"
    >
      {/* HEADER */}
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="py-20 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Learn. Build. Succeed.
        </h1>
        <p className="text-gray-600 mt-4">Explore EDOT courses and become a real-world problem solver.</p>
      </motion.div>

      {/* FILTER */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-white p-4 rounded-xl shadow flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search skills..."
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 py-3 border rounded-lg"
            />
          </div>

          <select
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="border px-4 py-3 rounded-lg"
          >
            <option value="">All</option>
            <option value="Programming">Programming</option>
            <option value="Mathematics">Math</option>
            <option value="Science">Science</option>
          </select>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-xl shadow">
                <div className="h-40 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 mb-2" />
                <div className="h-4 bg-gray-200 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    <img src={course.thumbnail} className="h-48 w-full object-cover group-hover:scale-110 transition" />

                    {/* Favorite */}
                    <button onClick={() => toggleFavorite(course._id)} className="absolute top-3 right-3 bg-white p-2 rounded-full">
                      <Heart className={favorites[course._id] ? 'text-red-500 fill-red-500' : ''} />
                    </button>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                      {course.price ? `$${course.price}` : 'FREE'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-blue-600">{course.title}</h3>

                    <div className="flex items-center gap-1 mt-2">
                      {renderStars(course.rating)}
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Clock size={14} /> {course.duration}h
                      </span>

                      <Link to={`/course/${course._id}`} className="flex items-center gap-1 text-blue-600 font-semibold hover:gap-2">
                        Start <ArrowRight size={16} />
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

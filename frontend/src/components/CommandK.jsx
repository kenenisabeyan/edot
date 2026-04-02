import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, BookOpen, Settings, LayoutDashboard, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandK() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mocked global search index - in production this would fetch based on query
  const searchIndex = [
    { type: 'Page', title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { type: 'Page', title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { type: 'Page', title: 'Course Library', icon: BookOpen, path: '/dashboard/library' },
    { type: 'User', title: 'Kenenisa Beyan', icon: User, path: '/dashboard/profile' },
    { type: 'User', title: 'Admin System', icon: User, path: '/dashboard/users' },
    { type: 'Course', title: 'Advanced React Architecture', icon: BookOpen, path: '/dashboard/courses' },
    { type: 'Course', title: 'UI/UX Masterclass', icon: BookOpen, path: '/dashboard/courses' },
  ];

  const filteredResults = searchIndex.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (isOpen) {
        if (e.key === 'Escape') setIsOpen(false);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        if (e.key === 'Enter' && filteredResults.length > 0) {
          e.preventDefault();
          navigate(filteredResults[selectedIndex].path);
          setIsOpen(false);
          setQuery('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, selectedIndex, navigate, filteredResults]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[15vh] mx-auto z-50 w-full max-w-2xl px-4 sm:px-0"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/10">
              
              {/* Search Input Area */}
              <div className="relative flex items-center px-4 py-4 border-b border-slate-100 dark:border-white/10">
                <Search className="w-5 h-5 text-[#6366F1]" />
                <input
                  ref={inputRef}
                  className="w-full bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-white px-4 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg font-medium"
                  placeholder="What do you need?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 hover:text-slate-600 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredResults.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-slate-500">
                    No results found for <span className="font-bold text-slate-700 dark:text-slate-300">"{query}"</span>
                  </div>
                ) : (
                  <ul>
                    {filteredResults.map((item, index) => {
                      const Icon = item.icon;
                      const isSelected = index === selectedIndex;
                      
                      return (
                        <li key={index} className="mb-1">
                          <button
                            onClick={() => {
                              navigate(item.path);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                              isSelected 
                                ? 'bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/20 dark:text-indigo-300' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                               <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-bold text-sm tracking-tight">{item.title}</span>
                              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{item.type}</span>
                            </div>
                            
                            {isSelected && <ArrowRight className="w-4 h-4 ml-auto" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              
              {/* Footer Tooltip */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/50">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  Use <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">&uarr;</span> <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">&darr;</span> to navigate
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">Enter</span> to select
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

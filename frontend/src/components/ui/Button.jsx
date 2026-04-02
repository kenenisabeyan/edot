import React from 'react';
import { motion } from 'framer-motion';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  icon: Icon,
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500',
    secondary: 'bg-slate-800 text-white shadow-md hover:bg-slate-700 dark:bg-white dark:text-slate-900 border border-slate-700',
    outline: 'bg-white/50 backdrop-blur-sm border-indigo-200 text-indigo-600 hover:bg-indigo-50 border focus:ring-indigo-500',
    success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 focus:ring-emerald-500',
    danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 focus:ring-rose-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm font-bold rounded-xl',
    lg: 'px-6 py-3 text-base font-extrabold rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
      )}
      {!loading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </motion.button>
  );
}

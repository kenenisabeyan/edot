import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = false, ...props }) {
  const baseClass = 'glass-card overflow-hidden relative';
  const hoverClass = hover ? 'hover-scale cursor-pointer' : '';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${baseClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b border-slate-100/50 dark:border-slate-800/50 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

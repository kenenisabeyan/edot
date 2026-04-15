import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Globe, ShoppingCart } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';
import { motion } from 'framer-motion';

const CAT_COLORS = {
  "Social Science": { main: "#F97316", dark: "#C2410C" }, 
  "Mathematics & Natural Science": { main: "#3B82F6", dark: "#1D4ED8" }, 
  "Natural Language": { main: "#A855F7", dark: "#7E22CE" }, 
  "Programming & Technology": { main: "#6366F1", dark: "#4338CA" }, 
  "Business & Entrepreneurship": { main: "#FFD700", dark: "#CA8A04" }, 
  "Personal Development": { main: "#22C55E", dark: "#15803D" }
};

const DEFAULT_COLOR = { main: "#3b82f6", dark: "#2563eb" };

const CAT_DESCRIPTIONS = {
  "Social Science": "This curriculum path is designed to enable learners to travel inside human society, increasing awareness to grow understanding of history, behavior, and structural consciousness.",
  "Mathematics & Natural Science": "This training curriculum allows people to develop a step-by-step rigorous analytical system to build the required logic for the purpose, dreams, and advanced scientific goals they designed.",
  "Natural Language": "This language path is engineered to empower seamless global communication. The training lets learners balance their social, professional, and cultural interactions elegantly.",
  "Programming & Technology": "This curriculum is the track to tech mastery. It's designed to create 'Aha' moments and increase awareness to grow into highly sought-after software architectures and development mindsets.",
  "Business & Entrepreneurship": "This premium curriculum enables future leaders to navigate markets independently. It helps construct financial stability, leadership, and powerful entrepreneurial ecosystems.",
  "Personal Development": "This training empowers individuals to unlock self-mastery. Develop habits and physical, mental, and social goals that directly translate to long-term prosperity."
};

const ALL_CATEGORIES = [
  "Social Science",
  "Mathematics & Natural Science",
  "Natural Language",
  "Programming & Technology",
  "Business & Entrepreneurship",
  "Personal Development"
];

const CategoryPackageCard = ({ category, enrollmentMap, index }) => {
  const navigate = useNavigate();
  const color = CAT_COLORS[category.mainCategory] || DEFAULT_COLOR;
  const description = CAT_DESCRIPTIONS[category.mainCategory] || "This comprehensive path lets you balance essential skills, advancing your journey exponentially.";
  
  // Check if user is enrolled in any course in this package
  const enrolledCourse = category.courses.find(c => enrollmentMap[c.id]);
  const isEnrolled = !!enrolledCourse;
  
  return (
    <div className="bg-[#11151F] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-t-[6px] border-white/5 flex flex-col overflow-hidden relative font-sans group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300" style={{ borderTopColor: color.main }}>
      
      {/* Header Art Area */}
      <div className="h-60 bg-black relative flex flex-col items-center justify-center shrink-0 rounded-t-xl z-20">
         {/* Glowing Concentric Rings */}
         <div className="absolute top-1/2 left-[43%] -translate-x-1/2 -translate-y-[65%] w-40 h-40 rounded-full border-[8px] opacity-90 transition-all duration-500 group-hover:scale-105" style={{ borderColor: color.dark, boxShadow: `0 0 25px ${color.main}80, inset 0 0 15px ${color.main}80` }}></div>
         
         <div className="absolute top-1/2 left-[57%] -translate-x-1/2 -translate-y-[65%] w-40 h-40 rounded-full border-[8px] opacity-90 transition-all duration-500 group-hover:scale-105" style={{ borderColor: color.main, boxShadow: `0 0 25px ${color.main}80, inset 0 0 15px ${color.main}80` }}></div>
         
         {/* Center Logo Shield */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-[110px] h-[110px] rounded-full border-[4px] bg-black flex flex-col items-center justify-center z-10 shadow-2xl transition-all duration-500 group-hover:scale-110" style={{ borderColor: color.main, boxShadow: `0 0 20px ${color.main}` }}>
           <div className="w-14 h-14 rounded-full overflow-hidden mb-1 ring-2 ring-white/20">
             <img src={edotLogo} alt="EDOT" className="w-full h-full object-cover" />
           </div>
           <span className="text-white font-black tracking-widest text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ color: color.main }}>EDOT</span>
         </div>

         {/* Highly Accurate Wavy SVG Ribbon Banner */}
         <div className="absolute bottom-[-5px] left-0 right-0 w-full px-2 z-30 flex justify-center drop-shadow-2xl pointer-events-none">
            <div className="relative w-full max-w-[360px]">
              <svg viewBox="0 0 400 130" className="w-full h-auto drop-shadow-2xl overflow-visible" preserveAspectRatio="xMidYMid meet">
                <defs>
                   <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={color.dark} />
                      <stop offset="15%" stopColor={color.main} />
                      <stop offset="85%" stopColor={color.main} />
                      <stop offset="100%" stopColor={color.dark} />
                   </linearGradient>
                   {/* Text path definition for smiling curve */}
                   <path id={`textPath-${index}`} d="M 40,65 Q 200,105 360,65" fill="none" />
                </defs>

                {/* Ribbon Tails with V-cut */}
                <path d="M 60,70 L 0,80 L 30,105 L -10,120 L 80,105 Z" fill={color.dark} className="drop-shadow-lg" />
                <path d="M 340,70 L 400,80 L 370,105 L 410,120 L 320,105 Z" fill={color.dark} className="drop-shadow-lg" />
                
                {/* Main Front Banner */}
                <path d="M 30,85 Q 200,125 370,85 L 370,45 Q 200,85 30,45 Z" fill={`url(#grad-${index})`} />
                
                {/* 3D Core Highlights */}
                <path d="M 30,45 Q 200,85 370,45 L 370,48 Q 200,88 30,48 Z" fill="rgba(255,255,255,0.4)" />
                <path d="M 30,82 Q 200,122 370,82 L 370,85 Q 200,125 30,85 Z" fill="rgba(0,0,0,0.25)" />
                
                {/* Curved Text inside Ribbon */}
                <text>
                  <textPath 
                    href={`#textPath-${index}`} 
                    startOffset="50%" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="font-serif font-black"
                    style={{ 
                      fill: 'white', 
                      fontSize: category.mainCategory.length > 20 ? '13px' : '16px', 
                      letterSpacing: '1px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    }}
                    {...(category.mainCategory.length > 15 ? { textLength: "280", lengthAdjust: "spacingAndGlyphs" } : {})}
                  >
                     {category.mainCategory.toUpperCase()} COURSES
                  </textPath>
                </text>
              </svg>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex-1 flex flex-col bg-[#11151F] relative z-10">
         <h3 className="font-bold text-white text-sm mb-1">{category.mainCategory} Courses</h3>
         <h4 className="font-black text-xs uppercase tracking-wider mb-5" style={{ color: color.main }}>EDOT SUCCESS JOURNEY</h4>
         
         <p className="text-slate-300 text-[13px] mb-8 leading-relaxed flex-1">
           {description}
         </p>
         
         {/* Available Courses Box */}
         <div className="bg-[#0B0E14]/50 p-5 rounded-2xl border border-white/5 mb-8 shadow-sm transition-shadow min-h-[100px]">
            <div className="text-xs font-black text-slate-300 flex items-center gap-2 mb-4">
               <Globe className="w-3.5 h-3.5" style={{ color: color.main }} /> Available courses
            </div>
            {category.courses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                 {category.courses.slice(0, 4).map(c => (
                    <button 
                      key={c.id}
                      onClick={() => navigate(`/course/${c.id}`)}
                      className="text-white text-[10px] px-4 py-1.5 rounded-full font-bold shadow-sm truncate max-w-[140px] hover:scale-105 transition-transform cursor-pointer" 
                      style={{ backgroundColor: color.main }}
                    >
                      {c.title}
                    </button>
                 ))}
                 {category.courses.length > 4 && (
                    <span className="bg-[#11151F]/40 border border-white/10 text-slate-300 text-[10px] px-4 py-1.5 rounded-full font-bold shadow-sm">
                      +{category.courses.length - 4}
                    </span>
                 )}
              </div>
            )}
         </div>

         {/* Action Button */}
         {isEnrolled ? (
             <button 
               onClick={() => navigate(`/course/${enrolledCourse.id}`)}
               className="w-[80%] mx-auto text-white font-black py-3.5 rounded-full flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all uppercase text-[11px] tracking-widest"
               style={{ 
                 backgroundColor: color.dark,
                 boxShadow: `0 8px 20px ${color.dark}60`,
               }}
               onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.2)' }}
               onMouseOut={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
             >
                <Globe className="w-4 h-4" /> Continue Learning
             </button>
         ) : (
             <button 
               onClick={() => navigate('/courses')}
               className="w-[80%] mx-auto text-white font-black py-3.5 rounded-full flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all uppercase text-[11px] tracking-widest"
               style={{ 
                 backgroundColor: color.main,
                 boxShadow: `0 8px 20px ${color.main}60`,
               }}
               onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.15)' }}
               onMouseOut={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
             >
                <ShoppingCart className="w-4 h-4" /> Enroll Now
             </button>
         )}
      </div>
    </div>
  );
};

export default function StudentCourses() {
  const [categorizedCourses, setCategorizedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, catRes] = await Promise.all([
          api.get('/student/enrollments'),
          api.get('/courses/categorized')
        ]);
        
        setEnrolledCourses(enrollRes.data.data || []);
        setCategorizedCourses(catRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const enrollmentMap = useMemo(() => {
    const map = {};
    enrolledCourses.forEach(enroll => {
      if (enroll.course?.id) {
         map[enroll.course.id] = enroll;
      }
    });
    return map;
  }, [enrolledCourses]);

  const displayCategories = useMemo(() => {
    return ALL_CATEGORIES.map(catName => {
       const found = categorizedCourses.find(c => c.mainCategory === catName);
       if (found) return found;
       return { mainCategory: catName, courses: [] };
    });
  }, [categorizedCourses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#3b82f6] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] py-12 px-4 sm:px-6 lg:px-8 font-sans animate-in fade-in duration-500 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Simple Page Header resembling external platform */}
        <div className="mb-12 text-center md:text-left flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-black tracking-tight text-white">Courses</h1>
             <p className="text-slate-400 font-medium mt-1">Explore our categories below</p>
           </div>
        </div>

        {displayCategories.length === 0 ? (
          <div className="text-center p-12 bg-[#11151F]/40 rounded-2xl shadow-sm border border-white/5">
             <h3 className="text-xl font-bold text-slate-300">No Categories Available</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {displayCategories.map((catGroup, idx) => (
               <CategoryPackageCard key={idx} index={idx} category={catGroup} enrollmentMap={enrollmentMap} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

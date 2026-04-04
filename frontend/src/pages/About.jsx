import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, MonitorPlay, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import kenoImg from '../assets/keno.jpg';
import firoImg from '../assets/firo.jpg';
import bettyImg from '../assets/betty.jpg';
import yobsanImg from '../assets/yobsan.jpg';

export default function About() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, success: 0 });
  void motion;

  // Animated counters
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 100;
      setCounts({
        students: Math.min(start, 10000),
        courses: Math.min(start / 10, 500),
        success: Math.min(start / 100, 98)
      });
      if (start >= 10000) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const team = [
    { 
      name: 'Kenenisa Beyan', 
      role: 'CEO & Founder / IT Security Officer', 
      img: kenoImg,
      desc: 'Leads the company vision and focuses on cyber security. Monitors network access to ensure a secure platform.'
    },
    { 
      name: 'Firomsa Guteta', 
      role: 'Visionary & Lead Fullstack Developer', 
      img: firoImg,
      desc: 'Oversees the entire ecosystem, from the 3D Portfolio marketing to the MERN backend architecture of EDOT.'
    },
    { 
      name: 'Bethelhem Yehuala', 
      role: 'Academic Director (Curriculum)', 
      img: bettyImg,
      desc: 'Reviews courses to ensure all lessons and quizzes meet EDOT\'s high educational standards before they go live.'
    },
    { 
      name: 'Yobsan Girma', 
      role: 'Financial Controller & Registrar', 
      img: yobsanImg,
      desc: 'Oversees tuition payments, instructor payouts, student enrollments, progress validation, and certificate issuance.'
    }
  ];

  const testimonials = [
    { name: 'Student A', text: 'EDOT changed how I learn. Very practical and easy!' },
    { name: 'Student B', text: 'The best platform for real skills. Highly recommended!' },
    { name: 'Student C', text: 'I improved my grades and confidence thanks to EDOT.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] min-h-screen text-white font-sans overflow-hidden">

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-between">
        <div className="w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-[600px] h-[600px] bg-[#008A32]/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* HERO */}
      <section className="relative z-10 py-32 text-center bg-gradient-to-br from-[#11151F] to-[#0B0E14] border-b border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
           <h1 className="text-6xl md:text-7xl font-display font-black mb-6 tracking-tight drop-shadow-md">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#EAB308]">EDOT</span></h1>
           <p className="max-w-2xl mx-auto text-xl text-slate-300 font-medium leading-relaxed">A modern, elite platform designed to help students learn smarter, perform faster, and secure real-world success.</p>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="relative z-10 py-24 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-10">See How EDOT <span className="text-[#008A32]">Works</span></h2>
        <div className="relative max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group cursor-pointer">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Video Placeholder" />
          <div className="absolute inset-0 m-auto w-24 h-24 bg-[#FFD700]/90 rounded-full flex items-center justify-center z-20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.4)] backdrop-blur-md">
             <PlayCircle className="text-[#0f172a] w-12 h-12 ml-1" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 py-20 bg-white/5 border-y border-white/10 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4 text-center">
          <div className="p-8 rounded-3xl bg-[#0B0E14]/50 border border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-6xl font-display font-black text-[#FFD700] mb-2">{counts.students}+</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Active Learners</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0B0E14]/50 border border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-6xl font-display font-black text-[#008A32] mb-2">{counts.courses}+</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Premium Courses</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0B0E14]/50 border border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-6xl font-display font-black text-cyan-400 mb-2">{counts.success}%</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Success Rate</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative z-10 py-32">
        <h2 className="text-4xl md:text-5xl font-display font-black text-center mb-16">The Architecture <span className="text-[#FFD700]">Team</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {team.map((member, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-[#11151F] p-8 rounded-[2rem] shadow-2xl border border-white/10 text-center flex flex-col h-full group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              
              <div className="w-36 h-36 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.15)] relative z-10 group-hover:border-[#FFD700]/50 transition-colors">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h4 className="font-display font-black text-2xl text-white mb-2 relative z-10">{member.name}</h4>
              <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest leading-relaxed mb-6 relative z-10 border-b border-white/10 pb-6 inline-block w-full">{member.role}</p>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 relative z-10">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-32 bg-[#11151F] border-t border-white/10">
        <h2 className="text-4xl md:text-5xl font-display font-black text-center mb-16">Voices of <span className="text-[#008A32]">Success</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {testimonials.map((t, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-[#0B0E14] border border-white/10 p-8 rounded-[2rem] shadow-2xl relative">
              <div className="absolute -top-6 left-8 bg-[#008A32] text-white p-3 rounded-full shadow-lg">
                 <StartIcon />
              </div>
              <div className="flex mb-6 mt-4 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-[#FFD700] fill-[#FFD700]" size={18} />)}
              </div>
              <p className="text-slate-300 text-lg leading-relaxed italic mb-6">"{t.text}"</p>
              <div className="border-t border-white/10 pt-4 mt-auto">
                 <h4 className="font-bold text-white uppercase tracking-widest text-xs">{t.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 text-center mx-4 sm:mx-8 mb-10">
        <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative border border-white/10 shadow-[0_0_50px_rgba(255,215,0,0.15)] bg-[#11151F]">
           <div className="absolute inset-0 bg-gradient-to-br from-[#008A32]/20 to-[#FFD700]/20 mix-blend-overlay"></div>
           <div className="relative z-10 py-24 px-6 flex flex-col items-center">
             <h2 className="text-4xl md:text-6xl font-display font-black mb-6 text-white">Join the Elite Learning Network</h2>
             <p className="text-slate-300 mb-10 text-lg max-w-2xl font-medium">Take control of your future with advanced analytics, premium courses, and expert mentorship.</p>
             <Link to="/register" className="inline-flex items-center gap-3 bgGradientToR from-[#FFD700] to-[#EAB308] bg-[#FFD700] text-[#0f172a] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.4)]">
               Begin Your Journey <ArrowRight className="w-5 h-5" />
             </Link>
           </div>
        </div>
      </section>

    </motion.div>
  );
}

// Helper icon component since we mapped it above
function StartIcon() {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
   );
}

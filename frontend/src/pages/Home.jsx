import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Play, Star, BookOpen, Users, Award, Shield, ArrowRight, Zap, Globe, CheckCircle } from 'lucide-react';
import AgendaWidget from '../components/AgendaWidget';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-64" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <Award className="w-8 h-8 mb-3 opacity-50 group-hover:text-[#FFD700] transition-colors duration-500" />
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Image: {text} ]</span>
  </div>
);

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:5000/api/calendar', { headers });
        if (Array.isArray(res.data)) setAnnouncements(res.data);
        else if (res.data && Array.isArray(res.data.events)) setAnnouncements(res.data.events);
      } catch (error) {
        console.error("Error fetching agenda", error);
      }
    };
    fetchAgenda();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      {/* Background Mesh Gradient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="relative pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Content */}
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008A32] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#008A32]"></span>
                </span>
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Education Digital Online Tutorials</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-sans font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                Master The Future <br className="hidden md:block"/> Of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Global Learning.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl drop-shadow-xl">
                EDOT is the premier hybrid learning ecosystem bridging academic excellence, programming mastery, and career advancement for students, professionals, and global innovators.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <Link to="/courses" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-[#0B0E14] font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                  Explore Programs <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#11151F]/80 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3">
                  <Play className="w-4 h-4 text-[#FFD700]" /> See How It Works
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-6 text-sm font-bold text-slate-500">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0E14] bg-slate-800 flex items-center justify-center shadow-lg z-[1] relative">
                       <Users className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#FFD700]">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs uppercase tracking-widest mt-1">Join 10k+ Learners</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#008A32]/20 to-[#FFD700]/20 blur-2xl rounded-full opacity-50 z-0"></div>
              <ImagePlaceholder text="Immersive EDOT Platform Dashboard Mockup" className="h-[500px] w-full shadow-2xl relative z-10" />
              
              {/* Floating Elements */}
              <div className="absolute -left-10 top-20 bg-[#11151F]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-20 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-[#008A32] to-[#FFD700] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#0B0E14]" />
                </div>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-widest">Global Certified</p>
                  <p className="text-slate-400 text-xs">Top Tier Instructors</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. TRUSTED BY / PARTNERS */}
        <section className="py-12 border-y border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Recognized & Accredited By Leading Institutions</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-white" />
                  <span className="font-bold text-xl text-white tracking-tighter">Partner {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PLATFORM CATEGORIES */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">Master Any Domain. <br/> <span className="text-[#008A32]">Accelerate Your Career.</span></h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">Our rigorous curriculum is curated to transform beginners into industry-ready professionals across high-demand disciplines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Social Science", desc: "Understand global dynamics, sociology, and human behavior.", icon: <Globe /> },
              { title: "Math & Science", desc: "Advanced logic, physics, and mathematical foundations.", icon: <Zap /> },
              { title: "Programming & Tech", desc: "Software engineering, DevOps, and cloud architecture.", icon: <BookOpen /> },
              { title: "Natural Language", desc: "Master linguistics, communication, and global languages.", icon: <Users /> },
              { title: "Business (Sale)", desc: "Entrepreneurship, marketing, and corporate financial strategy.", icon: <Award />, highlight: true },
              { title: "Personal Dev (Sale)", desc: "Leadership, productivity, and essential soft skills.", icon: <Shield />, highlight: true }
            ].map((cat, i) => (
              <div key={i} className={`p-8 rounded-[2rem] border transition-all duration-500 group ${cat.highlight ? 'bg-gradient-to-br from-[#11151F] to-[#0B0E14] border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.05)] hover:border-[#FFD700]/60' : 'bg-[#11151F]/40 backdrop-blur-xl border-white/10 hover:bg-white/5 hover:border-white/20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${cat.highlight ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-white/5 text-[#008A32]'}`}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-white">{cat.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-6">{cat.desc}</p>
                <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white hover:text-[#008A32] transition-colors">
                  Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TARGET AUDIENCES (Who is it for) */}
        <section className="py-32 px-6 bg-[#11151F]/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="order-2 lg:order-1 relative">
               <ImagePlaceholder text="Dynamic Collage of Students, Professionals & Instructors" className="h-[600px] w-full" />
            </div>

            <div className="order-1 lg:order-2 space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">A Unified Ecosystem For <span className="text-[#FFD700]">Every Learner</span>.</h2>
              <ul className="space-y-8">
                {[
                  { title: "Students (Primary & Uni)", desc: "Supplement academic studies with rigorous tutorials and foundational skill building." },
                  { title: "Working Professionals", desc: "Upskill rapidly with programming and business modules designed for modern industry constraints." },
                  { title: "Involved Parents", desc: "Monitor progress, track attendance, and ensure your absolute certainty in high-quality curriculum." },
                  { title: "Elite Instructors", desc: "Leverage our advanced course builder, automated analytics, and global reach to teach effectively." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 flex items-center justify-center text-[#008A32]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <CTA />

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Play, Star, BookOpen, Users, Award, Shield, ArrowRight, Zap, Globe, 
  CheckCircle, Video, LayoutDashboard, LineChart, Code, Clock
} from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-64", icon: Icon = Award }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    {Icon && <Icon className="w-8 h-8 mb-3 opacity-50 group-hover:text-[#FFD700] transition-colors duration-500" />}
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Virtual Asset: {text} ]</span>
  </div>
);

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/courses/public');
        // Grab the first 3 courses as featured
        if (data.courses && Array.isArray(data.courses)) {
           setFeaturedCourses(data.courses.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching featured courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
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
        <section className="relative pt-24 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 relative z-10 pr-0 lg:pr-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
                </span>
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Enterprise-Grade E-Learning</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-sans font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                Deploy Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Full Potential.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl drop-shadow-xl">
                EDOT is an elite hybrid learning infrastructure bridging rigorous academic knowledge with high-performance technical execution for global learners and professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#008A32] to-[#006e28] text-white font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(0,138,50,0.4)] hover:shadow-[0_0_40px_rgba(0,138,50,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  Start Execution <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#11151F]/80 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 group">
                  <Play className="w-4 h-4 text-[#FFD700] group-hover:scale-110 transition-transform" /> Browse Modules
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-6 text-sm font-bold text-slate-500">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0E14] bg-[#11151F] flex items-center justify-center shadow-lg z-[1] relative overflow-hidden">
                       <ImagePlaceholder text={`User ${i}`} icon={null} className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-xs uppercase tracking-widest mt-1 text-slate-400">Trusted by over 10,000+ Global Achievers</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#008A32]/20 to-[#FFD700]/20 blur-2xl rounded-full opacity-50 z-0"></div>
              <ImagePlaceholder text="Immersive EDOT Platform Dashboard Mockup" icon={LayoutDashboard} className="h-[550px] w-full shadow-2xl relative z-10 border-white/20" />
            </div>

          </div>
        </section>

        {/* 2. PLATFORM INTRODUCTION */}
        <section className="py-24 border-y border-white/5 bg-[#11151F]/40 backdrop-blur-xl relative z-20">
           <div className="max-w-5xl mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8">
               Beyond Standard Education. <br/> A <span className="text-[#FFD700]">Global Catalyst</span> For Success.
             </h2>
             <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
               We eliminate the boundaries between theoretical constraints and real-world application. By synthesizing primary academic principles with deep-tech programming and business dynamics, EDOT engineers a new breed of highly capable, internationally competitive professionals.
             </p>
           </div>
        </section>

        {/* 3. COURSE CATEGORIES */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mx-auto shadow-xl mb-6">
                <span className="text-[10px] font-black text-[#008A32] tracking-[0.2em] uppercase">Core Disciplines</span>
             </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Master The <span className="text-[#FFD700]">Six Pillars</span>.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Social Science", desc: "Understand global dynamics, sociology, and human behavior paradigms.", icon: <Globe /> },
              { title: "Mathematics & Science", desc: "Advanced logic, quantitative physics, and core scientific methodology.", icon: <Zap /> },
              { title: "Programming & Tech", desc: "Software engineering, DevOps, algorithms, and cloud architecture.", icon: <Code /> },
              { title: "Natural Language", desc: "Master complex linguistics, communication arts, and global languages.", icon: <Users /> },
              { title: "Business & Corporate", desc: "Elite entrepreneurship, strategic marketing, and financial execution.", icon: <Award />, premium: true },
              { title: "Personal Development", desc: "High-performance leadership, productivity tracking, and soft skills.", icon: <Shield />, premium: true }
            ].map((cat, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border transition-all duration-500 group ${cat.premium ? 'bg-gradient-to-br from-[#11151F] to-[#0B0E14] border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.05)] hover:border-[#FFD700]/60' : 'bg-[#11151F]/60 backdrop-blur-xl border-white/10 hover:bg-white/5 hover:border-white/20'}`}>
                <div className="flex items-center justify-between mb-8">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${cat.premium ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-white/5 text-[#008A32]'}`}>
                     {cat.icon}
                   </div>
                   {cat.premium && <span className="bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-[#FFD700]/30">Discount Category</span>}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{cat.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KEY FEATURES (Data-driven Dashboard Specs) */}
        <section className="py-32 px-6 bg-[#11151F]/40 border-y border-white/5 relative z-20">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                 
                 <div className="lg:col-span-5 space-y-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Engineered For <br/> <span className="text-[#008A32]">Maximum Velocity.</span></h2>
                    
                    <div className="space-y-8">
                       {[
                         { icon: <LayoutDashboard />, title: "Precision Dashboards", desc: "Role-aware telemetry for students, instructors, and parental oversight." },
                         { icon: <Video />, title: "Immersive Live Sync", desc: "High-definition, low-latency live classes with seamless playback archiving." },
                         { icon: <LineChart />, title: "Algorithmic Tracking", desc: "Automated progress logging, attendance validation, and real-time metrics." }
                       ].map((feat, i) => (
                         <div key={i} className="flex gap-6 group hover:-translate-y-1 transition-transform">
                           <div className="w-14 h-14 rounded-2xl bg-[#008A32]/10 border border-[#008A32]/30 flex items-center justify-center text-[#008A32] shrink-0 group-hover:bg-[#008A32] group-hover:text-[#0B0E14] transition-colors">
                             {feat.icon}
                           </div>
                           <div>
                             <h4 className="text-xl font-black text-white mb-2 tracking-tight">{feat.title}</h4>
                             <p className="text-slate-400 font-medium leading-relaxed text-sm">{feat.desc}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-[#008A32]/10 to-[#FFD700]/10 blur-3xl rounded-full z-0 pointer-events-none"></div>
                    <ImagePlaceholder text="High-Fidelity Dashboard Interface Display" icon={LineChart} className="h-[600px] w-full z-10 border-white/20 shadow-[0_0_80px_rgba(0,138,50,0.1)] relative" />
                 </div>

              </div>
           </div>
        </section>

        {/* 5. TRUST & CREDIBILITY */}
        <section className="py-32 px-6 max-w-7xl mx-auto text-center relative z-20">
           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mx-auto shadow-xl mb-8">
              <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Industry Verification</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-20">Certifications & Acclaim</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
             {[1,2,3,4].map(num => (
               <ImagePlaceholder key={num} text={`Institution Award Standard 0${num}`} icon={Award} className="h-48 border-white/10 hover:border-[#FFD700]/50" />
             ))}
           </div>

           <div className="bg-[#11151F]/80 backdrop-blur-2xl border border-[#008A32]/30 p-12 md:p-16 rounded-[3rem] shadow-[0_0_50px_rgba(0,138,50,0.1)] relative overflow-hidden">
               <div className="text-[#FFD700] mb-8 flex justify-center gap-2">
                 {[...Array(5)].map((_, i) => <Star key={i} className="w-8 h-8 fill-current" />)}
               </div>
               <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed max-w-4xl mx-auto mb-10 tracking-tight">
                 "EDOT is a fundamentally transformative platform. The integration of high-level academic theory with strictly disciplined programming execution has forged a completely new standard for global e-learning."
               </p>
               <div className="flex items-center justify-center gap-6">
                 <ImagePlaceholder text="Portrait" icon={null} className="w-16 h-16 rounded-full border-2 border-white/20" />
                 <div className="text-left">
                   <h4 className="font-black text-white text-lg tracking-tight">Kenenisa Beyan</h4>
                   <p className="text-slate-400 text-xs uppercase tracking-widest font-black">Chief Executive Officer, EDOT</p>
                 </div>
               </div>
           </div>
        </section>

        {/* 6. FEATURED COURSES */}
        <section className="py-32 px-6 bg-[#11151F]/40 border-y border-white/5 relative z-20">
           <div className="max-w-7xl mx-auto">
             
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">Elite Capabilities. <br/><span className="text-[#008A32]">Featured Modules.</span></h2>
                 <p className="text-slate-400 font-medium">Explore the apex of our global curriculum.</p>
               </div>
               <Link to="/courses" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0B0E14] transition-all flex items-center gap-3">
                 View Entire Index <ArrowRight className="w-4 h-4" />
               </Link>
             </div>

             {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-12 h-12 border-4 border-white/10 border-t-[#008A32] rounded-full animate-spin"></div>
                </div>
             ) : featuredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredCourses.map(course => (
                    <div key={course._id} className="bg-[#0B0E14]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#008A32]/30 hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-2">
                       <div className="h-56 relative overflow-hidden border-b border-white/5">
                          {course.thumbnail ? (
                             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-0"/>
                          ) : (
                             <ImagePlaceholder text={`Thumbnail: ${course.title}`} className="h-full w-full rounded-none border-0" />
                          )}
                          <div className="absolute top-4 left-4 bg-[#11151F]/90 backdrop-blur-md border border-[#008A32]/30 text-[#008A32] font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-20">
                            {course.category || 'General'}
                          </div>
                       </div>
                       <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-[#008A32] transition-colors tracking-tight line-clamp-2">{course.title}</h3>
                          <div className="flex items-center gap-4 mb-8 text-xs font-bold text-slate-400">
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FFD700]" /> {(course.lessons?.length || 0) * 15} Min</span>
                             <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#FFD700]" /> {course.lessons?.length || 0} Mods</span>
                          </div>
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                            <span className="font-black text-2xl text-white">ETB {course.price || 'Free'}</span>
                            <Link to={`/course/${course._id}`} className="bg-white/10 border border-white/10 text-white px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#008A32] hover:border-[#008A32] hover:text-[#0B0E14] transition-all">Enroll</Link>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-[#0B0E14]/80 border border-white/5 rounded-[2rem] p-6">
                       <ImagePlaceholder text={`Course Fallback 0${i}`} className="h-48 mb-6" />
                       <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
                       <div className="h-4 bg-white/5 rounded w-full mb-8"></div>
                       <div className="h-10 bg-white/5 rounded-xl w-full"></div>
                    </div>
                  ))}
                </div>
             )}

           </div>
        </section>

        {/* 7. FINAL CTA */}
        <CTA 
          title="Ready To Execute?" 
          description="Do not hesitate. Transform your core understanding into actionable results with EDOT Platform."
          buttonText="Initialize Registration"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}
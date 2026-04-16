import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecentPublicUsers } from '../utils/api';
import { 
  ArrowRight, BookOpen, GraduationCap, Sparkles, Database, Users, 
  BrainCircuit, Rocket, CheckCircle, Video, LayoutDashboard, Target,
  Award, Shield, Star, Play, Clock, Globe, Code, LineChart, Flame, PlayCircle, Percent, Compass,
  Lightbulb, ToggleRight, BarChart, Laptop
} from 'lucide-react';
import CTA from '../components/CTA';
import feature1Img from '../assets/features-1.png';
import feature2Img from '../assets/features-2.png';
import feature3Img from '../assets/features-3.png';
import ctaLeftImg from '../assets/presantetion.jpg';
import ctaRightImg from '../assets/edot-taken-certificates.jpg';
import homePageImg from '../assets/home-page.png';

// Image Placeholders to make the UI look rich in dark mode
const ImagePlaceholder = ({ text, className = "h-64", icon: Icon = BookOpen }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    {Icon && <Icon className="w-8 h-8 mb-3 opacity-50 group-hover:text-[#FFD700] transition-colors duration-300" />}
    <span className="font-black uppercase tracking-widest text-[10px] z-10 px-6 text-center group-hover:text-white transition-colors">[{text}]</span>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState('10k+');

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || avatarPath === 'default-avatar.png') return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getRecentPublicUsers();
      if (data && data.success) {
        setRecentUsers(data.users || []);
        if (data.totalCount > 10000) {
           setTotalUsers('10k+');
        } else if (data.totalCount >= 15) {
           const roundedFloor = Math.floor(data.totalCount / 5) * 5;
           setTotalUsers(`${roundedFloor}+`);
        } else if (data.totalCount > 0) {
           setTotalUsers(data.totalCount.toString());
        }
      }
    };
    fetchUsers();
  }, []);

  // Filter out the current user from recentUsers so we don't display them twice
  const displayUsers = recentUsers.filter(u => u.id !== user?.id);

  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans overflow-x-hidden text-slate-100 relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="relative pt-24 pb-28 md:pt-32 md:pb-36 px-6 overflow-hidden border-b border-white/5">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
             <div className="space-y-8 pr-0 lg:pr-8">
               <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                 Democratizing Quality <br /> Education for <span className="text-white">Ethiopia.</span>
               </h1>
               
               <p className="text-xl text-slate-200 font-medium leading-relaxed max-w-lg">
                 Your complete learning journey in one place. From primary school fundamentals to advanced university careers, EDOT provides the structure to grow.
               </p>
               
               <div className="flex flex-col sm:flex-row w-full max-w-sm sm:max-w-xl gap-4 pt-4 relative z-50">
                 <Link to="/register" className="flex-1 relative px-8 py-4 rounded-[1.1rem] font-black text-[13px] tracking-wider text-center border-b-4 outline-none focus:outline-none transition-all duration-300 ease-in-out active:border-b-0 active:translate-y-[4px] shadow-sm bg-[#1CB0F6] text-white border-[#1899D6] hover:bg-white hover:text-[#1CB0F6] hover:border-[#E5E5E5]">
                   Get started
                 </Link>
                 <Link to="/courses" className="flex-1 relative px-8 py-4 rounded-[1.1rem] font-black text-[13px] tracking-wider text-center border-b-4 outline-none focus:outline-none transition-all duration-300 ease-in-out active:border-b-0 active:translate-y-[4px] shadow-sm bg-white text-[#1CB0F6] border-[#E5E5E5] hover:bg-[#1CB0F6] hover:text-white hover:border-[#1899D6]">
                   Learn more
                 </Link>
               </div>

               <div className="pt-8 flex items-center gap-5 border-t border-white/5 mt-8">
                 <div className="flex -space-x-4 relative z-10">
                   {displayUsers.length > 0 ? (
                     displayUsers.slice(0, 3).map((u, i) => {
                       const colors = ['bg-blue-500/100', 'bg-emerald-500/100', 'bg-rose-500/100'];
                       const zIndexes = ['z-30', 'z-20', 'z-10'];
                       const avatar = getAvatarUrl(u.avatar);
                       return (
                         <div key={u.id || i} className={`w-12 h-12 rounded-full border-2 border-[#11151F] ${colors[i % colors.length]} overflow-hidden flex items-center justify-center shadow-lg shrink-0 relative ${zIndexes[i]}`}>
                           {avatar ? (
                             <img src={avatar} alt={u.name || "User Avatar"} className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-white font-black text-xl">{u.name ? u.name[0].toUpperCase() : 'U'}</span>
                           )}
                         </div>
                       );
                     })
                   ) : (
                     <>
                       <div className="w-12 h-12 rounded-full border-2 border-[#11151F] bg-blue-500/100 overflow-hidden flex items-center justify-center shadow-lg shrink-0 relative z-30"><span className="text-white font-black text-xl">K</span></div>
                       <div className="w-12 h-12 rounded-full border-2 border-[#11151F] bg-emerald-500/100 overflow-hidden flex items-center justify-center shadow-lg shrink-0 relative z-20"><span className="text-white font-black text-xl">N</span></div>
                       <div className="w-12 h-12 rounded-full border-2 border-[#11151F] bg-rose-500/100 overflow-hidden flex items-center justify-center shadow-lg shrink-0 relative z-10"><span className="text-white font-black text-xl">A</span></div>
                     </>
                   )}
                   <div className="w-12 h-12 rounded-full border-2 border-[#11151F] bg-gradient-to-br from-[#008A32] to-[#00A13B] flex items-center justify-center shadow-lg z-0 text-sm font-black text-white shrink-0 relative">
                     {totalUsers}
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <div className="flex items-center gap-1 text-[#FFD700]">
                     {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FFD700]" />)}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest mt-1.5 text-slate-300">Global learners growing daily</span>
                 </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-[3rem] p-0 bg-[#11151F]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,138,50,0.1)] border border-white/10 z-10 overflow-hidden">
                <img src={homePageImg} alt="Young Learners Collaborating with University Students" className="h-auto w-full object-cover rounded-[3rem] shadow-lg border-0" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-12 -left-8 bg-[#11151F]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4 z-20 animate-bounce" style={{animationDuration: '3.5s'}}>
                 <div className="w-12 h-12 rounded-2xl bg-[#008A32]/20 flex items-center justify-center text-[#008A32] border border-[#008A32]/30"><CheckCircle className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-black text-white text-sm uppercase tracking-widest">A+ Grades</h4>
                    <p className="text-[10px] text-slate-200 font-bold uppercase tracking-wider">Primary Success</p>
                 </div>
              </div>

              <div className="absolute bottom-16 -right-8 bg-[#11151F]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4 z-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                 <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] border border-[#FFD700]/30"><Target className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-black text-white text-sm uppercase tracking-widest">Job Ready</h4>
                    <p className="text-[10px] text-slate-200 font-bold uppercase tracking-wider">Career Skills</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INTRO SECTION */}
        <section className="py-24 border-b border-white/5 bg-[#0B0E14] relative z-20 text-center px-6">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8 tracking-tight">
               Designed for every stage of your life.
             </h2>
             <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed">
               EDOT actively supports learners from <span className="text-[#FFD700] font-black border-b border-[#FFD700]/30 px-1 rounded bg-[#FFD700]/10">primary and secondary school</span> to <span className="text-[#008A32] font-black border-b border-[#008A32]/30 px-1 rounded bg-[#008A32]/10">university and professional careers.</span> We combine simple foundations with deep challenges.
             </p>
           </div>
        </section>

        {/* 3. DESIGNED FOR COMPLETE BEGINNERS SECTION */}
        <section className="py-24 px-6 relative z-20 overflow-hidden">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                   Designed for complete beginners ready to make their next big move
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
                 {/* Card 1 */}
                 <div className="bg-[#11151F]/40 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_rgba(0,138,50,0.1)]">
                    <div className="w-12 h-12 mb-6 text-indigo-400">
                       <Lightbulb className="w-full h-full drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Starting Strong</h3>
                    <p className="text-slate-200 leading-relaxed font-medium">Whether you're in primary or secondary school, EDOT helps you build a strong academic foundation. Understand your subjects clearly, improve your performance, and gain the confidence to succeed in your exams and beyond.</p>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-[#11151F]/40 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_rgba(168,85,247,0.1)]">
                    <div className="w-12 h-12 mb-6 text-purple-400 flex items-center justify-center">
                       <div className="w-12 h-6 bg-purple-500/100/20 rounded-full border border-purple-500/30 flex items-center p-1 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                          <div className="w-4 h-4 bg-purple-400 rounded-full ml-auto"></div>
                       </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Growing Further</h3>
                    <p className="text-slate-200 leading-relaxed font-medium">As you move forward in your education, EDOT supports you with structured and deeper learning. From advanced subjects to new areas like technology and communication, you develop clarity, skills, and readiness for university-level challenges.</p>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-[#11151F]/40 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)]">
                    <div className="w-12 h-12 mb-6 text-orange-400">
                       <BarChart className="w-full h-full drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Upskilling for the Future</h3>
                    <p className="text-slate-200 leading-relaxed font-medium">Already have the basics? Take your learning to the next level. Explore programming, business, and personal development to strengthen your skills and prepare for real-world opportunities.</p>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-[#11151F]/40 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)]">
                    <div className="w-12 h-12 mb-6 text-blue-400">
                       <Laptop className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Future Builders</h3>
                    <p className="text-slate-200 leading-relaxed font-medium">Have big goals or ideas for the future? EDOT helps you turn knowledge into action — learn how to think, create, and build solutions that can impact your career, your community, and the world.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 4. LEARNING PATH SECTION */}
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
           <div className="text-center mb-16 animate-in slide-in-from-bottom-5 duration-700">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Start Your Learning Journey <br className="hidden md:block" /> From Foundation to Career</h2>
             <p className="text-lg text-slate-200 font-medium mt-6 max-w-2xl mx-auto">
               Visually guiding you through EDOT’s intelligently structured system, step by step.
             </p>
           </div>
           
           <div className="flex justify-center mb-16 relative z-20">
              <div className="inline-flex items-center gap-3 bg-[#11151F]/80 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-[#008A32]/10 opacity-50"></div>
                 <Compass className="w-5 h-5 shrink-0 text-[#FFD700] relative z-10" />
                 <span className="font-bold text-[11px] md:text-sm tracking-wide relative z-10 text-slate-300">
                   <strong className="text-white">Note:</strong> All learners are welcome to explore any course based on their interest — start where you are and grow at your own pace.
                 </span>
              </div>
           </div>

           <div className="space-y-24">
             {/* 🔰 SECTION 1: FOUNDATION LEARNING */}
             <div className="relative">
                <div className="mb-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#0B0E14] px-4 py-2 border border-white/10 rounded-full mb-3 shadow-md">
                     <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6]">Phase 01</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Foundation Learning</h3>
                  <p className="text-slate-200 font-medium mt-2 text-lg">Build strong academic foundations.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   {/* Card 1 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#F97316]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                            <Globe className="w-10 h-10 md:w-12 md:h-12 text-[#F97316]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#F97316] transition-colors leading-tight">Social Science</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">FREE</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Learn how human societies work from the ground up — histories, geographies, and cultures made simple and practical.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 15 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Users className="w-4 h-4 text-slate-300" /> Beginner Friendly
                               </div>
                               <Link to="/courses" className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F97316] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#EA580C] shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-0">
                                  Start Learning <PlayCircle className="w-4 h-4" />
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Card 2 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#3B82F6]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 text-[#3B82F6]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#3B82F6] transition-colors leading-tight">Mathematics & Natural Science</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#11151F]/10 text-slate-300 border border-white/10">Coming Soon</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Master arithmetic, logical reasoning, and basic physics through visually clear, exciting examples.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 20 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Users className="w-4 h-4 text-slate-300" /> Beginner Friendly
                               </div>
                               <button disabled className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-black text-[10px] uppercase tracking-widest cursor-not-allowed border border-white/5 mt-2 sm:mt-0 flex items-center justify-center gap-2">
                                  Notify Me
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Card 3 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#A855F7]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                            <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-[#A855F7]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#A855F7] transition-colors leading-tight">Natural Language</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20">Most Popular</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Develop strong communication skills by learning fundamental linguistics and clear expression strategies.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 18 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Users className="w-4 h-4 text-slate-300" /> Beginner Friendly
                               </div>
                               <Link to="/courses" className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#A855F7] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#9333EA] shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-0">
                                  Start Learning <PlayCircle className="w-4 h-4"/>
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>


             {/* 🚀 SECTION 2: ADVANCED & CAREER LEARNING */}
             <div className="relative pt-10">
                <div className="mb-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#0B0E14] px-4 py-2 border border-white/10 rounded-full mb-3 shadow-md">
                     <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Phase 02</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Advanced & Career</h3>
                  <p className="text-slate-200 font-medium mt-2 text-lg">Develop skills for university and beyond.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   {/* Card 4 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#6366F1]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                            <Code className="w-10 h-10 md:w-12 md:h-12 text-[#6366F1]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#6366F1] transition-colors leading-tight">Programming & Technology</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#11151F]/10 text-white border border-white/20 flex items-center gap-1"><Flame className="w-3 h-3 text-[#FFD700]"/> Hot Skill</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Learn how websites and applications work from the ground up — dive into algorithms, web frameworks, and cloud systems.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 40 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5 text-amber-500/80">
                                  <Users className="w-4 h-4 opacity-70" /> Intermediate / Advanced
                               </div>
                               <Link to="/courses" className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#6366F1] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#4F46E5] shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-0">
                                  Explore Now <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Card 5 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#FFD700]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                            <LineChart className="w-10 h-10 md:w-12 md:h-12 text-[#FFD700]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#FFD700] transition-colors leading-tight">Business & Entrepreneurship</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/100/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"><Percent className="w-3 h-3"/> Discounted</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Understand markets, financial scaling, and effective leadership tactics to build organizations that last.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 35 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5 text-amber-500/80">
                                  <Users className="w-4 h-4 opacity-70" /> Intermediate / Advanced
                               </div>
                               <Link to="/courses" className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFD700] text-[#0B0E14] font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-0">
                                  Explore Now <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Card 6 */}
                   <div className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 lg:p-8 relative group overflow-hidden transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-2xl hover:border-[#22C55E]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex flex-col md:flex-row gap-6 relative z-10 items-start md:items-center">
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <Target className="w-10 h-10 md:w-12 md:h-12 text-[#22C55E]" />
                         </div>
                         <div className="flex-1 flex flex-col w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-3 sm:gap-0">
                               <h4 className="text-2xl font-black text-white group-hover:text-[#22C55E] transition-colors leading-tight">Personal Development</h4>
                               <span className="w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/100/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"><Percent className="w-3 h-3"/> Discounted</span>
                            </div>
                            <p className="text-slate-200 font-medium mb-6 leading-relaxed max-w-xl text-sm md:text-base">
                               Develop high-value habits, public speaking confidence, and strong decision-making tools for life and career.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5">
                                  <Clock className="w-4 h-4 text-slate-300" /> 12 Hours
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-slate-200 uppercase tracking-widest bg-[#0B0E14] px-4 py-2 rounded-xl border border-white/5 text-amber-500/80">
                                  <Users className="w-4 h-4 opacity-70" /> Intermediate / Advanced
                               </div>
                               <Link to="/courses" className="sm:ml-auto w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#22C55E] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#16A34A] shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-0">
                                  Explore Now <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                               </Link>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 5. ZIG ZAG FEATURES SECTION */}
        <section className="py-32 border-t border-white/5 bg-[#0B0E14] relative z-20 overflow-hidden">
           <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center mb-28 animate-in slide-in-from-bottom-5 duration-700">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                   Finally, a smarter and easier way to learn
                 </h2>
                 <p className="text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
                   Say goodbye to confusing platforms and scattered resources — EDOT brings everything together into one simple, structured learning experience for everyone.
                 </p>
              </div>

              <div className="space-y-32">
                 {/* Row 1 */}
                 <div className="flex flex-col lg:flex-row items-center gap-16 group">
                   <div className="w-full lg:w-1/2 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008A32]/10 text-[#008A32] font-black text-[10px] uppercase tracking-widest border border-[#008A32]/20">01. Click & Learn</div>
                      <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">Start your journey with <br/> just a few clicks</h3>
                      <p className="text-lg text-slate-200 leading-relaxed font-medium">Say goodbye to confusing platforms and scattered resources — EDOT brings everything together into one simple, structured learning experience for everyone.</p>
                   </div>
                   <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#008A32]/20 to-transparent rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 lg:p-14 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                         <img src={feature1Img} alt="Start your journey" className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl rounded-[1.5rem]" />
                      </div>
                   </div>
                 </div>

                 {/* Row 2 */}
                 <div className="flex flex-col lg:flex-row-reverse items-center gap-16 group">
                   <div className="w-full lg:w-1/2 space-y-6 lg:pl-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700]/10 text-[#FFD700] font-black text-[10px] uppercase tracking-widest border border-[#FFD700]/20">02. Paced Growth</div>
                      <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">Learn step by step — <br/> at your own pace</h3>
                      <p className="text-lg text-slate-200 leading-relaxed font-medium">No more guessing what to study next. Our courses are clearly organized to guide you from basic subjects to advanced skills. Learn anywhere, anytime — whether you're a school student or a university learner, EDOT adapts to your level and goals.</p>
                   </div>
                   <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 lg:p-14 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                         <img src={feature2Img} alt="Learn step by step" className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl rounded-[1.5rem]" />
                      </div>
                   </div>
                 </div>

                 {/* Row 3 */}
                 <div className="flex flex-col lg:flex-row items-center gap-16 group">
                   <div className="w-full lg:w-1/2 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 font-black text-[10px] uppercase tracking-widest border border-orange-500/20">03. Achieve Opportunities</div>
                      <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">Turn learning into <br/> real success</h3>
                      <p className="text-lg text-slate-200 leading-relaxed font-medium">Gain practical skills in technology, business, and personal development — and prepare yourself for real-world opportunities.</p>
                      
                      <div className="pt-4 border-t border-white/10 mt-6">
                         <p className="text-[#FFD700] font-black text-xl tracking-tight">Your future starts with one decision.</p>
                      </div>
                   </div>
                   <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 lg:p-14 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                         <img src={feature3Img} alt="Turn learning into success" className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl rounded-[1.5rem]" />
                      </div>
                   </div>
                 </div>

              </div>
           </div>
        </section>

        {/* 6. FINAL CTA BLOCK */}
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
           <div className="bg-gradient-to-br from-[#1b1e24] to-[#121418] border border-white/5 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
              
              <div className="hidden lg:block w-56 h-56 relative z-10 shrink-0">
                 <div className="w-full h-full rounded-full border-[8px] border-[#0d0f13] shadow-2xl overflow-hidden">
                    <img src={ctaLeftImg} alt="Students" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
                 </div>
              </div>

              <div className="flex-1 text-center relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/20 text-[#FFD700] font-black text-[9px] tracking-[0.15em] uppercase mb-6 shadow-md bg-black/40">
                    <Sparkles className="w-3 h-3" /> UNLOCK YOUR POTENTIAL
                 </div>
                 
                 <h2 className="text-4xl md:text-[3.25rem] font-black text-white leading-[1.1] mb-8 tracking-tight">
                    Your future <br/>starts <span className="text-[#008A32]">here.</span>
                 </h2>

                 <div className="flex flex-col sm:flex-row w-full max-w-sm sm:max-w-xl mx-auto gap-4 pt-2">
                 <Link to="/register" className="flex-1 relative px-8 py-4 rounded-[1.1rem] font-black text-[13px] tracking-wider text-center border-b-4 outline-none focus:outline-none transition-all duration-300 ease-in-out active:border-b-0 active:translate-y-[4px] shadow-sm bg-[#1CB0F6] text-white border-[#1899D6] hover:bg-white hover:text-[#1CB0F6] hover:border-[#E5E5E5]">
                   Get started
                 </Link>
                 <Link to="/courses" className="flex-1 relative px-8 py-4 rounded-[1.1rem] font-black text-[13px] tracking-wider text-center border-b-4 outline-none focus:outline-none transition-all duration-300 ease-in-out active:border-b-0 active:translate-y-[4px] shadow-sm bg-white text-[#1CB0F6] border-[#E5E5E5] hover:bg-[#1CB0F6] hover:text-white hover:border-[#1899D6]">
                   Learn more
                 </Link>
                 </div>
              </div>

              <div className="hidden lg:block w-56 h-56 relative z-10 shrink-0">
                 <div className="w-full h-full rounded-full border-[8px] border-[#0d0f13] shadow-2xl overflow-hidden">
                    <img src={ctaRightImg} alt="Professionals" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
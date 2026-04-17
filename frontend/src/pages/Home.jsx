import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecentPublicUsers } from '../utils/api';
import { 
  ArrowRight, BookOpen, GraduationCap, Sparkles, Database, Users, 
  BrainCircuit, Rocket, CheckCircle, Video, LayoutDashboard, Target,
  Award, Shield, Star, Play, Clock, Globe, Code, LineChart, Flame, PlayCircle, Percent,
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
              <div className="text-center mb-12">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                   Designed for complete beginners ready to make their next big move
                 </h2>
                 <p className="text-slate-300 mt-4 max-w-3xl mx-auto text-lg font-medium">
                   EDOT keeps your first steps simple with clear paths, friendly lessons, and helpful guidance.
                 </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {[{
                    title: 'Starting Strong',
                    icon: Lightbulb,
                    color: 'text-[#22C55E]',
                    description: 'Build a strong academic foundation with clear concepts and simple support.'
                 },{
                    title: 'Growing Further',
                    icon: Sparkles,
                    color: 'text-[#6366F1]',
                    description: 'Move forward at your pace with lessons that stay easy to follow.'
                 },{
                    title: 'Upskilling for the Future',
                    icon: BarChart,
                    color: 'text-[#F97316]',
                    description: 'Develop practical skills for tech, business, and real-world challenges.'
                 },{
                    title: 'Future Builders',
                    icon: Laptop,
                    color: 'text-[#38BDF8]',
                    description: 'Turn learning into action and prepare for your next academic or career step.'
                 }].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="bg-[#11151F]/80 border border-white/10 rounded-[2rem] p-8 shadow-sm hover:border-white/20 transition-all duration-300">
                         <div className={`w-14 h-14 rounded-3xl bg-[#0B0E14] flex items-center justify-center mb-6 ${item.color}`}>
                            <Icon className="w-7 h-7" />
                         </div>
                         <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                         <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    );
                 })}
              </div>
           </div>
        </section>

        {/* 4. LEARNING PATH SECTION */}
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
           <div className="text-center mb-12">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Start Your Learning Journey from Foundation to Career</h2>
             <p className="text-lg text-slate-300 mt-4 max-w-2xl mx-auto">EDOT guides your progress with simple phases so you always know what to do next.</p>
           </div>

           <div className="grid gap-6 md:grid-cols-3">
             {[{
                step: '01',
                title: 'Choose your path',
                description: 'Pick the subject or skill you want to learn and begin with the right starting point.'
             },{
                step: '02',
                title: 'Follow the steps',
                description: 'Use clear, bite-sized lessons and easy progress markers to keep moving forward.'
             },{
                step: '03',
                title: 'Build real skills',
                description: 'Complete projects, earn certificates, and prepare for the next stage of your learning journey.'
             }].map((item, idx) => (
               <div key={idx} className="bg-[#11151F]/80 border border-white/10 rounded-[2rem] p-8 shadow-sm hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#008A32]/10 text-[#008A32] font-black mb-5">{item.step}</div>
                  <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.description}</p>
               </div>
             ))}
           </div>
        </section>

        {/* 5. FEATURES SECTION */}
        <section className="py-32 border-t border-white/5 bg-[#0B0E14] relative z-20 overflow-hidden">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                   A smarter, simpler way to learn
                 </h2>
                 <p className="text-lg text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
                   EDOT removes complexity so you can focus on learning, practicing, and growing.
                 </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                 {[{
                    title: 'Click & Learn',
                    description: 'Find the right course quickly and start learning in minutes.',
                    badge: '01',
                    color: 'bg-[#008A32]/10 text-[#008A32]'
                 },{
                    title: 'Step-by-step Progress',
                    description: 'Follow clear lessons and actions that keep your learning simple.',
                    badge: '02',
                    color: 'bg-[#FFD700]/10 text-[#FFD700]'
                 },{
                    title: 'Real Success',
                    description: 'Build useful skills and complete learning milestones with confidence.',
                    badge: '03',
                    color: 'bg-orange-500/10 text-orange-400'
                 }].map((item, idx) => (
                    <div key={idx} className="bg-[#11151F]/80 border border-white/10 rounded-[2rem] p-8 shadow-sm hover:border-white/20 transition-all duration-300">
                       <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-5 font-black text-sm ${item.color}`}>
                          {item.badge}
                       </div>
                       <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                       <p className="text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                 ))}
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
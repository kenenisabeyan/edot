import React from 'react';
import { CheckCircle, Globe, Award, Shield, Zap, TrendingUp, Users, Target, BookOpen, Key } from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-64", icon: Icon = Award }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    {Icon && <Icon className="w-8 h-8 mb-3 opacity-50 group-hover:text-[#FFD700] transition-colors duration-500" />}
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto px-6 pt-24 mb-32 relative">
           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
              <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">The EDOT Infrastructure</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">EDOT Platform.</span>
           </h1>
           <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
             We are an internationally scalable, hybrid education ecosystem. We dismantle the barriers between academic theory and high-performance corporate execution.
           </p>
        </section>

        {/* 2. OUR STORY (Problem -> Solution -> Vision) */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
          <div className="bg-[#11151F]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008A32]/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">The Origin <span className="text-[#008A32]">Code.</span></h2>
                  
                  <div className="space-y-8">
                     <div>
                        <h4 className="text-[#FFD700] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-4 h-4" /> The Problem</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          Global education is fragmented. Students are fed theoretical fluff without industry context, while professionals struggle to find actionable, structured upskilling networks. The gap between "knowing" and "executing" was massive.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-[#008A32] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Key className="w-4 h-4" /> The Solution</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          We engineered a unified data-dashboard and LMS. EDOT combines primary academia (Natural sciences, Social sciences) with hardcore technical skills (Programming, Business strategy), serving it in a high-fidelity environment.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-white" /> The Vision</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          To become the bedrock of intellectual capital. We are scaling a digital society where absolute beginners and elite practitioners operate on the same rigorous standards of excellence.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="h-full min-h-[400px]">
                  <ImagePlaceholder text="Early Startup Boarding / Blueprint Sketches" icon={TrendingUp} className="h-full w-full border-white/10 rounded-3xl" />
               </div>
            </div>
          </div>
        </section>

        {/* 3. MISSION & VISION */}
        <section className="mb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
           <div className="bg-[#0B0E14] border border-[#008A32]/30 rounded-[2.5rem] p-12 hover:shadow-[0_0_40px_rgba(0,138,50,0.15)] transition-shadow">
              <Zap className="w-12 h-12 text-[#008A32] mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">Our Mission</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                 To architect the world’s most accessible and rigorous educational hub. We provide students, professionals, and instructors with algorithmic telemetry, live synchronization, and verifiable credentials.
              </p>
           </div>
           
           <div className="bg-[#0B0E14] border border-[#FFD700]/30 rounded-[2.5rem] p-12 hover:shadow-[0_0_40px_rgba(255,215,0,0.1)] transition-shadow">
              <Globe className="w-12 h-12 text-[#FFD700] mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">Our Vision</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                 To fundamentally decentralize professional readiness. By integrating real-world corporate demands directly into our curriculum paths, ensuring our global learners are Day-One ready for industry challenges.
              </p>
           </div>
        </section>

        {/* 4. OUR TEAM */}
        <section className="py-32 max-w-7xl mx-auto px-6 relative z-20 border-t border-white/5">
           <div className="text-center mb-16">
             <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mx-auto mb-6">
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">The Architects</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Executive Board</h2>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { name: 'Kenenisa Beyan', role: 'Chief Executive Officer', desc: 'Platform architect and strategic visionary expanding global relations.' },
               { name: 'Firomsa Guteta', role: 'Lead Developer', desc: 'Core systems orchestration, database engineering, and deployment.' },
               { name: 'Bethelhem Yehuala', role: 'Academic Director', desc: 'Strict curriculum curation, instructor vetting, and compliance.' },
               { name: 'Yobsan Girma', role: 'Financial Controller', desc: 'Enterprise scaling, infrastructure finance, and strategic growth.' }
             ].map((member, i) => (
               <div key={i} className="bg-[#11151F]/40 border border-white/10 rounded-[2rem] overflow-hidden text-center group transition-all duration-300 hover:border-white/30 hover:-translate-y-2 hover:bg-[#11151F]">
                 <div className="h-64 relative overflow-hidden border-b border-white/5">
                    <ImagePlaceholder text={`Photo: ${member.name}`} icon={Users} className="h-full w-full rounded-none border-0" />
                 </div>
                 <div className="p-8">
                   <h4 className="font-black text-xl text-white mb-2 tracking-tight">{member.name}</h4>
                   <div className="bg-[#008A32]/10 text-[#008A32] px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-md inline-block mb-4 border border-[#008A32]/20">
                     {member.role}
                   </div>
                   <p className="text-slate-400 font-medium text-sm leading-relaxed">{member.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* 5. ACHIEVEMENTS & RECOGNITION (Gallery) */}
        <section className="py-24 bg-[#11151F]/60 border-y border-white/5 relative z-20">
           <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Institutional Achievements</h2>
               <p className="text-slate-400 font-medium mt-4">Officially audited and validated by global industry standards.</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  "ISO Security Compliance",
                  "Top E-Learning Startup 2026",
                  "Global Academic Council Cert",
                  "Data Privacy Guarantee",
                  "Enterprise Partner Program",
                  "Best UI/UX Infrastructure",
                  "Platform Scalability Award",
                  "Verified Instructional Standard"
                ].map((cert, i) => (
                  <div key={i} className="group cursor-pointer">
                     <ImagePlaceholder text={cert} icon={Award} className="h-40 rounded-[1.5rem] border border-white/5 group-hover:border-[#FFD700]/40 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all" />
                  </div>
                ))}
             </div>
           </div>
        </section>

        {/* 6. WHY CHOOSE EDOT */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">The EDOT <span className="text-[#008A32]">Advantage.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: <Shield />, title: "Bank-Grade Infrastructure", desc: "Your data is secured through zero-trust architectures and continuous cryptographic hashing protocols." },
               { icon: <BookOpen />, title: "Vetted Curriculum", desc: "No filler content. Every module undergoes severe academic scrutiny before it reaches your dashboard." },
               { icon: <Users />, title: "Elite Network", desc: "Operate alongside verified global instructors and motivated peers. EDOT is a professional collective." }
             ].map((adv, i) => (
               <div key={i} className="bg-[#11151F]/40 backdrop-blur-xl border border-[#008A32]/20 rounded-[2.5rem] p-10 hover:bg-[#11151F] transition-colors relative overflow-hidden group">
                  <div className="w-16 h-16 rounded-2xl bg-[#008A32]/10 text-[#008A32] flex items-center justify-center mb-8 border border-[#008A32]/20 group-hover:scale-110 transition-transform">
                     {adv.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{adv.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{adv.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <CTA 
          title="Ready To Architect Your Intellect?" 
          description="Join the fastest scaling educational infrastructure. Register an enterprise or individual account securely today."
          buttonText="Access The Platform"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle, Globe, Award, Shield, Zap, TrendingUp, Users, Target, BookOpen, Key } from 'lucide-react';
import CTA from '../components/CTA';

import kenoImg from '../assets/keno.jpg';
import firoImg from '../assets/firo.jpg';
import bettyImg from '../assets/betty.jpg';
import yobsanImg from '../assets/yobsan.jpg';

const ImagePlaceholder = ({ text, className = "h-64", icon: Icon = Award }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    {Icon && <Icon className="w-8 h-8 mb-3 opacity-50 group-hover:text-[#FFD700] transition-colors duration-500" />}
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
  </div>
);

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans overflow-x-hidden text-slate-100 relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      <div className="relative z-10 pt-20">

        {/* 1. HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto px-6 pt-24 mb-32 relative">
           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
              <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">The EDOT Infrastructure</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
              Building the Future <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">of Learning.</span>
           </h1>
           <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto">
             EDOT is not just a platform — it is a continuous learning journey from your first day of school to the peak of your professional career.
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
                          We noticed deeply disconnected education systems. Students learn theory without practical context, and professionals struggle to find a continuum of learning.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-[#008A32] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Key className="w-4 h-4" /> The Solution</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          We built one unified platform. EDOT bridges the gap by hosting everything from primary education basics to advanced industry certifications under one roof.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-white" /> The Vision</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          To radically evolve and become the central global platform connecting and empowering all levels of learners, from day one to retirement.
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
                 To make world-class education fully accessible, highly structured, and immediately practical for learners in every corner of the globe.
              </p>
           </div>
           
           <div className="bg-[#0B0E14] border border-[#FFD700]/30 rounded-[2.5rem] p-12 hover:shadow-[0_0_40px_rgba(255,215,0,0.1)] transition-shadow">
              <Globe className="w-12 h-12 text-[#FFD700] mb-6" />
              <h3 className="text-3xl font-black text-white mb-4">Our Vision</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                 To radically evolve and become the central global platform connecting and empowering all levels of learners, from day one to retirement.
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
               { name: 'Kenenisa Beyan', role: 'Chief Executive Officer', desc: 'Platform architect and strategic visionary expanding global relations.', image: kenoImg },
               { name: 'Firomsa Guteta', role: 'Lead Developer', desc: 'Core systems orchestration, database engineering, and deployment.', image: firoImg },
               { name: 'Bethelhem Yehuala', role: 'Academic Director', desc: 'Strict curriculum curation, instructor vetting, and compliance.', image: bettyImg },
               { name: 'Yobsan Girma', role: 'Financial Controller', desc: 'Enterprise scaling, infrastructure finance, and strategic growth.', image: yobsanImg }
             ].map((member, i) => (
               <div key={i} className="bg-[#11151F]/40 border border-white/10 rounded-[2rem] overflow-hidden text-center group transition-all duration-300 hover:border-white/30 hover:-translate-y-2 hover:bg-[#11151F]">
                 <div className="h-64 relative overflow-hidden border-b border-white/5">
                    {member.image ? (
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                        <ImagePlaceholder text={`Photo: ${member.name}`} icon={Users} className="h-full w-full rounded-none border-0" />
                    )}
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

        {/* 4.5 EDOT PLATFORM BIO */}
        <section className="py-24 px-6 max-w-5xl mx-auto relative z-20">
           <div className="bg-gradient-to-br from-[#11151F]/80 to-[#0B0E14] border border-[#FFD700]/20 rounded-[3rem] p-12 md:p-16 text-center shadow-[0_0_30px_rgba(255,215,0,0.05)] relative overflow-hidden group hover:border-[#FFD700]/40 transition-all">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#008A32]/10 rounded-full blur-[80px]"></div>
              
              <Globe className="w-12 h-12 text-[#FFD700] mb-8 mx-auto opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">The EDOT Ecosystem</h3>
              <p className="text-slate-300 font-medium leading-[2] text-lg md:text-xl italic">
                "EDOT is not simply a platform — it is a continuous learning journey connecting your first day of school to the peak of your professional career. We noticed deeply disconnected education systems and solved it by building one unified architecture. From primary knowledge to global enterprise execution, our mission is to make world-class education radically accessible, structured, and immediately practical for learners everywhere."
              </p>
              <div className="mt-10 pt-8 border-t border-white/5 mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
                 <div className="w-24 h-24 shrink-0">
                    <img src={kenoImg} alt="Kenenisa Beyan" className="w-full h-full rounded-full border-2 border-[#008A32]/50 shadow-[0_0_20px_rgba(0,138,50,0.2)] object-cover" />
                 </div>
                 <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black text-white tracking-tight">Kenenisa Beyan</h4>
                    <p className="text-[#008A32] font-bold text-[10px] uppercase tracking-widest mt-2 border border-[#008A32]/20 bg-[#008A32]/10 px-3 py-1 rounded inline-block">Chief Executive Officer</p>
                 </div>
              </div>
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

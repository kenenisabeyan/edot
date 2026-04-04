import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Users, BookOpen, ChevronRight, CheckCircle, Globe } from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-64" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Image: {text} ]</span>
  </div>
);

export default function About() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, instructors: 0 });

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 100;
      setCounts({
        students: Math.min(start, 50000),
        courses: Math.min(Math.floor(start / 100), 250),
        instructors: Math.min(Math.floor(start / 150), 120)
      });
      if (start >= 50000) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-32 pb-20">

        {/* HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto px-6 mb-24 relative">
           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-[#FFD700]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
              <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">Redefining Education globally</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
              About The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#00c94b]">EDOT Ecosystem</span>
           </h1>
           <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
             EDOT (Education Digital Online Tutorials) is a cutting-edge hybrid infrastructure bridging the gap between rigorous academic requirements and modern technical execution.
           </p>
        </section>

        {/* PLATFORM METRICS */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users />, count: `${counts.students}+`, label: "Global Learners" },
              { icon: <BookOpen />, count: `${counts.courses}+`, label: "Certified Programs" },
              { icon: <Target />, count: `${counts.instructors}+`, label: "Subject Authorities" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#11151F]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 text-center flex flex-col items-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-[#008A32]">
                  {stat.icon}
                </div>
                <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.count}</h3>
                <p className="font-bold text-slate-500 uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* THE MISSION & VISION */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <ImagePlaceholder text="Platform Interface & Analytics Mockup" className="h-[500px]" />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Our Mission & Vision
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                At EDOT, our mission is to provide world-class, uncompromised access to high-value education. Whether a student is mastering primary mathematics or an adult professional is delving into cloud architecture, our platform provides a scalable, secure, and user-centric experience.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Unifying fragmented learning paths into one secure dashboard.",
                  "Connecting elite instructors with eager learners globally.",
                  "Enabling parental transparency for younger students.",
                  "Providing verifiable, industry-recognized certificates."
                ].map((point, i) => (
                  <li key={i} className="flex gap-4 items-center bg-[#11151F] border border-white/5 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-[#FFD700] shrink-0" />
                    <span className="text-white font-bold text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* TEAM / LEADERSHIP */}
        <section className="pb-32 max-w-7xl mx-auto px-6 relative z-20">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Executive Leadership</h2>
             <p className="text-slate-400 font-medium mt-4">The visionaries driving the EDOT infrastructure.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { name: 'Kenenisa Beyan', role: 'CEO & Founder', desc: 'Platform architect and strategic visionary.' },
               { name: 'Firomsa Guteta', role: 'Lead Developer', desc: 'Core systems orchestration and deployment.' },
               { name: 'Bethelhem Yehuala', role: 'Academic Director', desc: 'Curriculum curation and academic standards.' },
               { name: 'Yobsan Girma', role: 'Financial Controller', desc: 'Enterprise scaling and infrastructure finance.' }
             ].map((member, i) => (
               <div key={i} className="bg-[#11151F]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden text-center group transition-all duration-300 hover:bg-white/5 hover:-translate-y-2">
                 <div className="h-64 relative overflow-hidden bg-[#0B0E14] border-b border-white/5 p-4">
                    <ImagePlaceholder text={`Photo: ${member.name}`} className="h-full w-full rounded-xl" />
                 </div>
                 <div className="p-8">
                   <h4 className="font-black text-xl text-white mb-2">{member.name}</h4>
                   <div className="bg-[#008A32]/10 text-[#008A32] px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-full inline-block mb-4 border border-[#008A32]/20">
                     {member.role}
                   </div>
                   <p className="text-slate-400 font-medium text-sm leading-relaxed">{member.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* AWARDS & RECOGNITION */}
        <section className="py-20 bg-[#11151F]/40 border-y border-white/5">
           <div className="max-w-7xl mx-auto px-6 text-center">
             <h2 className="text-3xl font-black text-white mb-12">Global Certifications & Awards</h2>
             <div className="flex flex-wrap justify-center gap-8">
               {[1,2,3,4].map(num => (
                 <ImagePlaceholder key={num} text={`Award Badge ${num}`} className="h-32 w-48 bg-transparent border-white/20" />
               ))}
             </div>
           </div>
        </section>

        <CTA 
          title="Elevate Your Organization" 
          description="Bring EDOT's elite education infrastructure to your school or corporate campus."
          buttonText="Partner With Us"
          buttonLink="/contact"
        />

      </div>
    </div>
  );
}

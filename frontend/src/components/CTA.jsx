import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA({ 
  title = "Ready to redefine your potential?", 
  description = "Join thousands of learners and elite instructors on the EDOT Platform today. Fast, secure, and built for your success.",
  buttonText = "Create Your Free Account",
  buttonLink = "/register"
}) {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative z-20">
      <div className="bg-gradient-to-br from-[#0B0E14] to-[#11151F] border border-[#008A32]/30 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_80px_rgba(0,138,50,0.15)] relative overflow-hidden group">
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#008A32]/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors duration-1000"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#008A32]/20 transition-colors duration-1000"></div>
        
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter relative z-10">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 relative z-10">
          {description}
        </p>

        <Link to={buttonLink} className="inline-flex items-center justify-center gap-3 px-12 py-6 rounded-2xl bg-[#008A32] text-[#0B0E14] font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(0,138,50,0.4)] hover:shadow-[0_0_50px_rgba(0,138,50,0.6)] hover:bg-[#00a33b] hover:-translate-y-1 transition-all relative z-10">
          {buttonText} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

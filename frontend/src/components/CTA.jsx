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
      <div className="bg-[#11151F]/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
        
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tight relative z-10">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 relative z-10">
          {description}
        </p>

        <Link to={buttonLink} className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[#008A32] text-white font-black uppercase tracking-widest text-xs hover:bg-[#007028] shadow-[0_0_25px_rgba(0,138,50,0.3)] transition-all hover:-translate-y-1 relative z-10">
          {buttonText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Linkedin, Github, Send, GraduationCap, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] border-t border-white/10 text-slate-400 font-sans mt-auto relative overflow-hidden" role="contentinfo">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008A32]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* 1. BRAND SECTION & CONTACT */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
               <div className="w-10 h-10 bg-[#008A32]/10 border border-[#008A32]/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,138,50,0.1)]">
                  <GraduationCap className="w-6 h-6 text-[#008A32]" />
               </div>
               <span className="font-black tracking-widest text-white text-2xl uppercase group-hover:text-[#FFD700] transition-colors">EDOT</span>
            </Link>
            
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
              A continuous learning journey bridging foundational education with advanced professional execution. Welcome to the ultimate enterprise ecosystem.
            </p>

            <div className="flex flex-col gap-5">
               <a href="mailto:support@edot.platform" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group">
                 <div className="w-10 h-10 rounded-full bg-[#11151F] border border-white/5 flex items-center justify-center group-hover:bg-[#FFD700]/10 group-hover:text-[#FFD700] transition-all">
                   <Mail className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-bold tracking-widest uppercase">support@edot.platform</span>
               </a>
               <a href="tel:+251900123456" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group">
                 <div className="w-10 h-10 rounded-full bg-[#11151F] border border-white/5 flex items-center justify-center group-hover:bg-[#008A32]/10 group-hover:text-[#008A32] transition-all">
                   <Phone className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-bold tracking-widest uppercase">+251 (0) 900 123 456</span>
               </a>
               <div className="flex items-center gap-4 text-slate-400 group">
                 <div className="w-10 h-10 rounded-full bg-[#11151F] border border-white/5 flex items-center justify-center">
                   <MapPin className="w-4 h-4 text-slate-500" />
                 </div>
                 <span className="text-xs font-bold tracking-widest uppercase">Adama Campus</span>
               </div>
            </div>
          </div>

          {/* 2. FOUNDATION LEARNING */}
          <div className="lg:col-span-2">
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#008A32]"></span> Foundation</h4>
             <ul className="space-y-4">
                <li><Link to="/courses?cat=SocialScience" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#008A32] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Social Science</Link></li>
                <li><Link to="/courses?cat=MathScience" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#008A32] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Math & Science</Link></li>
                <li><Link to="/courses?cat=NaturalLanguage" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#008A32] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Language Arts</Link></li>
             </ul>
          </div>

          {/* 3. ADVANCED LEARNING */}
          <div className="lg:col-span-2">
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FFD700]"></span> Advanced</h4>
             <ul className="space-y-4">
                <li><Link to="/courses?cat=Programming" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#FFD700] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Programming</Link></li>
                <li><Link to="/courses?cat=Business" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#FFD700] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Business</Link></li>
                <li><Link to="/courses?cat=PersonalDev" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 text-[#FFD700] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"/> Personal Dev</Link></li>
             </ul>
          </div>

          {/* 4. PLATFORM */}
          <div className="lg:col-span-2">
             <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Platform</h4>
             <ul className="space-y-4">
                <li><Link to="/about" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors block">About EDOT</Link></li>
                <li><Link to="/courses" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors block">Full Catalog</Link></li>
                <li><Link to="/register" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors block">Join Platform</Link></li>
                <li><Link to="/register?role=instructor" className="text-[#008A32] text-[10px] font-black uppercase tracking-widest border border-[#008A32]/20 bg-[#008A32]/10 px-2 py-1 rounded inline-block hover:bg-[#008A32] hover:text-white transition-colors">Teach With Us</Link></li>
             </ul>
          </div>

          {/* 5. SUPPORT */}
          <div className="lg:col-span-2">
             <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Support</h4>
             <ul className="space-y-4">
                <li><Link to="/contact" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors block">Contact Us</Link></li>
                <li><Link to="/contact" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors block">FAQ</Link></li>
                <li><Link to="/privacy" className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors block">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors block">Terms of Service</Link></li>
             </ul>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left text-slate-600 text-xs font-black uppercase tracking-widest">
             &copy; {new Date().getFullYear()} EDOT Platform. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4 bg-[#11151F] border border-white/5 rounded-full p-1.5">
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#0A66C2] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#333] transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Telegram" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#229ED9] transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

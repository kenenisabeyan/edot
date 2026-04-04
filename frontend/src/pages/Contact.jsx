import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Headphones, Building } from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-48" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Action Image: {text} ]</span>
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoadingSubmit(false);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20 max-w-3xl mx-auto px-6 pt-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <span className="text-[10px] font-black text-[#008A32] tracking-[0.2em] uppercase">Global Operations</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
            EDOT <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">COMMUNICATIONS HUB.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            Require enterprise access, vast school implementations, or direct technical assistance? Our global support architects are ready to accelerate your implementation immediately.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="bg-[#11151F]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-start hover:border-[#FFD700]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center mb-6 shadow-inner">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-3">Enterprise Sales Operations</h3>
              <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">Partnering for bulk school admissions, university curriculum syncing, or advanced corporate professional training packages.</p>
              <div className="font-black text-white uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 inline-block pointer-events-none">sales@edot.platform</div>
            </div>

            <div className="bg-[#11151F]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-start hover:border-[#008A32]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#008A32]/10 border border-[#008A32]/20 text-[#008A32] flex items-center justify-center mb-6 shadow-inner">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-3">Direct Technical Support</h3>
              <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">High-priority platform bug reporting, official certification verification, and immediate localized account assistance.</p>
              <div className="font-black text-white uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 inline-block pointer-events-none">support@edot.platform</div>
            </div>

            <div className="bg-[#0B0E14] px-8 py-8 border-l-4 border-[#FFD700] rounded-r-[2rem] shadow-lg">
               <h4 className="text-white font-black uppercase text-xs mb-4 tracking-[0.2em]">Primary Infrastructure HQ</h4>
               <p className="text-slate-400 font-medium text-sm flex items-center gap-3"><MapPin className="w-5 h-5 text-[#008A32]" /> Adama Science & Tech Campus, Ethiopia</p>
               <p className="text-slate-400 font-medium text-sm flex items-center gap-3 mt-4"><Phone className="w-5 h-5 text-[#008A32]" /> +251 Global Dispatch Line</p>
            </div>

          </div>

          {/* Secure Form Tracker */}
          <div className="lg:col-span-7">
            <div className="bg-[#11151F]/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#008A32]/20 rounded-full blur-[80px] pointer-events-none"></div>
               
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-32 relative z-10">
                  <div className="w-24 h-24 bg-[#008A32]/10 border border-[#008A32]/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,138,50,0.2)]">
                    <CheckCircle className="w-12 h-12 text-[#008A32]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">Transmission Success</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Ticket initialized in EDOT systems. Authorities will review your dispatch momentarily.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="mb-10 border-b border-white/5 pb-8">
                     <h2 className="text-3xl font-black text-white tracking-tight mb-2">Initialize Dispatch Channel</h2>
                     <p className="text-slate-400 text-sm font-medium">Use this secure gateway to dispatch an encrypted message directly to EDOT administrators.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Identity / Subject Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="Authorized Name"
                        className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Secure Return Email</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="Secure Origin Email"
                        className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Transmission Focus</label>
                    <input 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})} 
                      required 
                      placeholder="e.g., Enterprise Node Installation / Curriculum Integration"
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Dispatch Encrypted Contents</label>
                    <textarea 
                      rows="6" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="Outline your technical requirements or system issues here..."
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner resize-y"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className="w-full bg-gradient-to-r from-[#008A32] to-[#006e28] text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,138,50,0.3)] hover:shadow-[0_0_40px_rgba(0,138,50,0.5)] transform hover:-translate-y-1"
                  >
                    {loadingSubmit ? (
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loadingSubmit ? 'Initializing...' : 'Transmit Intel'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
        
        <CTA 
          title="Bypass Protocols." 
          description="You do not need authorization to begin learning. Create an account instantly."
          buttonText="Self-Deploy Account"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}
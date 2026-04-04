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

      <div className="relative z-10 pt-32 pb-32">
        
        {/* Header Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <span className="text-[10px] font-black text-[#008A32] tracking-[0.2em] uppercase">Enterprise & Support Operations</span>
          </div>

          <h1 className="text-5xl md:text-[5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
            EDOT <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">COMMUNICATIONS HUB</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            Need enterprise access, school implementations, or technical assistance? Our global support architects are ready to accelerate your implementation.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Information & Specific Operations */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="bg-[#11151F]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-start hover:border-[#FFD700]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center mb-6 shadow-inner">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-3">Enterprise Sales</h3>
              <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">Partnering for bulk school admissions, university curriculum syncing, or corporate professional training packages.</p>
              <div className="font-black text-white uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 inline-block">sales@edot.platform</div>
            </div>

            <div className="bg-[#11151F]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-start hover:border-[#008A32]/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-[#008A32]/10 border border-[#008A32]/20 text-[#008A32] flex items-center justify-center mb-6 shadow-inner">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-3">Technical Support</h3>
              <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">Platform bugs, certification verification, or immediate account assistance.</p>
              <div className="font-black text-white uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 inline-block">support@edot.platform</div>
            </div>

            <div className="px-4 py-6 border-l-4 border-[#FFD700]">
               <h4 className="text-white font-black uppercase text-sm mb-2">Primary Infrastructure HQ:</h4>
               <p className="text-slate-400 font-medium text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-[#008A32]"/> Adama Science & Tech Campus, Ethiopia</p>
               <p className="text-slate-400 font-medium text-sm flex items-center gap-2 mt-2"><Phone className="w-4 h-4 text-[#008A32]"/> +251 Global Dispatch Number</p>
            </div>

          </div>

          {/* Secure Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-[#11151F] to-[#0B0E14] backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#008A32]/10 rounded-full blur-[80px] pointer-events-none"></div>
               
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-32 relative z-10">
                  <div className="w-24 h-24 bg-[#008A32]/10 border border-[#008A32]/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,138,50,0.2)]">
                    <CheckCircle className="w-12 h-12 text-[#008A32]" />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4">Transmission Success</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Ticket created successfully in the EDOT systems. Authorities will review your dispatch momentarily.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="mb-10 border-b border-white/5 pb-8">
                     <h2 className="text-3xl font-black text-white tracking-tight mb-2">Direct Message Channel</h2>
                     <p className="text-slate-400 text-sm font-medium">Use this secure gateway to dispatch a message directly to EDOT administrators.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Identity / Name</label>
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
                        placeholder="Secure Email"
                        className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Transmission Subject</label>
                    <input 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})} 
                      required 
                      placeholder="e.g., Enterprise Installation / Syllabus Query"
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Dispatch Contents</label>
                    <textarea 
                      rows="6" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="Outline your requirements or issues here..."
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner resize-y"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className="w-full bg-white text-[#0B0E14] font-black text-sm uppercase tracking-[0.2em] px-8 py-5 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] transform hover:-translate-y-1"
                  >
                    {loadingSubmit ? (
                      <div className="w-5 h-5 border-4 border-[#0B0E14]/30 border-t-[#0B0E14] rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loadingSubmit ? 'Initializing...' : 'Transmit Now'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
        
        <CTA 
          title="Prefer To Get Started Immediately?" 
          description="You don't need authorization to begin learning. Create an account instantly."
          buttonText="Create Your Account"
          buttonLink="/register"
        />

      </div>
    </div>
  );
}
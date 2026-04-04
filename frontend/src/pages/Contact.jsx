import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-80px)] bg-[#0B0E14] text-white py-20 lg:py-28 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#008A32]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Get In Touch</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-black text-white mb-6 tracking-tight drop-shadow-md">
            Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#EAB308]">EDOT</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Whether you're a student, instructor, or partner, EDOT is here to support your learning journey. 
            Reach out to our elite team for guidance, collaboration, or technical support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#11151F] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-start gap-5 hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/5 rounded-bl-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Email Support</h3>
                <p className="text-[#FFD700] font-bold text-sm tracking-wide">support@edot.com</p>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                  Get help with courses, accounts, or platform issues within 24 hours.
                </p>
              </div>
            </div>

            <div className="bg-[#11151F] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-start gap-5 hover:border-[#008A32]/30 hover:shadow-[0_0_30px_rgba(0,138,50,0.1)] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#008A32]/5 rounded-bl-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-[#008A32]/10 border border-[#008A32]/20 text-[#008A32] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Call Assistance</h3>
                <p className="text-[#008A32] font-bold text-sm tracking-wide">+251 900 000 000</p>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                  Available Monday to Friday to support your learning experience.
                </p>
              </div>
            </div>

            <div className="bg-[#11151F] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-start gap-5 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-bl-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-3 drop-shadow-sm">Our Command Center</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  Adama Science and Technology Area<br/>
                  Oromia Region, Ethiopia
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0B0E14]/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/10 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-in zoom-in slide-in-from-bottom-8 duration-700 relative z-10">
                  <div className="w-24 h-24 bg-[#008A32]/10 border border-[#008A32]/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,138,50,0.3)]">
                    <CheckCircle2 className="w-12 h-12 text-[#008A32]" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-white mb-4 drop-shadow-md">Transmission Received</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Your message has successfully reached the EDOT secure servers. Our team will review your inquiry and respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2 px-1">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-[#11151F] rounded-xl border border-white/10 text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-inner" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2 px-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-[#11151F] rounded-xl border border-white/10 text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2 px-1">Subject</label>
                    <input 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})} 
                      required 
                      placeholder="Transmission Subject"
                      className="w-full px-5 py-4 bg-[#11151F] rounded-xl border border-white/10 text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-inner" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2 px-1">Message Body</label>
                    <textarea 
                      rows="5" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="Write your detailed message here..."
                      className="w-full px-5 py-4 bg-[#11151F] rounded-xl border border-white/10 text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-inner resize-y custom-scrollbar"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className="mt-4 w-full bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {loadingSubmit ? (
                      <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loadingSubmit ? 'Transmitting...' : 'Send Transmission'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Headphones, Building, Map, ChevronDown, ChevronUp } from 'lucide-react';
import CTA from '../components/CTA';

const ImagePlaceholder = ({ text, className = "h-48" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Interface Asset: {text} ]</span>
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How do I become an instructor on EDOT?",
      a: "Instructors must undergo our rigorous vetting process. You can start by registering a standard account and submitting an 'Instructor Upgrade Request' from your dashboard settings."
    },
    {
      q: "Can my entire school deploy the EDOT LMS system?",
      a: "Yes. Our Enterprise team specializes in bulk deployments, syllabus synchronization, and multi-tenant domain setups. Please use the contact form above and specify 'Enterprise Setup'."
    },
    {
      q: "Are the course certificates globally recognized?",
      a: "Every certificate generated on EDOT is cryptographically hashed and verified against our ISO-backed infrastructure, making them completely verifiable by global employers."
    },
    {
      q: "What should I do if my payment fails?",
      a: "Ensure your local telebirr or banking limits are cleared. If the issue persists, our technical support desk (support@edot.platform) operates 24/7 to resolve transactional drops."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitted(true);
      setLoadingSubmit(false);
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans overflow-x-hidden relative text-slate-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] md:left-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-10%] w-[50vh] md:w-[60vw] h-[50vh] md:h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 pt-20">
        
        {/* 1. HERO SECTION */}
        <div className="text-center mb-20 max-w-3xl mx-auto px-6 pt-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#008A32]/10 border border-[#008A32]/30 backdrop-blur-xl mx-auto shadow-xl mb-8">
             <span className="text-[10px] font-black text-[#008A32] tracking-[0.2em] uppercase">Connect With Us</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white mb-8 tracking-tight leading-[1.05] drop-shadow-2xl">
            We Are Here To <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Support Your Vision.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            Whether you need technical assistance, enterprise school integration, or just guidance on where to start—our global support team is available and ready to help.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          
          {/* 3. CONTACT INFORMATION & 4. MAP */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
               <div className="bg-[#11151F]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-[#008A32]/40 transition-colors">
                 <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#008A32]/10 text-[#008A32] flex items-center justify-center border border-[#008A32]/20">
                    <Headphones className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-lg tracking-tight mb-1">General Support</h3>
                    <p className="text-slate-400 text-sm font-medium mb-2">Technical issues and student help.</p>
                    <a href="mailto:support@edot.platform" className="text-[#008A32] font-black text-xs uppercase tracking-widest hover:underline">support@edot.platform</a>
                 </div>
               </div>

               <div className="bg-[#11151F]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-[#FFD700]/40 transition-colors">
                 <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center border border-[#FFD700]/20">
                    <Building className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-lg tracking-tight mb-1">Enterprise Sales</h3>
                    <p className="text-slate-400 text-sm font-medium mb-2">B2B, Universities, and Corporate.</p>
                    <a href="mailto:sales@edot.platform" className="text-[#FFD700] font-black text-xs uppercase tracking-widest hover:underline">sales@edot.platform</a>
                 </div>
               </div>
               
               <div className="bg-[#11151F]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-white/30 transition-colors">
                 <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 text-white flex items-center justify-center border border-white/10">
                    <Phone className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-lg tracking-tight mb-1">Global Hotline</h3>
                    <p className="text-slate-400 text-sm font-medium mb-2">Available Mon-Fri, 9AM-6PM (EAT).</p>
                    <span className="text-white font-black text-xs tracking-widest">+251 (0) 900 123 456</span>
                 </div>
               </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-48 bg-[#0B0E14] border border-white/10 rounded-[2rem] relative overflow-hidden group">
               <div className="absolute inset-0 bg-[#008A32]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
               <ImagePlaceholder text="Interactive Global Infrastructure Map Layer" className="h-full w-full rounded-none border-0" />
               <div className="absolute bottom-4 left-4 bg-[#11151F]/90 backdrop-blur-md px-4 py-2 border border-white/10 rounded-xl z-20 flex items-center gap-2 shadow-lg">
                  <MapPin className="w-4 h-4 text-[#008A32]" />
                  <span className="text-white font-bold text-xs">Adama Science & Tech Campus</span>
               </div>
            </div>

          </div>

          {/* 2. CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-[#11151F]/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#008A32]/20 rounded-full blur-[80px] pointer-events-none"></div>
               
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 relative z-10 w-full animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-[#008A32]/10 border border-[#008A32]/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,138,50,0.2)]">
                    <CheckCircle className="w-12 h-12 text-[#008A32]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Message Sent!</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Thank you for reaching out. A platform representative will get back to your email within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="mb-8 border-b border-white/5 pb-8">
                     <h2 className="text-3xl font-black text-white tracking-tight mb-2">Send A Message</h2>
                     <p className="text-slate-400 text-sm font-medium">Fill out the fields below and we'll route it to the appropriate desktop.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Your Message</label>
                    <textarea 
                      rows="5" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="How can we help you today?"
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
                      <Send className="w-4 h-4" />
                    )}
                    {loadingSubmit ? 'Processing...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* 5. FAQ SECTION */}
        <section className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5 relative z-20 mb-32">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-400 font-medium mt-4">Common queries from our community answered instantly.</p>
           </div>
           
           <div className="space-y-4">
              {faqs.map((faq, i) => (
                 <div 
                   key={i} 
                   onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                   className={`border cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${openFaq === i ? 'bg-[#11151F]/80 border-[#008A32]/30 shadow-lg' : 'bg-[#0B0E14] border-white/5 hover:border-white/20'}`}
                 >
                   <div className="p-6 flex items-center justify-between">
                     <h4 className={`font-black text-lg tracking-tight ${openFaq === i ? 'text-white' : 'text-slate-300'}`}>{faq.q}</h4>
                     {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#008A32]" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                   </div>
                   <div className={`px-6 pb-6 text-slate-400 font-medium leading-relaxed transition-all duration-300 ${openFaq === i ? 'block' : 'hidden'}`}>
                     {faq.a}
                   </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 6. CTA (Join EDOT / Become Instructor) */}
        <section className="max-w-5xl mx-auto px-6 relative z-20 pb-32">
          <div className="bg-gradient-to-br from-[#0B0E14] to-[#11151F] border border-[#FFD700]/30 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_80px_rgba(255,215,0,0.1)] relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#FFD700]/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter relative z-10">
              Ready To Join <span className="text-[#008A32]">EDOT?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 relative z-10">
              We provide the framework. You provide the execution. Create a student account instantly or apply to become a certified instructor.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <a href="/register" className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white text-[#0B0E14] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-slate-200 hover:-translate-y-1 transition-all">
                Become A Student
              </a>
              <a href="/register?role=instructor" className="w-full sm:w-auto px-10 py-5 rounded-xl bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:border-[#FFD700] hover:text-[#FFD700] transition-all">
                Apply To Instruct
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
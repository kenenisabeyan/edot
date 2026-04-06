import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Headphones, Building, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImagePlaceholder = ({ text, className = "h-48" }) => (
  <div className={`bg-gradient-to-br from-[#11151F] to-[#0B0E14] border border-white/10 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-[#008A32]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <span className="font-bold tracking-widest uppercase text-[10px] z-10 relative px-6 text-center group-hover:text-slate-300 transition-colors">[ Display: {text} ]</span>
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
      a: "We love welcoming new educators! You can start by registering a standard account and submitting a simple request from your dashboard. We'll guide you through the rest."
    },
    {
      q: "Can my entire school use the platform?",
      a: "Absolutely. Our team is perfectly equipped to set up school-wide deployments. Just drop us a message using the form above specifying 'School Setup' and we'll handle the heavy lifting playfully."
    },
    {
      q: "Are the course certificates globally recognized?",
      a: "Yes, they are! Every certificate you earn is verifiable and highly respected, representing the genuine effort and projects you put into your learning."
    },
    {
      q: "I'm having trouble with payments, what should I do?",
      a: "Don't worry in the slightest! Just reach out to us using the form above or call our friendly hotline, and our dedicated support team will help you resolve it immediately."
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
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans overflow-x-hidden text-slate-100 relative transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      <div className="relative z-10 pt-20">
        
        {/* 1. HERO SECTION */}
        <div className="text-center mb-20 max-w-3xl mx-auto px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mx-auto mb-8 shadow-lg">
             <span className="text-[10px] font-black text-[#FFD700] tracking-[0.2em] uppercase">Always Available</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
            We are here to <br/>
            <span className="text-white">help you.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Whether you have a simple question, need friendly guidance, or want to explore platform options, our warm support team is ready to assist you.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          
          {/* 3. CONTACT INFORMATION & 4. MAP */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 gap-6">
               <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all group">
                 <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center border border-[#FFD700]/20 group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-2xl mb-1">Friendly Support</h3>
                    <p className="text-slate-400 text-sm mb-3">Answers to any questions you might have.</p>
                    <a href="mailto:support@edot.platform" className="text-[#FFD700] font-bold text-xs uppercase tracking-widest hover:underline">support@edot.platform</a>
                 </div>
               </div>

               <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-[#008A32]/30 hover:shadow-[0_0_30px_rgba(0,138,50,0.05)] transition-all group">
                 <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#008A32]/10 text-[#008A32] flex items-center justify-center border border-[#008A32]/20 group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-2xl mb-1">Call Us Directly</h3>
                    <p className="text-slate-400 text-sm mb-3">We are available Mon-Fri, 9AM-6PM.</p>
                    <span className="text-emerald-500 font-black text-sm tracking-widest">+251 (0) 900 123 456</span>
                 </div>
               </div>
               
               <div className="bg-[#11151F]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-start gap-6 hover:border-white/30 transition-all group">
                 <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 text-white flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <Building className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-2xl mb-1">Partnerships</h3>
                    <p className="text-slate-400 text-sm mb-3">For universities and school boards.</p>
                    <a href="mailto:sales@edot.platform" className="text-white font-bold text-xs uppercase tracking-widest hover:underline">sales@edot.platform</a>
                 </div>
               </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-48 rounded-[2rem] relative overflow-hidden group shadow-inner border border-white/10 mt-2">
               <div className="absolute inset-0 bg-[#0B0E14]/40 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
               <ImagePlaceholder text="Map Base Layer" className="h-full w-full rounded-none border-0" />
               <div className="absolute bottom-4 left-4 bg-[#11151F]/90 backdrop-blur px-5 py-3 rounded-xl z-20 flex items-center gap-3 border border-white/10">
                  <MapPin className="w-5 h-5 text-[#008A32]" />
                  <span className="text-white font-bold text-[10px] uppercase tracking-widest">Adama Campus</span>
               </div>
            </div>

          </div>

          {/* 2. CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-[#11151F]/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl h-full relative overflow-hidden flex flex-col justify-center group">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#008A32]/5 rounded-full blur-[100px] pointer-events-none"></div>
               
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 relative z-10 w-full animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-[#008A32]/10 rounded-full flex items-center justify-center mb-8 border border-[#008A32]/20">
                    <CheckCircle className="w-12 h-12 text-[#008A32]" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Message Sent!</h3>
                  <p className="text-slate-400 max-w-sm mx-auto leading-relaxed text-lg">
                    Thank you so much for reaching out! A friendly representative will reply to your email very soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
                  <div className="mb-10 border-b border-white/5 pb-8">
                     <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Send A Text</h2>
                     <p className="text-slate-400 font-medium">Fill out the fields below and we'll be right with you.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="e.g. John Doe"
                        className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Your Message</label>
                    <textarea 
                      rows="5" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="How can we assist you today?"
                      className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className="w-full bg-[#008A32] text-white font-black uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-[#007028] hover:shadow-[0_0_25px_rgba(0,138,50,0.3)] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingSubmit ? (
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loadingSubmit ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* 5. FAQ SECTION */}
        <section className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5 relative z-20 mb-32">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Got Questions?</h2>
              <p className="text-slate-400 font-medium mt-4 md:text-lg">Common questions from our learning community.</p>
           </div>
           
           <div className="space-y-6">
              {faqs.map((faq, i) => (
                 <div 
                   key={i} 
                   onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                   className={`border cursor-pointer transition-all duration-300 rounded-[2rem] overflow-hidden ${openFaq === i ? 'bg-[#11151F]/80 border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.05)]' : 'bg-[#0B0E14] border-white/10 hover:border-white/20'}`}
                 >
                   <div className="p-8 flex items-center justify-between">
                     <h4 className={`font-black text-xl md:text-2xl ${openFaq === i ? 'text-[#FFD700]' : 'text-white'}`}>{faq.q}</h4>
                     {openFaq === i ? <ChevronUp className="w-6 h-6 text-[#FFD700] shrink-0" /> : <ChevronDown className="w-6 h-6 text-slate-500 shrink-0" />}
                   </div>
                   <div className={`px-8 pb-8 text-slate-400 font-medium leading-[1.8] text-lg transition-all duration-300 ${openFaq === i ? 'block' : 'hidden'}`}>
                     {faq.a}
                   </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 6. CTA (Join EDOT / Become Instructor) */}
        <section className="max-w-5xl mx-auto px-6 relative z-20 pb-32">
          <div className="bg-gradient-to-r from-[#11151F] to-[#0B0E14] border border-[#008A32]/20 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_40px_rgba(0,138,50,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#008A32]/10 rounded-full blur-[80px]"></div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight relative z-10">
              Ready To Join <br className="md:hidden"/><span className="text-[#008A32]">Our Community?</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 relative z-10">
              We are so excited to welcome you. Create your free account today and start your learning journey with our full support.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#008A32] text-white font-black uppercase tracking-widest text-xs hover:bg-[#007028] shadow-[0_0_25px_rgba(0,138,50,0.3)] transition-all">
                Become A Learner
              </Link>
              <Link to="/register?role=instructor" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#0B0E14] border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-all">
                Teach With Us
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
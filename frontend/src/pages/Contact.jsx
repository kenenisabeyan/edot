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
    <div className="min-h-[calc(100vh-80px)] bg-transparent py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full">
            Connect with EDOT
          </h1>
          <p className="text-lg text-slate-600 mt-8">
            Whether you're a student, instructor, or partner, EDOT is here to support your learning journey. 
            Reach out to us for guidance, collaboration, or technical support — our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-slate-600">support@edot.com</p>
                <p className="text-slate-500 text-sm mt-1">
                  Get help with courses, accounts, or platform issues within 24 hours.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Call Assistance</h3>
                <p className="text-slate-600">+251 900 000 000</p>
                <p className="text-slate-500 text-sm mt-1">
                  Available Monday to Friday to support your learning experience.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Our Location</h3>
                <p className="text-slate-600">
                  Adama Science and Technology Area<br/>
                  Oromia Region<br/>
                  Ethiopia
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 h-full">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Successfully Sent</h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Your message has been received by the EDOT team. We’ll review it and respond shortly to support your learning needs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})} 
                      required 
                      placeholder="What would you like to discuss?"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea 
                      rows="6" 
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                      required 
                      placeholder="Write your message, question, or feedback here..."
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loadingSubmit ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loadingSubmit ? 'Sending your message...' : 'Send Message to EDOT'}
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
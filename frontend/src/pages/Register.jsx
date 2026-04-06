import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, UserPlus, Zap, CheckCircle, ChevronLeft, GraduationCap } from 'lucide-react';

export default function Register() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get('role');
  const defaultRole = (roleParam === 'instructor' || roleParam === 'parent') ? roleParam : 'student';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: defaultRole, agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const setRole = (newRole) => {
    setFormData({ ...formData, role: newRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.agreeTerms) return setError('You must agree to the Terms of Service to continue.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    
    setLoadingSubmit(true);
    try {
      await register({
        name: formData.name, email: formData.email, password: formData.password, role: formData.role
      });
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || errorData?.errors?.[0]?.msg || err.message || 'Failed to create account.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleGoogleSignup = () => alert("Google OAuth integration pending.");

  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans flex items-stretch text-slate-100 relative overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center pl-24 pr-16 z-10 border-r border-white/5 bg-[#11151F]/40 backdrop-blur-md">
        <div className="absolute top-12 left-12">
           <Link to="/" className="inline-flex items-center gap-2 bg-[#11151F] border border-white/10 px-4 py-2 rounded-xl hover:border-[#FFD700]/30 transition-all group backdrop-blur">
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-[#FFD700] transition-colors" />
              <span className="text-slate-300 font-black tracking-widest text-[10px] uppercase group-hover:text-white transition-colors">Back to Home</span>
           </Link>
        </div>
        
        <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 p-4 rounded-[2rem] w-24 h-24 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,215,0,0.1)] text-[#FFD700]">
          <GraduationCap className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-8">
          Join The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#008A32]">Community.</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
          Start your journey with EDOT today. Empower yourself with structured curriculums and high-end enterprise tools.
        </p>

        <div className="flex flex-col gap-6">
          {["Strict Data Privacy", "Structured Curriculums", "Verified Instructors"].map((ft, i) => (
             <div key={i} className="flex items-center gap-4 text-white font-black text-xs tracking-widest uppercase bg-[#11151F] border border-white/5 px-6 py-4 rounded-2xl w-fit shadow-inner">
               <CheckCircle className="w-5 h-5 text-[#008A32]" /> {ft}
             </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-10">

          <div className="text-center mb-10 lg:hidden">
             <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <UserPlus className="w-8 h-8 text-[#FFD700]" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          </div>
          
          <div className="bg-[#11151F]/60 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#008A32]/5 rounded-full blur-[80px] pointer-events-none"></div>

             <div className="mb-8 text-center relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Register</h3>
                <p className="text-slate-400 text-sm font-medium">Please enter your details below.</p>
             </div>

             {error && (
               <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-500 shadow-sm animate-in fade-in slide-in-from-top-2 relative z-10">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-sm font-bold tracking-wide">{error}</p>
               </div>
             )}

             <button 
               type="button"
               onClick={handleGoogleSignup}
               className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-white bg-[#0B0E14] border border-white/10 hover:border-white/20 transition-all font-black text-xs uppercase tracking-widest shadow-inner mb-8 relative z-10"
             >
               <Zap className="w-4 h-4 text-[#FFD700]" />
               <span>Continue with Google</span>
             </button>

             <div className="relative mb-8 text-center flex items-center z-10">
               <div className="flex-1 border-t border-white/10"></div>
               <span className="px-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Or Register Manually</span>
               <div className="flex-1 border-t border-white/10"></div>
             </div>

             <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
               
               {/* ROLE SELECTION */}
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">I am signing up as a...</label>
                  <div className="grid grid-cols-3 gap-3">
                     <button type="button" onClick={() => setRole('student')} className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'student' ? 'bg-[#008A32]/20 border-[#008A32] text-white shadow-[0_0_15px_rgba(0,138,50,0.15)]' : 'bg-[#0B0E14] border-white/10 text-slate-500 hover:border-white/30'}`}>Student</button>
                     <button type="button" onClick={() => setRole('parent')} className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'parent' ? 'bg-[#FFD700]/20 border-[#FFD700] text-white shadow-[0_0_15px_rgba(255,215,0,0.15)]' : 'bg-[#0B0E14] border-white/10 text-slate-500 hover:border-white/30'}`}>Parent</button>
                     <button type="button" onClick={() => setRole('instructor')} className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'instructor' ? 'bg-white/10 border-white/50 text-white' : 'bg-[#0B0E14] border-white/10 text-slate-500 hover:border-white/30'}`}>Instructor</button>
                  </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Full Name</label>
                 <input 
                   type="text" 
                   name="name" 
                   value={formData.name}
                   onChange={handleChange}
                   required 
                   placeholder="John Doe" 
                   className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all"
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Email Address</label>
                 <input 
                   type="email" 
                   name="email" 
                   value={formData.email}
                   onChange={handleChange}
                   required 
                   placeholder="john@example.com" 
                   className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all"
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Password</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••••••" 
                      className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all pr-12"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                 </div>
               </div>

               <div className="flex items-start pt-2 px-2">
                 <input 
                   id="agreeTerms" 
                   name="agreeTerms" 
                   type="checkbox" 
                   checked={formData.agreeTerms}
                   onChange={handleChange}
                   className="mt-0.5 shrink-0 w-4 h-4 rounded border-white/20 bg-[#0B0E14] text-[#008A32] cursor-pointer"
                 />
                 <label htmlFor="agreeTerms" className="ml-3 block text-xs font-medium text-slate-400 cursor-pointer border-transparent">
                   I agree to the <Link to="/terms" className="text-[#008A32] hover:text-[#005e22] font-black tracking-wide transition-colors">Terms of Service</Link>
                 </label>
               </div>

               <button 
                 type="submit" 
                 disabled={loadingSubmit}
                 className="w-full bg-[#0B0E14] border border-[#008A32]/50 text-[#008A32] font-black uppercase tracking-widest text-xs px-8 py-5 rounded-2xl mt-4 transition-all flex items-center justify-center gap-3 hover:bg-[#008A32] hover:text-white shadow-[0_0_20px_rgba(0,138,50,0.1)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
               >
                 {loadingSubmit ? (
                   <div className="w-5 h-5 border-4 border-[#008A32]/30 border-t-[#008A32] rounded-full animate-spin"></div>
                 ) : (
                   <UserPlus className="w-4 h-4" />
                 )}
                 {loadingSubmit ? 'CREATING...' : 'CREATE ACCOUNT'}
               </button>
             </form>

             <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Already have an account? <Link to="/login" className="text-[#FFD700] hover:text-[#e5c100] ml-2 transition-colors">Sign in</Link>
                </p>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
}

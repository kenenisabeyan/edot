import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Shield, Zap, Lock, GraduationCap, ChevronLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);
    
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google OAuth integration module pending.");
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-base, #0B0E14)' }} className="min-h-screen w-full font-sans flex items-stretch text-slate-100 relative overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 lg:px-24 z-10 border-r border-white/5 bg-[#11151F]/40 backdrop-blur-md">
        <div className="absolute top-12 left-12">
           <Link to="/" className="inline-flex items-center gap-2 bg-[#11151F] border border-white/10 px-4 py-2 rounded-xl hover:border-[#FFD700]/30 transition-all group backdrop-blur">
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-[#FFD700] transition-colors" />
              <span className="text-slate-300 font-black tracking-widest text-[10px] uppercase group-hover:text-white transition-colors">Return to Hub</span>
           </Link>
        </div>
        
        <div className="bg-[#008A32]/10 border border-[#008A32]/20 p-4 rounded-[2rem] w-24 h-24 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(0,138,50,0.1)] text-[#008A32]">
          <GraduationCap className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-8">
          Welcome <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Back.</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
          Continue your learning journey. Securely authenticate your credentials to access the EDOT platform.
        </p>

        <div className="flex gap-4">
          <div className="bg-[#11151F] border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-inner">
             <Lock className="w-6 h-6 text-[#FFD700]" />
             <div>
               <p className="text-white font-black text-sm tracking-tight text-left">E2E Encrypted</p>
               <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Secure Access</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-10 relative">
          
          <div className="text-center mb-10 lg:hidden">
             <div className="bg-[#008A32]/10 border border-[#008A32]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,138,50,0.1)]">
                <GraduationCap className="w-8 h-8 text-[#008A32]" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          </div>

          <div className="bg-[#11151F]/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
             {/* Hover Glow Effect */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none"></div>

             <div className="mb-10 text-center relative z-10">
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">Sign In</h3>
               <p className="text-slate-400 text-sm font-medium">Please enter your account details.</p>
             </div>

             {error && (
               <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-500 shadow-sm animate-in fade-in slide-in-from-top-2 relative z-10">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-sm font-bold tracking-wide">{error}</p>
               </div>
             )}

             {/* Google OAuth Component */}
             <button 
               type="button"
               onClick={handleGoogleLogin}
               className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-white bg-[#0B0E14] border border-white/10 hover:border-white/20 transition-all font-black text-xs uppercase tracking-widest shadow-inner mb-8 relative z-10 hover:bg-[#11151F]"
             >
               <Zap className="w-4 h-4 text-[#FFD700]" />
               <span>Continue with Google</span>
             </button>

             <div className="relative mb-8 text-center flex items-center z-10">
               <div className="flex-1 border-t border-white/10"></div>
               <span className="px-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Or use email</span>
               <div className="flex-1 border-t border-white/10"></div>
             </div>

             <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
               
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Email Address</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required 
                   placeholder="student@example.com" 
                   className="w-full px-6 py-4 bg-[#0B0E14] border border-white/10 rounded-2xl text-white placeholder-slate-600 font-medium focus:outline-none focus:border-[#008A32]/50 focus:ring-1 focus:ring-[#008A32]/50 transition-all"
                 />
               </div>

               <div>
                 <div className="flex justify-between items-end mb-3 ml-2 mr-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                    <Link to="#" className="text-[10px] font-black text-[#FFD700] hover:text-[#e5c100] uppercase tracking-widest transition-colors mb-0.5">Forgot?</Link>
                 </div>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

               <button 
                 type="submit" 
                 disabled={loadingSubmit}
                 className="w-full bg-[#008A32] text-white font-black uppercase tracking-widest text-xs px-8 py-5 rounded-2xl mt-4 transition-all flex items-center justify-center gap-3 hover:bg-[#007028] shadow-[0_0_20px_rgba(0,138,50,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
               >
                 {loadingSubmit ? (
                   <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <Lock className="w-4 h-4" />
                 )}
                 {loadingSubmit ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}
               </button>
             </form>

             <div className="mt-10 text-center relative z-10 border-t border-white/5 pt-6">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  Don't have an account? <Link to="/register" className="text-[#008A32] hover:text-[#005e22] ml-2 transition-colors">Create one</Link>
                </p>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
}

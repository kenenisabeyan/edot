import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Shield, Zap, Lock } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

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
    <div className="min-h-screen bg-[#0B0E14] font-sans flex items-stretch relative overflow-hidden text-slate-300">
      
      {/* Background Mesh Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vh] h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vh] h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 lg:px-24 z-10 border-r border-white/5 bg-[#11151F]/40 backdrop-blur-xl">
        <div className="absolute top-12 left-12">
           <Link to="/" className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors">
              <Shield className="w-5 h-5 text-[#008A32]" />
              <span className="text-white font-black tracking-widest text-[10px] uppercase">Return to Hub</span>
           </Link>
        </div>
        
        <div className="bg-[#0B0E14] border border-white/10 p-4 rounded-3xl w-24 h-24 flex items-center justify-center mb-10 shadow-2xl">
          <img src={edotLogo} alt="EDOT Hub" className="w-full h-auto rounded-xl" />
        </div>
        
        <h1 className="text-5xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight mb-8">
          Initialize <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Session.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
          Authenticate your credentials to access the EDOT Central Architecture. Secure, lightning-fast execution awaits.
        </p>

        <div className="flex gap-4">
          <div className="bg-[#0B0E14] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg">
             <Lock className="w-6 h-6 text-[#008A32]" />
             <div>
               <p className="text-white font-bold text-sm tracking-tight text-left">E2E Encrypted</p>
               <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Zero-Trust Network</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-12 lg:hidden">
             <div className="bg-[#008A32]/10 border border-[#008A32]/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-[#008A32]" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">Access Hub</h2>
          </div>

          <div className="bg-[#11151F]/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="mb-10 text-center">
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">Authorization Required</h3>
               <p className="text-slate-400 text-sm font-medium">Please enter your registered credentials.</p>
             </div>

             {error && (
               <div className="mb-8 p-4 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-xl flex items-start gap-3 text-[#FF0000] shadow-sm animate-in fade-in slide-in-from-top-2">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-sm font-bold tracking-wide">{error}</p>
               </div>
             )}

             {/* Google OAuth Component */}
             <button 
               type="button"
               onClick={handleGoogleLogin}
               className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-white bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest shadow-sm group mb-8"
             >
               <Zap className="w-4 h-4 text-[#FFD700] group-hover:scale-110 transition-transform" />
               <span>Authenticate via Gateway</span>
             </button>

             <div className="relative mb-8 text-center flex items-center">
               <div className="flex-1 border-t border-white/10"></div>
               <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Or Local Protocol</span>
               <div className="flex-1 border-t border-white/10"></div>
             </div>

             <form onSubmit={handleSubmit} noValidate className="space-y-6">
               
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Origin Identity</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required 
                   placeholder="Ex: student@edot.platform" 
                   className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner"
                 />
               </div>

               <div>
                 <div className="flex justify-between items-end mb-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Passcode Key</label>
                    <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:underline underline-offset-4">Reset Key?</Link>
                 </div>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••" 
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#008A32]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner pr-12"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                 </div>
               </div>

               <button 
                 type="submit" 
                 disabled={loadingSubmit}
                 className="w-full bg-gradient-to-r from-[#008A32] to-[#006e28] text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-5 rounded-xl mt-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,138,50,0.3)] hover:shadow-[0_0_40px_rgba(0,138,50,0.5)] transform hover:-translate-y-1"
               >
                 {loadingSubmit ? (
                   <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <Lock className="w-4 h-4" />
                 )}
                 {loadingSubmit ? 'Validating...' : 'Establish Connection'}
               </button>
             </form>

             <div className="mt-10 text-center">
                <p className="text-xs font-bold text-slate-500 tracking-wider">
                  Unregistered Node? <Link to="/register" className="text-white hover:text-[#008A32] underline underline-offset-4 transition-colors uppercase tracking-[0.1em] ml-1">Create Access</Link>
                </p>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
}

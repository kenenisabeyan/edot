import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, UserPlus, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) return setError('Encryption keys do not match.');
    if (!formData.agreeTerms) return setError('Compliance with Platform Protocols is mandatory.');
    
    setLoadingSubmit(true);
    try {
      await register({
        name: formData.name, email: formData.email, password: formData.password, role: 'student'
      });
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || errorData?.errors?.[0]?.msg || err.message || 'Failed to initialize account node.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleGoogleSignup = () => alert("Google OAuth integration module pending.");

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans flex items-stretch relative overflow-hidden text-slate-300">
      
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vh] h-[60vh] rounded-full bg-[#008A32]/10 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vh] h-[60vh] rounded-full bg-[#FFD700]/10 blur-[150px]"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center pl-24 pr-16 z-10 border-r border-white/5 bg-[#11151F]/40 backdrop-blur-xl">
        <div className="absolute top-12 left-12">
           <Link to="/" className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white font-black tracking-widest text-[10px] uppercase">Abort Protocol</span>
           </Link>
        </div>
        
        <div className="bg-[#0B0E14] border border-white/10 p-4 rounded-3xl w-24 h-24 flex items-center justify-center mb-10 shadow-2xl">
          <img src={edotLogo} alt="EDOT Hub" className="w-full h-auto rounded-xl" />
        </div>
        
        <h1 className="text-5xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight mb-8">
          Join The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008A32] to-[#FFD700]">Digital Core.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
          Create your centralized access node. EDOT empowers you to execute at peak academic and professional capacity.
        </p>

        <div className="flex flex-col gap-4">
          {["Strict Data Isolation", "Algorithmic Curriculums", "Verified Execution"].map((ft, i) => (
             <div key={i} className="flex items-center gap-4 text-white font-bold text-sm tracking-widest uppercase">
               <CheckCircle className="w-5 h-5 text-[#FFD700]" /> {ft}
             </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-10">

          <div className="text-center mb-10 lg:hidden">
             <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-[#FFD700]" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tight">System Access</h2>
          </div>
          
          <div className="bg-[#11151F]/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="mb-10 text-center">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">New Node Initialization</h3>
                <p className="text-slate-400 text-sm font-medium">Input baseline parameters to begin.</p>
             </div>

             {error && (
               <div className="mb-8 p-4 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-xl flex items-start gap-3 text-[#FF0000] shadow-sm animate-in fade-in slide-in-from-top-2">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-sm font-bold tracking-wide">{error}</p>
               </div>
             )}

             <button 
               type="button"
               onClick={handleGoogleSignup}
               className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-white bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest shadow-sm group mb-8"
             >
               <Zap className="w-4 h-4 text-[#008A32] group-hover:scale-110 transition-transform" />
               <span>Gateway Integration (OAUTH)</span>
             </button>

             <div className="relative mb-8 text-center flex items-center">
               <div className="flex-1 border-t border-white/10"></div>
               <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Manual Entry Form</span>
               <div className="flex-1 border-t border-white/10"></div>
             </div>

             <form onSubmit={handleSubmit} noValidate className="space-y-6">
               
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Subject Name</label>
                 <input 
                   type="text" 
                   name="name" 
                   value={formData.name}
                   onChange={handleChange}
                   required 
                   placeholder="Ex: John Doe" 
                   className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#FFD700]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner"
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Origin Identifier (Email)</label>
                 <input 
                   type="email" 
                   name="email" 
                   value={formData.email}
                   onChange={handleChange}
                   required 
                   placeholder="Ex: john@edot.platform" 
                   className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#FFD700]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner"
                 />
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Encryption Key</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••••••" 
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#FFD700]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner pr-12"
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

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Verify Key</label>
                 <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••••••" 
                      className="w-full px-5 py-4 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#FFD700]/60 focus:bg-[#11151F] placeholder-slate-600 transition-all shadow-inner pr-12"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                 </div>
               </div>

               <div className="flex items-start pt-2">
                 <input 
                   id="agreeTerms" 
                   name="agreeTerms" 
                   type="checkbox" 
                   checked={formData.agreeTerms}
                   onChange={handleChange}
                   className="mt-1 shrink-0 w-5 h-5 rounded bg-[#0B0E14] border-white/20 text-[#FFD700] focus:ring-[#FFD700] cursor-pointer"
                 />
                 <label htmlFor="agreeTerms" className="ml-3 block text-xs font-bold text-slate-400 leading-snug cursor-pointer">
                   I agree to the <Link to="/terms" className="text-white hover:text-[#FFD700] underline underline-offset-4">ToS</Link> and <Link to="/privacy" className="text-white hover:text-[#FFD700] underline underline-offset-4">Privacy Execution Logic</Link>
                 </label>
               </div>

               <button 
                 type="submit" 
                 disabled={loadingSubmit}
                 className="w-full bg-gradient-to-r from-[#FFD700] to-[#cca700] text-[#0B0E14] font-black text-xs uppercase tracking-[0.2em] px-8 py-5 rounded-xl mt-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transform hover:-translate-y-1"
               >
                 {loadingSubmit ? (
                   <div className="w-5 h-5 border-4 border-[#0B0E14]/30 border-t-[#0B0E14] rounded-full animate-spin"></div>
                 ) : (
                   <UserPlus className="w-4 h-4" />
                 )}
                 {loadingSubmit ? 'Allocating Node...' : 'Establish Profile Protocol'}
               </button>
             </form>

             <div className="mt-10 text-center">
                <p className="text-xs font-bold text-slate-500 tracking-wider">
                  Established Node? <Link to="/login" className="text-white hover:text-[#FFD700] underline underline-offset-4 transition-colors uppercase tracking-[0.1em] ml-1">Authenticate</Link>
                </p>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
}

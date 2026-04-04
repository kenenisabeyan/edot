import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#0B0E14] relative overflow-hidden">
      {/* Decorative dark background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-[#008A32]/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#11151F]/80 backdrop-blur-3xl p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] border border-white/10 flex items-center justify-center p-2 mb-6 shadow-xl relative group">
            <div className="absolute inset-0 rounded-2xl bg-[#FFD700]/20 blur-xl group-hover:bg-[#FFD700]/30 transition-all opacity-0 group-hover:opacity-100"></div>
            <img src={edotLogo} alt="EDOT Logo" className="h-full w-auto rounded-xl relative z-10" />
          </div>
          <h2 className="text-3xl font-display font-black text-white tracking-wide mb-2">Welcome Back!</h2>
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Login to continue your learning journey</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#E30A17]/10 border border-[#E30A17]/30 rounded-xl flex items-start gap-3 text-[#E30A17] shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6 relative">
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="email" 
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 placeholder-slate-500 shadow-inner group-hover:border-white/20"
              />
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FFD700] transition-colors" />
            </div>
          </div>

          <div className="mb-6 relative">
            <div className="flex justify-between items-center mb-2 ml-1">
               <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
               <Link to="#" className="text-xs font-bold text-[#FFD700] hover:text-[#e0bd00] transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password" 
                className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 placeholder-slate-500 shadow-inner group-hover:border-white/20"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FFD700] transition-colors" />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-[#FFD700] focus:outline-none rounded-lg transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center mb-8 ml-1">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 accent-[#FFD700] bg-black/40 border-white/20 rounded cursor-pointer transition-colors"
            />
            <label htmlFor="remember" className="ml-3 block text-sm font-medium text-slate-300 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loadingSubmit}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#008A32] focus:ring-offset-2 focus:ring-offset-[#0B0E14] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loadingSubmit ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {loadingSubmit ? 'Authenticating...' : 'Secure Login'}
          </button>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-sm font-medium text-slate-400">
              Don't have an account? <Link to="/register" className="font-bold text-[#FFD700] hover:text-[#e0bd00] transition-colors ml-1">Request Platform Access</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

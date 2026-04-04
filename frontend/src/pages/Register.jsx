import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoadingSubmit(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student' // Hardcode to student automatically
      });
      // Registration successful but pending
      alert("Registration successful! Your account is pending administrator approval.");
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || errorData?.errors?.[0]?.msg || err.message || 'Failed to register account.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#0B0E14] py-12 relative overflow-hidden">
      {/* Decorative dark background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-[#008A32]/20 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-[#11151F]/80 backdrop-blur-3xl p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] border border-white/10 flex items-center justify-center p-2 mb-6 shadow-xl relative group">
            <div className="absolute inset-0 rounded-2xl bg-[#FFD700]/20 blur-xl group-hover:bg-[#FFD700]/30 transition-all opacity-0 group-hover:opacity-100"></div>
            <img src={edotLogo} alt="EDOT Logo" className="h-full w-auto rounded-xl relative z-10" />
          </div>
          <h2 className="text-3xl font-display font-black text-white tracking-wide mb-2">Create Account</h2>
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Join EDOT and start learning today</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#E30A17]/10 border border-[#E30A17]/30 rounded-xl flex items-start gap-3 text-[#E30A17] shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6 mb-8">
            <div className="relative group">
              <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  required
                  autoComplete="name" 
                  className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 placeholder-slate-500 shadow-inner group-hover:border-white/20"
                />
                <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FFD700] transition-colors" />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  required
                  autoComplete="email" 
                  className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 placeholder-slate-500 shadow-inner group-hover:border-white/20"
                />
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FFD700] transition-colors" />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password" 
                  required
                  autoComplete="new-password" 
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

            <div className="relative group">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password" 
                  required 
                  autoComplete="new-password" 
                  className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]/50 placeholder-slate-500 shadow-inner group-hover:border-white/20"
                />
                <CheckCircle className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FFD700] transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-center mb-8 ml-1 p-4 bg-white/5 border border-white/5 rounded-xl border-l-4 border-l-[#FFD700]">
            <input 
              type="checkbox" 
              id="terms" 
              required 
              className="w-4 h-4 accent-[#FFD700] bg-black/40 border-white/20 rounded cursor-pointer transition-colors"
            />
            <label htmlFor="terms" className="ml-3 block text-xs font-bold text-slate-400 leading-relaxed cursor-pointer select-none">
              I agree to EDOT's <Link to="/terms" target="_blank" className="text-[#FFD700] hover:text-[#e0bd00] underline decoration-[#FFD700]/30 underline-offset-4">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-[#FFD700] hover:text-[#e0bd00] underline decoration-[#FFD700]/30 underline-offset-4">Privacy Policy</Link>
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
              <UserPlus className="w-5 h-5" />
            )}
            {loadingSubmit ? 'Creating Profile...' : 'Submit Authorization'}
          </button>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-sm font-medium text-slate-400">
              Already have an account? <Link to="/login" className="font-bold text-[#FFD700] hover:text-[#e0bd00] transition-colors ml-1">Secure Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

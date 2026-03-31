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
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data || err.data;
      setError(errorData?.message || errorData?.errors?.[0]?.msg || err.message || 'Failed to register account.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={edotLogo} alt="EDOT Logo" className="h-12 w-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500">Join EDOT and start learning today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 mb-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
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
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-shadow"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
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
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-shadow"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
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
                  className="w-full pl-11 pr-12 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-shadow"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
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
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-shadow"
                />
                <CheckCircle className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-start mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center h-5 mt-0.5">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>
            <label htmlFor="terms" className="ml-3 block text-sm text-slate-600 leading-relaxed cursor-pointer">
              I agree to EDOT's <Link to="/terms" target="_blank" className="font-medium text-blue-600 hover:text-blue-500 underline decoration-blue-200 underline-offset-2">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="font-medium text-blue-600 hover:text-blue-500 underline decoration-blue-200 underline-offset-2">Privacy Policy</Link>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loadingSubmit}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingSubmit ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {loadingSubmit ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 ml-1 hover:underline">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

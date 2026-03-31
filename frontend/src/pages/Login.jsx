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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={edotLogo} alt="EDOT Logo" className="h-12 w-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome Back!</h2>
          <p className="text-slate-500">Login to continue your learning journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5 relative">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="email" 
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="mb-5 relative">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password" 
                className="w-full pl-11 pr-12 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loadingSubmit}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingSubmit ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {loadingSubmit ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
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

  const handleGoogleLogin = () => {
    alert("Google login integration coming soon!");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-stretch bg-gray-50 font-sans">
      
      {/* Left Side - Black Panel with Yellow Accents */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111111] relative flex-col items-center justify-center text-center px-12 overflow-hidden border-r-4 border-[#FFC107]">
        {/* Geometric Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC107]/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>

        <div className="relative z-10">
          <div className="bg-white p-3 rounded flex justify-center mb-10 w-fit mx-auto">
            <img src={edotLogo} alt="EDOT Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-[#FFC107] text-5xl font-black mb-4 uppercase tracking-tighter shadow-sm">Welcome Back</h2>
          <p className="text-white/80 text-lg font-medium">Log in to continue your path to master-level success.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          
          <h2 className="text-3xl font-black text-[#111111] text-center mb-8 uppercase tracking-tight">Access Account</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3 text-red-700 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-sm text-[#111111] bg-white hover:border-[#111111] hover:bg-gray-50 transition-all font-bold shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Ex. student@edot.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-sm text-[#111111] focus:outline-none focus:border-[#FFC107] focus:bg-white placeholder-gray-400 font-medium transition-colors"
              />
            </div>

            <div className="mb-2 relative">
              <div className="flex justify-between items-end mb-2">
                 <label className="block text-sm font-bold text-[#111111] uppercase tracking-wide">Password</label>
                 <Link to="#" className="text-xs font-bold text-[#FFC107] hover:text-[#e0a800] transition-colors underline underline-offset-4">Forgot password?</Link>
              </div>
              <div className="relative">
                 <input 
                   type={showPassword ? "text" : "password"} 
                   id="password" 
                   name="password" 
                   placeholder="Enter your password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-sm text-[#111111] focus:outline-none focus:border-[#FFC107] focus:bg-white placeholder-gray-400 pr-12 font-medium transition-colors"
                 />
                 <button 
                   type="button" 
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111] transition-colors"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loadingSubmit}
              className="w-full flex items-center justify-center py-4 px-4 rounded-sm text-[#111111] font-black uppercase tracking-widest bg-[#FFC107] hover:bg-[#e0a800] focus:outline-none transition-all disabled:opacity-70 mt-8 shadow-sm hover:shadow-md"
            >
              {loadingSubmit ? (
                <div className="w-5 h-5 border-4 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="mt-8 text-center bg-gray-50 p-4 border border-gray-200 rounded-sm">
              <p className="text-sm font-bold text-gray-600">
                Don't have an Account? <Link to="/register" className="text-[#111111] hover:text-[#FFC107] underline underline-offset-4 ml-1 transition-colors">Sign up now</Link>
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

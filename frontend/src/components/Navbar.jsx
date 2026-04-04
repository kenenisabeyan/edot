import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, BookOpen, LayoutDashboard, Info, Mail, LogIn, UserPlus } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all ${
      isActive 
        ? 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]' 
        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <nav className="bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto rounded-md shadow-[0_0_10px_rgba(255,215,0,0.2)]" />
              <span className="font-display font-black text-xl tracking-widest text-white uppercase drop-shadow-md">EDOT</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/" className={navLinkClass} end>
               Home
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              <BookOpen className="w-4 h-4" /> Courses
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </NavLink>
            )}
            <NavLink to="/about" className={navLinkClass}>
              <Info className="w-4 h-4" /> About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              <Mail className="w-4 h-4" /> Contact
            </NavLink>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#FFD700] uppercase tracking-widest">Hi, {user?.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-sm font-bold rounded-md text-white bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-black rounded-md text-[#0f172a] bg-gradient-to-r from-[#FFD700] to-[#EAB308] hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.3)] uppercase tracking-widest"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
               onClick={toggleMenu}
               className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FFD700]"
               aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#11151F]">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            <NavLink to="/" className={navLinkClass} onClick={toggleMenu} end>Home</NavLink>
            <NavLink to="/courses" className={navLinkClass} onClick={toggleMenu}><BookOpen className="w-4 h-4" /> Courses</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={toggleMenu}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
            )}
            <NavLink to="/about" className={navLinkClass} onClick={toggleMenu}><Info className="w-4 h-4" /> About</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={toggleMenu}><Mail className="w-4 h-4" /> Contact</NavLink>
          </div>
          
          <div className="pt-4 pb-3 border-t border-white/10 bg-[#0B0E14]">
            {isAuthenticated ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center px-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-black text-lg shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-bold text-white tracking-wide">{user?.name}</div>
                    <div className="text-xs font-black text-[#008A32] uppercase tracking-widest">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="mt-3 flex w-full items-center gap-2 px-4 py-2.5 border border-transparent text-sm font-bold uppercase tracking-widest rounded-md text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="px-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 border border-white/10 rounded-md shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-white/5 hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 border border-transparent rounded-md shadow-[0_0_15px_rgba(255,215,0,0.3)] text-sm font-black uppercase tracking-widest text-[#0f172a] bg-gradient-to-r from-[#FFD700] to-[#EAB308]"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

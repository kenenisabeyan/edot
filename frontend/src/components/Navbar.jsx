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
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-slate-600 hover:text-blue-600 hover:bg-transparent'
    }`;

  return (
    <nav className="glass-card border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">EDOT</span>
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
                <span className="text-sm font-medium text-slate-700">Hi, {user?.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 glass-card hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-slate-500" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        <div className="md:hidden border-t border-slate-200 glass-card">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClass} onClick={toggleMenu} end>Home</NavLink>
            <NavLink to="/courses" className={navLinkClass} onClick={toggleMenu}><BookOpen className="w-4 h-4" /> Courses</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={toggleMenu}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
            )}
            <NavLink to="/about" className={navLinkClass} onClick={toggleMenu}><Info className="w-4 h-4" /> About</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={toggleMenu}><Mail className="w-4 h-4" /> Contact</NavLink>
          </div>
          
          <div className="pt-4 pb-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center px-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800">{user?.name}</div>
                    <div className="text-sm font-medium text-slate-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="mt-3 flex w-full items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  <LogOut className="w-5 h-5 text-slate-500" /> Logout
                </button>
              </div>
            ) : (
              <div className="px-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-md shadow-sm text-base font-medium text-slate-700 glass-card hover:bg-transparent"
                >
                  <LogIn className="w-5 h-5 text-slate-400" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-5 h-5" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

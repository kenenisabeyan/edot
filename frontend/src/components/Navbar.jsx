import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

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
    `transition-colors ${
      isActive 
        ? 'text-white drop-shadow-md'
        : 'hover:text-white'
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0E14]/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008A32] to-[#FFD700] flex items-center justify-center text-[#0B0E14] text-xl shadow-lg border border-white/20">
              E
            </span>
            EDOT
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-400">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          )}
        </nav>
        
        {/* Desktop Auth / Actions */}
        <div className="hidden md:flex items-center gap-5">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="text-sm font-bold text-slate-300 hover:text-[#008A32] transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-[#008A32] transition-colors">Sign In</Link>
              <Link to="/register" className="px-6 py-2.5 text-sm font-black text-[#0B0E14] bg-white rounded-full hover:bg-slate-200 transition-colors shadow-lg hover:shadow-white/20">Join Now</Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0E14] border-t border-white/10 absolute top-full left-0 w-full overflow-hidden shadow-2xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            <NavLink to="/" className={({isActive}) => `text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`} onClick={toggleMenu} end>Home</NavLink>
            <NavLink to="/courses" className={({isActive}) => `text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`} onClick={toggleMenu}>Courses</NavLink>
            <NavLink to="/about" className={({isActive}) => `text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`} onClick={toggleMenu}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => `text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`} onClick={toggleMenu}>Contact</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={({isActive}) => `text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`} onClick={toggleMenu}>Dashboard</NavLink>
            )}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="w-full py-3 border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="w-full py-3 text-white text-sm font-bold text-center border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="w-full py-3 bg-white text-[#0B0E14] text-sm font-black rounded-xl text-center shadow-lg hover:bg-slate-200 transition-colors"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

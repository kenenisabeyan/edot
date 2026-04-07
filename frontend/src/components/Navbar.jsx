import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, ChevronDown, User, LogOut, Settings, 
  Bell, BookOpen, Shield, Zap, Globe, Code, UserCheck, 
  GraduationCap, ArrowRight, BrainCircuit, LineChart, Target
} from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';
import { MAIN_CATEGORIES } from '../constants/courseCategories';

// Link dynamic centralized categories to the generic UI Dropdown
const foundationCategories = [
  { name: MAIN_CATEGORIES[0] || 'Social Science', path: '/courses?mainCategory=Social%20Science', iconSmall: <Globe className="w-4 h-4 text-[#008A32]" /> },
  { name: MAIN_CATEGORIES[1] || 'Mathematics & Natural Science', path: '/courses?mainCategory=Mathematics%20%26%20Natural%20Science', iconSmall: <BrainCircuit className="w-4 h-4 text-[#008A32]" /> },
  { name: MAIN_CATEGORIES[2] || 'Natural Language', path: '/courses?mainCategory=Natural%20Language', iconSmall: <BookOpen className="w-4 h-4 text-[#008A32]" /> }
];

const advancedCategories = [
  { name: MAIN_CATEGORIES[3] || 'Programming & Technology', path: '/courses?mainCategory=Programming%20%26%20Technology', iconSmall: <Code className="w-4 h-4 text-[#FFD700]" /> },
  { name: MAIN_CATEGORIES[4] || 'Business & Entrepreneurship', path: '/courses?mainCategory=Business%20%26%20Entrepreneurship', iconSmall: <LineChart className="w-4 h-4 text-[#FFD700]" /> },
  { name: MAIN_CATEGORIES[5] || 'Personal Development', path: '/courses?mainCategory=Personal%20Development', iconSmall: <Target className="w-4 h-4 text-[#FFD700]" /> }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userDropdownRef = useRef(null);
  const catDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCatDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `text-xs font-black uppercase tracking-widest transition-colors py-2 ${
      isActive 
        ? 'text-[#FFD700]'
        : 'text-slate-400 hover:text-white'
    }`;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${isScrolled ? 'bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 group">
            <div className="w-12 h-12 bg-white/5 border border-white/20 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,138,50,0.3)]">
               <img src={edotLogo} alt="EDOT" className="w-full h-full object-cover shadow-inner" />
            </div>
            <span className="text-2xl font-black tracking-widest uppercase text-white group-hover:text-[#FFD700] transition-colors">EDOT</span>
          </Link>
        </div>
        
        {/* CENTER: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 bg-[#11151F]/40 backdrop-blur-md border border-white/5 px-8 py-3 rounded-full shadow-inner">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
          
          <div className="relative" ref={catDropdownRef}>
            <button 
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className={`text-xs font-black uppercase tracking-widest transition-colors py-2 flex items-center gap-1.5 ${catDropdownOpen ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Categories <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180 text-[#FFD700]' : 'text-slate-500'}`} />
            </button>
            
            <div className={`absolute top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 w-[600px] bg-[#11151F] border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-200 origin-top ${catDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
               
               <div className="grid grid-cols-2 gap-8">
                  {/* Foundation */}
                  <div>
                     <h5 className="text-[#008A32] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#008A32]/20 pb-3">
                        Foundation
                     </h5>
                     <div className="flex flex-col gap-2">
                       {foundationCategories.map((cat, idx) => (
                         <Link key={idx} to={cat.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0B0E14] border border-transparent hover:border-white/5 transition-all group">
                           <div className="w-8 h-8 rounded-lg bg-[#008A32]/5 flex items-center justify-center group-hover:bg-[#008A32]/10 transition-colors shrink-0">
                               {cat.iconSmall}
                           </div>
                           <h4 className="text-slate-300 text-xs font-bold group-hover:text-white transition-colors">{cat.name}</h4>
                         </Link>
                       ))}
                     </div>
                  </div>

                  {/* Advanced */}
                  <div>
                     <h5 className="text-[#FFD700] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#FFD700]/20 pb-3">
                        Advanced
                     </h5>
                     <div className="flex flex-col gap-2">
                       {advancedCategories.map((cat, idx) => (
                         <Link key={idx} to={cat.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0B0E14] border border-transparent hover:border-white/5 transition-all group">
                           <div className="w-8 h-8 rounded-lg bg-[#FFD700]/5 flex items-center justify-center group-hover:bg-[#FFD700]/10 transition-colors shrink-0">
                               {cat.iconSmall}
                           </div>
                           <h4 className="text-slate-300 text-xs font-bold group-hover:text-white transition-colors">{cat.name}</h4>
                         </Link>
                       ))}
                     </div>
                  </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-white/5 text-center">
                 <Link to="/courses" className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:text-[#e5c100] flex items-center justify-center gap-2">Browse Full Catalog <ArrowRight className="w-3 h-3" /></Link>
               </div>
            </div>
          </div>

          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>
        
        {/* RIGHT: Actions */}
        <div className="hidden lg:flex items-center justify-end gap-4 min-w-[200px]">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard/messages" className="text-slate-400 hover:text-[#FFD700] transition-colors relative bg-[#11151F] w-10 h-10 flex items-center justify-center rounded-full border border-white/5 group shadow-inner">
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FFD700] rounded-full border border-[#0B0E14]"></span>
              </Link>
              
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-[#11151F] border border-white/5 rounded-full hover:border-[#FFD700]/30 transition-all focus:outline-none group shadow-inner"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#008A32] to-[#FFD700] flex items-center justify-center text-[#0B0E14] shadow-md">
                    <span className="font-black text-xs">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180 text-[#FFD700]' : ''}`} />
                </button>

                <div className={`absolute top-[calc(100%+1rem)] right-0 w-64 bg-[#11151F] border border-white/10 rounded-[2rem] shadow-2xl transition-all duration-200 origin-top-right overflow-hidden ${userDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                  <div className="p-6 border-b border-white/5 bg-[#0B0E14]/40">
                    <p className="text-sm font-black text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#008A32] font-black truncate mt-1">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-black text-slate-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5 transition-colors">
                      <Shield className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/dashboard/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-black text-slate-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5 transition-colors">
                      <BookOpen className="w-4 h-4" /> My Learning
                    </Link>
                    <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-black text-slate-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </div>
                  <div className="p-3 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-black text-red-500 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-6 py-2.5 text-[10px] uppercase tracking-widest font-black text-slate-300 hover:text-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] border border-white/10 bg-[#11151F] rounded-xl transition-all hover:border-[#FFD700]/30">Log In</Link>
              <Link to="/register" className="px-6 py-2.5 text-[10px] uppercase tracking-widest font-black text-[#0B0E14] bg-[#008A32] rounded-xl hover:bg-[#007028] shadow-[0_0_15px_rgba(0,138,50,0.3)] hover:scale-105 transition-all">Sign Up</Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-4">
          <button onClick={toggleMenu} className="text-white p-2.5 bg-[#11151F] border border-white/10 rounded-xl hover:border-white/20 transition-all focus:outline-none">
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FFD700]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0B0E14]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 flex flex-col space-y-2">
            <NavLink to="/" className={({isActive}) => `px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black ${isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-slate-400 hover:text-white hover:bg-[#11151F]'}`}>Home</NavLink>
            <NavLink to="/courses" className={({isActive}) => `px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black ${isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-slate-400 hover:text-white hover:bg-[#11151F]'}`}>Courses</NavLink>
            
            {/* Mobile Categories Accordion Simplified */}
            <div className="px-5 py-4 bg-[#11151F]/50 rounded-2xl border border-white/5 my-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#008A32] mb-3 block">Foundation</span>
              <div className="flex flex-col gap-2 pl-2 border-l border-[#008A32]/20 mb-5">
                 {foundationCategories.map(cat => <Link key={cat.name} to={cat.path} className="text-xs uppercase tracking-widest text-slate-400 py-1.5 hover:text-white">{cat.name}</Link>)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-3 block">Advanced</span>
              <div className="flex flex-col gap-2 pl-2 border-l border-[#FFD700]/20">
                 {advancedCategories.map(cat => <Link key={cat.name} to={cat.path} className="text-xs uppercase tracking-widest text-slate-400 py-1.5 hover:text-white">{cat.name}</Link>)}
              </div>
            </div>

            <NavLink to="/about" className={({isActive}) => `px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black ${isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-slate-400 hover:text-white hover:bg-[#11151F]'}`}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => `px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black ${isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-slate-400 hover:text-white hover:bg-[#11151F]'}`}>Contact</NavLink>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="px-5 py-4 flex items-center gap-4 bg-[#11151F] rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#008A32] to-[#FFD700] flex items-center justify-center text-[#0B0E14] font-black text-lg">{user?.name?.charAt(0) || 'U'}</div>
                    <div>
                      <p className="text-sm font-black text-white">{user?.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#008A32] mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black text-slate-400 hover:text-white hover:bg-[#11151F]">View Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-5 py-4 rounded-xl text-xs uppercase tracking-widest font-black text-red-500 hover:bg-red-500/10">Log Out Extranet</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-2">
                  <Link to="/login" className="py-4 text-center rounded-xl text-white font-black text-xs uppercase tracking-widest border border-white/10 bg-[#11151F] hover:border-[#FFD700]/30 shadow-inner">Log In</Link>
                  <Link to="/register" className="py-4 text-center rounded-xl bg-[#008A32] text-white font-black text-xs uppercase tracking-widest hover:bg-[#007028] shadow-[0_0_15px_rgba(0,138,50,0.3)]">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

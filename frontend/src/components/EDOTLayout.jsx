import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Home, 
  Users, 
  UserSquare, 
  ClipboardCheck, 
  Wallet, 
  BellRing, 
  CalendarDays, 
  BookOpen, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Search,
  Menu,
  Award,
  Plus,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import CommandK from './CommandK';
import edotLogo from '../assets/edot-logo.jpg';

function NavItem({ item, metrics, role, sidebarCollapsed, onLinkClick }) {
  let badgeCount = 0;
  let badgeColor = 'bg-blue-500 text-white';

  if (item.path.includes('/messages')) {
    badgeCount = metrics.unreadMessages;
  } else if (item.path.includes('/dashboard/users') && role === 'admin') {
    badgeCount = metrics.pendingUsers;
    badgeColor = 'bg-rose-500 text-white';
  } else if (item.path.includes('/approvals')) {
    badgeCount = metrics.pendingApprovals;
    badgeColor = 'bg-amber-500 text-white';
  } else if (item.path.includes('/my-courses')) {
    badgeCount = metrics.pendingCourses;
    badgeColor = 'bg-amber-500 text-white';
  } else if (item.path.includes('/certificates')) {
    badgeCount = metrics.newCertificates;
    badgeColor = 'bg-emerald-500 text-white';
  }

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      onClick={() => onLinkClick(false)}
      className={({ isActive }) =>
        `group relative flex items-center justify-between px-4 py-3 xl:py-3.5 rounded-2xl transition-all duration-300 font-medium ${
          isActive
            ? (role === 'admin' ? 'bg-[#FACC15]/10 border border-[#FACC15]/30 shadow-[0_0_15px_rgba(250,204,21,0.1)] text-[#FACC15]' : 'bg-[#1e293b]/80 border border-[#4ade80]/20 shadow-[0_0_15px_rgba(74,222,128,0.05)] text-[#d9f99d]')
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#151e2b]/50 dark:hover:text-white'
        }`
      }
    >
      <div className="flex items-center gap-3">
        <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-300" />
        {!sidebarCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>}
      </div>
      {badgeCount > 0 && !sidebarCollapsed && (
        <span className={`${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm animate-in zoom-in duration-300`}>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
      {badgeCount > 0 && sidebarCollapsed && (
        <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${badgeColor}`}></span>
      )}
    </NavLink>
  );
}

export default function EDOTLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [financeOpen, setFinanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const quickActionsRef = useRef(null);
  
  const [metrics, setMetrics] = useState({
    unreadMessages: 0,
    pendingApprovals: 0,
    pendingCourses: 0,
    newCertificates: 0,
    pendingUsers: 0
  });

  useEffect(() => {
    // Check initial dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Force dark mode globally based on design system
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/users/dashboard-metrics');
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard metrics', err);
      }
    };
    if (user) {
      fetchMetrics();
      const intervalId = setInterval(fetchMetrics, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const role = user?.role ? user.role.toLowerCase().trim() : 'student';

  const roleNavConfig = {
    admin: {
      menu1: [
        { name: 'Dashboard', icon: Home, path: '/dashboard', exact: true },
        { name: 'All Users (Admin)', icon: Users, path: '/dashboard/users' },
        { name: 'Approvals', icon: ClipboardCheck, path: '/dashboard/approvals' },
        { name: 'Teachers', icon: UserSquare, path: '/dashboard/teachers' },
        { name: 'Students', icon: Users, path: '/dashboard/students' },
        { name: 'Attendance', icon: ClipboardCheck, path: '/dashboard/attendance' },
        { name: 'Revenue', icon: TrendingUp, path: '/dashboard/revenue' },
        { name: 'Performance', icon: Award, path: '/dashboard/performance' },
        { name: 'Teaching Trends', icon: BookOpen, path: '/dashboard/teaching' },
      ],
      menu2: [
        { name: 'Notice', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Calendar', icon: CalendarDays, path: '/dashboard/calendar' },
        { name: 'Library', icon: BookOpen, path: '/dashboard/library' },
        { name: 'Message', icon: MessageSquare, path: '/dashboard/messages' },
      ],
      showFinance: true,
      quickActions: [
        { name: 'Add Student', icon: Users, path: '/dashboard/students' },
        { name: 'Send Announcement', icon: BellRing, path: '/dashboard/notice' }
      ]
    },
    instructor: {
      menu1: [
        { name: 'Dashboard', icon: Home, path: '/dashboard', exact: true },
        { name: 'Create Course', icon: BookOpen, path: '/dashboard/builder' },
        { name: 'Manage Courses', icon: ClipboardCheck, path: '/dashboard/my-courses' },
        { name: 'My Classes', icon: BookOpen, path: '/dashboard/classes' },
        { name: 'Students', icon: Users, path: '/dashboard/students' },
        { name: 'Attendance', icon: ClipboardCheck, path: '/dashboard/attendance' },
        { name: 'Performance', icon: Award, path: '/dashboard/performance' },
        { name: 'Teaching Activity', icon: TrendingUp, path: '/dashboard/teaching' },
      ],
      menu2: [
        { name: 'Notice', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Calendar', icon: CalendarDays, path: '/dashboard/calendar' },
        { name: 'Message', icon: MessageSquare, path: '/dashboard/messages' },
      ],
      showFinance: false,
      quickActions: [
        { name: 'Create Course', icon: BookOpen, path: '/dashboard/builder' },
        { name: 'Mark Attendance', icon: ClipboardCheck, path: '/dashboard/attendance' }
      ]
    },
    student: {
      menu1: [
        { name: 'Dashboard', icon: Home, path: '/dashboard', exact: true },
        { name: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
        { name: 'Schedule', icon: CalendarDays, path: '/dashboard/schedule' },
      ],
      menu2: [
        { name: 'Notice', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Library', icon: BookOpen, path: '/dashboard/library' },
        { name: 'Message', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Certificates', icon: Award, path: '/dashboard/certificates' },
      ],
      showFinance: false,
      quickActions: []
    },
    parent: {
      menu1: [
        { name: 'Dashboard', icon: Home, path: '/dashboard', exact: true },
        { name: 'My Child', icon: Users, path: '/dashboard/child' },
        { name: 'Progress Report', icon: ClipboardCheck, path: '/dashboard/progress' },
        { name: 'Schedule', icon: CalendarDays, path: '/dashboard/schedule' },
      ],
      menu2: [
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Notifications', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Library', icon: BookOpen, path: '/dashboard/library' },
      ],
      showFinance: false,
      quickActions: []
    }
  };

  const currentConfig = roleNavConfig[role] || roleNavConfig.student;
  const navItemsMenu1 = currentConfig.menu1;
  const navItemsMenu2 = currentConfig.menu2;
  const showFinance = currentConfig.showFinance || false;
  const quickActions = currentConfig.quickActions || [];

  // themeClass logic removed, handled globally

  return (
    <div style={{ backgroundColor: 'var(--bg-base)' }} className={`h-screen w-full flex flex-col md:flex-row transition-colors duration-300 relative overflow-hidden text-slate-100`}>
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,138,50,0.30), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255,215,0,0.20), transparent 40%), radial-gradient(circle at 50% 75%, rgba(227,10,23,0.10), transparent 45%), linear-gradient(180deg, rgba(11,14,20,1), rgba(11,14,20,0.95), rgba(11,14,20,1))', backgroundBlendMode: 'screen, screen, screen, normal' }} />
      <CommandK />
      {/* Animated Background Mesh */}
      
      {/* Mobile Header */}
      <div className="md:hidden glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
          <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto rounded-lg" />
          <span className="text-gradient">EDOT</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 dark:text-slate-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar tilet-border-sidebar shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed md:sticky top-0 left-0 h-screen
        ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-[88px]' : 'w-64'}
      `}>
        <div className="p-6 pb-2 flex items-center justify-between">
           <div className={`flex items-center gap-3 font-bold text-2xl text-indigo-600 dark:text-indigo-400 transition-all ${sidebarCollapsed ? 'mx-auto' : ''}`}>
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto rounded-xl shadow-sm" />
             {!sidebarCollapsed && <span className="tracking-tight animate-in fade-in">EDOT</span>}
           </div>
           
           {!mobileMenuOpen && (
             <button 
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               className="hidden md:flex text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-transparent dark:hover:bg-slate-800"
             >
               {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
             </button>
           )}
        </div>

        <div className="overflow-y-auto overflow-x-hidden p-4 space-y-8 flex-1 scrollbar-hide mt-4">
           
           {/* Section: MAIN */}
           <div>
             {!sidebarCollapsed && <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-4">MAIN</p>}
             <nav className="space-y-1.5">
               {navItemsMenu1.map(item => (
                 <NavItem key={item.name} item={item} metrics={metrics} role={role} sidebarCollapsed={sidebarCollapsed} onLinkClick={setMobileMenuOpen} />
               ))}
               
               {/* Finance Accordion */}
               {showFinance && (
               <div>
                 <button 
                   onClick={() => setFinanceOpen(!financeOpen)}
                   className={`w-full flex items-center justify-between px-4 py-3 xl:py-3.5 rounded-xl transition-all duration-300 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white`}
                 >
                   <div className="flex items-center gap-3">
                     <Wallet className="w-5 h-5 shrink-0 transition-transform hover:scale-110 duration-300" />
                     {!sidebarCollapsed && <span className="animate-in fade-in slide-in-from-left-2">Finance</span>}
                   </div>
                   {!sidebarCollapsed && <ChevronDown className={`w-4 h-4 transition-transform ${financeOpen ? 'rotate-180' : ''}`} />}
                 </button>
                 {financeOpen && !sidebarCollapsed && (
                   <div className="pl-12 pr-4 py-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                     <NavLink to="/dashboard/finance/fees" className={({isActive}) => `block py-2.5 text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                       Fees Collection
                     </NavLink>
                     <NavLink to="/dashboard/finance/expenses" className={({isActive}) => `block py-2.5 text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                       Expenses
                     </NavLink>
                   </div>
                 )}
               </div>
               )}
             </nav>
           </div>

           {/* Section: MANAGEMENT */}
           <div>
             {!sidebarCollapsed && <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-4">MANAGEMENT</p>}
             <nav className="space-y-1.5">
               {navItemsMenu2.map(item => (
                 <NavItem key={item.name} item={item} metrics={metrics} role={role} sidebarCollapsed={sidebarCollapsed} onLinkClick={setMobileMenuOpen} />
               ))}
             </nav>
           </div>

           {/* Section: COMMUNICATION */}
           <div>
             {!sidebarCollapsed && <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-4">SETTINGS</p>}
             <nav className="space-y-1.5">
               <NavItem item={{ name: 'Profile', icon: User, path: '/dashboard/profile' }} metrics={metrics} role={role} sidebarCollapsed={sidebarCollapsed} onLinkClick={setMobileMenuOpen} />
               <NavItem item={{ name: 'Setting', icon: Settings, path: '/dashboard/settings' }} metrics={metrics} role={role} sidebarCollapsed={sidebarCollapsed} onLinkClick={setMobileMenuOpen} />
             </nav>
           </div>
        </div>

        {/* Bottom area (Logout) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors font-medium ${sidebarCollapsed ? 'md:px-0' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span className="animate-in fade-in">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen max-h-screen bg-transparent transition-colors duration-300">
        
        {/* Top Header */}
        <header className={`h-[88px] tilet-border-header border-b px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-colors duration-300 shadow-sm bg-[#0B0E14]/40 border-transparent backdrop-blur-md`}>
          
          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl hidden sm:block relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
              <input 
              type="text" 
              placeholder="Global Search (Students, Courses, Messages)..." 
              className={`w-full pl-12 pr-4 py-2.5 border border-transparent rounded-xl text-sm focus:outline-none transition-all shadow-sm bg-[#163828] text-white hover:border-[#1F4533] focus:bg-[#1F4533] placeholder:text-green-500/50 font-medium`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden lg:flex">
               <span className="text-xs font-semibold text-slate-400 glass-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md shadow-sm">CTRL + K</span>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            
            {/* Quick Actions (Admin/Instructor) */}
            {quickActions.length > 0 && (
              <div className="relative hidden md:block" ref={quickActionsRef}>
                <button 
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${role === 'admin' ? 'bg-[#FACC15] hover:bg-[#EAB308] text-[#020617] shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-[#EAB308] hover:bg-[#FACC15] dark:bg-[#EAB308] dark:hover:bg-[#FACC15] text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}
                >
                  <Plus className="w-4 h-4" />
                  Quick Action
                </button>
                
                {quickActionsOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card dark:bg-slate-900 rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                      <p className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Create New</p>
                      {quickActions.map(action => (
                        <button key={action.name} onClick={() => { setQuickActionsOpen(false); navigate(action.path); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-transparent dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left group">
                           <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                             <action.icon className="w-4 h-4" />
                           </div>
                           {action.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode toggle strictly disabled to maintain core identity */}


            {/* Notifications */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className={`relative pl-3 border-l ${role === 'admin' ? 'border-white/10' : 'border-slate-200 dark:border-slate-700'}`} ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none cursor-pointer group"
              >
                <div className="hidden lg:block text-right">
                  <p className={`text-sm font-bold transition-colors text-white`}>{user?.name || 'Kenenisa Beyan'}</p>
                  <p className={`text-xs font-medium capitalize text-slate-400`}>{user?.role || role}</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  <UserAvatar user={user} className="w-full h-full text-base border-2 border-white dark:border-slate-900" />
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-72 glass-card overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 bg-transparent/50 dark:bg-slate-800/50 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-sm">
                      <UserAvatar user={user} className="w-full h-full text-xl border-[3px] border-white dark:border-slate-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{user?.name || 'Admin User'}</h3>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 capitalize">{user?.role || 'Admin'}</p>
                      <p className="text-xs text-slate-500 mt-1">{user?.email || 'admin@edot.com'}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-1">
                    <button 
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-transparent dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button 
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-transparent dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
         <div className={`flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden mb-16 md:mb-0 relative z-10 text-white transition-colors duration-300`}>
           {/* Legacy mesh backgrounds removed. Global mesh background is now configured on the layout container. */}
           
           <Outlet />
        </div>
      </main>
    </div>
  );
}
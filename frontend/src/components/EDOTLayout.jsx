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
import edotLogo from '../assets/edot-logo.jpg';

export default function EDOTLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [financeOpen, setFinanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileDropdownRef = useRef(null);
  const quickActionsRef = useRef(null);
  
  const [metrics, setMetrics] = useState({
    unreadMessages: 0,
    pendingApprovals: 0,
    pendingCourses: 0,
    newCertificates: 0
  });

  useEffect(() => {
    // Check initial dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Opted to stick to light mode by default unless user toggles, for branding consistency.
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
       document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const NavItem = ({ item }) => {
    let badgeCount = 0;
    let badgeColor = 'bg-blue-500 text-white';

    if (item.path.includes('/messages')) {
      badgeCount = metrics.unreadMessages;
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
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) =>
          `group relative flex items-center justify-between px-4 py-3 xl:py-3.5 rounded-xl transition-all duration-300 font-medium ${
            isActive
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
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
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-[#f8f9ff]'}`}>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
          <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto rounded-lg" />
          EDOT
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 dark:text-slate-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-[88px]' : 'md:w-[280px]'}
      `}>
        <div className="p-6 pb-2 flex items-center justify-between">
           <div className={`flex items-center gap-3 font-bold text-2xl text-indigo-600 dark:text-indigo-400 transition-all ${sidebarCollapsed ? 'mx-auto' : ''}`}>
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto rounded-xl shadow-sm" />
             {!sidebarCollapsed && <span className="tracking-tight animate-in fade-in">EDOT</span>}
           </div>
           
           {!mobileMenuOpen && (
             <button 
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
               className="hidden md:flex text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
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
                 <NavItem key={item.name} item={item} />
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
                 <NavItem key={item.name} item={item} />
               ))}
             </nav>
           </div>

           {/* Section: COMMUNICATION */}
           <div>
             {!sidebarCollapsed && <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-4">SETTINGS</p>}
             <nav className="space-y-1.5">
               <NavItem item={{ name: 'Profile', icon: User, path: '/dashboard/profile' }} />
               <NavItem item={{ name: 'Setting', icon: Settings, path: '/dashboard/settings' }} />
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
      <main className="flex-1 flex flex-col min-w-0 bg-transparent transition-colors duration-300">
        
        {/* Top Header */}
        <header className="h-[88px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-colors duration-300">
          
          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl hidden sm:block relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Global Search (Students, Courses, Messages)..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:text-slate-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none hidden lg:flex">
               <span className="text-xs font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md shadow-sm">CTRL + K</span>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            
            {/* Quick Actions (Admin/Instructor) */}
            {quickActions.length > 0 && (
              <div className="relative hidden md:block" ref={quickActionsRef}>
                <button 
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Quick Action
                </button>
                
                {quickActionsOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                      <p className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Create New</p>
                      {quickActions.map(action => (
                        <button key={action.name} onClick={() => { setQuickActionsOpen(false); navigate(action.path); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left group">
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

            {/* Dark & Light Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative pl-3 border-l border-slate-200 dark:border-slate-700" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none cursor-pointer group"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">{user?.role || 'Admin'}</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 text-indigo-600 font-bold">
                    {user?.avatar && user.avatar !== 'default-avatar.png' ? (
                      <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                    )}
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-sm">
                      <div className="w-full h-full rounded-full border-[3px] border-white dark:border-slate-900 overflow-hidden flex items-center justify-center bg-white text-indigo-600 font-bold text-xl">
                        {user?.avatar && user.avatar !== 'default-avatar.png' ? (
                          <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                        )}
                      </div>
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button 
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
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
        <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden mb-16 md:mb-0 relative text-slate-800 dark:text-slate-200 transition-colors duration-300">
           {/* Dynamic Background Elements for depth */}
           <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] max-w-3xl max-h-[800px] bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
           <div className="fixed bottom-0 right-0 w-[40vw] h-[40vw] max-w-2xl max-h-[600px] bg-purple-400/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
           
           <Outlet />
        </div>
      </main>
    </div>
  );
}
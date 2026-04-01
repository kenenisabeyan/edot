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
  Bell,
  Menu,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import edotLogo from '../assets/edot-logo.jpg';

export default function EDOTLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [financeOpen, setFinanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  
  const [metrics, setMetrics] = useState({
    unreadMessages: 0,
    pendingApprovals: 0,
    pendingCourses: 0,
    newCertificates: 0
  });

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
      ],
      menu2: [
        { name: 'Notice', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Calendar', icon: CalendarDays, path: '/dashboard/calendar' },
        { name: 'Library', icon: BookOpen, path: '/dashboard/library' },
        { name: 'Message', icon: MessageSquare, path: '/dashboard/messages' },
      ],
      showFinance: true
    },
    instructor: {
      menu1: [
        { name: 'Dashboard', icon: Home, path: '/dashboard', exact: true },
        { name: 'Create Course', icon: BookOpen, path: '/dashboard/builder' },
        { name: 'Manage Courses', icon: ClipboardCheck, path: '/dashboard/my-courses' },
        { name: 'My Classes', icon: BookOpen, path: '/dashboard/classes' },
        { name: 'Students', icon: Users, path: '/dashboard/students' },
        { name: 'Attendance', icon: ClipboardCheck, path: '/dashboard/attendance' },
      ],
      menu2: [
        { name: 'Notice', icon: BellRing, path: '/dashboard/notice' },
        { name: 'Calendar', icon: CalendarDays, path: '/dashboard/calendar' },
        { name: 'Message', icon: MessageSquare, path: '/dashboard/messages' },
      ],
      showFinance: false
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
      showFinance: false
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
      showFinance: false
    }
  };

  const currentConfig = roleNavConfig[role] || roleNavConfig.student;
  const navItemsMenu1 = currentConfig.menu1;
  const navItemsMenu2 = currentConfig.menu2;
  const showFinance = currentConfig.showFinance || false;
  const NavItem = ({ item }) => {
    let badgeCount = 0;
    if (item.path.includes('/messages')) badgeCount = metrics.unreadMessages;
    else if (item.path.includes('/approvals')) badgeCount = metrics.pendingApprovals;
    else if (item.path.includes('/my-courses')) badgeCount = metrics.pendingCourses;
    else if (item.path.includes('/certificates')) badgeCount = metrics.newCertificates;

    return (
      <NavLink
        to={item.path}
        end={item.exact}
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) =>
          `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            isActive
              ? 'bg-[#4338ca] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`
        }
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-5 h-5 shrink-0" />
          {item.name}
        </div>
        {badgeCount > 0 && (
          <span className="bg-[#3390ec] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-xl text-[#4338ca]">
          <img src={edotLogo} alt="EDOT Logo" className="h-8 w-auto" />
          EDOT
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-40 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-transparent">
           <div className="flex items-center gap-2 font-bold text-2xl text-[#4338ca] mb-8">
             <img src={edotLogo} alt="EDOT Logo" className="h-10 w-auto" />
             EDOT
           </div>

           <div className="overflow-y-auto pr-2 -mr-2 space-y-6 h-[calc(100vh-140px)] scrollbar-hide">
              {/* Menu 1 */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">MENU</p>
                <nav className="space-y-1">
                  {navItemsMenu1.map(item => (
                    <NavItem key={item.name} item={item} />
                  ))}
                  
                  {/* Finance Accordion */}
                  {showFinance && (
                  <div>
                    <button 
                      onClick={() => setFinanceOpen(!financeOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900`}
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 shrink-0" />
                        Finance
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${financeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {financeOpen && (
                      <div className="pl-12 pr-4 py-2 space-y-1">
                        <NavLink to="/dashboard/finance/fees" className={({isActive}) => `block py-2 text-sm font-medium ${isActive ? 'text-[#4338ca]' : 'text-slate-500 hover:text-slate-900'}`}>
                          Fees Collection
                        </NavLink>
                        <NavLink to="/dashboard/finance/expenses" className={({isActive}) => `block py-2 text-sm font-medium ${isActive ? 'text-[#4338ca]' : 'text-slate-500 hover:text-slate-900'}`}>
                          Expenses
                        </NavLink>
                      </div>
                    )}
                  </div>
                  )}
                </nav>
              </div>

              {/* Menu 2 */}
              <div>
                <nav className="space-y-1">
                  {navItemsMenu2.map(item => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </nav>
              </div>

              {/* Other */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">OTHER</p>
                <nav className="space-y-1">
                  <NavItem item={{ name: 'Profile', icon: User, path: '/dashboard/profile' }} />
                  <NavItem item={{ name: 'Setting', icon: Settings, path: '/dashboard/settings' }} />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-left"
                  >
                    <LogOut className="w-5 h-5 shrink-0" /> Log out
                  </button>
                </nav>
              </div>
           </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white md:bg-transparent border-b border-transparent px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
            />
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell />
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-slate-500 font-medium capitalize">{user?.role || 'Admin'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-indigo-600 font-bold">
                  {user?.avatar && user.avatar !== 'default-avatar.png' ? (
                    <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                  )}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex items-start gap-3 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      {user?.avatar && user.avatar !== 'default-avatar.png' ? (
                        <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{user?.name || 'Admin User'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{user?.department || user?.specialization || 'EDOT Platform'}</p>
                      <p className="text-xs font-semibold text-indigo-600 mt-1 capitalize">{user?.role || 'Admin'}</p>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button 
                      onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" /> Change Password
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto mb-10 md:mb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
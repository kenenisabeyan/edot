import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Award, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let notifs = [];
        const role = user?.role || 'student';
        
        if (role === 'admin') {
          // Fetch pending courses for admin
          const { data } = await api.get('/admin/courses/pending');
          if (data.count > 0) {
            notifs.push({
              id: 'admin_pending',
              title: 'Action Required',
              message: `There are ${data.count} pending courses requiring your approval.`,
              icon: <ClipboardCheck className="w-5 h-5 text-amber-500" />,
              link: '/dashboard/approvals',
              time: 'Just now',
              unread: true
            });
          }
        } else if (role === 'instructor') {
          // Fetch instructor courses to see if any are pending or recently approved
          const { data } = await api.get('/instructor/courses');
          const pending = data.data.filter(c => c.status === 'pending');
          const approved = data.data.filter(c => c.status === 'approved');
          
          if (pending.length > 0) {
            notifs.push({
              id: 'inst_pending',
              title: 'Courses Under Review',
              message: `You have ${pending.length} courses waiting for admin approval.`,
              icon: <Clock className="w-5 h-5 text-amber-500" />,
              link: '/dashboard/my-courses',
              time: 'Recently',
              unread: true
            });
          }
          if (approved.length > 0) {
             notifs.push({
              id: 'inst_approved_mock', // Usually we'd check timestamps, just mocking a recent approval
              title: 'Course Approved!',
              message: `Good news! One of your courses has gone live.`,
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              link: '/dashboard/my-courses',
              time: '1 hr ago',
              unread: false
            });
          }
        } else {
          // Student mocks
          notifs.push({
            id: 'stu_cert',
            title: 'New Certificate Available',
            message: 'You successfully completed Introduction to React! View your certificate.',
            icon: <Award className="w-5 h-5 text-[#4338ca]" />,
            link: '/dashboard/certificates',
            time: '2 hrs ago',
            unread: true
          });
          notifs.push({
            id: 'stu_course',
            title: 'Welcome to EDOT Platform',
            message: 'Explore our digital library and enroll in new courses today.',
            icon: <Bell className="w-5 h-5 text-slate-500" />,
            link: '/dashboard/courses',
            time: '1 day ago',
            unread: false
          });
        }

        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => n.unread).length);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleNotificationClick = (link) => {
    setIsOpen(false);
    if (link) navigate(link);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm relative focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="font-medium">No new notifications</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map(notif => (
                  <button 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.link)}
                    className={`p-4 border-b border-slate-50 text-left hover:bg-slate-50 transition-colors flex gap-4 ${notif.unread ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${notif.unread ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100'}`}>
                      {notif.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-2 font-medium">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 ml-auto"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 text-center">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

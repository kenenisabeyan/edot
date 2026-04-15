import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

export default function ThemeDropdown() {
  const [theme, setTheme] = useState(localStorage.getItem('edot-theme') || 'default');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('edot-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(localStorage.getItem('edot-theme') || 'default');
    };
    window.addEventListener('theme-changed', syncTheme);
    return () => window.removeEventListener('theme-changed', syncTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: 'default', label: '1. Default', icon: Monitor },
    { value: 'light', label: '2. Light/White', icon: Sun },
    { value: 'extra-dark', label: '3. Dark', icon: Moon }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 relative group bg-[#11151F]/40 shadow-sm"
        title="Theme Settings"
      >
        {theme === 'default' && <Monitor className="w-5 h-5 opacity-70" />}
        {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
        {theme === 'extra-dark' && <Moon className="w-5 h-5 text-blue-400" />}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-[#FFD700]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 w-48 bg-[#11151F] border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2 px-3 pt-2">Theme Mode</div>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setIsOpen(false);
                window.dispatchEvent(new Event('theme-changed'));
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${theme === opt.value ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

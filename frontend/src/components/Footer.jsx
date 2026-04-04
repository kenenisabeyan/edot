import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import edotLogo from '../assets/edot-logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-10 border-t-4 border-[#FFC107]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-sm">
            <img src={edotLogo} alt="EDOT Logo" className="h-8 w-8 object-contain" />
            <span className="font-extrabold text-lg tracking-wide text-[#111111]">EDOT</span>
          </div>

          {/* Links Area */}
          <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-300">
            <Link to="/about" className="hover:text-[#FFC107] transition-colors">About Us</Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="hover:text-[#FFC107] transition-colors">Terms of Service</Link>
            <span className="text-gray-600">|</span>
            <Link to="/privacy" className="hover:text-[#FFC107] transition-colors">Privacy Policy</Link>
          </div>

          {/* Social Icons Area */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#FFC107] transition-colors scale-110">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-[#FFC107] transition-colors scale-110">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-[#FFC107] transition-colors scale-110">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-[#FFC107] transition-colors scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

        </div>
        
        <div className="mt-8 text-center text-xs text-gray-600 font-bold uppercase tracking-widest">
           &copy; {new Date().getFullYear()} EDOT Platform. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

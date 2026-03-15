import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 lg:py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">E</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">EDOT</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering learners worldwide with quality education and expert-led courses.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-slate-400 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Instructor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Categories</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/courses?category=programming" className="hover:text-white transition-colors">Programming</Link></li>
              <li><Link to="/courses?category=mathematics" className="hover:text-white transition-colors">Mathematics</Link></li>
              <li><Link to="/courses?category=science" className="hover:text-white transition-colors">Science</Link></li>
              <li><Link to="/courses?category=exam-prep" className="hover:text-white transition-colors">Exam Prep</Link></li>
              <li><Link to="/courses?category=languages" className="hover:text-white transition-colors">Languages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Get Updates</h4>
            <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest courses and offers.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-800 border-slate-700 text-sm rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
                aria-label="Email address"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-r-md transition-colors"
                aria-label="Subscribe"
              >
                Go
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EDOT. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

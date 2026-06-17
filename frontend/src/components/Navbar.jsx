import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'முகப்பு (Home)', path: '/' },
    { name: 'வாக்கியம் (Sentence)', path: '/sentence-builder' },
    { name: 'உரையாடல் (Dialogue)', path: '/dialogue-generator' },
    { name: 'பற்றி (About)', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-tamil-600 to-brand-500 text-white shadow-md shadow-tamil-500/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight bg-gradient-to-r from-tamil-600 via-tamil-500 to-brand-500 bg-clip-text text-transparent dark:from-tamil-400 dark:to-brand-400">
                தமிழ் Dialogue
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-tamil leading-none">
                வாக்கிய அமைப்பாளர்
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-tamil-50 text-tamil-600 dark:bg-tamil-950/30 dark:text-tamil-400 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions Area */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {/* Desktop Auth Links */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-tamil-600 to-brand-500 text-white font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono leading-none">
                      @{user?.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="ml-2 text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-500/5 hover:bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/10 cursor-pointer"
                  >
                    வெளியேறு (Logout)
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 transition-colors"
                  >
                    உள்நுழை (Sign In)
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-tamil-600 to-brand-500 rounded-xl hover:shadow-md hover:shadow-tamil-500/10 hover:brightness-105 active:scale-95 transition-all duration-300"
                  >
                    பதிவு செய்க (Sign Up)
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-lg transition-all duration-300 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-tamil-50 text-tamil-600 dark:bg-tamil-950/40 dark:text-tamil-400 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Auth Items */}
          <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 mt-2 space-y-2">
            {isAuthenticated ? (
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-tamil-600 to-brand-500 text-white font-bold text-sm uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono leading-none">
                      @{user?.username}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-red-500 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl cursor-pointer"
                >
                  வெளியேறு (Logout)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-xl"
                >
                  உள்நுழை (Sign In)
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-tr from-tamil-600 to-brand-500 rounded-xl text-center"
                >
                  பதிவு செய்க (Sign Up)
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

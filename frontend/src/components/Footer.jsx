import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
          {/* Tagline */}
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              தமிழ் வாக்கிய அமைப்பாளர் & உரையாடல்
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-tamil mt-1">
              யாதும் ஊரே யாவரும் கேளிர் - கணியன் பூங்குன்றனார்
            </span>
          </div>

          {/* Copyright details */}
          <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-1">
            <span>&copy; {currentYear} Tamil Dialogue & Sentence Builder.</span>
            <span className="flex items-center justify-center">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500 animate-pulse" /> for Tamil Education.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

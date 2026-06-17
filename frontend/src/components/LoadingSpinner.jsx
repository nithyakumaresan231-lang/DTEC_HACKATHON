import React from 'react';

export default function LoadingSpinner({ message = "செயலாக்கப்படுகிறது..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Track Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800/40"></div>
        {/* Spinner Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-tamil-500 dark:border-t-tamil-400 animate-spin"></div>
        {/* Center Glow */}
        <div className="absolute inset-3 rounded-full bg-brand-500/10 dark:bg-brand-400/10 animate-pulse"></div>
      </div>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-300 font-medium text-sm animate-pulse">
          {message}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-tamil mt-1">
          தயவுசெய்து காத்திருக்கவும் (Please wait)
        </p>
      </div>
    </div>
  );
}

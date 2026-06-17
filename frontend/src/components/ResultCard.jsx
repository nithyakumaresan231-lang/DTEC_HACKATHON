import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ResultCard({ title = "உருவாக்கப்பட்ட வாக்கியம் (Generated Sentence)", text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 glow-card transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
        
        {text && (
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/30 dark:border-slate-800/30 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale" />
                <span className="text-emerald-500 font-medium">நகலெடுக்கப்பட்டது (Copied)</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>நகலெடு (Copy)</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {text ? (
        <div className="py-2">
          <p className="text-2xl sm:text-3xl font-bold font-tamil text-tamil-600 dark:text-tamil-400 leading-relaxed text-center sm:text-left">
            {text}
          </p>
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400 dark:text-slate-500 italic text-sm">
          விவரங்களை தேர்வு செய்து வாக்கியத்தை உருவாக்கவும்.<br />
          (Choose options and generate a sentence.)
        </div>
      )}
    </div>
  );
}

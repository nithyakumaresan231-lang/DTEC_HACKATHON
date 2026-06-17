import React from 'react';
import { ShieldCheck, Code, Globe, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-grid-pattern relative">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <HelpCircle className="w-7 h-7 text-tamil-500" />
          <span>திட்டம் பற்றி (About the Project)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Objectives, linguistic architecture, and technologies powering the Tamil NLP tool.
        </p>
      </div>

      {/* Main card */}
      <div className="glass-panel rounded-3xl p-6 glow-card space-y-6">
        
        {/* Intro */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            நோக்கம் (Project Objective)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-tamil">
            தமிழ் மொழி ஒரு தொன்மையான மற்றும் வளமையான மொழியாகும். தமிழ் இலக்கணப் புணர்ச்சி விதிகள் மற்றும் கால அமைப்புகளை மாணவர்கள் எளிய முறையில் புரிந்துகொள்ள இந்தக் கல்வித்தளம் உருவாக்கப்பட்டுள்ளது.
            தமிழ் வினைமுற்றுகளை காலத்திற்கு ஏற்ப உருவாக்குதல், பெயர்ச்சொற்களை வேற்றுமை உருபுகள் கொண்டு மாற்றுதல் மற்றும் இருவருக்கு இடையேயான உரையாடல்களை உருவாக்குவதில் உள்ள சந்தி இலக்கண முறைகளை மாணவர்களுக்கு நேரடியாக விளக்குவதே இதன் நோக்கமாகும்.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            (Tamil is a classical language with complex agglutinative grammar. This platform helps students understand case declensions, verb conjugations, and phonetic sandhi rules. By using a rule-based NLP engine paired with generative AI models, it enables students to visualize grammatical transformations in real-time.)
          </p>
        </div>

        {/* NLP Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-tamil-600 dark:text-tamil-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>இலக்கண மாற்று (Rules engine)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consists of a Python grammar engine that declines objects into dative/accusative forms, and conjugates verbs based on tenses and subject suffixes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-tamil-600 dark:text-tamil-400 font-semibold text-sm">
              <Code className="w-4 h-4" />
              <span>பிழை திருத்தம் (NLP spell check)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Uses a phonologically weighted edit-distance (weighted Levenshtein distance) to correct homophonic typing mistakes (Mayangoligal) and missing Sandhi double consonants.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-tamil-600 dark:text-tamil-400 font-semibold text-sm">
              <Globe className="w-4 h-4" />
              <span>Gemini AI உரையாடல் (AI Dialogues)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Integrates with Google Gemini API using structured JSON output schemas to generate contextual dialogues alongside clean English learning translations.
            </p>
          </div>

        </div>

      </div>

      {/* Tech Stack Details */}
      <div className="glass-panel rounded-3xl p-6 glow-card space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          தொழில்நுட்பங்கள் (Technology Stack)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Frontend Stack:</p>
            <p>• React.js (Vite environment)</p>
            <p>• Tailwind CSS (v3 framework for premium UI)</p>
            <p>• Axios (API clients)</p>
            <p>• Lucide React & React Router DOM</p>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Backend Stack:</p>
            <p>• FastAPI (Python asynchronous REST APIs)</p>
            <p>• Uvicorn (ASGI web server)</p>
            <p>• Pydantic (data validations)</p>
            <p>• Google Generative AI (Gemini API Integration)</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

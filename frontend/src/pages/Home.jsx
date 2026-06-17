import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, MessageSquare, ShieldCheck, PenTool } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-start overflow-hidden bg-grid-pattern py-12">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tamil-500/10 dark:bg-tamil-500/5 rounded-full blur-3xl pulse-glow-bg"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pulse-glow-bg" style={{ animationDelay: '-4s' }}></div>

      <div className="max-w-4xl mx-auto px-4 text-center z-10 space-y-8 my-auto">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-tamil-50 dark:bg-tamil-950/40 border border-tamil-100/50 dark:border-tamil-900/30 text-tamil-600 dark:text-tamil-400 text-xs font-semibold uppercase tracking-wider animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>தமிழ் NLP கற்றல் தளம் (Tamil NLP Learning Platform)</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-50 leading-tight">
          Learn Tamil Grammar through <br />
          <span className="bg-gradient-to-r from-tamil-600 via-tamil-500 to-brand-500 bg-clip-text text-transparent dark:from-tamil-400 dark:to-brand-400">
            Dialogue & NLP Models
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-tamil">
          தமிழ் மொழியின் இலக்கண விதிகளை எளிமையாக கற்கவும், Gemini AI மூலம் தமிழ் உரையாடல்களை உருவாக்கவும் உதவும் ஒரு நவீன கல்வி தளம்.
          <span className="block font-sans text-sm text-slate-400 dark:text-slate-500 mt-2">
            (An interactive NLP educational platform to master Tamil sentence structure and generate context-rich dialogues.)
          </span>
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/sentence-builder"
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 hover:from-tamil-500 hover:to-brand-400 text-white font-semibold shadow-lg shadow-tamil-500/20 hover:shadow-tamil-500/35 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-center justify-center"
          >
            <span>வாக்கியங்களை அமைக்க (Build Sentences)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/dialogue-generator"
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-800/60 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-center justify-center shadow-sm"
          >
            <span>உரையாடல்களை உருவாக்க (Generate Dialogue)</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-3xl glow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Grammar Engine
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-tamil">
              பெயர்ச்சொற்கள், வினைச்சொற்கள் மற்றும் சந்தி விதிகளை இணைத்து பிழையற்ற வாக்கியங்களை உருவாக்குங்கள்.
              <span className="block font-sans text-xs text-slate-400 mt-1">Rule-based NLP system that automatically declines nouns and conjugates verbs based on tenses/pronouns.</span>
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-3xl glow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              AI Dialogue
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-tamil">
              வெவ்வேறு சூழல்கள், தலைப்புகள் மற்றும் தொனிகளில் தமிழ் உரையாடல்களை உடனுக்குடன் உருவாக்கவும்.
              <span className="block font-sans text-xs text-slate-400 mt-1">Generates natural situational dialogues with English translations powered by Google Gemini API.</span>
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-3xl glow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Spell Correction
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-tamil">
              வாக்கியங்களில் உள்ள எழுத்துப்பிழைகள் மற்றும் விடுபட்ட சந்தி எழுத்துக்களைத் தானாகவே கண்டறிந்து சரிசெய்யவும்.
              <span className="block font-sans text-xs text-slate-400 mt-1">Weighted homophonic Levenshtein spell corrector resolving typos and Sandhi rules instantly.</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

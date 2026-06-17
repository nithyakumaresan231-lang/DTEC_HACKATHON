import React from 'react';
import { User, Layers, PlayCircle, RefreshCw } from 'lucide-react';

export default function GrammarExplanation({ explanation }) {
  if (!explanation) {
    return (
      <div className="glass-panel rounded-3xl p-6 text-center text-slate-400 dark:text-slate-500 italic text-sm py-12">
        விளக்கத்தை அறிய வாக்கியத்தை உருவாக்கவும்.<br />
        (Generate a sentence to view grammatical explanation.)
      </div>
    );
  }

  const { subject, object, verb, sandhi } = explanation;

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-6 animate-fade-in transition-all duration-300">
      {/* Title */}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <RefreshCw className="w-5 h-5 text-tamil-500" />
        <span>இலக்கண விளக்கம் (Grammatical Explanation)</span>
      </h3>

      {/* Grid of components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Subject Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <User className="w-4 h-4" />
            <span className="font-semibold text-xs uppercase tracking-wider">எழுவாய் (Subject)</span>
          </div>
          <div>
            <p className="text-xl font-bold font-tamil text-slate-800 dark:text-slate-100">{subject.word}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Meaning: "{subject.meaning}"</p>
          </div>
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-800 dark:text-slate-200">Person:</strong> {subject.person}</p>
            <p><strong className="text-slate-800 dark:text-slate-200">Gender:</strong> {subject.gender}</p>
            <p><strong className="text-slate-800 dark:text-slate-200">Number:</strong> {subject.number}</p>
          </div>
        </div>

        {/* Object Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-4 h-4" />
            <span className="font-semibold text-xs uppercase tracking-wider">செயப்படுபொருள் (Object)</span>
          </div>
          <div>
            <p className="text-xl font-bold font-tamil text-slate-800 dark:text-slate-100">{object.root}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Meaning: "{object.meaning}"</p>
          </div>
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-800 dark:text-slate-200">Declined Case:</strong></p>
            <p className="text-tamil-600 dark:text-tamil-400 font-semibold font-tamil text-sm mt-0.5">{object.declined}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">{object.case_type}</p>
          </div>
        </div>

        {/* Verb Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
            <PlayCircle className="w-4 h-4" />
            <span className="font-semibold text-xs uppercase tracking-wider">பயனிலை (Verb)</span>
          </div>
          <div>
            <p className="text-xl font-bold font-tamil text-slate-800 dark:text-slate-100">{verb.root}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">English: "{verb.meaning}"</p>
          </div>
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <p><strong className="text-slate-800 dark:text-slate-200">Conjugated Form:</strong></p>
            <p className="text-rose-600 dark:text-rose-400 font-semibold font-tamil text-sm mt-0.5">{verb.conjugated}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Tense: {verb.tense} ({verb.suffix ? `Suffix: -${verb.suffix}` : 'Irregular'})</p>
          </div>
        </div>

      </div>

      {/* Sandhi and Union Rules Card */}
      <div className="p-4 rounded-2xl bg-tamil-50/50 dark:bg-tamil-950/10 border border-tamil-100/30 dark:border-tamil-900/20 text-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center space-x-1.5 mb-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-tamil-500"></span>
          <span>சந்தி விதிமுறை (Sandhi doubling rules)</span>
        </h4>
        <p className="text-slate-600 dark:text-slate-300 font-tamil leading-relaxed">
          {sandhi.explanation}
          {sandhi.consonant_doubled && (
            <span className="block mt-1 font-sans text-[10px] text-slate-400 dark:text-slate-500">
              * The next word starts with a hard consonant group, causing the plosive "{sandhi.consonant_doubled}" to double.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

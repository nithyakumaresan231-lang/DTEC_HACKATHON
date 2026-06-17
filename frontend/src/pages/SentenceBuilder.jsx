import React, { useState } from 'react';
import { sentenceService } from '../services/api';
import ResultCard from '../components/ResultCard';
import GrammarExplanation from '../components/GrammarExplanation';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, RefreshCcw, PenTool, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SentenceBuilder() {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'spellcheck'

  // --- Sentence Builder States ---
  const [subject, setSubject] = useState('நான்');
  const [verb, setVerb] = useState('செல்');
  const [object, setObject] = useState('பள்ளி');
  const [tense, setTense] = useState('past');
  const [customSubject, setCustomSubject] = useState('');
  const [customVerb, setCustomVerb] = useState('');
  const [customObject, setCustomObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentenceResult, setSentenceResult] = useState('');
  const [explanationResult, setExplanationResult] = useState(null);
  const [builderError, setBuilderError] = useState('');

  // --- Spell Checker States ---
  const [inputText, setInputText] = useState('அவண் பள்ளிக்கு சென்ரன்');
  const [checking, setChecking] = useState(false);
  const [spellResult, setSpellResult] = useState(null);
  const [spellError, setSpellError] = useState('');

  const subjects = [
    { label: 'நான் (I) - First Person Sing.', value: 'நான்' },
    { label: 'நாங்கள் (We) - First Person Plur.', value: 'நாங்கள்' },
    { label: 'நீ (You) - Second Person Sing.', value: 'நீ' },
    { label: 'நீங்கள் (You) - Second Person Plur. / Honorific', value: 'நீங்கள்' },
    { label: 'அவன் (He) - Third Person Masculine', value: 'அவன்' },
    { label: 'அவள் (She) - Third Person Feminine', value: 'அவள்' },
    { label: 'அவர் (He/She) - Third Person Honorific', value: 'அவர்' },
    { label: 'அவர்கள் (They) - Third Person Plural Human', value: 'அவர்கள்' },
    { label: 'அது (It) - Third Person Neuter Sing.', value: 'அது' },
    { label: 'அவை (They) - Third Person Neuter Plur.', value: 'அவை' },
    { label: 'தனிப்பயன் (Custom - Type manually)', value: 'custom' },
  ];

  const verbs = [
    { label: 'செல் (go)', value: 'செல்' },
    { label: 'படி (read/study)', value: 'படி' },
    { label: 'எழுது (write)', value: 'எழுது' },
    { label: 'செய் (do)', value: 'செய்' },
    { label: 'வா (come)', value: 'வா' },
    { label: 'போ (go)', value: 'போ' },
    { label: 'ஓடு (run)', value: 'ஓடு' },
    { label: 'பாடு (sing)', value: 'பாடு' },
    { label: 'தனிப்பயன் (Custom - Type manually)', value: 'custom' },
  ];

  const objects = [
    { label: 'பள்ளி (school)', value: 'பள்ளி' },
    { label: 'புத்தகம் (book)', value: 'புத்தகம்' },
    { label: 'கடிதம் (letter)', value: 'கடிதம்' },
    { label: 'வேலை (work)', value: 'வேலை' },
    { label: 'பாடம் (lesson)', value: 'பாடம்' },
    { label: 'வீடு (house/home)', value: 'வீடு' },
    { label: 'பூங்கா (park)', value: 'பூங்கா' },
    { label: 'பாடல் (song)', value: 'பாடல்' },
    { label: 'தனிப்பயன் (Custom - Type manually)', value: 'custom' },
  ];

  const tenses = [
    { label: 'இறந்தகாலம் (Past Tense)', value: 'past' },
    { label: 'நிகழ்காலம் (Present Tense)', value: 'present' },
    { label: 'எதிர்காலம் (Future Tense)', value: 'future' },
  ];

  const handleBuildSentence = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBuilderError('');
    
    const finalSubject = subject === 'custom' ? customSubject : subject;
    const finalVerb = verb === 'custom' ? customVerb : verb;
    const finalObject = object === 'custom' ? customObject : object;
    
    try {
      const payload = { subject: finalSubject, verb: finalVerb, object: finalObject, tense };
      const sentenceData = await sentenceService.generateSentence(payload);
      const explanationData = await sentenceService.getGrammarExplanation(payload);
      
      setSentenceResult(sentenceData.sentence);
      setExplanationResult(explanationData);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'வாக்கியத்தை உருவாக்குவதில் தோல்வி ஏற்பட்டது. (Failed to build sentence.)';
      setBuilderError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSpellCheck = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChecking(true);
    setSpellError('');
    try {
      const result = await sentenceService.correctSpelling(inputText);
      setSpellResult(result);
    } catch (err) {
      console.error(err);
      setSpellError('பிழை திருத்துவதில் தோல்வி ஏற்பட்டது. (Failed to check spelling.)');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-grid-pattern relative">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <PenTool className="w-7 h-7 text-tamil-500" />
            <span>வாக்கியம் அமைப்பாளர் & பிழை திருத்தம்</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build grammatically correct Tamil sentences or check spelling instantly.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'builder'
                ? 'bg-white text-tamil-600 dark:bg-slate-950 dark:text-tamil-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            வாக்கிய அமைப்பாளர் (Sentence Builder)
          </button>
          <button
            onClick={() => setActiveTab('spellcheck')}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'spellcheck'
                ? 'bg-white text-tamil-600 dark:bg-slate-950 dark:text-tamil-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            பிழை திருத்தம் (Spell Corrector)
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        // ================== SENTENCE BUILDER TAB ==================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Panel */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 glow-card space-y-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50 pb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-tamil-500" />
              <span>உள்ளீடுகள் (Inputs)</span>
            </h3>

            <form onSubmit={handleBuildSentence} className="space-y-4">
              {/* Subject */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">எழுவாய் (Subject)</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-sm leading-relaxed cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub.value} value={sub.value} className="dark:bg-slate-950">
                      {sub.label}
                    </option>
                  ))}
                </select>
                {subject === 'custom' && (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="e.g. தம்பி (Younger brother)"
                    className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20 mt-1.5 animate-fade-in"
                    required
                  />
                )}
              </div>

              {/* Object */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">செயப்படுபொருள் (Object)</label>
                <select
                  value={object}
                  onChange={(e) => setObject(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-sm leading-relaxed cursor-pointer"
                >
                  {objects.map((obj) => (
                    <option key={obj.value} value={obj.value} className="dark:bg-slate-950">
                      {obj.label}
                    </option>
                  ))}
                </select>
                {object === 'custom' && (
                  <input
                    type="text"
                    value={customObject}
                    onChange={(e) => setCustomObject(e.target.value)}
                    placeholder="e.g. பழம் (Fruit)"
                    className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20 mt-1.5 animate-fade-in"
                    required
                  />
                )}
              </div>

              {/* Verb */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">வினைச்சொல் (Verb Root)</label>
                <select
                  value={verb}
                  onChange={(e) => setVerb(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-sm leading-relaxed cursor-pointer"
                >
                  {verbs.map((v) => (
                    <option key={v.value} value={v.value} className="dark:bg-slate-950">
                      {v.label}
                    </option>
                  ))}
                </select>
                {verb === 'custom' && (
                  <input
                    type="text"
                    value={customVerb}
                    onChange={(e) => setCustomVerb(e.target.value)}
                    placeholder="e.g. உண் (eat)"
                    className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20 mt-1.5 animate-fade-in"
                    required
                  />
                )}
              </div>

              {/* Tense */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">காலம் (Tense)</label>
                <select
                  value={tense}
                  onChange={(e) => setTense(e.target.value)}
                  className="glass-input rounded-xl px-3 py-2 text-sm leading-relaxed cursor-pointer"
                >
                  {tenses.map((t) => (
                    <option key={t.value} value={t.value} className="dark:bg-slate-950">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading ||
                  (subject === 'custom' && !customSubject.trim()) ||
                  (object === 'custom' && !customObject.trim()) ||
                  (verb === 'custom' && !customVerb.trim())
                }
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 hover:from-tamil-500 hover:to-brand-400 text-white font-semibold shadow-md shadow-tamil-500/10 hover:shadow-tamil-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-4"
              >
                <span>வாக்கியத்தை உருவாக்கு (Generate)</span>
              </button>
            </form>

            {builderError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{builderError}</span>
              </div>
            )}
          </div>

          {/* Result Output Panel */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="glass-panel rounded-3xl py-12 flex justify-center items-center">
                <LoadingSpinner message="வாக்கியத்தை உருவாக்குகிறது (Constructing sentence)..." />
              </div>
            ) : (
              <>
                <ResultCard title="உருவாக்கப்பட்ட வாக்கியம் (Generated Sentence)" text={sentenceResult} />
                <GrammarExplanation explanation={explanationResult} />
              </>
            )}
          </div>
        </div>
      ) : (
        // ================== SPELL CORRECTOR TAB ==================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Input Form Panel */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 glow-card space-y-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50 pb-3 flex items-center space-x-2">
              <PenTool className="w-4 h-4 text-tamil-500" />
              <span>பிழை திருத்த உள்ளீடு (Input Sentence)</span>
            </h3>

            <form onSubmit={handleSpellCheck} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  தமிழ் வாக்கியம் (Type a Tamil Sentence):
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. அவண் பள்ளிக்கு சென்ரன்"
                  className="glass-input rounded-2xl px-4 py-3 text-base font-tamil min-h-[120px] focus:ring-tamil-500/20"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={checking || !inputText.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 hover:from-tamil-500 hover:to-brand-400 text-white font-semibold shadow-md shadow-tamil-500/10 hover:shadow-tamil-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <span>பிழையைச் சரிபார் (Verify Spelling)</span>
              </button>
            </form>

            {spellError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{spellError}</span>
              </div>
            )}

            {/* Instruction Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <h4 className="font-bold text-slate-700 dark:text-slate-300">How to test:</h4>
              <p>1. Type misspelled endings (e.g. <strong>சென்றன்</strong> instead of <strong>சென்றான்</strong>).</p>
              <p>2. Swap homophones (e.g. <strong>அவண்</strong> instead of <strong>அவன்</strong>).</p>
              <p>3. Drop Sandhi consonants (e.g. <strong>பள்ளிக்கு சென்றான்</strong> instead of <strong>பள்ளிக்குச் சென்றான்</strong>).</p>
            </div>
          </div>

          {/* Spell Corrector Results Display */}
          <div className="lg:col-span-7 space-y-6">
            {checking ? (
              <div className="glass-panel rounded-3xl py-12 flex justify-center items-center">
                <LoadingSpinner message="எழுத்துப்பிழைகளைச் சரிபார்க்கிறது (Checking spelling errors)..." />
              </div>
            ) : spellResult ? (
              <div className="space-y-6">
                
                {/* Visual indicator card */}
                <div className="glass-panel rounded-3xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                    பிழை திருத்த விவரம் (Correction Detail)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 rounded-2xl">
                      <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">உள்ளீடு (Original)</span>
                      <p className="text-lg font-tamil font-semibold text-slate-700 dark:text-slate-300 mt-1">{spellResult.original}</p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 rounded-2xl">
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">திருத்தப்பட்டது (Corrected)</span>
                      <p className="text-lg font-tamil font-semibold text-slate-800 dark:text-slate-100 mt-1">{spellResult.corrected}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 w-fit">
                    {spellResult.corrected_flag ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>எழுத்துப்பிழைகள் கண்டறியப்பட்டு சரிசெய்யப்பட்டன. (Errors corrected successfully.)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>வாக்கியத்தில் பிழைகள் எதுவும் கண்டறியப்படவில்லை. (Your sentence is perfectly correct!)</span>
                      </>
                    )}
                  </div>
                </div>

                <ResultCard title="திருத்தப்பட்ட வாக்கியம் (Corrected Sentence)" text={spellResult.corrected} />

              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-6 text-center text-slate-400 dark:text-slate-500 italic text-sm py-12">
                வாக்கியத்தை உள்ளிட்டு சரிபார்க்கவும்.<br />
                (Input a sentence on the left to verify spelling.)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { dialogueService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { MessageSquare, Sparkles, Copy, Check, Download, Info, ShieldAlert } from 'lucide-react';

export default function DialogueGenerator() {
  const [scenario, setScenario] = useState('school');
  const [topic, setTopic] = useState('வீட்டுப்பாடம் (Homework)');
  const [customScenario, setCustomScenario] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [tone, setTone] = useState('formal');
  const [length, setLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const scenarioTopics = {
    school: [
      { label: 'வீட்டுப்பாடம் (Homework)', value: 'வீட்டுப்பாடம் (Homework)' },
      { label: 'தேர்வு மதிப்பெண்கள் (Exam Marks)', value: 'தேர்வு மதிப்பெண்கள் (Exam Marks)' },
      { label: 'விடுப்பு விண்ணப்பம் (Leave Letter)', value: 'விடுப்பு விண்ணப்பம் (Leave Letter)' },
      { label: 'விளையாட்டுப் போட்டி (Sports Meet)', value: 'விளையாட்டுப் போட்டி (Sports Meet)' },
    ],
    hospital: [
      { label: 'உடல்நலம் / காய்ச்சல் (Fever & Health)', value: 'உடல்நலம் / காய்ச்சல் (Fever & Health)' },
      { label: 'கண் பரிசோதனை (Eye Checkup)', value: 'கண் பரிசோதனை (Eye Checkup)' },
      { label: 'பல் வலி (Toothache)', value: 'பல் வலி (Toothache)' },
      { label: 'மருந்து வாங்குதல் (Buying Medicine)', value: 'மருந்து வாங்குதல் (Buying Medicine)' },
    ],
    bank: [
      { label: 'கணக்கு தொடங்குதல் (Opening an Account)', value: 'கணக்கு தொடங்குதல் (Opening an Account)' },
      { label: 'பணம் எடுத்தல் / செலுத்துதல் (Withdrawal/Deposit)', value: 'பணம் எடுத்தல் / செலுத்துதல் (Withdrawal/Deposit)' },
      { label: 'கடன் விண்ணப்பம் (Loan Application)', value: 'கடன் விண்ணப்பம் (Loan Application)' },
      { label: 'ஏடிஎம் அட்டை (ATM Card Issue)', value: 'ஏடிஎம் அட்டை (ATM Card Issue)' },
    ],
    shopping: [
      { label: 'காய்கறி விலை (Vegetable Prices)', value: 'காய்கறி விலை (Vegetable Prices)' },
      { label: 'துணிக்கடை பேரம் (Clothing Bargaining)', value: 'துணிக்கடை பேரம் (Clothing Bargaining)' },
      { label: 'மளிகைப் பொருட்கள் (Grocery Shopping)', value: 'மளிகைப் பொருட்கள் (Grocery Shopping)' },
      { label: 'பழங்கள் வாங்குதல் (Buying Fruits)', value: 'பழங்கள் வாங்குதல் (Buying Fruits)' },
    ],
    interview: [
      { label: 'வேலை வாய்ப்பு (Job Interview)', value: 'வேலை வாய்ப்பு (Job Interview)' },
      { label: 'மென்பொருள் பணி (Software Job)', value: 'மென்பொருள் பணி (Software Job)' },
      { label: 'கல்லூரி சேர்க்கை (College Admission)', value: 'கல்லூரி சேர்க்கை (College Admission)' },
      { label: 'பகுதிநேர வேலை (Part-time Job)', value: 'பகுதிநேர வேலை (Part-time Job)' },
    ],
  };

  const scenarios = [
    { name: 'பள்ளி (School)', value: 'school' },
    { name: 'மருத்துவமனை (Hospital)', value: 'hospital' },
    { name: 'வங்கி (Bank)', value: 'bank' },
    { name: 'காய்கறிக்கடை (Shopping)', value: 'shopping' },
    { name: 'நேர்காணல் (Interview)', value: 'interview' },
    { name: 'தனிப்பயன் (Custom - Type manually)', value: 'custom' },
  ];

  const tones = [
    { name: 'மரியாதையான (Formal)', value: 'formal' },
    { name: 'நட்பான (Friendly)', value: 'friendly' },
    { name: 'இயல்பான (Informal)', value: 'informal' },
  ];

  const handleScenarioChange = (e) => {
    const newScenario = e.target.value;
    setScenario(newScenario);
    if (newScenario === 'custom') {
      setTopic('');
    } else {
      const topicsForScenario = scenarioTopics[newScenario] || [];
      if (topicsForScenario.length > 0) {
        setTopic(topicsForScenario[0].value);
      }
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    const finalScenario = scenario === 'custom' ? customScenario : scenario;
    const finalTopic = (scenario === 'custom' || topic === 'custom') ? customTopic : topic;
    
    try {
      const data = await dialogueService.generateDialogue({
        scenario: finalScenario,
        topic: finalTopic,
        tone,
        length: parseInt(length),
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('உரையாடலை உருவாக்குவதில் தோல்வி ஏற்பட்டது. (Failed to generate dialogue.)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogueText = () => {
    if (!result) return '';
    const finalScenario = scenario === 'custom' ? customScenario : scenario;
    const finalTopic = (scenario === 'custom' || topic === 'custom') ? customTopic : topic;
    let text = `உரையாடல் தலைப்பு: ${result.title}\n`;
    text += `சூழல் (Scenario): ${finalScenario}\n`;
    text += `தலைப்பு (Topic): ${finalTopic}\n`;
    text += `தொனி (Tone): ${tone}\n\n`;
    result.exchanges.forEach((ex) => {
      text += `${ex.speaker}:\n${ex.tamil}\n(${ex.english})\n\n`;
    });
    return text;
  };

  const handleCopy = async () => {
    const text = getDialogueText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const text = getDialogueText();
    if (!text) return;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${scenario}_dialogue.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-grid-pattern relative">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <MessageSquare className="w-7 h-7 text-tamil-500" />
          <span>AI தமிழ் உரையாடல் உருவாக்கி</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate custom situational dialogues in Tamil using the Gemini AI model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 glow-card space-y-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50 pb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-tamil-500" />
            <span>உரையாடல் அமைப்புகள் (Settings)</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Scenario */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">உரையாடல் சூழல் (Scenario)</label>
              <select
                value={scenario}
                onChange={handleScenarioChange}
                className="glass-input rounded-xl px-3 py-2 text-sm cursor-pointer"
              >
                {scenarios.map((sc) => (
                  <option key={sc.value} value={sc.value} className="dark:bg-slate-950">
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selection (Pre-defined Dropdown or Custom Text Input) */}
            {scenario === 'custom' ? (
              <>
                {/* Custom Scenario Text Input */}
                <div className="flex flex-col space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    தனிப்பயன் சூழல் (Custom Scenario)
                  </label>
                  <input
                    type="text"
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    placeholder="e.g. உணவகம் (Restaurant)"
                    className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20"
                    required
                  />
                </div>

                {/* Custom Topic Text Input */}
                <div className="flex flex-col space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    தனிப்பயன் தலைப்பு (Custom Topic)
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. உணவு ஆர்டர் செய்தல் (Ordering Food)"
                    className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* Topic dropdown for standard scenarios */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">உரையாடல் தலைப்பு (Topic)</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="glass-input rounded-xl px-3 py-2 text-sm cursor-pointer"
                  >
                    {[...(scenarioTopics[scenario] || []), { label: 'தனிப்பயன் (Custom - Type manually)', value: 'custom' }].map((t) => (
                      <option key={t.value} value={t.value} className="dark:bg-slate-950">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Topic Text Input for standard scenarios */}
                {topic === 'custom' && (
                  <div className="flex flex-col space-y-1.5 animate-fade-in">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      தனிப்பயன் தலைப்பு (Custom Topic)
                    </label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g. மைதானத்தில் விளையாட்டு (Playing in the ground)"
                      className="glass-input rounded-xl px-3 py-2 text-sm focus:ring-tamil-500/20"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Tone */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">உரையாடல் தொனி (Tone)</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="glass-input rounded-xl px-3 py-2 text-sm cursor-pointer"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value} className="dark:bg-slate-950">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exchanges count */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                உரையாடல் நீளம் (Exchanges count: {length})
              </label>
              <input
                type="range"
                min="3"
                max="8"
                step="1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-tamil-600 dark:accent-tamil-400 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>குறுகிய (3)</span>
                <span>நடுத்தர (5)</span>
                <span>நீண்ட (8)</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={
                loading || 
                (scenario === 'custom' 
                  ? (!customScenario.trim() || !customTopic.trim()) 
                  : (topic === 'custom' ? !customTopic.trim() : !topic.trim()))
              }
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 hover:from-tamil-500 hover:to-brand-400 text-white font-semibold shadow-md shadow-tamil-500/10 hover:shadow-tamil-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-4"
            >
              <span>உரையாடலை உருவாக்கு (Generate)</span>
            </button>

          </form>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Note */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/20 text-xs space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-bold">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>குறிப்பு (AI notice):</span>
            </div>
            <p>If Gemini API configurations are missing, local pre-defined educational dialogues are seamlessly loaded as backups.</p>
          </div>
        </div>

        {/* Results display panel */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="glass-panel rounded-3xl py-12 flex justify-center items-center">
              <LoadingSpinner message="AI உரையாடலை உருவாக்குகிறது (Gemini generating dialogue)..." />
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Scenario Card Title & Actions */}
              <div className="glass-panel rounded-3xl p-6 glow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] text-tamil-500 dark:text-tamil-400 font-bold uppercase tracking-wider">தலைப்பு (Dialogue Theme)</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-tamil mt-1">{result.title}</h3>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/30 dark:border-slate-800/30 transition-all duration-300"
                    title="Copy Dialogue"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-tamil-600 hover:bg-tamil-500 shadow-md shadow-tamil-500/10 hover:shadow-tamil-500/25 border border-transparent transition-all duration-300"
                    title="Download Text File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Chat Stream Bubble layout */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {result.exchanges.map((ex, idx) => {
                  // Alternating bubbles layout (left vs right alignment)
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] space-y-1.5 ${
                        isEven ? 'self-start mr-auto' : 'self-end ml-auto items-end'
                      }`}
                    >
                      {/* Speaker label */}
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 font-tamil">
                        {ex.speaker}
                      </span>
                      
                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm border ${
                          isEven
                            ? 'bg-white dark:bg-slate-900 border-slate-200/40 dark:border-slate-800/40 rounded-tl-none'
                            : 'bg-tamil-600 border-transparent text-white rounded-tr-none'
                        }`}
                      >
                        {/* Tamil Sentence */}
                        <p className={`font-tamil text-base font-semibold leading-relaxed ${isEven ? 'text-slate-800 dark:text-slate-100' : 'text-white'}`}>
                          {ex.tamil}
                        </p>
                        
                        {/* English translation */}
                        <p
                          className={`text-xs mt-1.5 italic ${
                            isEven ? 'text-slate-500 dark:text-slate-400' : 'text-tamil-200'
                          }`}
                        >
                          {ex.english}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-6 text-center text-slate-400 dark:text-slate-500 italic text-sm py-12">
              உரையாடல் அமைப்புகளைத் தேர்வு செய்து உருவாக்கவும்.<br />
              (Configure settings and generate a dialogue stream.)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

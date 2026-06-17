import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, BookOpen } from 'lucide-react';

export default function Signup() {
  const { signup, error: authError, setError } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (!name || !username || !email || !password || !confirmPassword) {
      setErrorMsg('தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும் (Please fill in all fields)');
      return;
    }

    if (username.length < 3) {
      setErrorMsg('பயனர் பெயர் குறைந்தபட்சம் 3 எழுத்துக்கள் இருக்க வேண்டும் (Username must be at least 3 characters)');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setErrorMsg('பயனர் பெயரில் எழுத்துக்கள், எண்கள், _ மற்றும் - மட்டுமே இருக்க வேண்டும் (Username must contain only letters, numbers, underscores, and hyphens)');
      return;
    }

    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
      setErrorMsg('தயவுசெய்து சரியான மின்னஞ்சலை உள்ளிடவும் (Please enter a valid email)');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துக்கள் இருக்க வேண்டும் (Password must be at least 6 characters)');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('இரு கடவுச்சொற்களும் பொருந்தவில்லை (Passwords do not match)');
      return;
    }

    setErrorMsg('');
    if (setError) setError(null);
    setIsLoading(true);

    try {
      await signup(username, email, password, name);
      // Redirect to login with success message
      navigate('/login', {
        state: {
          successMessage: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! தயவுசெய்து உள்நுழையவும். (Account created successfully! Please sign in.)'
        }
      });
    } catch (err) {
      setErrorMsg(err.message || 'கணக்கு உருவாக்குவதில் தோல்வி (Signup failed)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-grid-pattern py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-tamil-500/10 blur-[120px] pulse-glow-bg pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] pulse-glow-bg pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-slate-800/30">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-tamil-600 to-brand-500 text-white shadow-lg shadow-tamil-500/25 mb-4 animate-pulse">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-tamil text-center leading-tight">
              பதிவு செய்யவும்
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              தமிழ் Dialogue & Sentence Builder
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error alerts */}
            {(errorMsg || authError) && (
              <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-xs leading-normal">{errorMsg || authError}</span>
              </div>
            )}

            {/* Name field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                பெயர் (Full Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="உங்கள் பெயர்..."
                className="glass-input w-full px-4.5 py-3 rounded-xl text-sm transition-all text-slate-800 dark:text-slate-100"
                disabled={isLoading}
              />
            </div>

            {/* Username field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                பயனர் பெயர் (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tamil_learner"
                className="glass-input w-full px-4.5 py-3 rounded-xl text-sm transition-all text-slate-800 dark:text-slate-100"
                disabled={isLoading}
              />
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                மின்னஞ்சல் (Email Address)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="glass-input w-full px-4.5 py-3 rounded-xl text-sm transition-all text-slate-800 dark:text-slate-100"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                கடவுச்சொல் (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-4.5 pr-12 py-3 rounded-xl text-sm transition-all text-slate-800 dark:text-slate-100"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                கடவுச்சொல்லை உறுதிப்படுத்துக (Confirm Password)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full px-4.5 py-3 rounded-xl text-sm transition-all text-slate-800 dark:text-slate-100"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 text-white font-semibold text-sm shadow-lg shadow-tamil-500/20 hover:shadow-tamil-500/30 hover:scale-[1.01] hover:brightness-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>பதிவு செய்யப்படுகிறது... (Signing Up...)</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>பதிவு செய்க (Sign Up)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              ஏற்கனவே கணக்கு உள்ளதா? (Already have an account?){' '}
              <Link
                to="/login"
                className="text-tamil-600 dark:text-tamil-400 font-bold hover:underline ml-1 inline-flex items-center gap-0.5 group"
              >
                உள்நுழையவும் (Sign In)
                <Sparkles className="w-3.5 h-3.5 group-hover:animate-bounce" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

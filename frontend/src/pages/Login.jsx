import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, BookOpen } from 'lucide-react';

export default function Login() {
  const { login, error: authError, setError } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');

  // Route to redirect back to after successful login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg('தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும் (Please fill in all fields)');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    if (setError) setError(null);
    setIsLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'உள்நுழைவு தோல்வியடைந்தது (Login failed)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-grid-pattern py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-tamil-500/10 blur-[120px] pulse-glow-bg pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] pulse-glow-bg pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-slate-800/30">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-tamil-600 to-brand-500 text-white shadow-lg shadow-tamil-500/25 mb-4 animate-pulse">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-tamil text-center leading-tight">
              வரவேற்கிறோம்!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              தமிழ் Dialogue & Sentence Builder
            </p>
          </div>

           {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success alerts */}
            {successMsg && (
              <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 text-sm">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                <span className="font-medium text-xs leading-normal">{successMsg}</span>
              </div>
            )}

            {/* Error alerts */}
            {(errorMsg || authError) && (
              <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-xs leading-normal">{errorMsg || authError}</span>
              </div>
            )}

            {/* Username / Email field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                பயனர் பெயர் / மின்னஞ்சல் (Username / Email)
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="உள்நுழைய வேண்டிய முகவரி..."
                className="glass-input w-full px-4.5 py-3.5 rounded-2xl text-sm transition-all text-slate-800 dark:text-slate-100"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  கடவுச்சொல் (Password)
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-4.5 pr-12 py-3.5 rounded-2xl text-sm transition-all text-slate-800 dark:text-slate-100"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-tamil-600 to-brand-500 text-white font-semibold text-sm shadow-lg shadow-tamil-500/20 hover:shadow-tamil-500/30 hover:scale-[1.01] hover:brightness-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>சரிபார்க்கப்படுகிறது... (Verifying...)</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>உள்நுழைக (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              கணக்கு இல்லையா? (Don't have an account?){' '}
              <Link
                to="/signup"
                className="text-tamil-600 dark:text-tamil-400 font-bold hover:underline ml-1 inline-flex items-center gap-0.5 group"
              >
                பதிவு செய்யவும் (Sign Up)
                <Sparkles className="w-3.5 h-3.5 group-hover:animate-bounce" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

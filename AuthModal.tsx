import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, X, LogIn, AlertCircle, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess, message }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsDemo } = useAuth();

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Auth error:', err);
      // Clean up common firebase errors for friendly reading
      let readableError = err.message || 'An error occurred. Please check your details.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        readableError = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        readableError = 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        readableError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        readableError = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed' || readableError.includes('operation-not-allowed')) {
        readableError = 'Email/Password Sign-In is disabled on your Firebase project. To fix this: Go to Firebase Console -> Authentication -> Sign-in method -> Click Add new provider -> select Email/Password -> click Enable & Save.';
      }
      setError(readableError);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Google Sign In error:', err);
      let readableError = err.message || 'Failed to sign in with Google.';
      if (err.code === 'auth/operation-not-allowed' || readableError.includes('operation-not-allowed')) {
        readableError = 'Google Sign-In is disabled on your Firebase project. To fix this: Go to Firebase Console -> Authentication -> Sign-in method -> Click Add new provider -> select Google -> click Enable & Save.';
      }
      setError(readableError);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative transform overflow-hidden rounded-3xl glass-card-strong text-left shadow-2xl transition-all w-full max-w-md flex flex-col border border-white/50 z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/30 text-slate-400 hover:text-slate-600 transition-colors z-10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-center">
            {/* Logo and Greeting */}
            <div className="text-center space-y-2">
              <div className="mx-auto p-3 bg-medical-500 rounded-2xl text-white shadow-md shadow-medical-500/20 w-fit">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-800">
                {isSignUp ? 'Create Patient Profile' : 'Welcome to We Care'}
              </h3>
              <p className="text-xs text-slate-500 leading-normal font-sans max-w-xs mx-auto">
                {message || (isSignUp 
                  ? 'Sign up to book clinical appointments and view your session records.'
                  : 'Sign in to access your secure medical portal & schedules.')}
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200/60 rounded-xl text-xs text-red-600 flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed font-sans">{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder={isSignUp ? "Minimum 6 characters" : "••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-medical-500 hover:bg-medical-600 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <LogIn className="h-4 w-4" />
                <span>{isSubmitting ? 'Authenticating...' : (isSignUp ? 'Register Account' : 'Sign In')}</span>
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/40 w-full" />
              <span className="absolute bg-white/10 px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest backdrop-blur-sm rounded-full">
                or
              </span>
            </div>

            {/* Google Login Provider Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              type="button"
              className="w-full py-2.5 bg-white/40 hover:bg-white/60 border border-white/50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {/* Google Brand G Icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

             {/* Toggle Sign In / Sign Up */}
            <div className="text-center">
              <button
                onClick={handleToggleMode}
                className="text-[11px] font-bold text-medical-600 hover:text-medical-700 transition-colors cursor-pointer"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"}
              </button>
            </div>

            {/* Quick Demo Mode Bypasses */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Demo Sandbox
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await signInAsDemo('patient');
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-black rounded-lg transition-colors border border-teal-200/50 cursor-pointer text-center"
                >
                  Demo Patient
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await signInAsDemo('admin');
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg transition-colors border border-indigo-200/50 cursor-pointer text-center"
                >
                  Demo Admin Portal
                </button>
              </div>
            </div>
            
            {/* Note on manual Email auth enabling */}
            {isSignUp && (
              <p className="text-[9px] text-center text-slate-400 font-sans font-medium leading-relaxed max-w-xs mx-auto">
                Note: If using email registration for the first time on a custom Firebase project, please ensure Email/Password authentication is enabled in your Firebase console.
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

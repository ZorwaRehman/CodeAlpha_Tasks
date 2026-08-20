import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginAsDemo } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back! You are logged in.');
      } else {
        await register(name, email, password);
        showToast('Account created successfully! Welcome to Apex Store.');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: 'customer' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemo(role);
      showToast(
        role === 'admin'
          ? 'Logged in as Administrator (Admin Dashboard unlocked)'
          : 'Logged in as Demo Customer (Alex Morgan)'
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to login with demo credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Banner */}
          <div className="p-6 pb-4 bg-zinc-50 border-b border-zinc-200/80 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Lock className="w-6 h-6 text-zinc-200" />
            </div>
            <h3 className="text-xl font-black text-zinc-900">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {mode === 'login'
                ? 'Sign in to access your orders, saved addresses, and profile'
                : 'Join Apex Store for fast order tracking and member discounts'}
            </p>

            {/* Tab switch buttons */}
            <div className="flex bg-zinc-200/70 p-1 rounded-xl mt-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Quick Demo Logins Section */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/90 text-xs">
              <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider block mb-2">
                Quick 1-Click Demo Accounts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick('customer')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl font-semibold text-zinc-800 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('admin')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl font-semibold text-indigo-900 transition-colors shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Jordan Hayes"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:outline-none bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:outline-none bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-9 pr-3 py-2.5 border border-zinc-200 rounded-xl focus:border-zinc-900 focus:outline-none bg-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

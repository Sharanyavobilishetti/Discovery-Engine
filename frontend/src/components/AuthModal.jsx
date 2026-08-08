import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = tab === 'login' 
      ? 'http://localhost:8000/api/v1/auth/login' 
      : 'http://localhost:8000/api/v1/auth/register';

    const payload = tab === 'login'
      ? { email, password }
      : { email, password, full_name: fullName };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      
      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={() => setIsAuthOpen(false)} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />

      <div className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl z-10 overflow-hidden">
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {tab === 'login' 
              ? 'Access your personalized multi-intent AI recommendations' 
              : 'Join to experience real-time intent personalization'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-button py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-500/25"
          >
            <span>{loading ? 'Processing...' : (tab === 'login' ? 'Sign In' : 'Create Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

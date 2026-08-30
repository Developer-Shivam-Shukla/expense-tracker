import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setFormError(err?.message || 'Invalid credentials. Please verify and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.morgan@example.com');
    setPassword('password123');
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome to Vault<span className="text-emerald-400">Flow</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to access your financial records, cash flow, and analytics
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          {formError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs leading-relaxed">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="pt-2 border-t border-[#222224]">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 bg-[#1e1e20] hover:bg-[#2d2d30] text-zinc-300 hover:text-white border border-[#2d2d30] rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fill Demo Credentials (alex.morgan@example.com)</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

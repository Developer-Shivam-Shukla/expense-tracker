import React, { useState } from 'react';
import { User, Mail, Lock, DollarSign, ArrowRight, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../constants';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [monthlyBudget, setMonthlyBudget] = useState('4000');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        currency,
        monthlyBudget: parseFloat(monthlyBudget) || 4000,
      });
    } catch (err) {
      setFormError(err?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
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
            Create your Vault<span className="text-emerald-400">Flow</span> account
          </h1>
          <p className="text-xs text-zinc-400">
            Start tracking all revenue, expenses, and budget limits in one place
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          {formError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs leading-relaxed">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Currency & Monthly Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Target Budget
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="4000"
                  className="w-full px-3 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

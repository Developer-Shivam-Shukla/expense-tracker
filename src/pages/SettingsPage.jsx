import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Save, RefreshCw, Download, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/auth';
import { dashboardApi } from '../api/dashboard';
import { CURRENCIES } from '../constants';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const SettingsPage = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { success, error } = useToast();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget?.toString() || '4000');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Reset Demo modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCurrency(user.currency || 'USD');
      setMonthlyBudget(user.monthlyBudget?.toString() || '4000');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Validation Error', 'Full Name is required.');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        currency,
        monthlyBudget: parseFloat(monthlyBudget) || 4000,
      });
      success('Settings Saved', 'Profile preferences updated.');
    } catch (err) {
      error('Save Error', err?.message || 'Failed to update preferences.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      error('Validation Error', 'Please enter your current and new password.');
      return;
    }

    if (newPassword.length < 6) {
      error('Validation Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      error('Validation Error', 'New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      success('Password Updated', 'Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      error('Password Error', err?.message || 'Could not change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      await dashboardApi.resetDemoData();
      success('Demo Data Reset', 'Realistic transactions have been seeded.');
      setIsResetModalOpen(false);
      await refreshUser();
    } catch (err) {
      error('Reset Error', err?.message || 'Failed to reset sample data.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      await dashboardApi.downloadFullReport();
      success('Export Success', 'Full financial report downloaded.');
    } catch (err) {
      error('Export Error', err?.message || 'Failed to download report.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#222224]">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Account & App Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage your personal preferences, budget targets, security credentials, and data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile & Financial Preferences Form */}
        <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222224]">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Profile & Preferences</h3>
              <p className="text-xs text-zinc-400">Display details and default currency</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-[#0a0a0b] border border-[#222224] rounded-xl text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Monthly Target Budget Limit
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isSavingProfile ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222224]">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Security & Credentials</h3>
              <p className="text-xs text-zinc-400">Update your account login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                New Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isSavingPassword ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Data Management & Demo Actions */}
      <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-white pb-2 border-b border-[#222224]">
          Data Export & Sample Seeding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#111112] border border-[#2d2d30] flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">Complete Financial Export</h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                Download a clean multi-tab Excel workbook containing Executive Summary, Incomes, Expenses, and Category Breakdowns.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloading ? 'Generating...' : 'Export Complete Spreadsheet (.xlsx)'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#111112] border border-[#2d2d30] flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">Reset Demo Transactions</h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                Replace existing transactions with sample salary, dividends, rent, and utility records across the past 3 months.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-200 bg-[#1e1e20] hover:bg-[#2d2d30] hover:text-white border border-[#2d2d30] rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Re-seed Sample Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetDemoData}
        title="Reset Sample Data"
        message="This will overwrite current transaction records for this account with standard realistic sample data across 3 months. Do you want to proceed?"
        confirmText="Confirm Reset"
        isDangerous={false}
        isLoading={isResetting}
      />
    </div>
  );
};

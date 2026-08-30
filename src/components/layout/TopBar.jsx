import React from 'react';
import { Menu, Plus, ArrowUpRight, ArrowDownRight, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const TopBar = ({
  onToggleSidebar,
  onOpenAddIncome,
  onOpenAddExpense,
  currentPage,
  onNavigate,
}) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const pageTitles = {
    dashboard: 'Financial Overview',
    income: 'Income Records',
    expenses: 'Expense Tracker',
    analytics: 'Analytics & Insights',
    settings: 'Settings & Security',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-[#222224] px-4 sm:px-6 flex items-center justify-between">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-[#2d2d30]"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white tracking-tight">
            {pageTitles[currentPage] || 'Overview'}
          </span>
        </div>
      </div>

      {/* Right zone: Quick Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenAddIncome}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-xs whitespace-nowrap"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          Add Income
        </button>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-all shadow-xs whitespace-nowrap"
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          Add Expense
        </button>

        {/* Settings button */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-[#2d2d30] transition-colors"
          title="Account Settings"
          aria-label="Account Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

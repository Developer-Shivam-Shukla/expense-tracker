import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingDown,
  PiggyBank,
  Percent,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardApi } from '../api/dashboard';
import { StatCard } from '../components/common/StatCard';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart';
import { BudgetProgressCard } from '../components/dashboard/BudgetProgressCard';
import { RecentTransactionsList } from '../components/dashboard/RecentTransactionsList';
import { DashboardSkeleton } from '../components/common/Skeleton';

export const DashboardPage = ({
  onNavigate,
  onOpenAddIncome,
  onOpenAddExpense,
}) => {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const currency = user?.currency || 'USD';

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const overview = await dashboardApi.getOverview();
      setData(overview);
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
      toastError('Dashboard Error', err?.message || 'Could not load overview statistics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-[#151517] border border-[#2d2d30] rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Unable to load dashboard data</h3>
        <p className="text-xs text-zinc-400 mt-1">Check your connection and try refreshing.</p>
        <button
          type="button"
          onClick={() => fetchDashboardData()}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const { currentMonth, changes, budgetStatus, spendByCategory, recentTransactions, monthlyTrends } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Refresh Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222224]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Welcome, {user?.name ? user.name.split(' ')[0] : 'User'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Financial snapshot for <strong className="text-emerald-400 font-semibold">{currentMonth.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#151517] border border-[#2d2d30] transition-colors disabled:opacity-50"
            title="Refresh statistics"
            aria-label="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenAddIncome}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1 shadow-xs whitespace-nowrap"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            + Income
          </button>

          <button
            type="button"
            onClick={onOpenAddExpense}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1 shadow-xs whitespace-nowrap"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            - Expense
          </button>
        </div>
      </div>

      {/* Primary Financial Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <StatCard
          title="Monthly Income"
          amount={currentMonth.income}
          currency={currency}
          percentChange={changes.incomePercentChange}
          percentChangeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />

        {/* Monthly Expenses */}
        <StatCard
          title="Monthly Expenses"
          amount={currentMonth.expenses}
          currency={currency}
          percentChange={changes.expensePercentChange}
          percentChangeLabel="vs last month"
          trendInverted={true}
          icon={<TrendingDown className="w-5 h-5" />}
          iconBgColor="bg-rose-500/10 text-rose-400 border border-rose-500/20"
        />

        {/* Net Savings */}
        <StatCard
          title="Net Savings"
          amount={currentMonth.savings}
          currency={currency}
          percentChange={changes.savingsPercentChange}
          percentChangeLabel="vs last month"
          icon={<PiggyBank className="w-5 h-5" />}
          iconBgColor="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />

        {/* Savings Rate */}
        <StatCard
          title="Savings Rate"
          amount={currentMonth.savingsRate}
          isCurrency={false}
          suffix="%"
          subtitle={
            currentMonth.savingsRate >= 30
              ? 'Excellent (Goal: >20%)'
              : currentMonth.savingsRate > 0
              ? 'Moderate savings'
              : 'Negative savings this month'
          }
          icon={<Percent className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
      </div>

      {/* Middle Section: Budget Utilization & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <MonthlyTrendChart trends={monthlyTrends} currency={currency} />
          <BudgetProgressCard
            monthlyBudget={budgetStatus.monthlyBudget}
            spent={budgetStatus.spent}
            remaining={budgetStatus.remaining}
            percentUsed={budgetStatus.percentUsed}
            currency={currency}
            onEditBudget={() => onNavigate('settings')}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <CategoryDonutChart
            data={spendByCategory}
            currency={currency}
            title="Monthly Expense Breakdown"
            type="expense"
          />
        </div>
      </div>

      {/* Bottom Section: Combined Recent Transactions */}
      <RecentTransactionsList
        transactions={recentTransactions}
        currency={currency}
        onNavigateToIncome={() => onNavigate('income')}
        onNavigateToExpenses={() => onNavigate('expenses')}
        onAddIncome={onOpenAddIncome}
        onAddExpense={onOpenAddExpense}
      />
    </div>
  );
};

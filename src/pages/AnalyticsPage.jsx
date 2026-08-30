import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardApi } from '../api/dashboard';
import { formatCurrency } from '../utils/formatters';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart';
import { DashboardSkeleton } from '../components/common/Skeleton';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const currency = user?.currency || 'USD';

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await dashboardApi.getOverview();
        setData(res);
      } catch (err) {
        error('Analytics Error', err?.message || 'Failed to load analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    loadOverview();
  }, [error]);

  const handleExportFull = async () => {
    try {
      await dashboardApi.downloadFullReport();
      success('Report Exported', 'Full financial report exported to Excel.');
    } catch (err) {
      error('Export Error', err?.message);
    }
  };

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { totalAllTime, monthlyTrends, spendByCategory, incomeByCategory } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222224]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Financial Analytics & Insights
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Deep dive into long-term savings rates, cash flow health, and category spending
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportFull}
          className="px-4 py-2 text-xs font-semibold text-zinc-200 bg-[#151517] hover:bg-[#1e1e20] hover:text-white border border-[#2d2d30] rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Download Multi-Sheet Report
        </button>
      </div>

      {/* Lifetime Wealth & Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#151517] border border-[#2d2d30] rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lifetime Inflow</span>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            +{formatCurrency(totalAllTime.income, currency)}
          </div>
          <p className="text-xs text-zinc-500 pt-1">Across all logged earnings</p>
        </div>

        <div className="p-5 bg-[#151517] border border-[#2d2d30] rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lifetime Outflow</span>
          <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
            -{formatCurrency(totalAllTime.expenses, currency)}
          </div>
          <p className="text-xs text-zinc-500 pt-1">Across all recorded expenses</p>
        </div>

        <div className="p-5 bg-[#151517] border border-[#2d2d30] rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Net Retained Wealth</span>
          <div className={`text-2xl font-extrabold tracking-tight ${totalAllTime.balance >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
            {formatCurrency(totalAllTime.balance, currency)}
          </div>
          <p className="text-xs text-zinc-500 pt-1">Net accumulated savings</p>
        </div>

        <div className="p-5 bg-[#151517] border border-[#2d2d30] rounded-2xl space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lifetime Savings Rate</span>
          <div className="text-2xl font-extrabold text-amber-400 tracking-tight">
            {totalAllTime.income > 0
              ? `${((totalAllTime.balance / totalAllTime.income) * 100).toFixed(1)}%`
              : '0.0%'}
          </div>
          <p className="text-xs text-zinc-500 pt-1">Percent of earnings retained</p>
        </div>
      </div>

      {/* 6-Month Trend */}
      <MonthlyTrendChart trends={monthlyTrends} currency={currency} />

      {/* Two-column Donut breakdowns: Expense vs Income */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart
          data={spendByCategory}
          currency={currency}
          title="Expense Distribution by Category"
          type="expense"
        />

        <CategoryDonutChart
          data={incomeByCategory}
          currency={currency}
          title="Income Distribution by Category"
          type="income"
        />
      </div>

      {/* Monthly Performance Table */}
      <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#222224]">
          <h3 className="text-sm font-bold text-white">Monthly Cashflow Breakdown</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Historical overview by calendar month</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222224] bg-[#111112] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Income</th>
                <th className="py-3 px-4 text-right">Expenses</th>
                <th className="py-3 px-4 text-right">Net Savings</th>
                <th className="py-3 px-4 text-right">Savings Rate</th>
                <th className="py-3 px-4 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222224]">
              {monthlyTrends.map((m) => {
                const isGood = m.savingsRate >= 20;
                const isModerate = m.savingsRate > 0 && m.savingsRate < 20;

                return (
                  <tr key={m.monthKey} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">{m.month}</td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-medium">
                      +{formatCurrency(m.income, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-400 font-medium">
                      -{formatCurrency(m.expense, currency)}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold ${m.savings >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
                      {formatCurrency(m.savings, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-zinc-300 font-medium">
                      {m.savingsRate.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[10px] tracking-wide uppercase ${
                          isGood
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isModerate
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isGood ? 'Optimal' : isModerate ? 'Moderate' : 'Deficit'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

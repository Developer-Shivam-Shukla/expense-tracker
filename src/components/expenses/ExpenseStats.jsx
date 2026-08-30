import React from 'react';
import { CreditCard, TrendingDown, Layers, PieChart } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const ExpenseStats = ({ summary, currency = 'USD' }) => {
  if (!summary) return null;

  const topCategory = summary.categoryBreakdown?.length > 0 ? summary.categoryBreakdown[0] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Outflow"
        amount={summary.totalExpenses || 0}
        currency={currency}
        percentChange={summary.monthlyComparison?.percentChange}
        percentChangeLabel="vs last month"
        trendInverted={true}
        icon={<CreditCard className="w-5 h-5" />}
        iconBgColor="bg-rose-500/10 text-rose-400 border border-rose-500/20"
      />

      <StatCard
        title="Average Expense"
        amount={summary.averageExpense || 0}
        currency={currency}
        subtitle="Per recorded transaction"
        icon={<TrendingDown className="w-5 h-5" />}
        iconBgColor="bg-amber-500/10 text-amber-400 border border-amber-500/20"
      />

      <StatCard
        title="Transactions Count"
        amount={summary.count || 0}
        isCurrency={false}
        suffix=" entries"
        subtitle="Total expense records"
        icon={<Layers className="w-5 h-5" />}
        iconBgColor="bg-purple-500/10 text-purple-400 border border-purple-500/20"
      />

      <StatCard
        title="Highest Spending Area"
        amount={topCategory ? topCategory.total : 0}
        currency={currency}
        subtitle={topCategory ? `${topCategory.category} (${topCategory.percentage?.toFixed(0) || 0}%)` : 'None recorded'}
        icon={<PieChart className="w-5 h-5" />}
        iconBgColor="bg-rose-500/10 text-rose-400 border border-rose-500/20"
      />
    </div>
  );
};

import React from 'react';
import { DollarSign, TrendingUp, Layers, Award } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const IncomeStats = ({ summary, currency = 'USD' }) => {
  if (!summary) return null;

  const topCategory = summary.categoryBreakdown?.length > 0 ? summary.categoryBreakdown[0] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Inflow"
        amount={summary.totalIncome || 0}
        currency={currency}
        percentChange={summary.monthlyComparison?.percentChange}
        percentChangeLabel="vs last month"
        icon={<DollarSign className="w-5 h-5" />}
        iconBgColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      />

      <StatCard
        title="Average Income"
        amount={summary.averageIncome || 0}
        currency={currency}
        subtitle="Per recorded transaction"
        icon={<TrendingUp className="w-5 h-5" />}
        iconBgColor="bg-teal-500/10 text-teal-400 border border-teal-500/20"
      />

      <StatCard
        title="Transactions Count"
        amount={summary.count || 0}
        isCurrency={false}
        suffix=" entries"
        subtitle="Total income records"
        icon={<Layers className="w-5 h-5" />}
        iconBgColor="bg-blue-500/10 text-blue-400 border border-blue-500/20"
      />

      <StatCard
        title="Top Income Source"
        amount={topCategory ? topCategory.total : 0}
        currency={currency}
        subtitle={topCategory ? `${topCategory.category} (${topCategory.percentage?.toFixed(0) || 0}%)` : 'None recorded'}
        icon={<Award className="w-5 h-5" />}
        iconBgColor="bg-amber-500/10 text-amber-400 border border-amber-500/20"
      />
    </div>
  );
};

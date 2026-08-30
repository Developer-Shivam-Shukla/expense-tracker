import React from 'react';
import { AlertCircle, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BudgetProgressCard = ({
  monthlyBudget,
  spent,
  remaining,
  percentUsed,
  currency = 'USD',
  onEditBudget,
}) => {
  const isOverBudget = remaining < 0;
  const isWarning = percentUsed >= 85 && !isOverBudget;

  const barColor = isOverBudget
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  const cappedPercent = Math.min(Math.max(percentUsed, 0), 100);

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-zinc-400">Monthly Budget Usage</span>
          <div className="text-lg font-bold text-white mt-0.5">
            {formatCurrency(spent, currency)}{' '}
            <span className="text-xs font-normal text-zinc-500">
              of {formatCurrency(monthlyBudget, currency)}
            </span>
          </div>
        </div>

        {onEditBudget && (
          <button
            type="button"
            onClick={onEditBudget}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#2d2d30] transition-colors"
            title="Adjust monthly budget limit"
            aria-label="Adjust monthly budget"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#222224] h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-500 rounded-full`}
            style={{ width: `${cappedPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">
            {percentUsed.toFixed(1)}% spent
          </span>
          <span
            className={`font-semibold ${
              isOverBudget
                ? 'text-rose-400'
                : isWarning
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {isOverBudget
              ? `Over by ${formatCurrency(Math.abs(remaining), currency)}`
              : `${formatCurrency(remaining, currency)} remaining`}
          </span>
        </div>
      </div>

      {/* Status footer pill */}
      <div
        className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
          isOverBudget
            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            : isWarning
            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
        }`}
      >
        {isOverBudget ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : isWarning ? (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="leading-tight">
          {isOverBudget
            ? 'You have exceeded your target budget limit for this month.'
            : isWarning
            ? 'Approaching your monthly limit. Pace remaining expenses carefully.'
            : 'Healthy spending rate! You are well within your monthly allocation.'}
        </span>
      </div>
    </div>
  );
};

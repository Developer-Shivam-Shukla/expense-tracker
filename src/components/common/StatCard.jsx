import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const StatCard = ({
  title,
  amount,
  currency = 'USD',
  isCurrency = true,
  prefix = '',
  suffix = '',
  percentChange,
  percentChangeLabel,
  subtitle,
  icon,
  iconBgColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  trendInverted = false,
}) => {
  const isPositive = percentChange !== undefined ? percentChange >= 0 : null;
  const isGoodTrend = trendInverted ? !isPositive : isPositive;

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs hover:border-[#3e3e42] transition-colors group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 tracking-wide">{title}</span>
        {icon && (
          <div className={`p-2 rounded-xl shrink-0 ${iconBgColor}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold tracking-tight text-white">
          {prefix}
          {isCurrency ? formatCurrency(amount, currency) : amount}
          {suffix}
        </div>

        {/* Change indicator / subtitle */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          {percentChange !== undefined && (
            <span
              className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                isGoodTrend
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {Math.abs(percentChange).toFixed(1)}%
            </span>
          )}

          {percentChangeLabel && (
            <span className="text-[11px] text-zinc-500">{percentChangeLabel}</span>
          )}

          {subtitle && !percentChangeLabel && (
            <span className="text-[11px] text-zinc-400 truncate max-w-full">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};

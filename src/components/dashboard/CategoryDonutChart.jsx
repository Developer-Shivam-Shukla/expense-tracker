import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories';

export const CategoryDonutChart = ({
  data = [],
  currency = 'USD',
  title = 'Category Breakdown',
  type = 'expense',
}) => {
  const total = data.reduce((acc, curr) => acc + curr.total, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-zinc-500">No transactions recorded for this period</p>
        </div>
      </div>
    );
  }

  // Pre-assign distinct colors
  const defaultColors = [
    '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
  ];

  const enrichedData = data.map((item, index) => {
    const meta = type === 'income' ? INCOME_CATEGORIES[item.category] : EXPENSE_CATEGORIES[item.category];
    const color = meta?.color || defaultColors[index % defaultColors.length];
    const percentage = total > 0 ? (item.total / total) * 100 : 0;
    return {
      ...item,
      color,
      percentage,
    };
  });

  // Calculate SVG Conic stroke segments
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs flex-1 flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="text-xs font-semibold text-zinc-400">
          Total: <strong className="text-white">{formatCurrency(total, currency)}</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="text-[#222224]"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
            />
            {enrichedData.map((item, idx) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  strokeLinecap="butt"
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>

          {/* Donut Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              {enrichedData.length} Areas
            </span>
            <span className="text-xs font-bold text-zinc-100">
              100%
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2 max-h-48 overflow-y-auto pr-1">
          {enrichedData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs py-1 border-b border-[#222224]/60 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-200 font-medium truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-zinc-100">
                  {formatCurrency(item.total, currency)}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono w-10 text-right">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

export const MonthlyTrendChart = ({
  trends = [],
  currency = 'USD',
}) => {
  if (!trends || trends.length === 0) return null;

  // Find max value across income and expense for chart scaling
  const maxVal = Math.max(
    ...trends.map((t) => Math.max(t.income, t.expense)),
    1000
  );

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#222224] mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">6-Month Cash Flow Trend</h3>
          <p className="text-xs text-zinc-400">Comparing total income vs total outgoings</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-zinc-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-zinc-300">Expenses</span>
          </div>
        </div>
      </div>

      {/* Bar visual area */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44">
          {trends.map((item) => {
            const incomeHeight = maxVal > 0 ? (item.income / maxVal) * 100 : 0;
            const expenseHeight = maxVal > 0 ? (item.expense / maxVal) * 100 : 0;

            return (
              <div key={item.monthKey} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip trigger area */}
                <div className="relative flex items-end gap-1 sm:gap-1.5 h-full w-full justify-center pb-1">
                  {/* Income bar */}
                  <div
                    className="w-3 sm:w-5 bg-emerald-600 group-hover:bg-emerald-500 rounded-t-sm transition-all duration-300 relative"
                    style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                    title={`Income: ${formatCurrency(item.income, currency)}`}
                  />

                  {/* Expense bar */}
                  <div
                    className="w-3 sm:w-5 bg-rose-600 group-hover:bg-rose-500 rounded-t-sm transition-all duration-300 relative"
                    style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                    title={`Expense: ${formatCurrency(item.expense, currency)}`}
                  />
                </div>

                {/* Month label */}
                <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-200 mt-1 whitespace-nowrap">
                  {item.month}
                </span>

                {/* Savings rate tag */}
                <span
                  className={`text-[9px] font-bold mt-0.5 ${
                    item.savings >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.savings >= 0 ? `+${item.savingsRate.toFixed(0)}%` : 'Deficit'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

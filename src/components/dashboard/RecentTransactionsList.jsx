import React from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Plus } from 'lucide-react';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import { CategoryBadge, PaymentMethodBadge } from '../common/Badge';

export const RecentTransactionsList = ({
  transactions = [],
  currency = 'USD',
  onNavigateToIncome,
  onNavigateToExpenses,
  onAddIncome,
  onAddExpense,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-5 shadow-xs text-center py-8">
        <p className="text-xs text-zinc-400">No recent transactions recorded.</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={onAddIncome}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
          >
            + Add Income
          </button>
          <button
            type="button"
            onClick={onAddExpense}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
          >
            + Add Expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl shadow-xs overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[#222224]">
        <div>
          <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
          <p className="text-xs text-zinc-400">Latest earnings and expenditures</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToIncome}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Incomes &rarr;
          </button>
          <span className="text-zinc-600">•</span>
          <button
            type="button"
            onClick={onNavigateToExpenses}
            className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
          >
            View Expenses &rarr;
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#222224]">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';

          return (
            <div
              key={`${tx.type}_${tx.id}`}
              className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between gap-3"
            >
              {/* Left icon & details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isIncome
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-zinc-100 text-xs sm:text-sm truncate">
                    {tx.description}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 flex-wrap">
                    <span>{formatRelativeDate(tx.date)}</span>
                    <span>•</span>
                    <CategoryBadge category={tx.category} type={tx.type} size="sm" />
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                      <PaymentMethodBadge method={tx.paymentMethod} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Right amount */}
              <div className="text-right shrink-0">
                <span
                  className={`font-bold text-xs sm:text-sm ${
                    isIncome ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(tx.amount, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

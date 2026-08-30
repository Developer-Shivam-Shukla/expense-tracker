import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge, PaymentMethodBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const IncomeTable = ({
  incomes = [],
  currency = 'USD',
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onAddNew,
}) => {
  if (incomes.length === 0) {
    return (
      <EmptyState
        title="No income records found"
        description="Try adjusting your search filters or record your first income transaction."
        actionText="Add Income"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl overflow-hidden shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#222224] bg-[#111112] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222224] text-sm">
            {incomes.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap font-medium">
                  {formatDate(item.date)}
                </td>
                <td className="py-3.5 px-4 min-w-[200px]">
                  <div className="font-semibold text-zinc-100 group-hover:text-white">
                    {item.description}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-sm" title={item.notes}>
                      {item.notes}
                    </p>
                  )}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <CategoryBadge category={item.category} type="income" />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PaymentMethodBadge method={item.paymentMethod} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span className="font-bold text-emerald-400 text-sm">
                    +{formatCurrency(item.amount, currency)}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Income"
                      aria-label="Edit Income"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Income"
                      aria-label="Delete Income"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-[#222224]">
        {incomes.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-500 font-medium block">
                  {formatDate(item.date)}
                </span>
                <h4 className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
                  {item.description}
                </h4>
              </div>
              <span className="text-base font-bold text-emerald-400 shrink-0">
                +{formatCurrency(item.amount, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <CategoryBadge category={item.category} type="income" />
                <PaymentMethodBadge method={item.paymentMethod} />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                  aria-label="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {item.notes && (
              <p className="text-xs text-zinc-400 bg-[#111112] p-2 rounded-lg border border-[#2d2d30]">
                {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Table Footer & Pagination */}
      <div className="p-4 border-t border-[#222224] bg-[#111112] flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-3">
        <span>
          Showing <strong className="text-zinc-200">{incomes.length}</strong> of{' '}
          <strong className="text-zinc-200">{totalCount}</strong> records
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#2d2d30] text-zinc-300 hover:bg-[#1e1e20] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-zinc-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#2d2d30] text-zinc-300 hover:bg-[#1e1e20] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

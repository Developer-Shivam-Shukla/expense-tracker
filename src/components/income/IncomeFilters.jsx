import React from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { INCOME_CATEGORY_LIST } from '../../utils/categories';
import { DATE_FILTER_PRESETS, SORT_OPTIONS } from '../../constants';

export const IncomeFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sort,
  onSortChange,
  onAddNew,
  onDownloadExcel,
  isDownloading = false,
}) => {
  return (
    <div className="bg-[#151517] border border-[#2d2d30] rounded-2xl p-4 space-y-3.5 shadow-xs">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search description, notes, category..."
            className="w-full pl-9 pr-4 py-2 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Buttons: Export & Add */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDownloadExcel}
            disabled={isDownloading}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-200 bg-[#1e1e20] hover:bg-[#2d2d30] hover:text-white border border-[#2d2d30] rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            {isDownloading ? 'Generating Excel...' : 'Export Excel'}
          </button>

          <button
            type="button"
            onClick={onAddNew}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      {/* Filter Row: Category, Date Range, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#222224] text-xs">
        {/* Category selector */}
        <div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#111112] border border-[#2d2d30] rounded-xl text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {INCOME_CATEGORY_LIST.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Preset */}
        <div>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#111112] border border-[#2d2d30] rounded-xl text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
          >
            {DATE_FILTER_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#111112] border border-[#2d2d30] rounded-xl text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom date range if selected */}
        {dateRange === 'custom' && (
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-1/2 px-2 py-1.5 bg-[#111112] border border-[#2d2d30] rounded-lg text-[11px] text-zinc-200"
            />
            <span className="text-zinc-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-1/2 px-2 py-1.5 bg-[#111112] border border-[#2d2d30] rounded-lg text-[11px] text-zinc-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};

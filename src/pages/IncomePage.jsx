import React, { useState, useEffect, useCallback } from 'react';
import { incomeApi } from '../api/income';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IncomeStats } from '../components/income/IncomeStats';
import { IncomeFilters } from '../components/income/IncomeFilters';
import { IncomeTable } from '../components/income/IncomeTable';
import { IncomeFormModal } from '../components/income/IncomeFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TableSkeleton } from '../components/common/Skeleton';

export const IncomePage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const currency = user?.currency || 'USD';

  // Data states
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deletingIncome, setDeletingIncome] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate actual startDate and endDate based on dateRange preset
  const getDateRangeBounds = useCallback(() => {
    if (dateRange === 'all') return { start: undefined, end: undefined };
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    if (dateRange === 'this-month') {
      const start = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-01`;
      const end = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-31`;
      return { start, end };
    }

    if (dateRange === 'last-month') {
      const prevMonthDate = new Date(curYear, curMonth - 1, 1);
      const pYear = prevMonthDate.getFullYear();
      const pMonth = prevMonthDate.getMonth() + 1;
      const start = `${pYear}-${String(pMonth).padStart(2, '0')}-01`;
      const end = `${pYear}-${String(pMonth).padStart(2, '0')}-31`;
      return { start, end };
    }

    if (dateRange === 'this-year') {
      const start = `${curYear}-01-01`;
      const end = `${curYear}-12-31`;
      return { start, end };
    }

    if (dateRange === 'custom') {
      return { start: startDate || undefined, end: endDate || undefined };
    }

    return { start: undefined, end: undefined };
  }, [dateRange, startDate, endDate]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { start, end } = getDateRangeBounds();

    try {
      const queryParams = {
        search: search.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        startDate: start,
        endDate: end,
        sort,
        page,
        limit: 20,
      };

      const [listRes, summaryRes] = await Promise.all([
        incomeApi.getIncomes(queryParams),
        incomeApi.getIncomeSummary({ startDate: start, endDate: end }),
      ]);

      setIncomes(listRes.records || []);
      setTotalPages(listRes.totalPages || 1);
      setTotalCount(listRes.totalCount || 0);
      setSummary(summaryRes);
    } catch (err) {
      console.error('Failed to load income data:', err);
      error('Load Error', err?.message || 'Could not fetch income records.');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, sort, page, getDateRangeBounds, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    if (editingIncome) {
      await incomeApi.updateIncome(editingIncome.id, formData);
      success('Income Updated', `Saved changes to "${formData.description}"`);
    } else {
      await incomeApi.createIncome(formData);
      success('Income Recorded', `Added new income of ${formData.description}`);
    }
    setEditingIncome(null);
    loadData();
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingIncome) return;
    setIsDeleting(true);
    try {
      await incomeApi.deleteIncome(deletingIncome.id);
      success('Income Deleted', `Deleted "${deletingIncome.description}"`);
      setDeletingIncome(null);
      loadData();
    } catch (err) {
      error('Delete Error', err?.message || 'Could not delete income entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Excel Download
  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    const { start, end } = getDateRangeBounds();
    try {
      await incomeApi.downloadExcel({
        startDate: start,
        endDate: end,
        category: category !== 'all' ? category : undefined,
      });
      success('Export Complete', 'Income records downloaded as Excel (.xlsx)');
    } catch (err) {
      error('Export Error', err?.message || 'Failed to download spreadsheet.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#222224]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Income Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Log and review all incoming revenue, salaries, and asset earnings
          </p>
        </div>
      </div>

      {/* Income Summary Statistics */}
      <IncomeStats summary={summary} currency={currency} />

      {/* Filter and Search Bar */}
      <IncomeFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        dateRange={dateRange}
        onDateRangeChange={(val) => {
          setDateRange(val);
          setPage(1);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(val) => {
          setSort(val);
          setPage(1);
        }}
        onAddNew={() => {
          setEditingIncome(null);
          setIsFormOpen(true);
        }}
        onDownloadExcel={handleDownloadExcel}
        isDownloading={isDownloading}
      />

      {/* Income Records Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <IncomeTable
          incomes={incomes}
          currency={currency}
          onEdit={(inc) => {
            setEditingIncome(inc);
            setIsFormOpen(true);
          }}
          onDelete={(inc) => setDeletingIncome(inc)}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onAddNew={() => {
            setEditingIncome(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Add / Edit Modal */}
      <IncomeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIncome(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingIncome}
        currency={currency}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingIncome}
        onClose={() => setDeletingIncome(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income Record"
        message={`Are you sure you want to permanently delete "${deletingIncome?.description}"? This action cannot be undone.`}
        confirmText="Delete Record"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

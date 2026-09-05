import React, { useState, useEffect, useCallback } from "react";
import { expensesApi } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ExpenseStats } from "../components/expenses/ExpenseStats";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseTable } from "../components/expenses/ExpenseTable";
import { ExpenseFormModal } from "../components/expenses/ExpenseFormModal";
import { CategoryDonutChart } from "../components/dashboard/CategoryDonutChart";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { TableSkeleton } from "../components/common/Skeleton";

export const ExpensesPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const currency = user?.currency || "USD";

  // Data states
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter and pagination states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate actual startDate and endDate with valid last-day boundaries
  const getDateRangeBounds = useCallback(() => {
    if (dateRange === "all") return { start: undefined, end: undefined };
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();

    if (dateRange === "this-month") {
      const lastDay = new Date(curYear, curMonth + 1, 0).getDate();
      const start = `${curYear}-${String(curMonth + 1).padStart(2, "0")}-01`;
      const end = `${curYear}-${String(curMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      return { start, end };
    }

    if (dateRange === "last-month") {
      const prevMonthDate = new Date(curYear, curMonth - 1, 1);
      const pYear = prevMonthDate.getFullYear();
      const pMonth = prevMonthDate.getMonth() + 1;
      const lastDay = new Date(pYear, pMonth, 0).getDate();
      const start = `${pYear}-${String(pMonth).padStart(2, "0")}-01`;
      const end = `${pYear}-${String(pMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      return { start, end };
    }

    if (dateRange === "this-year") {
      const start = `${curYear}-01-01`;
      const end = `${curYear}-12-31`;
      return { start, end };
    }

    if (dateRange === "custom") {
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
        category: category !== "all" ? category : undefined,
        startDate: start,
        endDate: end,
        sort,
        page,
        limit: 20,
      };

      const [listRes, summaryRes] = await Promise.all([
        expensesApi.getExpenses(queryParams),
        expensesApi.getExpenseSummary({ startDate: start, endDate: end }),
      ]);

      // Normalize array extraction across varied API response keys
      const rawList = listRes?.data ?? listRes;
      const records =
        rawList?.records ||
        rawList?.expenses ||
        rawList?.data ||
        (Array.isArray(rawList) ? rawList : []);

      const pages = rawList?.totalPages || rawList?.pages || 1;
      const count = rawList?.totalCount || rawList?.total || records.length;

      setExpenses(records);
      setTotalPages(pages);
      setTotalCount(count);

      const rawSummary = summaryRes?.data ?? summaryRes;
      setSummary(rawSummary);
    } catch (err) {
      console.error("Failed to load expenses data:", err);
      error("Load Error", err?.message || "Could not fetch expense records.");
    } finally {
      setIsLoading(false);
    }
  }, [search, category, sort, page, getDateRangeBounds, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    if (editingExpense) {
      await expensesApi.updateExpense(
        editingExpense._id || editingExpense.id,
        formData,
      );
      success("Expense Updated", `Saved changes to "${formData.description}"`);
    } else {
      await expensesApi.createExpense(formData);
      success(
        "Expense Recorded",
        `Added new expense for ${formData.description}`,
      );
    }
    setEditingExpense(null);
    loadData();
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await expensesApi.deleteExpense(
        deletingExpense._id || deletingExpense.id,
      );
      success("Expense Deleted", `Deleted "${deletingExpense.description}"`);
      setDeletingExpense(null);
      loadData();
    } catch (err) {
      error("Delete Error", err?.message || "Could not delete expense entry.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Excel Download
  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    const { start, end } = getDateRangeBounds();
    try {
      await expensesApi.downloadExcel({
        startDate: start,
        endDate: end,
        category: category !== "all" ? category : undefined,
      });
      success("Export Complete", "Expense records downloaded as Excel (.xlsx)");
    } catch (err) {
      error("Export Error", err?.message || "Failed to download spreadsheet.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Safe category breakdown check
  const categoryBreakdown =
    summary?.categoryBreakdown || summary?.spendByCategory || [];

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#222224]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Expense Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor and organize all outgoings, household bills, and daily
            spending
          </p>
        </div>
      </div>

      {/* Expense Summary Statistics */}
      <ExpenseStats summary={summary} currency={currency} />

      {/* Category Spending Breakdown Chart for this timeframe */}
      {categoryBreakdown.length > 0 && (
        <div className="mb-2">
          <CategoryDonutChart
            data={categoryBreakdown}
            currency={currency}
            title="Spending Breakdown by Category"
            type="expense"
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <ExpenseFilters
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
          setEditingExpense(null);
          setIsFormOpen(true);
        }}
        onDownloadExcel={handleDownloadExcel}
        isDownloading={isDownloading}
      />

      {/* Expense Records Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <ExpenseTable
          expenses={expenses}
          currency={currency}
          onEdit={(exp) => {
            setEditingExpense(exp);
            setIsFormOpen(true);
          }}
          onDelete={(exp) => setDeletingExpense(exp)}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onAddNew={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Add / Edit Modal */}
      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        currency={currency}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record"
        message={`Are you sure you want to permanently delete "${deletingExpense?.description}"? This action cannot be undone.`}
        confirmText="Delete Record"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

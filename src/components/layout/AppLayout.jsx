import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { IncomeFormModal } from '../income/IncomeFormModal';
import { ExpenseFormModal } from '../expenses/ExpenseFormModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { incomeApi } from '../../api/income';
import { expensesApi } from '../../api/expenses';

export const AppLayout = ({
  children,
  currentPage,
  onNavigate,
  onRefreshTrigger,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const currency = user?.currency || 'USD';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const handleCreateIncome = async (formData) => {
    try {
      await incomeApi.createIncome(formData);
      success('Income Recorded', `Added "${formData.description}"`);
      if (onRefreshTrigger) onRefreshTrigger();
    } catch (err) {
      error('Error', err?.message || 'Could not record income');
      throw err;
    }
  };

  const handleCreateExpense = async (formData) => {
    try {
      await expensesApi.createExpense(formData);
      success('Expense Recorded', `Added "${formData.description}"`);
      if (onRefreshTrigger) onRefreshTrigger();
    } catch (err) {
      error('Error', err?.message || 'Could not record expense');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Sticky Topbar */}
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenAddIncome={() => setIsIncomeModalOpen(true)}
          onOpenAddExpense={() => setIsExpenseModalOpen(true)}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Add Incomes Modal */}
      <IncomeFormModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={handleCreateIncome}
        currency={currency}
      />

      {/* Global Quick Add Expenses Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleCreateExpense}
        currency={currency}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { IncomePage } from './pages/IncomePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { IncomeFormModal } from './components/income/IncomeFormModal';
import { ExpenseFormModal } from './components/expenses/ExpenseFormModal';
import { incomeApi } from './api/income';
import { expensesApi } from './api/expenses';
import { useToast } from './context/ToastContext';
import { Loader2 } from 'lucide-react';

export function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { success, error } = useToast();
  const currency = user?.currency || 'USD';

  // Navigation: 'dashboard' | 'income' | 'expenses' | 'analytics' | 'settings'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // Modals for global Quick Add
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-emerald-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Loading VaultFlow...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Views
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  // Handle Quick Add Income from top actions
  const handleQuickAddIncome = async (formData) => {
    try {
      await incomeApi.createIncome(formData);
      success('Income Recorded', `Added "${formData.description}"`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      error('Error', err?.message || 'Could not save income');
      throw err;
    }
  };

  // Handle Quick Add Expense from top actions
  const handleQuickAddExpense = async (formData) => {
    try {
      await expensesApi.createExpense(formData);
      success('Expense Recorded', `Added "${formData.description}"`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      error('Error', err?.message || 'Could not save expense');
      throw err;
    }
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page)}
      onRefreshTrigger={() => setRefreshTrigger((prev) => prev + 1)}
    >
      {currentPage === 'dashboard' && (
        <DashboardPage
          key={refreshTrigger}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenAddIncome={() => setIsIncomeModalOpen(true)}
          onOpenAddExpense={() => setIsExpenseModalOpen(true)}
        />
      )}

      {currentPage === 'income' && <IncomePage key={refreshTrigger} />}

      {currentPage === 'expenses' && <ExpensesPage key={refreshTrigger} />}

      {currentPage === 'analytics' && <AnalyticsPage key={refreshTrigger} />}

      {currentPage === 'settings' && <SettingsPage />}

      {/* Global Quick Add Incomes Modal */}
      <IncomeFormModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={handleQuickAddIncome}
        currency={currency}
      />

      {/* Global Quick Add Expenses Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleQuickAddExpense}
        currency={currency}
      />
    </AppLayout>
  );
}

export default App;

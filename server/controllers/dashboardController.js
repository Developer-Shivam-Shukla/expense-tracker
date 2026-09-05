import XLSX from 'xlsx';
import Income from '../models/incomeModel.js';
import Expense from '../models/expenseModel.js';
import User from '../models/userModel.js';

// @desc Get comprehensive dashboard statistics and trends
// @route GET /api/dashboard/overview or GET /api/dashboard
export const getDashboardOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const now = new Date();
    // UTC-aligned start of the current month
    const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0));
    const lastMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));

    // 1. All-time Records
    const [allIncome, allExpenses] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
    ]);

    const totalIncome = allIncome.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = allExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);

    // 2. Current Month Metrics
    const thisMonthIncome = allIncome
      .filter((item) => new Date(item.date) >= currentMonthStart)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const thisMonthExpenses = allExpenses
      .filter((item) => new Date(item.date) >= currentMonthStart)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const thisMonthSavings = thisMonthIncome - thisMonthExpenses;
    const savingsRate = thisMonthIncome > 0 
      ? Number(((thisMonthSavings / thisMonthIncome) * 100).toFixed(1)) 
      : 0;

    // 3. Last Month Metrics & Percentage Growth
    const lastMonthIncome = allIncome
      .filter((item) => {
        const d = new Date(item.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const lastMonthExpenses = allExpenses
      .filter((item) => {
        const d = new Date(item.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const lastMonthSavings = lastMonthIncome - lastMonthExpenses;

    const incomePercentChange = lastMonthIncome > 0
      ? Number((((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1))
      : 0;

    const expensePercentChange = lastMonthExpenses > 0
      ? Number((((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1))
      : 0;

    const savingsPercentChange = lastMonthSavings !== 0
      ? Number((((thisMonthSavings - lastMonthSavings) / Math.abs(lastMonthSavings)) * 100).toFixed(1))
      : 0;

    // 4. Monthly Trend (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const nextMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 1));
      const monthLabel = monthDate.toLocaleString('default', { month: 'short' });

      const mIncome = allIncome
        .filter((item) => {
          const d = new Date(item.date);
          return d >= monthDate && d < nextMonthDate;
        })
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      const mExpense = allExpenses
        .filter((item) => {
          const d = new Date(item.date);
          return d >= monthDate && d < nextMonthDate;
        })
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      monthlyTrends.push({
        month: monthLabel,
        year: monthDate.getFullYear(),
        income: mIncome,
        expenses: mExpense,
        net: mIncome - mExpense,
      });
    }

    // 5. Category Breakdown (Current Month Expenses)
    const categoryMap = {};
    allExpenses
      .filter((item) => new Date(item.date) >= currentMonthStart)
      .forEach((exp) => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
      });

    const spendByCategory = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      name: cat,
      amount: categoryMap[cat],
      value: categoryMap[cat],
      percentage: thisMonthExpenses > 0 ? Number(((categoryMap[cat] / thisMonthExpenses) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // 6. Recent Transactions
    const formattedIncomes = allIncome.slice(0, 10).map((inc) => ({
      id: inc._id,
      _id: inc._id,
      type: 'income',
      description: inc.description || inc.source,
      amount: inc.amount,
      category: inc.category,
      date: inc.date,
      paymentMethod: inc.paymentMethod,
      icon: inc.icon || 'Wallet',
    }));

    const formattedExpenses = allExpenses.slice(0, 10).map((exp) => ({
      id: exp._id,
      _id: exp._id,
      type: 'expense',
      description: exp.description,
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      paymentMethod: exp.paymentMethod,
      icon: exp.icon || 'CreditCard',
    }));

    const recentTransactions = [...formattedIncomes, ...formattedExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const monthlyBudget = user?.monthlyBudget || 3000;
    const percentUsed = monthlyBudget > 0 ? Number(((thisMonthExpenses / monthlyBudget) * 100).toFixed(1)) : 0;
    const remaining = Math.max(0, monthlyBudget - thisMonthExpenses);

    const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // ✅ Formatted payload to directly match React DashboardPage props
    return res.status(200).json({
      success: true,
      currentMonth: {
        name: monthName,
        income: thisMonthIncome,
        expenses: thisMonthExpenses,
        savings: thisMonthSavings,
        savingsRate: savingsRate,
      },
      changes: {
        incomePercentChange,
        expensePercentChange,
        savingsPercentChange,
      },
      budgetStatus: {
        monthlyBudget,
        spent: thisMonthExpenses,
        remaining,
        percentUsed,
      },
      spendByCategory,
      monthlyTrends,
      recentTransactions,
      totals: {
        totalIncome,
        totalExpenses,
        totalSavings: totalIncome - totalExpenses,
      },
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return next(error);
  }
};

// @desc Export complete financial workbook (.xlsx)
// @route GET /api/dashboard/export or /api/export/full-workbook
export const exportFullWorkbook = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [incomes, expenses, user] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
      User.findById(userId),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    const workbook = XLSX.utils.book_new();

    // Executive Summary
    const summaryData = [
      ['VaultFlow Financial Report'],
      ['Generated On', new Date().toLocaleString()],
      ['Account Name', user?.name || 'User'],
      ['Account Email', user?.email || ''],
      ['Currency', user?.currency || 'USD'],
      [],
      ['Metric', 'Amount'],
      ['Total Income', totalIncome],
      ['Total Expenses', totalExpenses],
      ['Net Savings', totalIncome - totalExpenses],
      ['Monthly Budget', user?.monthlyBudget || 3000],
      ['Income Records Count', incomes.length],
      ['Expense Records Count', expenses.length],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

    // Income Records
    const incomeRows = incomes.map((inc, index) => ({
      '#': index + 1,
      Date: inc.date ? new Date(inc.date).toISOString().split('T')[0] : '',
      Description: inc.description || inc.source || '',
      Category: inc.category || 'Other',
      Amount: inc.amount,
      'Payment Method': inc.paymentMethod || '',
      Notes: inc.notes || '',
    }));
    const incomeSheet = XLSX.utils.json_to_sheet(incomeRows);
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Records');

    // Expense Records
    const expenseRows = expenses.map((exp, index) => ({
      '#': index + 1,
      Date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '',
      Description: exp.description || '',
      Category: exp.category || 'Other',
      Amount: exp.amount,
      'Payment Method': exp.paymentMethod || '',
      Notes: exp.notes || '',
    }));
    const expenseSheet = XLSX.utils.json_to_sheet(expenseRows);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expense Records');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=VaultFlow_Full_Report.xlsx');
    return res.send(buffer);
  } catch (error) {
    console.error('Export workbook error:', error);
    return next(error);
  }
};

// @desc Seed realistic sample data for testing
// @route POST /api/dashboard/reset-demo or POST /api/export/reset-demo
export const resetDemoData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Income.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
    ]);

    const sampleIncomes = [
      { description: 'Senior Tech Consultant Salary', amount: 5400, category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date() },
      { description: 'Client UI Design Retainer', amount: 1850, category: 'Freelance', paymentMethod: 'Bank Transfer', date: new Date(Date.now() - 10 * 86400000) },
      { description: 'S&P 500 Dividend Payout', amount: 320, category: 'Investments', paymentMethod: 'Bank Transfer', date: new Date(Date.now() - 18 * 86400000) },
    ];

    const sampleExpenses = [
      { category: 'Housing', description: 'Modern Apartment Rent', amount: 1650, paymentMethod: 'Bank Transfer', date: new Date() },
      { category: 'Food & Dining', description: 'Whole Foods Market Groceries', amount: 184.5, paymentMethod: 'Credit Card', date: new Date(Date.now() - 3 * 86400000) },
    ];

    await Promise.all([
      Income.insertMany(sampleIncomes.map((i) => ({ ...i, userId }))),
      Expense.insertMany(sampleExpenses.map((e) => ({ ...e, userId }))),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Demo dataset successfully generated and linked to your account.',
    });
  } catch (error) {
    console.error('Reset demo error:', error);
    return next(error);
  }
};
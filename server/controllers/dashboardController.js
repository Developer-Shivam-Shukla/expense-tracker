import XLSX from 'xlsx';
import Income from '../models/incomeModel.js';
import Expense from '../models/expenseModel.js';
import User from '../models/userModel.js';

// @desc Get comprehensive dashboard statistics and trends
// @route GET /api/dashboard/overview or GET /api/dashboard
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. All-time Totals
    const [allIncome, allExpenses] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
    ]);

    const totalIncome = allIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    // 2. Current Month Totals
    const thisMonthIncome = allIncome
      .filter((item) => new Date(item.date) >= currentMonthStart)
      .reduce((sum, item) => sum + item.amount, 0);

    const thisMonthExpenses = allExpenses
      .filter((item) => new Date(item.date) >= currentMonthStart)
      .reduce((sum, item) => sum + item.amount, 0);

    // 3. Last Month Totals
    const lastMonthIncome = allIncome
      .filter((item) => {
        const d = new Date(item.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const lastMonthExpenses = allExpenses
      .filter((item) => {
        const d = new Date(item.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    // Percentage changes
    const incomeGrowth =
      lastMonthIncome > 0
        ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
        : 0;

    const expenseGrowth =
      lastMonthExpenses > 0
        ? (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
        : 0;

    // 4. Monthly Trend (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = monthDate.toLocaleString('default', { month: 'short' });

      const mIncome = allIncome
        .filter((item) => {
          const d = new Date(item.date);
          return d >= monthDate && d < nextMonthDate;
        })
        .reduce((sum, item) => sum + item.amount, 0);

      const mExpense = allExpenses
        .filter((item) => {
          const d = new Date(item.date);
          return d >= monthDate && d < nextMonthDate;
        })
        .reduce((sum, item) => sum + item.amount, 0);

      monthlyTrends.push({
        month: monthLabel,
        year: monthDate.getFullYear(),
        income: mIncome,
        expenses: mExpense,
        net: mIncome - mExpense,
      });
    }

    // 5. Expense Breakdown by Category
    const categoryMap = {};
    allExpenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      amount: categoryMap[cat],
      percentage: totalExpenses > 0 ? ((categoryMap[cat] / totalExpenses) * 100).toFixed(1) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // 6. Recent Transactions (combined top 10)
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
    const budgetUsedPercentage = monthlyBudget > 0 ? ((thisMonthExpenses / monthlyBudget) * 100).toFixed(1) : 0;
    const budgetRemaining = Math.max(0, monthlyBudget - thisMonthExpenses);

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate: Number(savingsRate),
        thisMonthIncome,
        thisMonthExpenses,
        thisMonthNet: thisMonthIncome - thisMonthExpenses,
        incomeGrowth: Number(incomeGrowth),
        expenseGrowth: Number(expenseGrowth),
        monthlyBudget,
        budgetUsedPercentage: Number(budgetUsedPercentage),
        budgetRemaining,
        monthlyTrends,
        categoryBreakdown,
        recentTransactions,
        incomeCount: allIncome.length,
        expenseCount: allExpenses.length,
      },
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating dashboard metrics',
    });
  }
};

// @desc Export complete financial workbook (.xlsx)
// @route GET /api/dashboard/export or /api/export/full-workbook
export const exportFullWorkbook = async (req, res) => {
  try {
    const userId = req.user._id;
    const [incomes, expenses, user] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
      User.findById(userId),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    const workbook = XLSX.utils.book_new();

    // Summary Sheet
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

    // Income Sheet
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

    // Expenses Sheet
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
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating full workbook',
    });
  }
};

// @desc Seed realistic sample data for testing
// @route POST /api/dashboard/reset-demo or POST /api/export/reset-demo
export const resetDemoData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Clear existing for this user
    await Promise.all([
      Income.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
    ]);

    const sampleIncomes = [
      { description: 'Senior Tech Consultant Salary', amount: 5400, category: 'Salary', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 2 * 86400000) },
      { description: 'Client UI Design Retainer', amount: 1850, category: 'Freelance', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 10 * 86400000) },
      { description: 'S&P 500 Dividend Payout', amount: 320, category: 'Investments', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 18 * 86400000) },
      { description: 'Quarterly Project Completion Bonus', amount: 1200, category: 'Bonus', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 35 * 86400000) },
      { description: 'Consultancy Retainer Previous Month', amount: 5400, category: 'Salary', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 32 * 86400000) },
      { description: 'Rental Unit Revenue', amount: 850, category: 'Rental', paymentMethod: 'bank_transfer', date: new Date(Date.now() - 45 * 86400000) },
    ];

    const sampleExpenses = [
      { category: 'Housing', description: 'Modern Apartment Rent', amount: 1650, paymentMethod: 'bank_transfer', date: new Date(Date.now() - 1 * 86400000) },
      { category: 'Food & Dining', description: 'Whole Foods Market Groceries', amount: 184.5, paymentMethod: 'credit_card', date: new Date(Date.now() - 3 * 86400000) },
      { category: 'Utilities', description: 'High-Speed Gigabit Fiber Internet', amount: 89.99, paymentMethod: 'credit_card', date: new Date(Date.now() - 5 * 86400000) },
      { category: 'Transportation', description: 'Shell EV Supercharging Station', amount: 42.5, paymentMethod: 'credit_card', date: new Date(Date.now() - 7 * 86400000) },
      { category: 'Entertainment', description: 'Cloud Infrastructure & Media Subs', amount: 75.0, paymentMethod: 'credit_card', date: new Date(Date.now() - 12 * 86400000) },
      { category: 'Healthcare', description: 'Annual Health & Dental Checkup', amount: 135.0, paymentMethod: 'credit_card', date: new Date(Date.now() - 16 * 86400000) },
      { category: 'Education', description: 'Advanced System Architecture Course', amount: 249.0, paymentMethod: 'credit_card', date: new Date(Date.now() - 25 * 86400000) },
      { category: 'Housing', description: 'Previous Month Apartment Rent', amount: 1650, paymentMethod: 'bank_transfer', date: new Date(Date.now() - 31 * 86400000) },
      { category: 'Food & Dining', description: 'Dinner with Engineering Team', amount: 145.0, paymentMethod: 'credit_card', date: new Date(Date.now() - 34 * 86400000) },
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
    return res.status(500).json({
      success: false,
      message: error.message || 'Error seeding sample data',
    });
  }
};

import XLSX from 'xlsx';
import Expense from '../models/expenseModel.js';

// @desc Add a new expense
// @route POST /api/expense/add or POST /api/expense or POST /api/expenses
export const addExpense = async (req, res, next) => {
  try {
    const { category, description, title, item, amount, date, paymentMethod, notes, icon } = req.body;
    const finalDescription = description || title || item;

    if (!category || !finalDescription || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Category, Description, and Amount',
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      category: category.trim(),
      description: finalDescription.trim(),
      amount: numericAmount,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'credit_card',
      notes: notes || '',
      icon: icon || 'CreditCard',
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Add expense error:', error);
    return next(error);
  }
};

// @desc Get all expenses for authenticated user
// @route GET /api/expense/get or GET /api/expense or GET /api/expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, search, sortBy = 'date', sortOrder = 'desc', limit, page } = req.query;

    const filter = { userId: req.user._id };

    if (category && category !== 'all' && category !== 'All Categories') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { description: searchRegex },
        { category: searchRegex },
        { notes: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let query = Expense.find(filter).sort(sortOptions);

    if (limit && page) {
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const expenses = await query.exec();
    const totalCount = await Expense.countDocuments(filter);
    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return res.status(200).json({
      success: true,
      count: expenses.length,
      totalCount,
      totalAmount,
      data: expenses,
      expenses,
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    return next(error);
  }
};

// @desc Get expense summary & category breakdown
// @route GET /api/expense/summary
export const getExpenseSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allTimeStats, thisMonthStats, categoryStats] = await Promise.all([
      Expense.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalExpense: { $sum: '$amount' },
            count: { $sum: 1 },
            avgExpense: { $avg: '$amount' },
          },
        },
      ]),
      Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: firstDayOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            monthExpense: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalExpense: allTimeStats[0]?.totalExpense || 0,
        totalCount: allTimeStats[0]?.count || 0,
        thisMonthExpense: thisMonthStats[0]?.monthExpense || 0,
        thisMonthCount: thisMonthStats[0]?.count || 0,
        averageTransaction: allTimeStats[0]?.avgExpense || 0,
        byCategory: categoryStats.map((c) => ({
          category: c._id,
          total: c.total,
          count: c.count,
        })),
      },
    });
  } catch (error) {
    console.error('Expense summary error:', error);
    return next(error);
  }
};

// @desc Update an existing expense
// @route PUT /api/expense/:id
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, description, title, item, amount, date, paymentMethod, notes, icon } = req.body;
    const finalDescription = description || title || item;

    const expense = await Expense.findOne({ _id: id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found or not authorized',
      });
    }

    if (category) expense.category = category.trim();
    if (finalDescription) expense.description = finalDescription.trim();
    if (amount !== undefined) {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      expense.amount = num;
    }
    if (date) expense.date = new Date(date);
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;
    if (icon) expense.icon = icon;

    const updated = await expense.save();

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Update expense error:', error);
    return next(error);
  }
};

// @desc Delete an expense
// @route DELETE /api/expense/:id
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found or already deleted',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: deleted._id },
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    return next(error);
  }
};

// @desc Download all expenses as an Excel (.xlsx) file
// @route GET /api/expense/download/excel or /api/expense/downloadexcel
export const downloadExpenseExcel = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

    const rows = expenses.map((exp, index) => ({
      '#': index + 1,
      Date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '',
      Description: exp.description || '',
      Category: exp.category || 'Other',
      'Amount ($)': exp.amount,
      'Payment Method': exp.paymentMethod || 'Credit Card',
      Notes: exp.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=VaultFlow_Expense_Report.xlsx');
    return res.send(buffer);
  } catch (error) {
    console.error('Download expense excel error:', error);
    return next(error);
  }
};
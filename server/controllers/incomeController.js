import XLSX from "xlsx";
import Income from "../models/incomeModel.js";

// @desc Add a new income record
// @route POST /api/income/add or POST /api/income
export const addIncome = async (req, res, next) => {
  try {
    const {
      source,
      description,
      amount,
      category,
      date,
      paymentMethod,
      notes,
      icon,
    } = req.body;
    const finalDescription = description || source;

    if (!finalDescription || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide both description/source and amount",
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const income = await Income.create({
      userId: req.user._id,
      source: finalDescription.trim(),
      description: finalDescription.trim(),
      amount: numericAmount,
      category: category || "Salary",
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || "Bank Transfer",
      notes: notes || "",
      icon: icon || "Wallet",
    });

    return res.status(201).json({
      success: true,
      message: "Income record added successfully",
      data: income,
    });
  } catch (error) {
    console.error("Add income error:", error);
    return next(error);
  }
};

// @desc Get all income records for the authenticated user
// @route GET /api/income/get or GET /api/income
export const getAllIncomes = async (req, res, next) => {
  try {
    const {
      category,
      startDate,
      endDate,
      search,
      sortBy = "date",
      sortOrder = "desc",
      limit,
      page,
    } = req.query;

    const filter = { userId: req.user._id };

    if (category && category !== "all" && category !== "All Categories") {
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
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { description: searchRegex },
        { source: searchRegex },
        { notes: searchRegex },
        { category: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    let query = Income.find(filter).sort(sortOptions);

    if (limit && page) {
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const incomes = await query.exec();
    const totalCount = await Income.countDocuments(filter);
    const totalAmount = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    return res.status(200).json({
      success: true,
      count: incomes.length,
      totalCount,
      totalAmount,
      data: incomes,
      incomes,
    });
  } catch (error) {
    console.error("Get incomes error:", error);
    return next(error);
  }
};

// @desc Get income summary and category distribution
// @route GET /api/income/summary
export const getIncomeSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allTimeStats, thisMonthStats, categoryStats] = await Promise.all([
      Income.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$amount" },
            count: { $sum: 1 },
            avgIncome: { $avg: "$amount" },
          },
        },
      ]),
      Income.aggregate([
        {
          $match: {
            userId,
            date: { $gte: firstDayOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            monthIncome: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Income.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalIncome: allTimeStats[0]?.totalIncome || 0,
        totalCount: allTimeStats[0]?.count || 0,
        thisMonthIncome: thisMonthStats[0]?.monthIncome || 0,
        thisMonthCount: thisMonthStats[0]?.count || 0,
        averageTransaction: allTimeStats[0]?.avgIncome || 0,
        byCategory: categoryStats.map((c) => ({
          category: c._id,
          total: c.total,
          count: c.count,
        })),
      },
    });
  } catch (error) {
    console.error("Income summary error:", error);
    return next(error);
  }
};

// @desc Update an existing income record
// @route PUT /api/income/:id
export const updateIncome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      source,
      description,
      amount,
      category,
      date,
      paymentMethod,
      notes,
      icon,
    } = req.body;
    const finalDescription = description || source;

    const income = await Income.findOne({ _id: id, userId: req.user._id });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income record not found or not authorized",
      });
    }

    if (finalDescription) {
      income.description = finalDescription.trim();
      income.source = finalDescription.trim();
    }
    if (amount !== undefined) {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a positive number",
        });
      }
      income.amount = num;
    }
    if (category) income.category = category;
    if (date) income.date = new Date(date);
    if (paymentMethod) income.paymentMethod = paymentMethod;
    if (notes !== undefined) income.notes = notes;
    if (icon) income.icon = icon;

    const updated = await income.save();

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update income error:", error);
    return next(error);
  }
};

// @desc Delete an income record
// @route DELETE /api/income/:id
export const deleteIncome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Income.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Income record not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
      data: { id: deleted._id },
    });
  } catch (error) {
    console.error("Delete income error:", error);
    return next(error);
  }
};

// @desc Download all incomes as an Excel (.xlsx) file
// @route GET /api/income/download/excel or /api/income/downloadexcel
export const downloadIncomeExcel = async (req, res, next) => {
  try {
    const incomes = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const rows = incomes.map((inc, index) => ({
      "#": index + 1,
      Date: inc.date ? new Date(inc.date).toISOString().split("T")[0] : "",
      Description: inc.description || inc.source || "",
      Category: inc.category || "Other",
      "Amount ($)": inc.amount,
      "Payment Method": inc.paymentMethod || "Bank Transfer",
      Notes: inc.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=VaultFlow_Income_Report.xlsx",
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Download income excel error:", error);
    return next(error);
  }
};

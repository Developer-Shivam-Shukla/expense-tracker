import express from 'express';
import {
  addExpense,
  getAllExpenses,
  getExpenseSummary,
  updateExpense,
  deleteExpense,
  downloadExpenseExcel,
} from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/add', addExpense);
router.post('/', addExpense);

router.get('/get', getAllExpenses);
router.get('/', getAllExpenses);

router.get('/summary', getExpenseSummary);

router.get('/download/excel', downloadExpenseExcel);
router.get('/downloadexcel', downloadExpenseExcel);

router.put('/update/:id', updateExpense);
router.put('/:id', updateExpense);

router.delete('/delete/:id', deleteExpense);
router.delete('/:id', deleteExpense);

export default router;

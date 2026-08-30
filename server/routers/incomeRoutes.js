import express from 'express';
import {
  addIncome,
  getAllIncomes,
  getIncomeSummary,
  updateIncome,
  deleteIncome,
  downloadIncomeExcel,
} from '../controllers/incomeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/add', addIncome);
router.post('/', addIncome);

router.get('/get', getAllIncomes);
router.get('/', getAllIncomes);

router.get('/summary', getIncomeSummary);

router.get('/download/excel', downloadIncomeExcel);
router.get('/downloadexcel', downloadIncomeExcel);

router.put('/update/:id', updateIncome);
router.put('/:id', updateIncome);

router.delete('/delete/:id', deleteIncome);
router.delete('/:id', deleteIncome);

export default router;

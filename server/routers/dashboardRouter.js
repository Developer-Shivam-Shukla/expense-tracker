import express from 'express';
import {
  getDashboardOverview,
  exportFullWorkbook,
  resetDemoData,
} from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardOverview);
router.get('/overview', getDashboardOverview);
router.get('/export', exportFullWorkbook);
router.get('/export/full-workbook', exportFullWorkbook);
router.post('/reset-demo', resetDemoData);
router.post('/seed', resetDemoData);

export default router;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import authRouter from './routers/userRoutes.js';
import incomeRouter from './routers/incomeRoutes.js';
import expenseRouter from './routers/expenseRouter.js';
import dashboardRouter from './routers/dashboardRouter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// Mounted Routes
app.use('/api/user', authRouter);
app.use('/api/auth', authRouter); // Compatibility alias
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/expenses', expenseRouter); // Compatibility alias
app.use('/api/dashboard', dashboardRouter);
app.use('/api/export', dashboardRouter); // Compatibility alias

export { app };
export default app;

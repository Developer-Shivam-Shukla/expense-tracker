import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: 'CreditCard',
    },
    category: {
      type: String,
      required: [true, 'Please specify an expense category'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an expense description'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please enter a valid expense amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'credit_card',
      enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'crypto', 'other'],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;

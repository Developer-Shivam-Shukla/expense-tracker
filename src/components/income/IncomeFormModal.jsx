import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { INCOME_CATEGORY_LIST, PAYMENT_METHODS } from '../../utils/categories';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';

export const IncomeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  currency = 'USD',
}) => {
  const isEditing = !!initialData;
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || 'Salary');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'Bank Transfer');
      setNotes(initialData.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setCategory('Salary');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Bank Transfer');
      setNotes('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive income amount.');
      return;
    }

    if (!date) {
      setError('Please choose a date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: numAmount,
        category,
        date,
        paymentMethod,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save income record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Income Record' : 'Record New Income'}
      description={
        isEditing
          ? 'Update the details for this income entry.'
          : 'Log any earnings, salaries, dividends, or freelance payouts.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs leading-relaxed">
            {error}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Description <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly Salary, Freelance Design, Dividend"
            className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Amount & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Amount ({currencySymbol}) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-zinc-400 pointer-events-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Category & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Income Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              {INCOME_CATEGORY_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Notes / Reference (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details, invoice number, or client remarks..."
            className="w-full px-3.5 py-2 bg-[#111112] border border-[#2d2d30] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222224]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-[#1e1e20] hover:bg-[#2d2d30] border border-[#2d2d30] rounded-xl transition-all whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isEditing ? 'Save Changes' : 'Record Income'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

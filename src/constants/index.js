// Common Constants & Defaults for VaultFlow Frontend

export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'AU$' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'SG$' },
  { code: 'CHF', label: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Dividends',
  'Rental',
  'Bonus',
  'Gifts',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Housing & Rent',
  'Groceries & Food',
  'Dining & Drinks',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Healthcare & Medical',
  'Shopping',
  'Travel',
  'Subscriptions',
  'Education',
  'Personal Care',
  'Other',
];

export const PAYMENT_METHODS = [
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Cash',
  'PayPal',
  'UPI',
  'Apple Pay',
  'Google Pay',
  'Cheque',
  'Other',
];

export const DATE_FILTER_PRESETS = [
  { value: 'all', label: 'All Time' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest Date First' },
  { value: 'date-asc', label: 'Oldest Date First' },
  { value: 'amount-desc', label: 'Highest Amount First' },
  { value: 'amount-asc', label: 'Lowest Amount First' },
];

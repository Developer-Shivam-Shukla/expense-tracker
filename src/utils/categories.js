// Category metadata and styling information

export const INCOME_CATEGORIES = {
  Salary: {
    name: 'Salary',
    color: '#059669', // emerald-600
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    iconName: 'Briefcase',
  },
  Freelance: {
    name: 'Freelance',
    color: '#0d9488', // teal-600
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    iconName: 'Laptop',
  },
  Investments: {
    name: 'Investments',
    color: '#2563eb', // blue-600
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    iconName: 'TrendingUp',
  },
  Business: {
    name: 'Business',
    color: '#7c3aed', // violet-600
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    iconName: 'Building2',
  },
  Dividends: {
    name: 'Dividends',
    color: '#0891b2', // cyan-600
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    iconName: 'Coins',
  },
  Rental: {
    name: 'Rental',
    color: '#d97706', // amber-600
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    iconName: 'Home',
  },
  Bonus: {
    name: 'Bonus',
    color: '#16a34a', // green-600
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    iconName: 'Award',
  },
  Gifts: {
    name: 'Gifts',
    color: '#db2777', // pink-600
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    iconName: 'Gift',
  },
  Other: {
    name: 'Other',
    color: '#4b5563', // gray-600
    bgColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    iconName: 'CircleDollarSign',
  },
};

export const EXPENSE_CATEGORIES = {
  'Housing & Rent': {
    name: 'Housing & Rent',
    color: '#e11d48', // rose-600
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    iconName: 'Home',
  },
  'Groceries & Food': {
    name: 'Groceries & Food',
    color: '#ea580c', // orange-600
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    iconName: 'ShoppingBag',
  },
  'Dining & Drinks': {
    name: 'Dining & Drinks',
    color: '#f59e0b', // amber-500
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    iconName: 'Utensils',
  },
  'Transportation': {
    name: 'Transportation',
    color: '#0284c7', // light-blue-600
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    iconName: 'Car',
  },
  'Utilities & Bills': {
    name: 'Utilities & Bills',
    color: '#6366f1', // indigo-500
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    iconName: 'Zap',
  },
  'Entertainment': {
    name: 'Entertainment',
    color: '#9333ea', // purple-600
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    iconName: 'Film',
  },
  'Healthcare & Medical': {
    name: 'Healthcare & Medical',
    color: '#dc2626', // red-600
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    iconName: 'HeartPulse',
  },
  'Shopping': {
    name: 'Shopping',
    color: '#c026d3', // fuchsia-600
    bgColor: '#fdf4ff',
    borderColor: '#f5d0fe',
    iconName: 'Tag',
  },
  'Travel': {
    name: 'Travel',
    color: '#0d9488', // teal-600
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    iconName: 'Plane',
  },
  'Subscriptions': {
    name: 'Subscriptions',
    color: '#4f46e5', // indigo-600
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    iconName: 'Repeat',
  },
  'Education': {
    name: 'Education',
    color: '#2563eb', // blue-600
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    iconName: 'GraduationCap',
  },
  'Personal Care': {
    name: 'Personal Care',
    color: '#db2777', // pink-600
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
    iconName: 'Sparkles',
  },
  'Other': {
    name: 'Other',
    color: '#4b5563', // gray-600
    bgColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    iconName: 'HelpCircle',
  },
};

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

export const INCOME_CATEGORY_LIST = Object.keys(INCOME_CATEGORIES);
export const EXPENSE_CATEGORY_LIST = Object.keys(EXPENSE_CATEGORIES);

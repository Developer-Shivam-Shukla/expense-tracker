// Utility formatting functions

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'AU$',
  JPY: '¥',
  SGD: 'SG$',
  CHF: 'CHF',
  CNY: '¥',
};

export function formatCurrency(amount, currency = 'USD') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const isNegative = num < 0;
  const absAmount = Math.abs(num);

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
}

export function formatCompactCurrency(amount, currency = 'USD') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1)}k`;
  }
  return `${sign}${symbol}${abs.toFixed(0)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(dateString);
}

export function formatPercentage(value) {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

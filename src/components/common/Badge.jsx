import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Coins,
  Home,
  Award,
  Gift,
  CircleDollarSign,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Film,
  HeartPulse,
  Tag,
  Plane,
  Repeat,
  GraduationCap,
  Sparkles,
  HelpCircle,
  CreditCard,
  Building,
  Banknote,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories';

export const CategoryIcon = ({ iconName, className = 'w-3.5 h-3.5' }) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'CircleDollarSign':
      return <CircleDollarSign className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'Plane':
      return <Plane className={className} />;
    case 'Repeat':
      return <Repeat className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export const CategoryBadge = ({ category, type = 'income', showIcon = true, size = 'sm' }) => {
  const meta = type === 'income' ? INCOME_CATEGORIES[category] : EXPENSE_CATEGORIES[category];
  const color = meta?.color || (type === 'income' ? '#10b981' : '#f43f5e');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold tracking-wide border whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}35`,
        color: color,
      }}
    >
      {showIcon && meta?.iconName && <CategoryIcon iconName={meta.iconName} className="w-3 h-3 shrink-0" />}
      <span className="truncate max-w-[120px]">{category || 'Other'}</span>
    </span>
  );
};

export const PaymentMethodBadge = ({ method }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1e1e20] text-zinc-300 border border-[#2d2d30] text-[11px] font-medium whitespace-nowrap">
      <CreditCard className="w-3 h-3 text-zinc-400" />
      {method || 'Other'}
    </span>
  );
};

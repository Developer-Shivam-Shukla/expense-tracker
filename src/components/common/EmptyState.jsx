import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  description = 'Get started by creating a new entry.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#151517] border border-[#2d2d30] rounded-2xl">
      <div className="p-3.5 bg-[#1e1e20] text-zinc-400 border border-[#2d2d30] rounded-2xl mb-4">
        {icon || <Inbox className="w-6 h-6 text-zinc-400" />}
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
};

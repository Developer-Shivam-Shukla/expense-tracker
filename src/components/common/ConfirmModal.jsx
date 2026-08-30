import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isDangerous
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isDangerous ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#222224]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#1e1e20] hover:bg-[#2d2d30] border border-[#2d2d30] rounded-xl transition-all whitespace-nowrap"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

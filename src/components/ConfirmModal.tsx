import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '삭제',
  cancelText = '취소',
  danger = true
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/65 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all w-full max-w-sm border border-gray-100">
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className={`p-2.5 rounded-2xl ${danger ? 'bg-rose-50 text-red-500' : 'bg-gray-100 text-gray-800'}`}>
              <AlertTriangle size={18} className="stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-gray-900 font-sans">
              {title}
            </h3>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6">
            {description}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 py-3 text-xs font-bold text-slate-550 border border-gray-200 bg-gray-50/50 hover:bg-gray-100 font-sans rounded-xl transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`cursor-pointer flex-1 py-3 text-xs font-bold text-white font-sans rounded-xl transition-all ${
                danger 
                  ? 'bg-red-500 hover:bg-rose-600 shadow-sm' 
                  : 'bg-gray-800 hover:bg-gray-900 shadow-sm'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

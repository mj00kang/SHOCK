import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full ${sizeClasses[size]} bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header segment with premium light-gradient background */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-display font-extrabold text-gray-900 text-base md:text-lg tracking-tight">
            {title}
          </h3>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body formatted in highly-legible deep charcoal text */}
        <div className="p-6 overflow-y-auto flex-1 text-gray-700 font-sans text-xs md:text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowUpToLine } from 'lucide-react';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[54px] h-[54px] bg-white hover:bg-gray-50 text-gray-800 rounded-full border border-gray-200 shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all focus:outline-none cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUpToLine size={24} strokeWidth={1.5} />
    </button>
  );
}

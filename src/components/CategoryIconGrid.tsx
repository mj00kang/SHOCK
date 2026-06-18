import React from 'react';

interface CategoryIconGridProps {
  onNavigateToCategoryPage: (group: 'POP' | 'SPORTS' | 'ANALOG', subCategory?: string) => void;
}

export default function CategoryIconGrid({ onNavigateToCategoryPage }: CategoryIconGridProps) {
  const row1 = [
    {
      label: '빈티지토이',
      emoji: '🧸',
      group: 'POP' as const,
      subCategory: '빈티지토이',
    },
    {
      label: '피규어',
      emoji: '🤖',
      group: 'POP' as const,
      subCategory: '피규어',
    },
    {
      label: '트레이딩카드',
      emoji: '🃏',
      group: 'POP' as const,
      subCategory: '트레이딩카드',
    },
    {
      label: '아이돌포카',
      emoji: '🌟',
      group: 'POP' as const,
      subCategory: '아이돌 포카',
    },
    {
      label: '스포츠카드',
      emoji: '🏀',
      group: 'SPORTS' as const,
      subCategory: '스포츠카드',
    },
    {
      label: '유니폼/의류 굿즈',
      emoji: '👕',
      group: 'SPORTS' as const,
      subCategory: '유니폼/의류 굿즈',
    },
    {
      label: '운동화',
      emoji: '👟',
      group: 'SPORTS' as const,
      subCategory: '운동화',
    },
    {
      label: '사인볼/공',
      emoji: '⚾',
      group: 'SPORTS' as const,
      subCategory: '사인볼/공',
    },
  ];

  const row2 = [
    {
      label: '스포츠굿즈',
      emoji: '🏆',
      group: 'SPORTS' as const,
      subCategory: '스포츠 굿즈',
    },
    {
      label: '희귀 LP/음반',
      emoji: '📻',
      group: 'ANALOG' as const,
      subCategory: '희귀 LP/음반',
    },
    {
      label: '빈티지 카메라',
      emoji: '📷',
      group: 'ANALOG' as const,
      subCategory: '빈티지 카메라',
    },
    {
      label: '화폐',
      emoji: '💵',
      group: 'ANALOG' as const,
      subCategory: '화폐',
    },
    {
      label: '우표',
      emoji: '✉️',
      group: 'ANALOG' as const,
      subCategory: '우표',
    },
    {
      label: '로스트미디어',
      emoji: '📼',
      group: 'ANALOG' as const,
      subCategory: '로스트미디어',
    },
    {
      label: '레트로',
      emoji: '🕹️',
      group: 'ANALOG' as const,
      subCategory: '레트로',
    },
    {
      label: '굿즈',
      emoji: '🎒',
      group: 'POP' as const,
      subCategory: '굿즈',
    },
  ];

  return (
    <section id="category-icon-grid" className="w-full bg-white pt-10 pb-9 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-10 select-none flex flex-col gap-6 md:gap-10">
        
        {/* Row 1: Forced 8 columns grid for absolute wrap prevention and perfect scaling responsiveness */}
        <div className="grid grid-cols-8 gap-x-1.5 sm:gap-x-4 md:gap-x-8 gap-y-4 justify-items-center w-full">
          {row1.map((item, index) => (
            <button
              key={`row1-${index}`}
              onClick={() => onNavigateToCategoryPage(item.group, item.subCategory)}
              className="group flex flex-col items-center justify-center cursor-pointer w-full"
            >
              {/* Responsive Circle frame */}
              <div className="w-11 h-11 sm:w-16 sm:h-16 md:w-[76px] md:h-[76px] xl:w-[82px] xl:h-[82px] aspect-square rounded-full bg-neutral-50/90 hover:bg-neutral-100 flex items-center justify-center border border-neutral-100 group-hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md text-xl sm:text-3xl md:text-4xl select-none">
                {item.emoji}
              </div>
              <span className="text-[8px] min-[360px]:text-[9px] min-[400px]:text-[10px] sm:text-[11px] md:text-[12px] font-sans font-bold text-neutral-800 text-center tracking-tighter mt-1 md:mt-2.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full block leading-none">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Row 2: Forced 8 columns grid matching Row 1 symmetry for absolute wrap prevention and perfect scaling responsiveness */}
        <div className="grid grid-cols-8 gap-x-1.5 sm:gap-x-4 md:gap-x-8 gap-y-4 justify-items-center w-full">
          {row2.map((item, index) => (
            <button
              key={`row2-${index}`}
              onClick={() => onNavigateToCategoryPage(item.group, item.subCategory)}
              className="group flex flex-col items-center justify-center cursor-pointer w-full"
            >
              {/* Responsive Circle frame */}
              <div className="w-11 h-11 sm:w-16 sm:h-16 md:w-[76px] md:h-[76px] xl:w-[82px] xl:h-[82px] aspect-square rounded-full bg-neutral-50/90 hover:bg-neutral-100 flex items-center justify-center border border-neutral-100 group-hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md text-xl sm:text-3xl md:text-4xl select-none">
                {item.emoji}
              </div>
              <span className="text-[8px] min-[360px]:text-[9px] min-[400px]:text-[10px] sm:text-[11px] md:text-[12px] font-sans font-bold text-neutral-800 text-center tracking-tighter mt-1 md:mt-2.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full block leading-none">
                {item.label}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

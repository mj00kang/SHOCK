import React, { useState, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  categoryGroup?: string;
  categoryName?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  categoryGroup = 'POP',
  categoryName = '굿즈'
}: ProductImageProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error when src changes (e.g. uploading replacement)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const fallbackUrl = `gradient://${categoryGroup}/${categoryName}/0`;
  const resolvedSrc = (!src || imgError) ? fallbackUrl : src;

  if (resolvedSrc && resolvedSrc.startsWith('gradient://')) {
    // Format: gradient://GROUP/CategoryName/Index
    const parts = resolvedSrc.split('/');
    const group = parts[2] || 'POP';
    const catName = parts[3] || '아이템';

    // Emoji mapper based on category name
    const getCategoryEmoji = (cat: string) => {
      const emojiMap: Record<string, string> = {
        '빈티지토이': '🧸',
        '피규어': '🤖',
        '트레이딩카드': '🃏',
        '아이돌 포카': '🌟',
        '굿즈': '🎒',
        '스포츠카드': '🏀',
        '유니폼/의류 굿즈': '👕',
        '운동화': '👟',
        '사인볼/공': '⚾',
        '스포츠 굿즈': '🏆',
        '희귀 LP/음반': '📻',
        '빈티지 카메라': '📷',
        '화폐': '💵',
        '우표': '✉️',
        '로스트미디어': '📼',
        '레트로': '📺'
      };
      return emojiMap[cat] || '🎁';
    };

    const emoji = getCategoryEmoji(catName);

    // Styled gradients tailored to each category group
    const design = {
      POP: {
        gradientClass: 'from-gray-300 via-pink-100 to-rose-350',
        textColor: 'text-rose-600',
        badgeColor: 'bg-rose-50 border-rose-100 text-rose-600',
        floatingLabel: 'POP ART ARCHIVE'
      },
      SPORTS: {
        gradientClass: 'from-gray-300 via-teal-100 to-emerald-350',
        textColor: 'text-emerald-700',
        badgeColor: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        floatingLabel: 'ATHLETIC CHAMP'
      },
      ANALOG: {
        gradientClass: 'from-gray-300 via-yellow-50 to-yellow-300',
        textColor: 'text-yellow-700',
        badgeColor: 'bg-yellow-50 border-yellow-100 text-yellow-700',
        floatingLabel: 'RETRO CHRONOS'
      }
    }[group as 'POP' | 'SPORTS' | 'ANALOG'] || {
      gradientClass: 'from-gray-200 via-gray-100 to-blue-200',
      textColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 border-blue-100 text-blue-600',
      floatingLabel: '샥 PREMIUM'
    };

    return (
      <div className={`w-full h-full  ${design.gradientClass} flex flex-col items-center justify-between p-5 relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] select-none rounded-[inherit]`}>
        {/* Decorative ambient rays */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gray-50 pointer-events-none" />
        
        {/* Monospace Badge header */}
        <div className="w-full flex items-center justify-between relative z-10">
          <span className="text-[8px] font-mono font-black tracking-widest text-gray-500/80 uppercase">
            {design.floatingLabel}
          </span>
          <span className={`text-[8px] font-mono font-black border rounded px-1.5 py-0.5 ${design.badgeColor}`}>
            CODE-{group}
          </span>
        </div>

        {/* Central Display: Big Icon with float anim */}
        <div className="flex flex-col items-center justify-center space-y-2 relative z-10 my-auto">
          <div className="text-5xl md:text-6xl drop-shadow-lg transform transition-transform hover:scale-125 duration-300 animate-bounce" style={{ animationDuration: '3s' }}>
            {emoji}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-slate-705 bg-white/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 shadow-sm">
            {catName}
          </span>
        </div>

        {/* Brand footer watermark */}
        <div className="w-full flex items-end justify-between border-t border-gray-900/5 pt-2 relative z-10 text-[8px] font-mono font-bold text-gray-400">
          <span>샥 VERIFIED COLLECTIBLE</span>
          <span className="font-sans font-black opacity-60">샥 옥션</span>
        </div>
      </div>
    );
  }

  // Fallback to absolute standard img tag with error handler
  return (
    <img 
      src={resolvedSrc} 
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setImgError(true)}
    />
  );
}

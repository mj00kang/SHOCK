import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../data/mockData';
import { isAuctionActive } from '../utils/auctionUtils';
import ProductImage from './ProductImage';

interface ProductCardProps {
  key?: string;
  product: Product;
  onBidClick: (product: Product) => void;
  onBuyNowClick: (product: Product) => void;
  onToggleLike: (productId: string) => void;
  isLiked: boolean;
  onInstantBadgeClick?: () => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onBidClick,
  onBuyNowClick,
  onToggleLike,
  isLiked,
  onInstantBadgeClick,
  onProductClick
}: ProductCardProps) {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const active = isAuctionActive(product);
  const currentPrice = product.currentPrice;

  const getRemainingTimeStr = () => {
    const end = new Date(product.endAt).getTime();
    const remainingMs = end - Date.now();

    if (remainingMs <= 0 || product.status === 'sold' || product.status === 'ended') {
      return '경매마감';
    }

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  const remainingStr = getRemainingTimeStr();

  let statusBadgeStr = '상향식';
  let statusBadgeBg = 'bg-[#111827]'; // Black
  if (!active) {
    statusBadgeStr = product.status === 'sold' ? '판매완료' : '경매종료';
    statusBadgeBg = 'bg-[#4B5563]'; // Gray-600
  } else {
    const end = new Date(product.endAt).getTime();
    const remainingMs = end - Date.now();
    
    if (remainingMs > 0 && remainingMs < 1000 * 60 * 60) {
      statusBadgeStr = '마감임박';
      statusBadgeBg = 'bg-[#DC2626]'; // Solid red
    } else if (product.hasBuyNow === true && Number(product.buyNowPrice) > 0) {
      statusBadgeStr = '즉시낙찰 가';
      statusBadgeBg = 'bg-[#4B5563]';
    }
  }

  const shortDescription = product.tags && product.tags.length > 0
    ? product.tags.map(t => `#${t}`).join(' ')
    : product.categoryName;

  const conditionStr = product.condition ? product.condition : '상태우수';

  return (
    <div 
      onClick={() => onProductClick?.(product)}
      className="relative cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 select-none flex flex-col justify-between"
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(product.id);
        }}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md border border-neutral-100 text-neutral-400 hover:text-red-500 shadow-sm transition-all"
        title="관심 등록"
      >
        <Heart 
          size={15} 
          className={isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-[#c0c0c0]'} 
        />
      </button>

      {/* Image container styled pale grey with rounded Corners */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#f4f4f4] rounded-2xl mb-3 border border-gray-200">
        <ProductImage 
          src={product.image} 
          alt={product.title}
          categoryGroup={product.categoryGroup}
          categoryName={product.categoryName}
          className="w-full h-full object-cover transition-transform duration-[600ms] hover:scale-105"
        />

        <div className="absolute bottom-3 right-3 bg-black/75 text-white rounded-md px-2 py-1 text-[12px] font-medium shadow-sm z-10 backdrop-blur-sm" style={{ fontFamily: 'Pretendard, sans-serif' }}>
          {remainingStr}
        </div>

        {!active && (
          <div className="absolute inset-0 bg-neutral-900/35 z-10 flex items-center justify-center backdrop-blur-[1px]" />
        )}
      </div>

      {/* Product Information block */}
      <div className="flex flex-col flex-1 text-left px-1" style={{ fontFamily: 'Pretendard, sans-serif' }}>
        <p className="text-[11px] font-extrabold text-[#111827] uppercase tracking-wider mb-1 line-clamp-1">
          {product.categoryGroup}
        </p>
        
        <h3 className="text-[14px] font-medium text-neutral-800 leading-[1.3] mb-0.5 line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-[12px] text-neutral-400 leading-[1.2] mb-3 line-clamp-1">
          {shortDescription}
        </p>
        
        <div className="mt-auto border-t border-neutral-50 pt-2.5 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-neutral-400 font-medium mb-0.5">
              {active ? '현재 입찰가' : '최종 낙찰가'}
            </span>
            <span className="text-[20px] font-extrabold tracking-tight text-neutral-900 leading-none">
              {currentPrice.toLocaleString()}
              <span className="text-[12px] ml-0.5 font-normal text-neutral-600">원</span>
            </span>
          </div>

          <span className="bg-neutral-100 text-neutral-600 rounded-md px-[13px] py-[7px] text-[11px] font-semibold tracking-wider leading-none select-none">
            {conditionStr}
          </span>
        </div>
      </div>
    </div>
  );
}

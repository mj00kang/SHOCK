import React from 'react';
import { Product } from '../data/mockData';
import ProductCard from './ProductCard';

interface DeadlineAuctionProps {
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onBidClick: (product: Product) => void;
  onBuyNowClick: (product: Product) => void;
  onViewMore: (tab?: 'all' | 'live' | 'buyNow') => void;
  onProductClick?: (product: Product) => void;
}

export default function DeadlineAuction({
  products,
  likedProductIds,
  onToggleLike,
  onBidClick,
  onBuyNowClick,
  onViewMore,
  onProductClick
}: DeadlineAuctionProps) {

  // Select up to 8 representative live products based on recommendation/popularity/ending-soonest
  const curatedProducts = (products || [])
    .filter(product => {
      if (!product) return false;
      const status = String(product.status || '').toLowerCase();
      const endTime = product.endAt ? new Date(product.endAt).getTime() : 0;
      return (
        ['live', 'active', 'selling', '경매 진행 중', '진행중'].includes(status) &&
        endTime > Date.now() &&
        !product.orderId &&
        !product.soldAt
      );
    })
    .sort((a, b) => {
      const aTimeLeft = new Date(a.endAt || 0).getTime() - Date.now();
      const bTimeLeft = new Date(b.endAt || 0).getTime() - Date.now();
      
      // Items closing within 1 hour have absolute scarcity first
      const aIsUrgent = aTimeLeft > 0 && aTimeLeft < 3600000;
      const bIsUrgent = bTimeLeft > 0 && bTimeLeft < 3600000;
      
      if (aIsUrgent && !bIsUrgent) return -1;
      if (!aIsUrgent && bIsUrgent) return 1;

      // Otherwise, sort by combined popularity metrics (likes & bids) first
      const scoreA = Number(a.likeCount || 0) + Number(a.bidCount || 0) * 1.8;
      const scoreB = Number(b.likeCount || 0) + Number(b.bidCount || 0) * 1.8;
      return scoreB - scoreA;
    })
    .slice(0, 8);

  return (
    <section id="deadline-section" className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Module Header */}
        <div className="relative text-center mb-10">
          <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-mono border border-gray-200 px-3 py-1 bg-white rounded-full mb-3">
            MOST POPULAR
          </span>
          <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight mt-4">
            실시간 인기 경매 상품
          </h2>
          <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto">
            마감이 얼마 남지 않은 핫한 인기 경매 아이템들입니다.
          </p>

          <button 
            onClick={() => onViewMore('all')}
            className="md:absolute md:bottom-1 md:right-0 mt-6 md:mt-0 mx-auto cursor-pointer text-neutral-400 hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-1 select-none"
            title="전체 경매 목록 리스트로 이동"
          >
            <span>더보기</span>
            <span className="text-[10px] font-mono">→</span>
          </button>
        </div>

        {/* 6 columns responsive grid for 6x10 layout */}
        {curatedProducts.length > 0 ? (
          <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {curatedProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onBidClick={onBidClick}
                onBuyNowClick={onBuyNowClick}
                onToggleLike={onToggleLike}
                isLiked={likedProductIds.includes(prod.id)}
                onInstantBadgeClick={() => onViewMore('buyNow')}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-[20px]">
            <span className="block text-4xl mb-3 select-none">📷</span>
            <h3 className="font-display font-bold text-gray-900 mb-1">현재 진행 중인 실시간 경매가 없습니다</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              수집가들의 모든 상향 경매품 마감이 성사되었습니다. 새로운 소장품이 준비되는 동안 잠시만 기다려 주세요!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

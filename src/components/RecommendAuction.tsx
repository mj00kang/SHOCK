import React from 'react';
import { Product } from '../data/mockData';
import ProductCard from './ProductCard';

interface RecommendAuctionProps {
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onBidClick: (product: Product) => void;
  onBuyNowClick: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export default function RecommendAuction({
  products,
  likedProductIds,
  onToggleLike,
  onBidClick,
  onBuyNowClick,
  onProductClick
}: RecommendAuctionProps) {
  // Extract top 3 or 4 most active auctions based on traffic index (likes + bids)
  const recommendedItems = [...products]
    .filter(p => p.status === 'live')
    .sort((a, b) => (b.bidCount + b.likeCount) - (a.bidCount + a.likeCount))
    .slice(8, 12);

  if (recommendedItems.length === 0) return null;

  return (
    <section id="recommendation-bento" className="w-full py-16 px-4 md:px-8 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Module Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-mono border border-gray-200 px-3 py-1 bg-white rounded-full mb-3">
            REAL-TIME TRENDING PICK
          </span>
          <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight mt-4">
            실시간 소장가들의 핫 추천 경매
          </h2>
          <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto">
            현재 샥 입찰 경쟁이 가장 치열하고 조회수가 급증하고 있는 실시간 테마 추천 아이템들입니다.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(() => {
            let items = [...recommendedItems];
            return items.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onBidClick={onBidClick}
                onBuyNowClick={onBuyNowClick}
                onToggleLike={onToggleLike}
                isLiked={likedProductIds.includes(prod.id)}
                onProductClick={onProductClick}
              />
            ));
          })()}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/mockData';
import ProductImage from '../components/ProductImage';

interface RankingPageProps {
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onProductClick: (product: Product) => void;
  onBackToMain: () => void;
}

const RANKING_MODE_CARDS = [
  {
    id: 'popular',
    icon: '🏆',
    title: '인기 애장품',
    desc: '많이 찾는 상품'
  },
  {
    id: 'liveBid',
    icon: '🟢',
    title: '실시간 입찰',
    desc: '입찰 진행 중'
  },
  {
    id: 'endingSoon',
    icon: '⏰',
    title: '마감임박',
    desc: '곧 종료되는 경매'
  },
  {
    id: 'trending',
    icon: '🔥',
    title: '관심 급상승',
    desc: '찜·조회 증가'
  }
];

const RANKING_CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'vintage-toy', name: '빈티지토이' },
  { id: 'figure', name: '피규어' },
  { id: 'trading-card', name: '트레이딩카드' },
  { id: 'idol-photocard', name: '아이돌 포카' },
  { id: 'goods', name: '굿즈' },
  { id: 'sports-card', name: '스포츠카드' },
  { id: 'uniform-clothing', name: '유니폼/의류 굿즈' },
  { id: 'sneakers', name: '운동화' },
  { id: 'signed-ball', name: '사인볼/공' },
  { id: 'sports-goods', name: '스포츠 굿즈' },
  { id: 'rare-lp', name: '희귀 LP/음반' },
  { id: 'vintage-camera', name: '빈티지 카메라' },
  { id: 'currency', name: '화폐' },
  { id: 'stamp', name: '우표' },
  { id: 'lost-media', name: '로스트미디어' },
  { id: 'retro', name: '레트로' }
];

export default function RankingPage({
  products,
  likedProductIds,
  onToggleLike,
  onProductClick,
  onBackToMain
}: RankingPageProps) {
  const [rankingType, setRankingType] = useState<'popular' | 'liveBid' | 'endingSoon' | 'trending'>('popular');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [brandOnly, setBrandOnly] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<'rapid' | 'weekly' | 'monthly'>('rapid');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle local scroll bar scrolling
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  // Match ranking categories to our local products list
  const getFilteredProducts = () => {
    // 공통 데이터: 기존 상품 데이터
    const sourceProducts = products || [];

    // 삭제된 상품은 제외
    const validProducts = sourceProducts.filter(product =>
      !["deleted", "removed"].includes(String(product.status || "").toLowerCase())
    );

    // 경매 진행 상품 우선
    const liveProducts = validProducts.filter(product => {
      const status = String(product.status || '').toLowerCase();
      const endTime = product.endAt ? new Date(product.endAt).getTime() : 0;
      return (
        ['live', 'active', 'selling', '경매 진행 중', '진행중'].includes(status) &&
        endTime > Date.now() &&
        !product.orderId &&
        !product.soldAt
      );
    });

    // 4. 인기 애장품 기준
    const popularItems = [...validProducts].sort((a, b) => {
      const scoreA =
        Number(a.likeCount || 0) * 3 +
        Number((a as any).viewCount || 0) +
        Number(a.bidCount || (a as any).bids?.length || 0) * 5;

      const scoreB =
        Number(b.likeCount || 0) * 3 +
        Number((b as any).viewCount || 0) +
        Number(b.bidCount || (b as any).bids?.length || 0) * 5;

      return scoreB - scoreA;
    });

    // 5. 실시간 입찰 기준
    const liveBidItems = [...liveProducts].sort((a, b) => {
      const bidA = Number(a.bidCount || (a as any).bids?.length || 0);
      const bidB = Number(b.bidCount || (b as any).bids?.length || 0);

      if (bidB !== bidA) return bidB - bidA;

      const timeA = new Date((a as any).latestBidAt || (a as any).updatedAt || (a as any).createdAt || 0).getTime();
      const timeB = new Date((b as any).latestBidAt || (b as any).updatedAt || (b as any).createdAt || 0).getTime();

      return timeB - timeA;
    });

    // 6. 마감임박 기준
    const now = Date.now();
    const endingSoonItems = [...liveProducts]
      .filter(product => product.endAt && new Date(product.endAt).getTime() > now)
      .sort((a, b) => {
        return new Date(a.endAt!).getTime() - new Date(b.endAt!).getTime();
      });

    // 7. 관심 급상승 기준
    const trendingItems = [...validProducts].sort((a, b) => {
      const scoreA =
        Number((a as any).trendScore || 0) +
        Number((a as any).recentLikeIncrease || 0) * 5 +
        Number((a as any).recentViewIncrease || 0) * 2 +
        Number((a as any).recentBidIncrease || 0) * 8 +
        Number(a.likeCount || 0) * 2 +
        Number(a.bidCount || (a as any).bids?.length || 0) * 4;

      const scoreB =
        Number((b as any).trendScore || 0) +
        Number((b as any).recentLikeIncrease || 0) * 5 +
        Number((b as any).recentViewIncrease || 0) * 2 +
        Number((b as any).recentBidIncrease || 0) * 8 +
        Number(b.likeCount || 0) * 2 +
        Number(b.bidCount || (b as any).bids?.length || 0) * 4;

      return scoreB - scoreA;
    });

    // 8. 최종 표시 상품 분기
    const rankingProductsByType = {
      popular: popularItems,
      liveBid: liveBidItems,
      endingSoon: endingSoonItems,
      trending: trendingItems
    };

    const filteredRankingProducts = rankingProductsByType[rankingType] || popularItems;

    // 9. 소분류 필터와 함께 작동
    let finalRankingProducts = [...filteredRankingProducts];
    if (activeCategory !== 'all') {
      const targetCategoryName = RANKING_CATEGORIES.find(c => c.id === activeCategory)?.name || '';
      finalRankingProducts = finalRankingProducts.filter(p => {
        const catName = (p as any).subCategory || p.categoryName || '';
        return catName === targetCategoryName;
      });
    }

    return finalRankingProducts;
  };

  const filteredRankingProducts = getFilteredProducts();

  // Helper mock rank progress indicator
  const getRankIndicator = (idx: number, id: string) => {
    // Generate a beautiful indicator delta base on index + id string
    const code = id.charCodeAt(id.length - 1) || 0;
    const type = (idx + code) % 4;

    if (type === 0 || idx < 3) {
      // Stable or no change helper
      return { text: '-', colorClass: 'text-neutral-400' };
    } else if (type === 1) {
      const delta = (code % 3) + 1;
      return { text: `▲${delta}`, colorClass: 'text-[#ff4d4f] font-bold' };
    } else if (type === 2) {
      const delta = (code % 2) + 1;
      return { text: `▼${delta}`, colorClass: 'text-[#00c853] font-bold' };
    } else {
      return { text: '-', colorClass: 'text-neutral-400' };
    }
  };

  // Helper simulated high transaction counts shown at top right of original card image
  const getSimulatedTransactions = (prod: Product, idx: number) => {
    const code = prod.id.charCodeAt(prod.id.length - 1) + idx;
    const scale = (code % 5) + 1;
    if (scale === 1) {
      const count = Math.floor((prod.bidCount * 148) + 1050);
      return `입찰 ${count.toLocaleString()}`;
    } else if (scale === 2) {
      const count = ((prod.bidCount * 8.5) + 1.2).toFixed(1);
      return `입찰 ${count}만`;
    } else {
      const count = Math.floor((prod.bidCount * 225) + 3014);
      return `입찰 ${count.toLocaleString()}`;
    }
  };

  // Helper discount rates
  const getSimulatedPromo = (prod: Product, idx: number) => {
    const code = prod.id.charCodeAt(0) + idx;
    if (code % 3 === 0) {
      const pct = (code % 4) * 10 + 15;
      return pct;
    }
    return 0;
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        
        {/* Navigation Breadcrumb / Indicator */}
        <div className="flex items-center gap-1 text-xs text-neutral-400 mb-6 font-medium">
          <span className="cursor-pointer hover:text-neutral-800" onClick={onBackToMain}>홈</span>
          <span>&gt;</span>
          <span className="text-neutral-800 font-bold">인기 랭킹</span>
        </div>

        {/* 1. Ranking Mode Cards (Stable for Production) */}
        <div className="ranking-mode-cards">
          {RANKING_MODE_CARDS.map((tab) => {
            const isSelected = rankingType === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setRankingType(tab.id as any);
                  setActiveCategory('all');
                }}
                className={`ranking-mode-card ${isSelected ? 'active' : ''}`}
              >
                <div className="ranking-mode-icon">{tab.icon}</div>
                <div className="flex flex-col text-left">
                  <div className="ranking-mode-title">{tab.title}</div>
                  <div className="ranking-mode-desc">{tab.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Category Pill tags with nice scroll right button */}
        <div className="relative w-full border-b border-gray-100 pb-3 flex items-center">
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-[8px] overflow-x-auto select-none no-scrollbar py-2 scroll-smooth pr-14 w-full"
          >
            {RANKING_CATEGORIES.map((cat) => {
              const matchesSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-[14px] h-[36px] md:h-[40px] rounded-full text-[13px] md:text-[14px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
                    matchesSelected
                      ? 'bg-[#111827] text-white'
                      : 'bg-[#F3F4F6] hover:bg-gray-200 text-[#374151]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
          
          {/* Subtle fade overlay & scroll right trigger */}
          <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pointer-events-none">
            <button
              onClick={scrollRight}
              className="pointer-events-auto w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors focus:outline-none"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 3. Filtering Section */}
        <div className="flex items-center justify-end mt-6 mb-8 select-none">
          
          {/* Time filters right aligned */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
            <button
              onClick={() => setTimeFilter('rapid')}
              className={`hover:text-black transition-colors ${timeFilter === 'rapid' ? 'text-black font-extrabold' : ''}`}
            >
              급상승
            </button>
            <span className="text-neutral-200 text-[10px] select-none">|</span>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`hover:text-black transition-colors ${timeFilter === 'weekly' ? 'text-black font-extrabold' : ''}`}
            >
              주간
            </button>
            <span className="text-neutral-200 text-[10px] select-none">|</span>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`hover:text-black transition-colors ${timeFilter === 'monthly' ? 'text-black font-extrabold' : ''}`}
            >
              월간
            </button>
          </div>
        </div>

        {/* Empty list fallbacks */}
        {filteredRankingProducts.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-base font-bold text-neutral-800">
              {rankingType === 'popular' && '인기 애장품 데이터를 집계 중입니다.'}
              {rankingType === 'liveBid' && '현재 실시간 입찰 중인 상품이 없습니다.'}
              {rankingType === 'endingSoon' && '마감임박 상품이 없습니다.'}
              {rankingType === 'trending' && '관심 급상승 데이터를 집계 중입니다.'}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm">
              인기 수집가들이 새로운 입찰을 진행 중입니다! 전체 보기나 다른 옵션 카테고리를 선택해 랭킹을 확인해 보세요.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setBrandOnly(false);
              }}
              className="mt-6 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              전체 랭킹으로 돌아가기
            </button>
          </div>
        ) : (
          /* 4. Products grid with rank overlays */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            <AnimatePresence mode="popLayout">
              {filteredRankingProducts.map((prod, index) => {
                const rankNum = index + 1;
                const ind = getRankIndicator(index, prod.id);
                const transactions = getSimulatedTransactions(prod, index);
                const isLiked = likedProductIds.includes(prod.id);
                const discount = getSimulatedPromo(prod, index);

                return (
                  <motion.div
                    key={prod.id}
                    layoutId={`rank-card-${prod.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={() => onProductClick(prod)}
                    className="group cursor-pointer flex flex-col relative select-none"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f4f4] mb-3 border border-gray-200">
                      <ProductImage
                        src={prod.image}
                        alt={prod.title}
                        categoryGroup={prod.categoryGroup}
                        categoryName={prod.categoryName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Transaction Count overlays on top-right */}
                      <span className="absolute top-3 right-3 bg-white/70 backdrop-blur-xs text-[10px] font-bold text-neutral-600 px-1.5 py-0.5 rounded-md">
                        {transactions}
                      </span>

                      {/* Hover effect overlays */}
                      <div className="absolute inset-0 bg-black/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Meta Section */}
                    <div className="flex flex-col text-left font-sans">
                      
                      {/* Ranking Line (e.g. 1 - or 7 ▲3) */}
                      <div className="flex items-center gap-1.5 mb-1 select-none">
                        <span className="text-base font-black text-black leading-none shrink-0">
                          {rankNum}
                        </span>
                        <span className={`text-[11px] leading-none shrink-0 ${ind.colorClass}`}>
                          {ind.text}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 className="text-xs font-semibold text-neutral-800 leading-[1.3] mb-1 line-clamp-2 h-8 group-hover:text-black">
                        {prod.title}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-center gap-1 text-[13px] tracking-tight font-extrabold text-neutral-900 mt-1">
                        {discount > 0 && (
                          <span className="text-[#ff4d4f] font-mono shrink-0 font-black">
                            {discount}%
                          </span>
                        )}
                        <span>{prod.currentPrice.toLocaleString()}원</span>
                      </div>

                    </div>

                    {/* Bookmark Heart outline absolute overlay on top of standard image left-bottom */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(prod.id);
                      }}
                      className="absolute bottom-16 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md border border-neutral-100 text-neutral-400 hover:text-red-500 shadow-xs transition-all pointer-events-auto"
                      title="관심 등록"
                    >
                      <Heart
                        size={13}
                        className={isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-[#c0c0c0]'}
                      />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}

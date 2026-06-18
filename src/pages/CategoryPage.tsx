import React, { useState, useEffect } from 'react';
import { ArrowLeft, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Product, INITIAL_CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';

interface CategoryPageProps {
  group: 'POP' | 'SPORTS' | 'ANALOG';
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onBidClick: (product: Product) => void;
  onBuyNowClick: (product: Product) => void;
  onBackToMain: () => void;
  initialSub?: string;
  onProductClick?: (product: Product) => void;
}

export default function CategoryPage({
  group,
  products,
  likedProductIds,
  onToggleLike,
  onBidClick,
  onBuyNowClick,
  onBackToMain,
  initialSub = 'all',
  onProductClick
}: CategoryPageProps) {
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [sortBy, setSortBy] = useState<string>('endingSoon');

  useEffect(() => {
    setSelectedSub(initialSub);
  }, [initialSub]);

  const groupInfo = {
    POP: {
      title: 'POP Culture / 대중문화',
      description: '빈티지토이, 피규어, 트레이딩카드, 아이돌 포카, 굿즈 등 대중문화 소장품 경매',
      bgColor: 'from-red-500/10 via-white to-gray-800/5',
      primaryColor: 'text-rose-600',
      borderColor: 'border-rose-100',
      activeTabClass: 'bg-red-500 text-white'
    },
    SPORTS: {
      title: 'SPORTS / 스포츠',
      description: '스포츠카드, 유니폼, 운동화, 사인볼 등 스포츠 소장품 경매',
      bgColor: 'from-gray-800/10 via-white to-gray-500/5',
      primaryColor: 'text-gray-900',
      borderColor: 'border-gray-200',
      activeTabClass: 'bg-gray-900 text-white'
    },
    ANALOG: {
      title: 'ANALOG / 아날로그',
      description: '희귀 LP, 빈티지 카메라, 화폐, 우표, 로스트미디어, 레트로 소장품 경매',
      bgColor: 'from-yellow-500/10 via-white to-gray-500/5',
      primaryColor: 'text-yellow-600',
      borderColor: 'border-yellow-100',
      activeTabClass: 'bg-yellow-500 text-white'
    }
  }[group];

  // Get the subcategories for this group
  const subCategories = INITIAL_CATEGORIES.filter(c => c.group === group);

  // Filter the products
  const categoryProducts = products
    .filter(p => {
      if (p.status === 'cancelled') return false;
      // Must match active major category
      if (p.categoryGroup !== group) return false;
      // Must match selected subcategory if not 'all'
      if (selectedSub !== 'all' && p.categoryName !== selectedSub) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'endingSoon') {
        const aActive = new Date(a.endAt).getTime() > Date.now() && a.status === 'live';
        const bActive = new Date(b.endAt).getTime() > Date.now() && b.status === 'live';
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return new Date(a.endAt).getTime() - new Date(b.endAt).getTime();
      }
      if (sortBy === 'popular') {
        return (b.bidCount + b.likeCount) - (a.bidCount + a.likeCount);
      }
      if (sortBy === 'lowestPrice') {
        return a.currentPrice - b.currentPrice;
      }
      if (sortBy === 'highestPrice') {
        return b.currentPrice - a.currentPrice;
      }
      if (sortBy === 'newest') {
        return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      }
      return 0;
    });

  return (
    <main className={`w-full min-h-screen  ${groupInfo.bgColor} py-8 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link Button */}
        <div className="flex items-center">
          <button
            onClick={onBackToMain}
            className="page-back-link group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>

        {/* Detailed Category Page Banner Header */}
        <div className={`p-6 md:p-8 rounded-2xl bg-white border ${groupInfo.borderColor} shadow-sm text-left relative overflow-hidden`}>
          <div className="relative z-10 space-y-2">
            <span className={`text-[10px] uppercase font-mono font-black tracking-widest ${groupInfo.primaryColor}`}>
              샥 CATEGORY HUB
            </span>
            <h1 className="font-display font-black text-2xl md:text-3xl text-slate-950 tracking-tight">
              {groupInfo.title}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-2xl font-sans">
              {groupInfo.description}
            </p>
          </div>
          {/* Subtle decorative background gradient circles */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none" />
        </div>

        {/* Categories Tabs Selector & Sorting Option */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Horizontal Subcategory Pill Filter */}
            <div className="flex flex-wrap items-center gap-2 text-left">
              <span className="text-xs font-black text-gray-400 mr-2 uppercase font-mono">Filter: </span>
              
              <button
                onClick={() => setSelectedSub('all')}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedSub === 'all'
                    ? groupInfo.activeTabClass + ' border-transparent'
                    : 'bg-gray-50 border-gray-100 text-slate-650 hover:bg-gray-100'
                }`}
              >
                전체보기 (필터 초기화)
              </button>

              {subCategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub.name)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    selectedSub === sub.name
                      ? groupInfo.activeTabClass + ' border-transparent'
                      : 'bg-gray-50 border-gray-100 text-slate-650 hover:bg-gray-100'
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Criteria Selection */}
            <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-xs text-gray-600 self-start md:self-auto">
              <SlidersHorizontal size={12} className="text-gray-800" />
              <span className="font-bold">정렬 기준:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer border-none pl-1"
              >
                <option value="endingSoon">⏰ 마감 시각 임박 순</option>
                <option value="popular">🔥 인기 최고 뜨거운 순</option>
                <option value="lowestPrice">🪙 낮은 최고 입찰가 순</option>
                <option value="highestPrice">📈 높은 최고 입찰가 순</option>
                <option value="newest">✨ 최근 신규 등록 순</option>
              </select>
            </div>

          </div>

          {/* Active Filtering Information Bar */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-gray-400">선택한 카테고리:</span>
              <span className={`px-2.5 py-1 rounded-md border text-xs font-extrabold ${groupInfo.primaryColor} bg-gray-50 ${groupInfo.borderColor}`}>
                {selectedSub === 'all' ? `${group} 전체` : `현재 카테고리: ${selectedSub}`}
              </span>
            </div>

            <div className="text-gray-400 font-mono">
              총 <strong className="text-gray-900 font-bold">{categoryProducts.length}</strong>개의 경매 진행 중
            </div>
          </div>
        </div>

        {/* Grid List of Cards */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onBidClick={onBidClick}
                onBuyNowClick={onBuyNowClick}
                onToggleLike={onToggleLike}
                isLiked={likedProductIds.includes(prod.id)}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-dashed border-gray-200 rounded-2xl shadow-sm">
            <span className="block text-4xl mb-3 select-none">📦</span>
            <h3 className="font-display font-black text-gray-900 text-base md:text-lg">해당 조건에 만족하는 소장품이 없습니다</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-2">
              현재 필터링 및 소 분류군 카테고리에 참여 승인된 실시간 옥션 매물이 빈 상태입니다. "전체보기 (필터 초기화)" 버튼을 눌러보세요.
            </p>
            <button
              onClick={() => setSelectedSub('all')}
              className="mt-6 cursor-pointer bg-gray-900 hover:bg-gray-900 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all"
            >
              전체 목록 보기 복귀
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

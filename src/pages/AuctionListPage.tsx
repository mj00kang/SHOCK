import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowLeft, Search, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../data/mockData';
import ProductCard from '../components/ProductCard';

interface AuctionListPageProps {
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onBidClick: (product: Product) => void;
  onBuyNowClick: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onBackToMain: () => void;
  initialTab?: 'all' | 'live' | 'buyNow';
  onProductClick?: (product: Product) => void;
}

export default function AuctionListPage({
  products,
  likedProductIds,
  onToggleLike,
  onBidClick,
  onBuyNowClick,
  searchQuery,
  setSearchQuery,
  onBackToMain,
  initialTab = 'all',
  onProductClick
}: AuctionListPageProps) {
  // Page Tab state: 'all' (전체 소장품), 'live' (실시간 호가 경매), 'buyNow' (즉시낙찰 가능)
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'buyNow'>(initialTab);
  
  // Category filter state: 'all', 'POP', 'SPORTS', 'ANALOG'
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'POP' | 'SPORTS' | 'ANALOG'>('all');
  
  // Sorting options
  const [sortBy, setSortBy] = useState<string>('endingSoon');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page to 1 on tab or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, sortBy, searchQuery]);

  // Synchronize initialTab if it changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle filtering
  const filteredProducts = products.filter(p => {
    // 1. Status Filter: Hide cancelled
    if (p.status === 'cancelled') return false;

    // 2. Tab filtering:
    // - 'all': Show all products
    // - 'live': Real-time upward bidding (p.status === 'live' and auctionType === 'ascending')
    // - 'buyNow': Instant deal (p.buyNowPrice or isInstantDealAvailable is present)
    if (activeTab === 'live') {
      const isEnded = new Date(p.endAt).getTime() <= Date.now() || p.status !== 'live';
      if (isEnded) return false;
    }
    if (activeTab === 'buyNow') {
      const isInstant = (p.hasBuyNow || p.buyNowPrice) && p.buyNowPrice && p.status === 'live';
      if (!isInstant) return false;
    }

    // 3. Category Filter
    if (selectedCategory !== 'all') {
      if (p.categoryGroup !== selectedCategory) return false;
    }

    // 4. Search Query Match
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(query);
      const catMatch = p.categoryName.toLowerCase().includes(query);
      const sellerMatch = p.sellerNickname.toLowerCase().includes(query);
      const tagsMatch = p.tags.some(t => t.toLowerCase().includes(query));
      if (!titleMatch && !catMatch && !sellerMatch && !tagsMatch) return false;
    }

    return true;
  });

  // Handle Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aActive = new Date(a.endAt).getTime() > Date.now() && a.status === 'live';
    const bActive = new Date(b.endAt).getTime() > Date.now() && b.status === 'live';

    if (sortBy === 'endingSoon') {
      // Live items come first
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

  // Pagination calculation
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="w-full min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb back button */}
        <div className="mb-6">
          <button
            onClick={onBackToMain}
            className="page-back-link group !mb-0"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>

        {/* Hero title banner */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono tracking-wider">
              <Sparkles size={11} className="animate-spin" />
              <span>샥 GLOBAL AUCTION</span>
            </div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight">
              전체 소장품 경매
            </h1>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl leading-relaxed">
              샥에 올라온 모든 애장품 경매를 한눈에 확인해보세요. 수많은 진귀한 수집가의 무대 속에서 당신의 영혼을 흔들 단 하나의 보물을 낙찰 및 타결하세요.
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full md:w-80 select-none">
            <input
              type="text"
              placeholder="무엇이든 검색해 보세요 (예: 리자몽, LP)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-2xl py-3 pl-10 pr-4 outline-none transition-all font-sans"
            />
            <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-600 px-1.5 py-0.5 rounded font-black cursor-pointer transition-colors"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* Three navigation tabs */}
        <div className="flex border-b border-gray-200 gap-1.5 mb-6 overflow-x-auto scroller-hidden">
          {[
            { id: 'all', label: '전체 소장품', desc: '모든 출품 경매' },
            { id: 'live', label: '실시간 호가 경매', desc: '현재 진행 입찰작' },
            { id: 'buyNow', label: '즉시낙찰 가능', desc: '⚡ 즉시낙찰 보물' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
              }}
              className={`cursor-pointer px-6 py-4 border-b-2 font-sans font-bold text-center flex flex-col items-center gap-0.5 transition-all outline-none whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-gray-800 text-gray-900 font-extrabold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-sm md:text-base">{tab.label}</span>
              <span className="text-[10px] font-medium opacity-80">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Filters and sorting Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-gray-200 p-4 rounded-2xl shadow-sm mb-8">
          
          {/* Subcategory selectors */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '전체 카테고리' },
              { id: 'POP', label: '🧸 POP Culture' },
              { id: 'SPORTS', label: '🏀 SPORTS' },
              { id: 'ANALOG', label: '📻 ANALOG' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`cursor-pointer px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort controls dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600">
              <SlidersHorizontal size={12} className="text-gray-800" />
              <span className="font-bold">정렬 기준:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer border-none pl-1"
              >
                <option value="endingSoon">⏰ 마감 시각 임박 순</option>
                <option value="popular">🔥 관심 & 입찰 열기 순</option>
                <option value="lowestPrice">🪙 낮은 최고가 입찰 순</option>
                <option value="highestPrice">💎 높은 최고가 입찰 순</option>
                <option value="newest">✨ 신규 등록 등록 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global searchQuery notice */}
        {searchQuery.trim() !== '' && (
          <div className="mb-6 flex items-center justify-between text-xs text-gray-900 bg-gray-100 border border-gray-200 p-4 rounded-2xl animate-fade-in text-left">
            <span>
              검색 키워드 <strong>"{searchQuery}"</strong>에 부합하는 소장품이 총 <strong>{totalItems}개</strong> 매치되었습니다.
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="underline hover:text-sky-900 cursor-pointer font-bold select-none"
            >
              검색 필터 해제
            </button>
          </div>
        )}

        {/* Total products count bar */}
        <div className="mb-6 text-left">
          <p className="text-xs text-gray-500">
            해당 조건의 활성화 소장품: <strong className="text-gray-900 font-black">{totalItems}개</strong>
          </p>
        </div>

        {/* Main interactive grid mapping */}
        {paginatedProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map(prod => (
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

            {/* Custom Pagination Numbers */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 pt-4 pb-2" id="auction-list-pagination">
                <button
                  disabled={activePage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-200 bg-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none select-none"
                >
                  이전
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum, idx, arr) => (
                    <React.Fragment key={pageNum}>
                      <button
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className={`cursor-pointer px-3 py-2 rounded-xl font-mono text-xs font-black transition-all ${
                          activePage === pageNum
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                      {idx < arr.length - 1 && (
                        <span className="text-gray-200 font-sans text-xs select-none">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  disabled={activePage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-200 bg-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none select-none"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-250 rounded-2xl shadow-sm my-4 p-8">
            <AlertCircle size={32} className="text-gray-400 mx-auto mb-3" />
            <h3 className="font-display font-black text-gray-900 text-base mb-1">검색 결과에 맞는 경매 소장품이 없습니다</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              선택하신 수집 카테고리 또는 대분류, 탭 필터에 해당하는 애장품이 존재하지 않습니다. 검색어를 초기화하거나 카테고리 설정을 변경해 보세요!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveTab('all');
              }}
              className="mt-6 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all"
            >
              모든 필터 초기화
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

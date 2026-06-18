import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, ArrowLeft, ArrowUpRight, Flame, Layers, Award, Sparkles, CircleHelp, Calendar, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { Product } from '../data/mockData';

interface MarketTrendPageProps {
  products: Product[];
  onBackToMain: () => void;
  onProductClick: (prod: Product) => void;
}

// 30-day interactive simulation data
const CHART_DATA = [
  { date: '05/15', price: 195000, volume: 180 },
  { date: '05/16', price: 215000, volume: 220 },
  { date: '05/17', price: 205000, volume: 140 },
  { date: '05/18', price: 190000, volume: 160 },
  { date: '05/19', price: 185000, volume: 200 },
  { date: '05/20', price: 220000, volume: 240 },
  { date: '05/21', price: 240000, volume: 260 },
  { date: '05/22', price: 235000, volume: 190 },
  { date: '05/23', price: 210000, volume: 150 },
  { date: '05/24', price: 225000, volume: 180 },
  { date: '05/25', price: 212000, volume: 220 },
  { date: '05/26', price: 180000, volume: 130 },
  { date: '05/27', price: 175050, volume: 110 },
  { date: '05/28', price: 210000, volume: 280 },
  { date: '05/29', price: 260000, volume: 320 },
  { date: '05/30', price: 280000, volume: 300 },
  { date: '05/31', price: 230000, volume: 210 },
  { date: '06/01', price: 205000, volume: 165 },
  { date: '06/02', price: 218000, volume: 190 },
  { date: '06/03', price: 228000, volume: 220 },
  { date: '06/04', price: 225500, volume: 205 },
  { date: '06/05', price: 270000, volume: 330 },
  { date: '06/06', price: 245000, volume: 180 },
  { date: '06/07', price: 201200, volume: 140 },
  { date: '06/08', price: 240000, volume: 260 },
  { date: '06/09', price: 260000, volume: 290 },
  { date: '06/10', price: 240000, volume: 230 },
  { date: '06/11', price: 295000, volume: 380 },
  { date: '06/12', price: 240000, volume: 150 },
  { date: '06/13', price: 210020, volume: 130 },
  { date: '06/14', price: 217898, volume: 210 },
];

export default function MarketTrendPage({ products, onBackToMain, onProductClick }: MarketTrendPageProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products && products.length > 0 ? products[0].id : ''
  );

  const [activeSubPage, setActiveSubPage] = useState<'main' | 'price-rising' | 'trend-turning-up' | 'undervalued-volume'>('main');

  // 1. 가격 상승 (price-rising) products calculations - High growth (> 10%)
  const priceRisingItems = React.useMemo(() => {
    return products.filter(product => {
      const basePrice = Number((product as any).previousPrice || product.startPrice || (product as any).initialPrice || 0);
      const currentPrice = Number(product.currentPrice || (product as any).finalPrice || (product as any).price || 0);
      if (!basePrice || !currentPrice) return false;
      const rate = (currentPrice - basePrice) / basePrice;
      return rate >= 0.10; // 10% or more increase
    });
  }, [products]);

  const priceRisingProductsList = React.useMemo(() => {
    return priceRisingItems.map(p => {
      const basePrice = Number((p as any).previousPrice || p.startPrice || (p as any).initialPrice || p.currentPrice || 10000);
      const currentPrice = Number(p.currentPrice || (p as any).finalPrice || (p as any).price || 10000);
      const changeRate = basePrice > 0 ? ((currentPrice - basePrice) / basePrice) * 100 : 0;
      
      return {
        product: p,
        changeRate: changeRate > 0 ? changeRate : 1.5,
        currentPrice,
        bidCount: p.bidCount,
        likeCount: p.likeCount
      };
    })
    .sort((a, b) => b.changeRate - a.changeRate || b.bidCount - a.bidCount || b.likeCount - a.likeCount);
  }, [priceRisingItems]);

  // 2. 상승 전환 (trend-turning-up) products calculations - Moderate growth but high bid momentum (1% to 10%)
  const trendTurningItems = React.useMemo(() => {
    return products.filter(product => {
      const basePrice = Number(product.startPrice || (product as any).initialPrice || 0);
      const currentPrice = Number(product.currentPrice || (product as any).finalPrice || (product as any).price || 0);
      const bidCount = Number(product.bidCount || (product as any).bids?.length || 0);
      if (!basePrice || !currentPrice) return false;
      const rate = (currentPrice - basePrice) / basePrice;
      return rate > 0.01 && rate < 0.10 && bidCount >= 1;
    });
  }, [products]);

  const trendTurningProductsList = React.useMemo(() => {
    return trendTurningItems.map(p => {
      const basePrice = Number(p.startPrice || 10000);
      const currentPrice = Number(p.currentPrice || 10000);
      const changeRate = basePrice > 0 ? ((currentPrice - basePrice) / basePrice) * 100 : 0;
      const turnRate = changeRate > 0 ? changeRate * 0.85 : (p.bidCount * 1.5 + 1.2);
      
      return {
        product: p,
        turnRate,
        isTurning: true,
        currentPrice,
        bidCount: p.bidCount,
        likeCount: p.likeCount
      };
    })
    .sort((a, b) => b.turnRate - a.turnRate || b.bidCount - a.bidCount);
  }, [trendTurningItems]);

  // 3. 거래량 대비 저렴 (undervalued-volume) products calculations - high bid momentum but low price < 150k
  const undervaluedItems = React.useMemo(() => {
    return products.filter(product => {
      const bidCount = Number(product.bidCount || (product as any).bids?.length || 0);
      const currentPrice = Number(product.currentPrice || (product as any).finalPrice || (product as any).price || 1);
      return bidCount >= 2 && currentPrice < 150000;
    });
  }, [products]);

  const undervaluedProductsList = React.useMemo(() => {
    return undervaluedItems.map(p => {
      const bidCount = Number(p.bidCount || (p as any).bids?.length || 0);
      const likeCount = Number(p.likeCount || (p as any).likes || 0);
      const viewCount = Number((p as any).viewCount || (p as any).views || 0);
      const currentPrice = Number(p.currentPrice || (p as any).finalPrice || (p as any).price || 1);
      const demandScore = bidCount * 3 + likeCount * 2 + viewCount;
      const valueScore = currentPrice > 0 ? (demandScore / currentPrice) * 10000 : 0;

      return {
        product: p as Product,
        valueScore: valueScore > 0 ? valueScore : 10.5,
        currentPrice,
        bidCount,
        likeCount,
        viewCount
      };
    })
    .sort((a, b) => b.valueScore - a.valueScore || b.bidCount - a.bidCount);
  }, [undervaluedItems]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync selection if prop list updates
  useEffect(() => {
    if (products && products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Search filter
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.categoryName || '').toLowerCase().includes(q)
    );
  });

  // Sync searchQuery when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setSearchQuery(selectedProduct.title);
    }
  }, [selectedProductId, selectedProduct]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateTrendDataLocal = (currentPrice: number) => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateStr = String(d.getDate()).padStart(2, '0');
      const dateFormatted = `${month}/${dateStr}`;
      
      let price: number;
      if (i === 0) {
        price = currentPrice;
      } else {
        const randRatio = -0.10 + Math.random() * 0.20;
        price = Math.round((currentPrice * (1 + randRatio)) / 100) * 100;
      }
      const volume = Math.floor(Math.random() * 150) + 10;
      data.push({ date: dateFormatted, price, volume });
    }
    return data;
  };

  const chartDataToUse = selectedProduct?.trendData && selectedProduct.trendData.length > 0
    ? selectedProduct.trendData
    : (selectedProduct ? generateTrendDataLocal(selectedProduct.currentPrice || 150000) : CHART_DATA);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number>(10000);
  const [displayVolume, setDisplayVolume] = useState<number>(0);
  const [displayDate, setDisplayDate] = useState<string>('');
  
  const showOnlyLine = true;
  const containerRef = useRef<HTMLDivElement>(null);

  // Update real-time display details when index or selected product changes
  useEffect(() => {
    if (hoverIndex !== null && chartDataToUse[hoverIndex]) {
      setDisplayPrice(chartDataToUse[hoverIndex].price);
      setDisplayVolume(chartDataToUse[hoverIndex].volume);
      setDisplayDate(chartDataToUse[hoverIndex].date);
    } else {
      const last = chartDataToUse[chartDataToUse.length - 1];
      if (last) {
        setDisplayPrice(last.price);
        setDisplayVolume(last.volume);
        setDisplayDate(last.date);
      }
    }
  }, [hoverIndex, selectedProductId, chartDataToUse]);

  // Handle Mouse interaction for smooth chart scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingX = 60;
    const chartWidth = rect.width - paddingX * 2;
    
    if (x >= paddingX && x <= rect.width - paddingX) {
      const ratio = (x - paddingX) / chartWidth;
      const exactIndex = Math.round(ratio * (chartDataToUse.length - 1));
      if (exactIndex >= 0 && exactIndex < chartDataToUse.length) {
        setHoverIndex(exactIndex);
      }
    } else if (x < paddingX) {
      setHoverIndex(0);
    } else if (x > rect.width - paddingX) {
      setHoverIndex(chartDataToUse.length - 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // SVG Chart rendering calculations
  const width = 850;
  const height = 300;
  const paddingX = 60;
  const paddingY = 40;

  const prices = chartDataToUse.map(d => d.price);
  const volumes = chartDataToUse.map(d => d.volume);

  const calculatedMinPrice = Math.min(...prices);
  const calculatedMaxPrice = Math.max(...prices);

  // Pad the bounds nicely so the curve fits and looks perfect
  const minPrice = Math.round((calculatedMinPrice * 0.95) / 100) * 100;
  const maxPrice = Math.round((calculatedMaxPrice * 1.05) / 100) * 100;
  const maxVolume = Math.max(...volumes, 50);

  const getX = (index: number) => {
    return paddingX + (index / (chartDataToUse.length - 1)) * (width - paddingX * 2);
  };

  const getYPrice = (price: number) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  const getYVolume = (volume: number) => {
    const ratio = volume / maxVolume;
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  // Generate SVG paths for price line and gradient area
  const points = chartDataToUse.map((d, i) => `${getX(i)},${getYPrice(d.price)}`).join(' ');
  const firstPointX = getX(0);
  const lastPointX = getX(chartDataToUse.length - 1);
  const baselineY = height - paddingY;
  const areaPoints = `${firstPointX},${baselineY} ${points} ${lastPointX},${baselineY}`;

  // Dynamic grid lines based on calculated min/max
  const priceRange = maxPrice - minPrice;
  const gridLevels = [
    maxPrice,
    minPrice + priceRange * 0.75,
    minPrice + priceRange * 0.50,
    minPrice + priceRange * 0.25,
    minPrice
  ];

  const formatPriceLabel = (p: number) => {
    if (p >= 10000) {
      const units = p / 10000;
      return units % 1 === 0 ? `${units}만` : `${units.toFixed(1)}만`;
    }
    return `${p.toLocaleString()}`;
  };

  const volumeLevels = [
    maxVolume,
    Math.round(maxVolume * 0.75),
    Math.round(maxVolume * 0.50),
    Math.round(maxVolume * 0.25),
    0
  ];

  const total30DayVolume = volumes.reduce((a, b) => a + b, 0);

  // Dynamically compute the Top 5 products based on the real products list from 샥 (SYAK)
  const getTop5Products = () => {
    if (!products || products.length === 0) return [];

    const computed = products.map(p => {
      // Find the basePrice of the item
      const basePrice = Number(p.startPrice || 10000);
      const current = Number(p.currentPrice || 10000);
      const changeRate = basePrice > 0 ? ((current - basePrice) / basePrice) * 100 : 0;
      
      const bidCount = p.bidCount || p.bidsCount || 0;
      const likeCount = p.likeCount || 0;
      const score = changeRate * 2.0 + bidCount * 5.0 + likeCount * 1.5;

      return {
        product: p,
        changeRate,
        current,
        bidCount,
        likeCount,
        score
      };
    });

    // Sort: changeRate descending, then score descending, then current price
    computed.sort((a, b) => {
      if (b.changeRate !== a.changeRate) {
        return b.changeRate - a.changeRate;
      }
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.current - a.current;
    });

    return computed.slice(0, 5).map((item) => {
      const up = item.changeRate >= 0;
      // Synthesize a nice clean sparkline list that goes up if there is a positive change rate
      const baseSpark = [15, 22, 18, 32, 28, 42, 48];
      const spark = up 
        ? baseSpark.map((v, i) => Math.min(50, Math.max(5, v + Math.sin(i) * 3 + (Math.random() - 0.5) * 4)))
        : baseSpark.map((v, i) => Math.min(50, Math.max(5, v - i * 1.8 + (Math.random() - 0.5) * 4)));

      return {
        id: item.product.id,
        title: item.product.title,
        price: item.current,
        change: `${item.changeRate >= 0 ? '+' : ''}${item.changeRate.toFixed(1)}%`,
        volume: item.bidCount,
        spark,
        image: item.product.images?.[0] || item.product.image
      };
    });
  };

  const dynamicTop5 = getTop5Products();

  if (activeSubPage !== 'main') {
    const subPageInfo = {
      'price-rising': {
        title: '가격 상승',
        desc: '전일 대비 입찰가 상승폭이 큰 애장품입니다.',
        emptyMessage: '가격 상승 데이터를 집계 중입니다.',
        items: priceRisingProductsList.map(item => ({
          ...item.product,
          badgeText: `+${item.changeRate.toFixed(1)}%`,
          badgeColor: 'bg-red-50 text-red-600 border-red-100 font-sans font-black'
        }))
      },
      'trend-turning-up': {
        title: '상승 전환',
        desc: '최근 입찰 흐름이 하락 또는 정체 상태에서 상승세로 바뀐 애장품입니다.',
        emptyMessage: '상승 전환 데이터를 집계 중입니다.',
        items: trendTurningProductsList.map(item => ({
          ...item.product,
          badgeText: `+${item.turnRate.toFixed(1)}% 전환`,
          badgeColor: 'bg-orange-50 text-orange-650 border-orange-100 font-sans font-bold'
        }))
      },
      'undervalued-volume': {
        title: '거래량 대비 저렴',
        desc: '입찰과 관심은 많지만 상대적으로 현재가가 낮은 애장품입니다.',
        emptyMessage: '거래량 대비 저렴한 상품을 집계 중입니다.',
        items: undervaluedProductsList.map(item => ({
          ...item.product,
          badgeText: `가치 점수: ${item.valueScore.toFixed(1)}`,
          badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100 font-sans font-bold'
        }))
      }
    }[activeSubPage];

    return (
      <div className="w-full bg-white min-h-screen py-8 md:py-12 px-4 md:px-8 font-sans transition-all animate-fade-in" ref={containerRef}>
        <div className="max-w-7xl mx-auto">
          {/* Header row with back button */}
          <div className="mb-6 text-left">
            <button 
              onClick={() => {
                setActiveSubPage('main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="page-back-link group"
            >
              <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>시세로 돌아가기</span>
            </button>
          </div>

          {/* Title block */}
          <div className="text-left mb-8">
            <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-sans border border-gray-200 px-3 py-1 bg-white rounded-full mb-3 shadow-xs">
              MARKET DETAIL
            </span>
            <div className="flex items-baseline gap-3">
              <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight font-sans">
                {subPageInfo?.title} 수집 목록
              </h1>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-lg">
                총 {subPageInfo?.items.length}개 상품
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {subPageInfo?.desc}
            </p>
          </div>

          {/* Items Grid */}
          {subPageInfo && subPageInfo.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {subPageInfo.items.map((prod) => (
                <div 
                  key={prod.id}
                  onClick={() => onProductClick(prod)}
                  className="bg-white border border-gray-200 rounded-[18px] p-[18px] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-left"
                >
                  <div>
                    {/* Image container */}
                    <div className="h-44 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 relative">
                      <ProductImage 
                        src={prod.images?.[0] || prod.image} 
                        alt={prod.title} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className={`absolute top-2.5 right-2.5 text-[10px] px-2.5 py-1 rounded-full border shadow-2xs ${prod.badgeColor}`}>
                        {prod.badgeText}
                      </span>
                    </div>

                    {/* Category & Name */}
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 tracking-widest block mb-1">
                        {prod.categoryName || '컬렉티블'}
                      </span>
                      <h3 className="font-sans font-bold text-xs sm:text-sm text-gray-950 line-clamp-2 leading-snug group-hover:text-[#EF4444] transition-colors mb-2 min-h-[40px]" title={prod.title}>
                        {prod.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom prices & bid metrics */}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[9px] font-extrabold text-gray-400 block uppercase leading-none mb-1">현재가 / 낙찰가</span>
                        <span className="font-sans font-black text-gray-900 text-sm sm:text-base">{prod.currentPrice.toLocaleString()}원</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-extrabold text-gray-400 block uppercase leading-none mb-1">종료 시점</span>
                        <span className="text-[10px] font-semibold text-gray-450 block font-bold">소장 경합 기록</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500">
                      <span>실시간 참여도</span>
                      <span className="text-slate-700">입찰 {prod.bidCount || 0}건 · 관심 {prod.likeCount || 0}</span>
                    </div>
                    {/* CTA detail view link */}
                    <div className="mt-3 bg-gray-900 group-hover:bg-red-500 text-white font-bold text-xs py-2 rounded-xl text-center transition-colors">
                      애장품 경매 보러가기
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[24px] py-16 px-4 md:px-8 text-center max-w-lg mx-auto mb-12">
              <span className="text-4xl block mb-2">📊</span>
              <p className="font-sans font-bold text-sm text-slate-500 leading-snug">
                {subPageInfo?.emptyMessage}
              </p>
              <p className="text-xs text-slate-400 mt-1">이 조건에 맞는 애장품이 등록되는 즉시 최신 시세 지표를 반영하여 실시간 분석 리스트가 활성화됩니다.</p>
              <button 
                onClick={() => setActiveSubPage('main')}
                className="mt-5 inline-flex items-center gap-1 hover:gap-1.5 text-xs font-black text-white bg-slate-800 hover:bg-slate-900 border border-slate-705 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <span>메인으로 돌아가기</span>
              </button>
            </div>
          )}

          {/* Guide footer */}
          <div className="bg-gray-100/50 border border-gray-200 rounded-2xl p-5 text-left text-xs gap-3 flex items-start text-gray-500 select-none">
            <Layers size={18} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <strong className="text-gray-900 block font-bold text-xs">안내 및 면책 공고</strong>
              <p className="leading-relaxed">
                본 플랫폼의 시세 지표는 실제 수집 애장품 매매 행위 기록(최종 가격 협의 타결 낙찰가)을 중앙값 처리하여 시각화한 모의 인덱스입니다. 실제 외부 유통 거래 가격과 연동되지는 않으며, 유저들의 자율 경쟁 가치가 반영됩니다. 안심하고 입찰 흥정을 벌이실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen py-8 md:py-12 px-4 md:px-8 font-sans transition-all animate-fade-in" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={onBackToMain}
            className="page-back-link group !mb-0"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
          
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-sans">
            <span>LIVE DATA HUB</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Header block with visual identity */}
        <div className="text-center w-full mb-10 flex flex-col items-center justify-center mx-auto">
          <div className="text-center flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-sans border border-gray-200 px-3 py-1 bg-white rounded-full mb-3 shadow-xs text-center">
              MARKET INSIGHT
            </span>
            <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-[#111827] tracking-tight text-center w-full block">
              실시간 소장품 시세 정보
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1.5 max-w-xl text-center w-full block leading-relaxed">
              플랫폼에서 거래되는 희귀 리미티드 애장품의 전일 낙찰 체결가, 가격 거래량 등급 분석 자료입니다.
            </p>
          </div>
        </div>

        {/* 1. 어제 시장 인사이트 Section */}
        <div className="mb-10 text-left">
          <h3 className="font-sans font-bold text-[#111827] text-lg tracking-tight mb-5 pl-0.5">
            어제 시장 인사이트
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 가격 상승 */}
            <div 
              onClick={() => {
                setActiveSubPage('price-rising');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#F1F3F5] hover:bg-[#FFEBEF]/40 cursor-pointer hover:shadow-md border border-transparent hover:border-red-200 rounded-[20px] p-6 flex flex-col justify-between transition-all relative overflow-hidden group active:scale-[0.98]"
              title="가격 상승 상품 목록 보러가기"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1F2] group-hover:bg-[#FFF1F2] flex items-center justify-center transition-colors">
                    <Flame size={15} className="text-[#EF4444]" />
                  </div>
                  <span className="text-[14px] text-gray-800 font-bold group-hover:text-red-650 transition-colors">가격 상승</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[25px] font-extrabold text-gray-900 leading-none">
                    {priceRisingProductsList.length}종
                  </span>
                  <span className="text-xs font-black text-[#EF4444] font-sans leading-none">
                    +{ (priceRisingProductsList.reduce((sum, item) => sum + item.changeRate, 0) / (priceRisingProductsList.length || 1)).toFixed(1) }%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-4 group-hover:text-red-500 transition-colors">전일 대비 가격 상승 상품 보기 →</p>
            </div>

            {/* 상승 전환 */}
            <div 
              onClick={() => {
                setActiveSubPage('trend-turning-up');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#F1F3F5] hover:bg-[#FFF5EB]/60 cursor-pointer hover:shadow-md border border-transparent hover:border-orange-200 rounded-[20px] p-6 flex flex-col justify-between transition-all relative overflow-hidden group active:scale-[0.98]"
              title="상승 전환 상품 목록 보러가기"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFF5EB] flex items-center justify-center transition-colors">
                    <TrendingUp size={15} className="text-orange-500" />
                  </div>
                  <span className="text-[14px] text-gray-800 font-bold group-hover:text-orange-650 transition-colors">상승 전환</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[25px] font-extrabold text-gray-900 leading-none">
                    {trendTurningProductsList.length}종
                  </span>
                  <span className="text-xs font-black text-orange-500 font-sans leading-none">
                    +{ (trendTurningProductsList.reduce((sum, item) => sum + item.turnRate, 0) / (trendTurningProductsList.length || 1)).toFixed(1) }%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-4 group-hover:text-orange-500 transition-colors">하락 후 상승 전환 상품 보기 →</p>
            </div>

            {/* 거래량 대비 저렴 */}
            <div 
              onClick={() => {
                setActiveSubPage('undervalued-volume');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#F1F3F5] hover:bg-[#EBFDF5]/60 cursor-pointer hover:shadow-md border border-transparent hover:border-emerald-200 rounded-[20px] p-6 flex flex-col justify-between transition-all relative overflow-hidden group active:scale-[0.98]"
              title="거래량 대비 저렴 상품 목록 보러가기"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#EBFDF5] flex items-center justify-center transition-colors">
                    <Award size={15} className="text-emerald-500" />
                  </div>
                  <span className="text-[14px] text-gray-800 font-bold group-hover:text-emerald-650 transition-colors">거래량 대비 저렴</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[25px] font-extrabold text-gray-900 leading-none">
                    {undervaluedProductsList.length}종
                  </span>
                  <span className="text-xs font-black text-emerald-500 font-sans leading-none">
                    -{ (undervaluedProductsList.reduce((sum, item) => sum + (item.valueScore > 10 ? 10 : item.valueScore), 0) / (undervaluedProductsList.length || 1) * 0.25).toFixed(1) }%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-4 group-hover:text-emerald-500 transition-colors">거래량 급증 · 시세 안정 상품 보기 →</p>
            </div>
          </div>
        </div>

        {/* 2. Main Flex Layout (Left Chart + Right Top 5 List) */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full mb-12">
          
          {/* Left Block: 30일 시세 · 거래량 Interactive Chart */}
          <div className="flex-1 bg-white border border-gray-150 rounded-[24px] p-6 lg:p-8 shadow-xs flex flex-col justify-between overflow-hidden">
            
            {/* Elegant Product Selector Dropdown */}
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="h-12 w-12 rounded-lg border border-gray-200 bg-white flex-shrink-0 overflow-hidden relative shadow-xs">
                  <ProductImage 
                    src={selectedProduct?.images?.[0] || selectedProduct?.image} 
                    alt="" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left font-sans">
                  <span className="text-[10px] font-extrabold text-[#EF4444] uppercase tracking-wider">{selectedProduct?.categoryName || '컬렉티블'}</span>
                  <h3 className="text-xs font-bold text-gray-900 truncate max-w-[180px] sm:max-w-xs leading-snug">{selectedProduct?.title || '수집품'}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative" ref={searchContainerRef}>
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={14} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="수집품 이름 또는 카테고리 검색..."
                    className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-8 py-1.5 text-xs font-bold text-gray-700 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(true);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {/* Autocomplete Dropdown List */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto font-sans text-left">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setSearchQuery(p.title);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-xs text-left font-sans flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors ${
                              p.id === selectedProductId ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 font-medium'
                            }`}
                          >
                            <span className="truncate max-w-[180px] sm:max-w-[200px]">{p.title}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-2 flex-shrink-0">
                              {p.categoryName || '컬렉티블'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-xs text-slate-400 text-center font-bold">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onProductClick(selectedProduct)}
                  className="bg-gray-900 text-white rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-red-500 transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
                >
                  상세 보기
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5 mb-5 select-none font-sans">
              <div className="text-left font-sans flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">30일 시세 변동</span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors" title="시안중앙값 정보">
                    <CircleHelp size={13} />
                  </button>
                </div>
                
                <p className="text-[11px] text-gray-400 font-sans font-bold mb-1.5 uppercase">
                  최근 체결가 중앙값 {hoverIndex !== null && <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold font-sans ml-1">⏱️ {displayDate} 변경 시점</span>}
                </p>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <h2 className="text-2xl font-sans font-extrabold text-gray-900 tracking-tight flex items-baseline gap-1.5">
                    <span>{displayPrice.toLocaleString()}원</span>
                  </h2>
                  
                  {/* 가격 아래/옆 지표 요약 영역 */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-gray-500 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1 text-slate-700 font-sans">
                      30일 총 거래량: <strong className="text-slate-950 font-extrabold">{total30DayVolume.toLocaleString()}건</strong>
                    </span>
                    <span className="text-gray-300 font-normal">|</span>
                    <span className="flex items-center gap-1 text-slate-700 font-sans">
                      최근 7일 입찰: <strong className="text-slate-950 font-extrabold">{((selectedProduct?.bidCount || 0) * 1.5 + 12).toFixed(0)}건</strong>
                    </span>
                    <span className="text-gray-300 font-normal">|</span>
                    <span className="flex items-center gap-1 font-sans">
                      전일 대비 거래량: <strong className="text-red-500 font-black">+12.4%</strong>
                    </span>
                    <span className="text-gray-300 font-normal">|</span>
                    <span className="flex items-center gap-1 text-slate-700 font-sans">
                      입찰수: <strong className="text-slate-950 font-extrabold">{selectedProduct?.bidCount || 0}건</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggles and Sparkline summary metrics (With pill badges instead of toggling buttons) */}
              <div className="flex flex-col items-end gap-2 text-right">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 px-2.5 py-1 rounded-full border border-red-100 text-[10px] font-black leading-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>거래량 증가 +12.4%</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-655 px-2.5 py-1 rounded-full border border-orange-100 text-[10px] font-bold leading-none">
                    <span>입찰 활발</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-gray-400 font-sans leading-none mt-1">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400 font-sans">1일 전</span>
                    <strong className="text-red-500 font-extrabold font-sans">+7.3%</strong>
                  </span>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400 font-sans">7일 전</span>
                    <strong className="text-[#10B981] font-extrabold font-sans">-14.4%</strong>
                  </span>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400 font-sans">30일 전</span>
                    <strong className="text-red-500 font-extrabold font-sans">+10.4%</strong>
                  </span>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-405 font-bold font-sans">거래량</span>
                    <strong className="text-gray-800 font-bold font-sans">{total30DayVolume.toLocaleString()}건</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Plot rendering context */}
            <div className="relative w-full overflow-x-auto select-none no-scrollbar -mx-2 font-sans">
              <div className="min-w-[700px] w-full relative">
                <svg 
                  width="100%" 
                  height={height} 
                  viewBox={`0 0 ${width} ${height}`} 
                  className="overflow-visible"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <defs>
                    {/* Glowing Red-Coral gradient for price fill */}
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines matching exactly the current bounds */}
                  {gridLevels.map((lvl, index) => (
                    <line 
                      key={index}
                      x1={paddingX} 
                      y1={getYPrice(lvl)} 
                      x2={width - paddingX} 
                      y2={getYPrice(lvl)} 
                      stroke="#f1f5f9" 
                      strokeDasharray="3 3" 
                    />
                  ))}

                  {/* Pricing left side Y-axis labels */}
                  {gridLevels.map((lvl, index) => (
                    <text 
                      key={index}
                      x={paddingX - 12} 
                      y={getYPrice(lvl) + 4} 
                      textAnchor="end" 
                      className="text-[10px] font-medium fill-gray-400 font-sans"
                    >
                      {formatPriceLabel(lvl)}
                    </text>
                  ))}

                  {/* Volume right side Y-axis labels and Bar Columns are removed for line-only mode */}

                  {/* 2. Gradient Area fill for price lines */}
                  <polygon points={areaPoints} fill="url(#priceGradient)" />

                  {/* 3. The actual smooth Price line curve */}
                  <polyline
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* 4. Active Interactive scrub scrubber vertical line */}
                  {hoverIndex !== null && chartDataToUse[hoverIndex] && (
                    <>
                      <line
                        x1={getX(hoverIndex)}
                        y1={paddingY}
                        x2={getX(hoverIndex)}
                        y2={baselineY}
                        stroke="#94A3B8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      
                      {/* Price focus point circle indicator */}
                      <circle
                        cx={getX(hoverIndex)}
                        cy={getYPrice(chartDataToUse[hoverIndex].price)}
                        r="6"
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="shadow-md"
                      />

                      {/* Tooltip detail box overlay */}
                      <g transform={`translate(${getX(hoverIndex) + 15 > width - 150 ? getX(hoverIndex) - 145 : getX(hoverIndex) + 12}, ${getYPrice(chartDataToUse[hoverIndex].price) - 40})`}>
                        <rect width="130" height="52" fill="rgba(15, 23, 42, 0.92)" rx="8" />
                        <text x="10" y="18" fill="#F1F5F9" fontSize="10" fontWeight="700" fontFamily="sans-serif">날짜: {chartDataToUse[hoverIndex].date}</text>
                        <text x="10" y="32" fill="#FDA4AF" fontSize="10" fontWeight="800" fontFamily="mono">시세: {chartDataToUse[hoverIndex].price.toLocaleString()}원</text>
                        <text x="10" y="45" fill="#94A3B8" fontSize="9" fontWeight="700" fontFamily="sans-serif">거래량: {chartDataToUse[hoverIndex].volume}건</text>
                      </g>
                    </>
                  )}

                  {/* X-axis coordinate date lines & text labels */}
                  {chartDataToUse.map((d, i) => {
                    // Show dates selectively to look clean and neat exactly like KREAM
                    if (i % 5 === 0 || i === chartDataToUse.length - 1) {
                      return (
                        <g key={i}>
                          <line x1={getX(i)} y1={baselineY} x2={getX(i)} y2={baselineY + 5} stroke="#cbd5e1" strokeWidth="1" />
                          <text
                            x={getX(i)}
                            y={baselineY + 20}
                            textAnchor="middle"
                            className="text-[10px] fill-gray-400 font-medium font-sans"
                          >
                            {d.date}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>

            {/* Custom chart legend block */}
            <div className="flex items-center gap-4 justify-center mt-6 select-none font-sans text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-[#EF4444] rounded-sm inline-block" />
                <span>시세(원)</span>
              </span>
              <span className="ml-auto text-gray-500 flex items-center gap-1.5 font-sans">
                <span>30일 총 거래량:</span>
                <strong className="text-gray-950 font-extrabold bg-gray-100 border border-gray-150 px-2 py-0.5 rounded-md">{total30DayVolume.toLocaleString()}건</strong>
              </span>
            </div>
          </div>

          {/* Right Block: 전일 상승 Top 5 */}
          <div className="w-full xl:w-[420px] bg-white border border-gray-150 rounded-[24px] p-6 shadow-xs flex flex-col hover:shadow-sm transition-all text-left">
            <div className="border-b border-gray-100 pb-4 mb-4 select-none">
              <h3 className="font-sans font-bold text-slate-850 text-base flex items-center gap-2">
                <TrendingUp size={18} className="text-[#EF4444]" />
                <span>전일 상승 Top 5</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">전일 대비 입찰가가 가장 많이 오른 애장품입니다.</p>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-3.5">
              {dynamicTop5.length > 0 ? (
                dynamicTop5.map((prod, index) => {
                  // Inline tiny sparkline curve point calculator
                  const sparkWidth = 72;
                  const sparkHeight = 28;
                  const spPoints = prod.spark.map((v, i) => {
                    const x = (i / (prod.spark.length - 1)) * sparkWidth;
                    const ratio = (v - 5) / (50 - 5);
                    const y = sparkHeight - (ratio * sparkHeight);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <div 
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setSearchQuery(prod.title);
                      }}
                      className="flex items-center justify-between gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group"
                      title={`${prod.title} 시세 확인하기`}
                    >
                      {/* Rank label */}
                      <span className="font-sans font-black text-gray-850 text-[15px] w-5 text-center select-none">
                        {index + 1}
                      </span>

                      {/* Cute thumbnail container */}
                      <div className="h-[46px] w-[46px] rounded-lg overflow-hidden border border-gray-150 bg-[#F4F4F4] flex-shrink-0 relative">
                        <img 
                          src={prod.image}
                          alt="" 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Meta specifics info */}
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-sans font-bold text-gray-900 text-[11px] sm:text-[12px] truncate leading-tight group-hover:text-[#EF4444] transition-colors" title={prod.title}>
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-sans font-bold text-gray-900 text-xs">{prod.price.toLocaleString()}원</span>
                          <span className="font-sans font-black text-[10px] text-[#EF4444] leading-none">{prod.change}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5 leading-none">입찰 {prod.volume}건</span>
                      </div>

                      {/* Sparkline graphical wave */}
                      <div className="w-[72px] h-[28px] overflow-visible flex-shrink-0 select-none pb-1">
                        <svg width="100%" height="100%" viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}>
                          <polyline
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="1.8"
                            points={spPoints}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 font-bold">
                  시세 상승 데이터를 집계 중입니다.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Informative usage guide footer for Market trend */}
        <div className="bg-gray-100/50 border border-gray-200 rounded-2xl p-5 text-left text-xs gap-3 flex items-start text-gray-500 select-none">
          <Layers size={18} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <strong className="text-gray-900 block font-bold text-xs">안내 및 면책 공고</strong>
            <p className="leading-relaxed">
              본 플랫폼의 시세 지표는 실제 수집 애장품 매매 행위 기록(최종 가격 협의 타결 낙찰가)을 중앙값 처리하여 시각화한 모의 인덱스입니다. 실제 외부 유통 거래 가격과 연동되지는 않으며, 유저들의 자율 경쟁 가치가 반영됩니다. 샥 테크에 안전 예치된 샥머니 보존량은 100% 모의 가상 수치로, 안심하고 입찰 흥정을 벌이실 수 있습니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

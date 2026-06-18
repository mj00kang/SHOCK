import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Heart, Share2, Award, ShieldCheck, ChevronRight, User } from 'lucide-react';
import { Product } from '../data/mockData';
import { 
  getProducts, saveProducts, 
  getBids, saveBids, BidRecord,
  saveUser, UserState
} from '../utils/storageUtils';
import ProductGallery from '../components/ProductGallery';
import BidHistory from '../components/BidHistory';
import BidBox from '../components/BidBox';
import ProductPriceTrendChart from '../components/ProductPriceTrendChart';

interface ProductDetailPageProps {
  productId: string;
  currentUser: UserState | null;
  onBack: () => void;
  onRequireLogin: () => void;
  onNavigateToCheckout: (productId: string, price: number) => void;
  onToggleLike: (productId: string) => void;
  likedProductIds: string[];
  onRefreshData?: () => void;
}

export default function ProductDetailPage({
  productId,
  currentUser,
  onBack,
  onRequireLogin,
  onNavigateToCheckout,
  onToggleLike,
  likedProductIds,
  onRefreshData
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [productBids, setProductBids] = useState<BidRecord[]>([]);
  const [ticker, setTicker] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);

  // Load product and bids
  const loadProductData = () => {
    const allProducts = getProducts();
    let found = allProducts.find(p => p.id === productId);

    const allBids = getBids();
    let filteredBids = allBids.filter(b => b.productId === productId);

    if (found && filteredBids.length === 0) {
      const mn = ['김수집러', '이빈티지', '박레트로', '최한정판', '정컬렉터', '한매니아', '조덕후', '오오타쿠', '홍희귀템', '유니크'];
      const shuffledMn = [...mn].sort(() => 0.5 - Math.random());
      const newRandomBids: BidRecord[] = [1, 2, 3].map(i => {
        const randNick = shuffledMn[i - 1] + Math.floor(Math.random() * 100);
        const bidTime = new Date(Date.now() - Math.random() * 86400000).toISOString();
        const basePrice = found.currentPrice > found.startPrice ? found.currentPrice : found.startPrice + (3 * (found.minBidIncrement || 1000));
        const bPrice = basePrice - (i - 1) * (found.minBidIncrement || 1000);
        return {
          id: `bid-rand-${productId}-${i}`,
          productId: productId,
          bidderId: `user-rand-${randNick}`,
          bidderNickname: randNick,
          bidPrice: Math.max(found.startPrice, bPrice),
          bidAt: bidTime
        };
      });
      // Sort to make sure highest is newest
      newRandomBids.sort((a, b) => b.bidPrice - a.bidPrice);
      
      filteredBids = newRandomBids;
      saveBids([...allBids, ...newRandomBids]);
      
      const newCurrentPrice = newRandomBids[0].bidPrice;
      const updatedProducts = allProducts.map(p => {
        if (p.id === productId) {
          return { ...p, bidCount: p.bidCount + 3, currentPrice: Math.max(p.currentPrice, newCurrentPrice) };
        }
        return p;
      });
      saveProducts(updatedProducts);
      
      found = updatedProducts.find(p => p.id === productId);
    }

    if (found) {
      setProduct(found);
    }
    setProductBids(filteredBids);
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  // Realtime countdown clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <ArrowLeft className="text-gray-400 h-10 w-10 animate-pulse" />
        <p className="mt-4 text-sm text-gray-500 font-bold">상품 정보를 찾을 수 없거나 삭제되었습니다.</p>
        <button 
          onClick={onBack} 
          className="page-back-link group mt-6"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>메인으로 돌아가기</span>
        </button>
      </div>
    );
  }

  const isLiked = likedProductIds.includes(product.id);

  // Time remaining calculator
  const getRemainingTimeStr = () => {
    const end = new Date(product.endAt).getTime();
    const remainingMs = end - Date.now();

    if (remainingMs <= 0 || product.status === 'sold' || product.status === 'ended') {
      return '마감 완료';
    }

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  const isLive = product.status === 'live' && new Date(product.endAt).getTime() > Date.now();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBidSuccess = (bidAmount: number) => {
    if (!currentUser) return;

    // 1. Double check conditions
    if (currentUser.nickname === product.sellerNickname) {
      alert('본인이 등록하신 경매에는 입찰이 불가합니다.');
      return;
    }

    // 2. Add bid record
    const newBid: BidRecord = {
      id: `bid-user-${Date.now()}`,
      productId: product.id,
      bidderId: currentUser.id,
      bidderNickname: currentUser.nickname,
      bidPrice: bidAmount,
      bidAt: new Date().toISOString()
    };

    const allBids = getBids();
    saveBids([...allBids, newBid]);

    // 3. Update product current price
    const allProducts = getProducts();
    const updatedProducts = allProducts.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          currentPrice: bidAmount,
          bidCount: p.bidCount + 1
        };
      }
      return p;
    });
    saveProducts(updatedProducts);

    // 4. Save User coins if you want or legacy logic, let's create a notification
    try {
      const unreadsRaw = localStorage.getItem('shock_notifications_unreads');
      const list = unreadsRaw ? JSON.parse(unreadsRaw) : [];
      list.unshift({
        id: `notif-bid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bid_success',
        message: `📢 [${product.title}] 상품에 ${bidAmount.toLocaleString()}원으로 안전 입찰하였습니다.`,
        createdAt: new Date().toISOString(),
        isRead: false
      });
      localStorage.setItem('shock_notifications_unreads', JSON.stringify(list));
    } catch (err) {}

    // 5. Update local state
    loadProductData();
    if (onRefreshData) {
      onRefreshData();
    }
    alert('🎉 호가 입찰이 성공적으로 적용되었습니다!');
  };

  // Status Colors for the detail page
  let statusBadgeColor = 'bg-rose-50 text-red-500 border-rose-100';
  let statusText = '경매 진행 중 ⚡';

  if (product.status === 'sold') {
    statusBadgeColor = 'bg-gray-900 text-white border-transparent';
    statusText = '낙찰 및 주문완료 ✓';
  } else if (!isLive) {
    statusBadgeColor = 'bg-gray-100 text-gray-500 border-gray-200';
    statusText = '경매 유찰/마감';
  }

  return (
    <div className="bg-gray-50 min-h-[90vh] py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="page-back-link group !mb-0"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-450 font-medium">
            <span>Home</span>
            <ChevronRight size={12} />
            <span className="uppercase">{product.categoryGroup}</span>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-bold">{product.categoryName}</span>
          </div>
        </div>

        {/* Detailed Screen Layout split into 2 massive columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left partition detail (7cols): Photo Gallery & Overview */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery 
              image={product.image}
              images={(product as any).images || []}
              title={product.title}
              categoryGroup={product.categoryGroup}
              categoryName={product.categoryName}
            />

            {/* Description card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left space-y-4">
              <h3 className="font-sans font-extrabold text-base text-gray-900 border-b border-gray-50 pb-3">
                📋 애장품 원형 사연 및 상세정보 설명
              </h3>

              <div className="text-sm md:text-base text-slate-650 leading-relaxed whitespace-pre-wrap font-sans">
                {product.description || '이 수집품에 등록된 상세 스펙 정보가 존재하지 않습니다.'}
              </div>

              {/* Tag Badges */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-gray-900 font-bold bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 해당 상품 관련 시세차트 (3번 div와 4번 div 사이에 추가) */}
            <ProductPriceTrendChart product={product} />

            {/* Bid History Widget */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <BidHistory bids={productBids} />
            </div>

          </div>

          {/* Right partition action columns (5cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Core Specs Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
              
              {/* Category indicator & Wishlist trigger row */}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 border border-gray-200 text-gray-700 font-extrabold px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                  {product.categoryGroup} &gt; {product.categoryName}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleLike(product.id)}
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                    title="찜하기"
                  >
                    <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                    title="복사공유"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

              {isCopied && (
                <p className="text-xs text-gray-900 font-bold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-center">
                  📎 주소가 클립보드에 무사히 복사되었습니다!
                </p>
              )}

              {/* Main Title display */}
              <div className="space-y-2">
                <span className={`inline-block text-xs font-sans font-black px-2.5 py-0.5 rounded border ${statusBadgeColor}`}>
                  {statusText}
                </span>
                <h1 className="font-sans font-black text-gray-900 text-xl md:text-2xl leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Ticker Row */}
              <div className="flex items-center gap-2 p-3 bg-rose-50/40 border border-rose-100/50 rounded-2xl">
                <Clock size={16} className="text-red-500 animate-pulse" />
                <div>
                  <span className="block text-[12px] font-bold text-slate-450 uppercase tracking-widest font-sans">남은 시간</span>
                  <span className="text-base font-extrabold font-mono text-rose-600">
                    {getRemainingTimeStr()}
                  </span>
                </div>
              </div>

              {/* Product Specifications Metas */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-gray-100">
                <div className="bg-gray-50/60 p-3 rounded-2xl border border-dashed border-gray-200">
                  <span className="block text-[11px] font-extrabold text-gray-500 uppercase">보관 컨디션 등급</span>
                  <span className="text-sm font-bold text-gray-900 mt-1 block">
                    {product.condition || '상태우수'}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block leading-snug">
                    {(() => {
                      const cond = product.condition || '상태우수';
                      if (cond === '새상품급') return '보관 상태가 좋고 거의 새것에 가까운 상품';
                      if (cond === '상태우수') return '눈에 띄는 흠집이 거의 없는 상품';
                      if (cond === '사용감 있음') return '생활기스 또는 미세한 마찰 흔적이 있는 상품';
                      if (cond === '빈티지') return '세월감이나 사용 흔적이 있으며, 일부 스크래치 또는 보관 흔적이 있을 수 있는 상품';
                      return '';
                    })()}
                  </span>
                </div>
                <div className="bg-gray-50/60 p-3 rounded-2xl border border-dashed border-gray-200">
                  <span className="block text-[11px] font-extrabold text-gray-500 uppercase">입찰 방식</span>
                  <span className="text-sm font-bold text-gray-900 mt-1 block uppercase">
                    실시간 최고가 입찰
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block leading-snug">
                    {product.hasBuyNow && Number(product.buyNowPrice) > 0
                      ? '입찰 참여 또는 즉시낙찰로 바로 구매할 수 있어요.' 
                      : '최소 입찰가 이상으로 경매에 참여할 수 있어요.'}
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="py-3.5 space-y-3 px-1 border-b border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>최초 시작가:</span>
                  <span className="font-mono text-gray-700 font-bold text-sm">{product.startPrice.toLocaleString()}원</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-black flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-800 animate-pulse"></span>
                    현재 입찰가:
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-2xl text-slate-950">
                      {product.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-bold ml-0.5">원</span>
                  </div>
                </div>

                {/* 최소 입찰 가능 금액 */}
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span className="font-bold text-gray-600">최소 입찰 가능 금액:</span>
                  <span className="font-mono font-bold bg-gray-200/60 px-2 py-0.5 rounded text-gray-900 text-sm text-right">
                    {(() => {
                      const minIncrement = product.minBidIncrement || 1000;
                      const isNoBidsYet = product.bidCount === 0;
                      const nextMinBid = isNoBidsYet ? product.startPrice : product.currentPrice + minIncrement;
                      return nextMinBid.toLocaleString();
                    })()}원
                  </span>
                </div>

                {/* 즉시낙찰가 영역 및 안내문구 */}
                {product.status === 'live' && Number(product.buyNowPrice) > 0 && (
                  <div className="mt-3.5 p-4 bg-yellow-50/70 border border-yellow-200/60 rounded-2xl space-y-3 text-left">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-yellow-800 font-black flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        즉시낙찰가:
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-black text-xl text-yellow-905">
                          {product.buyNowPrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-yellow-700 font-bold ml-0.5">원</span>
                      </div>
                    </div>

                    <div className="text-xs text-yellow-800 leading-relaxed bg-white p-2.5 rounded-xl border border-yellow-100/50 font-sans">
                      ⚡ 즉시낙찰가로 결제하면 경매 종료를 기다리지 않고 바로 거래가 진행됩니다.
                    </div>
                  </div>
                )}
              </div>

              {/* Seller details */}
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-gray-200 text-slate-650 rounded-xl">
                    <User size={15} />
                  </span>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-450 uppercase tracking-wider">경매인 셀러</span>
                    <span className="text-sm font-black text-gray-900 font-sans">{product.sellerNickname}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 text-sm text-yellow-500 font-bold bg-white/95 border border-gray-200 px-2 py-0.5 rounded-md shadow-sm font-mono">
                    ★ {product.sellerRating}
                  </span>
                </div>
              </div>

            </div>

            {/* Bidding Control Area */}
            <div className="space-y-4">
              <BidBox 
                product={product}
                currentUserNickname={currentUser ? currentUser.nickname : ''}
                onBidSuccess={handleBidSuccess}
                onBuyNowClick={() => {
                  const price = product.buyNowPrice || Math.floor(product.currentPrice * 1.4);
                  onNavigateToCheckout(product.id, price);
                }}
                onRequireLogin={onRequireLogin}
              />

              <div className="bg-gray-50 border border-gray-200 p-4.5 rounded-2xl text-gray-500 text-sm leading-relaxed space-y-1">
                <p className="font-extrabold text-gray-700 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-gray-800" />
                  <span>위해차단 및 안심 정품 에스크로 보호</span>
                </p>
                <p>
                  경매 참여 시 타결까지 임의 취소는 다른 입찰자들에게 차질을 빚게 되오니 신중한 참여를 부탁드립니다. 대금은 샥 에스크로 기금에 안전 수탁 수령 후 판매 완료됩니다.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

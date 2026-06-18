import React, { useState, useRef } from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/mockData';
import ProductImage from './ProductImage';

interface RankingSectionProps {
  products: Product[];
  likedProductIds: string[];
  onToggleLike: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

const CIRCLE_TABS = [
  { id: 'most-wanted', label: '많이 산 상품', imageUrl: '/src/assets/images/regenerated_image_1781568349871.png' },
  { id: 'rising-hot', label: '뜨는 신상', imageUrl: '/src/assets/images/regenerated_image_1781568352386.png' },
  { id: 'gift', label: '선물하기', imageUrl: '/src/assets/images/regenerated_image_1781568354829.png' },
  { id: 'popular-brand', label: '인기 브랜드', imageUrl: '/src/assets/images/regenerated_image_1781568357629.png' }
];

const RANKING_CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'shoes', name: '신발' },
  { id: 'tshirt', name: '티셔츠' },
  { id: 'runningshoes', name: '러닝화' },
  { id: 'sandal', name: '샌들' },
  { id: 'tradingcard', name: '트레이딩카드' },
  { id: 'beauty', name: '뷰티' },
  { id: 'watch', name: '시계' },
  { id: 'jewelry', name: '주얼리' },
  { id: 'luxury', name: '럭셔리' }
];

export default function RankingSection({ products, likedProductIds, onToggleLike, onProductClick }: RankingSectionProps) {
  const [activeCircle, setActiveCircle] = useState<string>('most-wanted');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [brandOnly, setBrandOnly] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<'rapid' | 'weekly' | 'monthly'>('rapid');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const getFilteredProducts = () => {
    let filtered = [...products].filter(p => p.status !== 'cancelled');

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => {
        const catName = p.categoryName || '';
        const titleL = p.title.toLowerCase();
        if (activeCategory === 'shoes' || activeCategory === 'runningshoes' || activeCategory === 'sandal') {
          return catName.includes('운동화') || titleL.includes('신발') || titleL.includes('shoes');
        }
        if (activeCategory === 'tradingcard') {
          return catName.includes('카드') || titleL.includes('card');
        }
        if (activeCategory === 'luxury') {
          return p.currentPrice > 100000;
        }
        return false;
      });
    }

    if (brandOnly) {
      filtered = filtered.filter((_, idx) => idx % 2 === 0);
    }

    filtered.sort((a, b) => {
      let scoreA = a.bidCount * 5 + (a.likeCount * 3);
      let scoreB = b.bidCount * 5 + (b.likeCount * 3);
      if (timeFilter === 'weekly') {
        scoreA += (a.id.charCodeAt(a.id.length - 1) % 10) * 2;
        scoreB += (b.id.charCodeAt(b.id.length - 1) % 10) * 2;
      } else if (timeFilter === 'monthly') {
        scoreA += (a.id.charCodeAt(0) % 10) * 4;
        scoreB += (b.id.charCodeAt(0) % 10) * 4;
      } else {
        scoreA += (a.currentPrice % 7) * 4;
        scoreB += (b.currentPrice % 7) * 4;
      }
      return scoreB - scoreA;
    });

    return filtered.slice(0, 12); // top 12 items
  };

  const rankedProducts = getFilteredProducts();

  const getRankIndicator = (idx: number, id: string) => {
    const code = id.charCodeAt(id.length - 1) || 0;
    const type = (idx + code) % 4;
    if (type === 0 || idx < 3) return { text: '-', colorClass: 'text-neutral-400' };
    if (type === 1) return { text: `▲${(code % 3) + 1}`, colorClass: 'text-[#ff4d4f] font-bold' };
    if (type === 2) return { text: `▼${(code % 2) + 1}`, colorClass: 'text-[#00c853] font-bold' };
    return { text: '-', colorClass: 'text-neutral-400' };
  };

  return (
    <section id="ranking-section" className="w-full bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-black text-black mb-8 italic">인기 랭킹 아레나</h2>
        
        {/* Circle Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-14 mb-8 overflow-x-auto no-scrollbar pb-2">
          {CIRCLE_TABS.map((tab) => {
            const isSelected = activeCircle === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveCircle(tab.id); setActiveCategory('all'); }}
                className="flex flex-col items-center group cursor-pointer focus:outline-none shrink-0"
              >
                <div className={`w-[72px] h-[72px] md:w-[84px] md:h-[84px] rounded-full overflow-hidden flex items-center justify-center bg-gray-55 border-2 transition-all duration-300 ${isSelected ? 'border-black scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.08)]' : 'border-transparent hover:border-gray-300'}`}>
                  <img src={tab.imageUrl} alt={tab.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <span className={`text-xs md:text-[13px] mt-3 font-extrabold transition-all duration-200 ${isSelected ? 'text-black' : 'text-neutral-400 group-hover:text-black'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="relative w-full border-b border-gray-100 pb-3 flex items-center mb-6">
          <div ref={scrollContainerRef} className="flex items-center gap-2 overflow-x-auto select-none no-scrollbar py-1 pr-14 w-full">
            {RANKING_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-white to-transparent flex items-center justify-end pointer-events-none">
            <button onClick={scrollRight} className="pointer-events-auto w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black shadow-sm">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
            <button onClick={() => setTimeFilter('rapid')} className={`hover:text-black ${timeFilter === 'rapid' ? 'text-black font-extrabold' : ''}`}>급상승</button>
            <span className="text-neutral-200 text-[10px]">|</span>
            <button onClick={() => setTimeFilter('weekly')} className={`hover:text-black ${timeFilter === 'weekly' ? 'text-black font-extrabold' : ''}`}>주간</button>
            <span className="text-neutral-200 text-[10px]">|</span>
            <button onClick={() => setTimeFilter('monthly')} className={`hover:text-black ${timeFilter === 'monthly' ? 'text-black font-extrabold' : ''}`}>월간</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 mt-4">
          <AnimatePresence mode="popLayout">
            {rankedProducts.map((prod, index) => {
              const ind = getRankIndicator(index, prod.id);
              const isLiked = likedProductIds.includes(prod.id);
              return (
                <motion.div key={prod.id} layoutId={`main-rank-${prod.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group cursor-pointer flex flex-col relative select-none" onClick={() => onProductClick(prod)}>
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f4f4] mb-3 border border-gray-200">
                    <ProductImage src={prod.image} alt={prod.title} categoryGroup={prod.categoryGroup} categoryName={prod.categoryName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col text-left font-sans">
                    <div className="flex items-center gap-1.5 mb-1 select-none">
                      <span className="text-base font-black text-black leading-none">{index + 1}</span>
                      <span className={`text-[11px] leading-none ${ind.colorClass}`}>{ind.text}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-neutral-800 leading-[1.3] mb-1 line-clamp-2 h-8 group-hover:text-black">{prod.title}</h3>
                    <div className="flex items-center gap-1 text-[13px] tracking-tight font-extrabold text-neutral-900 mt-1">
                      {prod.currentPrice.toLocaleString()}원
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

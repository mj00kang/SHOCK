import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../data/mockData';
import { TrendingUp, CircleHelp, Calendar, Sparkles } from 'lucide-react';

interface ProductPriceTrendChartProps {
  product: Product;
}

export default function ProductPriceTrendChart({ product }: ProductPriceTrendChartProps) {
  // Generate stable local 30-day realistic trend data based on current price
  const [chartData, setChartData] = useState<{ date: string; price: number; volume: number }[]>([]);

  useEffect(() => {
    const currentPrice = product.currentPrice || 100000;
    const data = [];
    const now = new Date();
    
    // Seed random generator with product ID so the chart remains consistent for the same product
    let seed = 0;
    if (product.id) {
      for (let i = 0; i < product.id.length; i++) {
        seed += product.id.charCodeAt(i);
      }
    }

    const pseudoRandom = (min: number, max: number, offsetIndex: number) => {
      const x = Math.sin(seed + offsetIndex) * 10000;
      const r = x - Math.floor(x);
      return min + r * (max - min);
    };

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateStr = String(d.getDate()).padStart(2, '0');
      const dateFormatted = `${month}/${dateStr}`;
      
      let price: number;
      if (i === 0) {
        price = currentPrice;
      } else {
        // Trend slightly upwards over 30 days towards the current bid price
        const growthFactor = (30 - i) / 30; // 0 at day index 30 (oldest), 1 at day 0 (today)
        const baseOffset = -0.15 + (growthFactor * 0.12); // slightly rising average
        const randRatio = baseOffset + pseudoRandom(-0.08, 0.08, i);
        price = Math.round((currentPrice * (1 + randRatio)) / 1000) * 1000;
      }
      const volume = Math.floor(pseudoRandom(5, 45, i));
      data.push({ date: dateFormatted, price, volume });
    }
    setChartData(data);
  }, [product.id, product.currentPrice]);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [displayDate, setDisplayDate] = useState<string>('');

  useEffect(() => {
    if (chartData.length === 0) return;
    if (hoverIndex !== null && chartData[hoverIndex]) {
      setDisplayPrice(chartData[hoverIndex].price);
      setDisplayDate(chartData[hoverIndex].date);
    } else {
      const last = chartData[chartData.length - 1];
      if (last) {
        setDisplayPrice(last.price);
        setDisplayDate(last.date);
      }
    }
  }, [hoverIndex, chartData]);

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-xs text-gray-400">시세 데이터를 불러오는 중...</div>;
  }

  // SVG dimensions
  const width = 600;
  const height = 180;
  const paddingX = 45;
  const paddingY = 20;

  const prices = chartData.map(d => d.price);
  const minPriceVal = Math.min(...prices);
  const maxPriceVal = Math.max(...prices);

  const pricePad = (maxPriceVal - minPriceVal) * 0.15 || 10000;
  const minPrice = Math.max(0, Math.round((minPriceVal - pricePad) / 1000) * 1000);
  const maxPrice = Math.round((maxPriceVal + pricePad) / 1000) * 1000;

  const getX = (index: number) => {
    return paddingX + (index / (chartData.length - 1)) * (width - paddingX * 2);
  };

  const getY = (price: number) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  const points = chartData.map((d, i) => `${getX(i)},${getY(d.price)}`).join(' ');
  const areaPoints = `${getX(0)},${height - paddingY} ${points} ${getX(chartData.length - 1)},${height - paddingY}`;

  // Grid levels
  const priceRange = maxPrice - minPrice;
  const gridLevels = [
    maxPrice,
    minPrice + priceRange * 0.5,
    minPrice
  ];

  const formatPriceLabel = (p: number) => {
    if (p >= 10000) {
      const units = p / 10000;
      return units % 1 === 0 ? `${units}만` : `${units.toFixed(1)}만`;
    }
    return `${p.toLocaleString()}`;
  };

  // Safe mouse scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const chartWidth = rect.width - (paddingX * 2 * (rect.width / width));
    const padLeft = paddingX * (rect.width / width);

    if (x >= padLeft && x <= rect.width - padLeft) {
      const ratio = (x - padLeft) / chartWidth;
      const exactIndex = Math.round(ratio * (chartData.length - 1));
      if (exactIndex >= 0 && exactIndex < chartData.length) {
        setHoverIndex(exactIndex);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Calculate 30-day change percentage
  const oldestPrice = chartData[0]?.price || 1;
  const newestPrice = chartData[chartData.length - 1]?.price || 1;
  const changePercent = ((newestPrice - oldestPrice) / oldestPrice) * 100;
  const isPositive = changePercent >= 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
        <div>
          <h3 className="font-sans font-black text-base text-gray-950 flex items-center gap-1.5">
            <span>📊 실시간 시세 및 거래 동향</span>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider font-sans">
            최근 30일간의 회원간 체결가 중앙값 변동
          </p>
        </div>

        <div className="text-right flex items-center sm:block gap-2">
          <span className={`inline-flex items-center gap-0.5 text-xs font-sans font-black px-2.5 py-0.5 rounded ${
            isPositive ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
          }`}>
            ⏱️ 30일 기준 {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Ticker values */}
      <div className="grid grid-cols-2 gap-4 pb-4 mb-4 bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-100">
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">시세 평가액 ({displayDate})</span>
          <span className="text-lg font-black font-mono text-gray-900">{displayPrice.toLocaleString()}원</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">30일 최고 거래가</span>
          <span className="text-lg font-black font-mono text-gray-900">{maxPriceVal.toLocaleString()}원</span>
        </div>
      </div>

      {/* SVG Container wrapping the chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`} 
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="detailPriceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLevels.map((lvl, index) => (
            <line 
              key={index}
              x1={paddingX} 
              y1={getY(lvl)} 
              x2={width - paddingX} 
              y2={getY(lvl)} 
              stroke="#f1f5f9" 
              strokeDasharray="3 3" 
            />
          ))}

          {/* Left Y Labels */}
          {gridLevels.map((lvl, index) => (
            <text 
              key={index}
              x={paddingX - 10} 
              y={getY(lvl) + 3} 
              textAnchor="end" 
              className="text-[10px] font-semibold fill-gray-405 font-sans"
            >
              {formatPriceLabel(lvl)}
            </text>
          ))}

          {/* Date labels on X Axis */}
          <text x={getX(0)} y={height - 2} textAnchor="start" className="text-[9px] font-bold fill-gray-400 font-sans">
            {chartData[0]?.date}
          </text>
          <text x={getX(14)} y={height - 2} textAnchor="middle" className="text-[9px] font-bold fill-gray-400 font-sans">
            {chartData[14]?.date}
          </text>
          <text x={getX(29)} y={height - 2} textAnchor="end" className="text-[9px] font-bold fill-gray-400 font-sans">
            오늘 ({chartData[29]?.date})
          </text>

          {/* Gradient paint */}
          <polygon points={areaPoints} fill="url(#detailPriceGradient)" />

          {/* Main stroke line */}
          <polyline
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Scrub pointer */}
          {hoverIndex !== null && chartData[hoverIndex] && (
            <>
              <line
                x1={getX(hoverIndex)}
                y1={paddingY}
                x2={getX(hoverIndex)}
                y2={height - paddingY}
                stroke="#CBD5E1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(chartData[hoverIndex].price)}
                r="5"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="shadow"
              />
            </>
          )}
        </svg>
      </div>

      <div className="mt-3 text-[11px] text-gray-400 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-sans">
        💡 차트 위를 마우스로 문지르거나(드래그) 터치하시면 날짜별 상세 변동 단가를 타임라인 스크럽으로 간편하게 확인할 수 있습니다.
      </div>
    </div>
  );
}

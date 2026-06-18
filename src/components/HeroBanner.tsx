import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { INITIAL_BANNERS, Banner } from '../data/mockData';
import slide1Img from '../assets/images/regenerated_image_1781573429620.png';
import slide2Img from '../assets/images/regenerated_image_1781573575419.png';
import slide3Img from '../assets/images/regenerated_image_1781573432419.png';

interface HeroBannerProps {
  onScrollToSection: (sectionId: string, filterValue?: string) => void;
}

export default function HeroBanner({ onScrollToSection }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = INITIAL_BANNERS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500); // Auto roll every 6s
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.type === 'lucky_shock') {
      onScrollToSection('#event-section');
    } else if (banner.type === 'gathering') {
      onScrollToSection('#community-section');
    } else if (banner.type === 'hot_bids') {
      onScrollToSection('#deadline-section', 'all');
    } else {
      onScrollToSection(banner.targetSection);
    }
  };

  const SLIDE_CONTENT = [
    {
      label: "LUCKY DRAW",
      title: "럭키샥 100원 응모 이벤트",
      description: "한정판 피규어와 희귀 굿즈를 100원 응모로 만날 수 있는 특별한 기회",
      button: "100원 응모하러 가기",
      bg: "linear-gradient(135deg, #FAF7F0 0%, #F3F4F6 100%)", // Cream
      imageOverride: slide1Img,
    },
    {
      label: "TRADING CARD DAY",
      title: "트레이딩 카드 데이",
      description: "카드 수집가들이 모여 플레이하고, 카드를 나누고, 굿즈까지 함께 즐기는 주말 이벤트",
      button: "이벤트 둘러보기",
      bg: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)", // Soft Blue
      imageOverride: slide2Img,
    },
    {
      label: "LIVE AUCTION NOW",
      title: "지금 가장 뜨거운 애장품 경매",
      description: "실시간 입찰이 몰리는 인기 애장품 경매",
      button: "실시간 경매 리스트 보기",
      bg: "linear-gradient(135deg, #F5F5F5 0%, #EFE7DA 100%)", // Light Beige
      imageOverride: slide3Img,
    }
  ];

  return (
    <section id="recommend-section" className="w-full py-6 px-4 md:px-8 bg-white hero-banner-wrapper">
      {/* Slide frame with shadow and custom rounded corners */}
      <div className="relative w-full max-w-7xl mx-auto rounded-[28px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        
        {/* Banner container */}
        <div className="relative w-full min-h-[260px] md:min-h-[320px] lg:min-h-[330px] flex items-stretch bg-[#F4F4F4] transition-all">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            const content = SLIDE_CONTENT[index] || SLIDE_CONTENT[0];
            return (
              <div
                key={banner.id}
                style={{ background: content.bg }}
                className={`w-full md:grid md:grid-cols-[1.1fr_0.9fr] flex flex-col items-center transition-all duration-700 p-6 md:py-[36px] md:px-[68px] lg:px-[76px] ${
                  isActive ? 'relative opacity-100 z-10 flex' : 'absolute top-0 left-0 w-full h-full opacity-0 z-0 pointer-events-none hidden'
                }`}
              >

                {/* Text content col */}
                <div className="w-full flex flex-col justify-center text-left max-w-[560px] md:pr-8 lg:pr-12 order-1 mt-2 md:mt-2 pb-10 md:pb-0 z-10">
                  <div className="mb-4">
                    <span 
                      className="inline-block px-3 py-1.5 rounded-full text-[11px] md:text-[12px] font-[800] tracking-[0.1em] uppercase text-[#111827] bg-white/70 backdrop-blur-md border border-[#111827]/10"
                      style={{ fontFamily: 'Pretendard, sans-serif' }}
                    >
                      {content.label}
                    </span>
                  </div>
                  <h2 
                    className="font-sans text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[42px] font-[900] text-[#111827] tracking-[-0.03em] leading-[1.25] mb-3 whitespace-pre-line"
                    style={{ fontFamily: 'Pretendard, sans-serif' }}
                  >
                    {content.title}
                  </h2>
                  <p 
                    className="font-sans text-[14px] sm:text-[15px] md:text-[15px] font-medium text-[#6B7280] mb-5 md:mb-6 leading-[1.6] max-w-[560px] whitespace-pre-line"
                    style={{ fontFamily: 'Pretendard, sans-serif', wordBreak: 'keep-all' }}
                  >
                    {content.description}
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleBannerClick(banner)}
                      className="cursor-pointer bg-[#111827] text-white hover:bg-black text-[14px] md:text-[15px] font-[800] font-sans h-[42px] md:h-[46px] px-[20px] md:px-[24px] rounded-full inline-flex items-center justify-center gap-[8px] group transition-all"
                      style={{ fontFamily: 'Pretendard, sans-serif' }}
                    >
                      <span>{content.button}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Graphic col with lifestyle view */}
                <div className="w-full h-full max-h-[160px] sm:max-h-[220px] md:max-h-none flex items-center justify-center lg:justify-end order-2 relative z-0 mt-4 md:mt-0">
                  <div className="relative w-full h-[150px] sm:h-[180px] md:h-full md:max-h-[260px] md:max-w-[100%] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.08)] border border-[#111827]/10 group bg-white/50">
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors z-10 pointer-events-none"></div>
                    <img
                      src={content.imageOverride || banner.image}
                      alt={banner.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02] opacity-100"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Manual Left/Right indicators right on top of slides */}
          <button
            onClick={handlePrev}
            className="hero-arrow-btn absolute left-2 md:left-[16px] lg:left-[20px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] md:w-[46px] md:h-[46px] rounded-full text-[#111827] hover:text-black transition-all cursor-pointer flex items-center justify-center bg-white/80 hover:bg-white border border-[#111827]/10 backdrop-blur-[8px] shadow-sm"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleNext}
            className="hero-arrow-btn absolute right-2 md:right-[16px] lg:right-[20px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] md:w-[46px] md:h-[46px] rounded-full text-[#111827] hover:text-black transition-all cursor-pointer flex items-center justify-center bg-white/80 hover:bg-white border border-[#111827]/10 backdrop-blur-[8px] shadow-sm"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          {/* Slider dots/capsule indicators positioned in bottom center */}
          <div className="hero-indicator-row absolute bottom-[22px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-[7px] select-none">
            {banners.map((_, index) => {
              const isDotActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 ease-in-out cursor-pointer rounded-full ${
                    isDotActive
                      ? 'w-[22px] h-[6px] bg-[#111827]'
                      : 'w-[6px] h-[6px] bg-[#D1D5DB]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

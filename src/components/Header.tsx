import React, { useState } from 'react';
import { Menu, Search, Heart, User, Bell, Sparkles, X } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/mockData';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  userCoins: number;
  userNickname: string;
  userRole: 'user' | 'admin';
  setUserRole: (role: 'user' | 'admin') => void;
  onOpenSellModal: () => void;
  onOpenMyPageModal: () => void;
  onOpenNotificationsModal: () => void;
  onOpenLikesModal: () => void;
  unreadNotificationsCount: number;
  currentView?: 'main' | 'POP' | 'SPORTS' | 'ANALOG' | 'list_product' | 'community' | 'event' | 'mypage' | 'auction_list' | 'login' | 'signup' | 'checkout' | 'ranking' | 'market_trend' | 'notice' | 'faq' | 'inquiry' | 'report';
  setCurrentView?: (v: 'main' | 'POP' | 'SPORTS' | 'ANALOG' | 'list_product' | 'community' | 'event' | 'mypage' | 'auction_list' | 'login' | 'signup' | 'checkout' | 'ranking' | 'market_trend' | 'notice' | 'faq' | 'inquiry' | 'report') => void;
  onNavigateToCategoryPage?: (group: 'POP' | 'SPORTS' | 'ANALOG', subCategory?: string) => void;
  onNavigateToListProduct?: () => void;
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
}



export default function Header({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  userCoins,
  userNickname,
  userRole,
  setUserRole,
  onOpenSellModal,
  onOpenMyPageModal,
  onOpenNotificationsModal,
  onOpenLikesModal,
  unreadNotificationsCount,
  currentView = 'main',
  setCurrentView,
  onNavigateToCategoryPage,
  onNavigateToListProduct,
  isLoggedIn,
  onNavigateToLogin,
  onNavigateToSignup,
  onLogout
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Smooth scroll helper
  const handleScrollToSection = (elementId: string, filterValue?: string) => {
    if (setCurrentView) {
      setCurrentView('main');
    }
    if (filterValue !== undefined) {
      setActiveFilter(filterValue);
    }
    setTimeout(() => {
      const element = document.querySelector(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    setDropdownOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    const cat = INITIAL_CATEGORIES.find(c => c.name === categoryName);
    if (cat && onNavigateToCategoryPage) {
      onNavigateToCategoryPage(cat.group, categoryName);
    } else {
      setActiveFilter(`category:${categoryName}`);
      if (setCurrentView) {
        setCurrentView('main');
      }
      setTimeout(() => {
        const element = document.querySelector('#deadline-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setDropdownOpen(false);
  };

  const handleGroupClick = (groupName: 'POP' | 'SPORTS' | 'ANALOG') => {
    if (onNavigateToCategoryPage) {
      onNavigateToCategoryPage(groupName, 'all');
    } else {
      setActiveFilter(`all_group:${groupName}`);
      if (setCurrentView) {
        setCurrentView('main');
      }
      setTimeout(() => {
        const element = document.querySelector('#deadline-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setDropdownOpen(false);
  };

  const popSubcats = INITIAL_CATEGORIES.filter(c => c.group === 'POP');
  const sportsSubcats = INITIAL_CATEGORIES.filter(c => c.group === 'SPORTS');
  const analogSubcats = INITIAL_CATEGORIES.filter(c => c.group === 'ANALOG');

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      
      {/* 샥 머니 탑바 */}
      <div className="w-full bg-gray-50/50 border-b border-gray-100 py-2">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between text-[11px] font-sans text-gray-500">
          <div className="flex items-center gap-1.5 select-none">
            <span className="font-semibold text-gray-500">즐겁고 친근한 애장품 거래, 샥!</span>
          </div>
          
          {/* 우측 로그인, 회원가입, 고객센터 */}
          <div className="flex items-center gap-2 text-[11px] font-sans">
            {isLoggedIn ? (
              <>
                <span className="text-gray-400 font-medium select-none cursor-default">
                  <span className="text-gray-700 font-bold">{userNickname}</span>님
                </span>
                <span className="text-gray-200 select-none">|</span>
                <button 
                  onClick={onLogout}
                  className="hover:text-red-500 text-gray-600 transition-colors font-medium cursor-pointer outline-none border-none bg-transparent"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onNavigateToSignup}
                  className="text-gray-600 hover:text-black transition-colors font-medium cursor-pointer outline-none border-none bg-transparent"
                >
                  회원가입
                </button>
                <span className="text-gray-200 select-none">|</span>
                <button 
                  onClick={onNavigateToLogin}
                  className="text-gray-600 hover:text-black transition-colors font-medium cursor-pointer outline-none border-none bg-transparent"
                >
                  로그인
                </button>
              </>
            )}
            <span className="text-gray-200 select-none">|</span>
            <div className="relative group cursor-pointer flex items-center gap-0.5 text-gray-600 hover:text-black transition-colors font-medium select-none">
              <span className="py-2">고객센터</span>
              <span className="text-[8px] font-light">▼</span>
              
              <div className="absolute right-0 top-full -mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left font-sans">
                <button onClick={() => setCurrentView && setCurrentView('notice')} className="w-full text-left block px-4 py-2 hover:bg-slate-50 font-medium text-[13px] text-gray-700 hover:text-black transition-colors bg-white border-none cursor-pointer">공지사항</button>
                <button onClick={() => setCurrentView && setCurrentView('faq')} className="w-full text-left block px-4 py-2 hover:bg-slate-50 font-medium text-[13px] text-gray-700 hover:text-black transition-colors bg-white border-none cursor-pointer">자주하는 질문</button>
                <button onClick={() => setCurrentView && setCurrentView('inquiry')} className="w-full text-left block px-4 py-2 hover:bg-slate-50 font-medium text-[13px] text-gray-700 hover:text-black transition-colors bg-white border-none cursor-pointer">1:1 문의</button>
                <button onClick={() => setCurrentView && setCurrentView('report')} className="w-full text-left block px-4 py-2 hover:bg-slate-50 font-medium text-[13px] text-gray-700 hover:text-black transition-colors bg-white border-none cursor-pointer">신고하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1단 상단 헤더: [로고윈도우] ----- [중앙 검색창] ----- [우측 회원기능 및 출품버튼] */}
      <div className="w-full max-w-7xl mx-auto h-[80px] px-6 md:px-8 flex items-center justify-between gap-4 md:gap-8 relative">
        
        {/* [좌측]: 로고 */}
        <div 
          onClick={() => {
            if (setCurrentView) setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center cursor-pointer select-none group flex-shrink-0"
        >
          <div className="text-left flex items-center">
            <h1 className="font-display font-black text-2xl md:text-[28px] tracking-tighter select-none leading-none flex items-center gap-1.5">
              <span className="text-black">PLATFORM</span>
              <span className="text-[#EF4444]">SHOCK</span>
            </h1>
          </div>
        </div>

        {/* [중앙]: 가로로 충분히 긴 검색창 (데스크숍 느낌의 라운드) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[560px] select-none z-10">
          <div className="w-full relative">
            <input 
              type="text"
              placeholder="애장품, 카테고리, 키워드 검색"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (setCurrentView) {
                  setCurrentView('main');
                }
                const target = document.querySelector('#deadline-section');
                if (target && e.target.value) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full px-5 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer animate-fade-in"
              >
                <X size={16} />
              </button>
            )}
            <button 
              onClick={() => {
                if (setCurrentView) {
                  setCurrentView('main');
                }
                const target = document.querySelector('#deadline-section');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer p-1"
              title="검색 실행"
            >
              <Search size={20} className="stroke-[2]" />
            </button>
          </div>
        </div>

        {/* [우측]: 찜, 알림, 마이페이지, 출품버튼 */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* 모바일 돋보기 */}
          <button 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer relative"
            title="상품 검색"
          >
            <Search size={20} className="stroke-[2]" />
          </button>

          {/* 찜 목록 */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                alert('찜목록을 이용하시려면 로그인이 필요합니다.');
                onNavigateToLogin();
                return;
              }
              onOpenLikesModal();
            }}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors relative cursor-pointer hidden sm:block"
            title="관심목록"
          >
            <Heart size={20} className="stroke-[2]" />
          </button>

          {/* 알림 가이드 */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                alert('알림 기능을 이용하시려면 로그인이 필요합니다.');
                onNavigateToLogin();
                return;
              }
              onOpenNotificationsModal();
            }}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors relative cursor-pointer font-sans"
            title="알림"
          >
            <Bell size={20} className="stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </button>

          {/* 마이페이지 */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                alert('마이페이지를 이용하시려면 로그인이 필요합니다.');
                onNavigateToLogin();
                return;
              }
              if (setCurrentView) {
                setCurrentView('mypage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                onOpenMyPageModal();
              }
            }}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentView === 'mypage'
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title="마이페이지"
          >
            <User size={20} className="stroke-[2]" />
          </button>

          {/* 출품하기 버튼 */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert('애장품 출품을 하시려면 로그인이 필요합니다.');
                onNavigateToLogin();
                return;
              }
              if (onNavigateToListProduct) {
                onNavigateToListProduct();
              } else {
                onOpenSellModal();
              }
            }}
            className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-extrabold h-11 px-5 rounded-full flex items-center justify-center shadow-sm transition-colors font-sans select-none border-none ml-2"
          >
            출품하기
          </button>
        </div>
      </div>

      {/* 2단 하단 네비게이션: [전체 카테고리 | 추천 Hot | 마감임박 | 커뮤니티 | 이벤트] (좌측 정렬) */}
      <div className="hidden md:flex w-full bg-white border-b border-gray-200 h-[52px] relative justify-start z-40">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-start gap-8 lg:gap-11 text-[15px] font-bold relative h-full">
          
          {/* 전체 카테고리 */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-1.5 h-full transition-all cursor-pointer border-b-2 ${
              dropdownOpen ? 'text-gray-900 border-gray-900' : 'text-gray-900 border-transparent hover:text-gray-600'
            }`}
          >
            <Menu size={18} className={dropdownOpen ? 'text-gray-900' : 'text-gray-600'} />
            <span>전체 카테고리</span>
          </button>

          {/* 추천 */}
          <button 
            onClick={() => handleScrollToSection('#recommendation-bento')}
            className="text-gray-900 hover:text-gray-600 h-full border-b-2 border-transparent transition-all cursor-pointer flex items-center gap-1 relative"
          >
            <span>추천</span>
            <span className="absolute top-[14px] -right-2 h-[5px] w-[5px] rounded-full bg-red-500 select-none" />
          </button>

          {/* 마감임박 */}
          <button 
            onClick={() => {
              setSortBy('endingSoon');
              handleScrollToSection('#deadline-section');
            }}
            className="text-gray-900 hover:text-gray-600 h-full border-b-2 border-transparent transition-all cursor-pointer flex items-center gap-1 relative"
          >
            <span>마감임박</span>
            <span className="absolute top-[14px] -right-2 h-[5px] w-[5px] rounded-full bg-red-500 select-none" />
          </button>

          {/* 랭킹 */}
          <button 
            onClick={() => {
              if (setCurrentView) setCurrentView('ranking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-full transition-all cursor-pointer flex items-center gap-1 relative border-b-2 ${
              currentView === 'ranking' ? 'text-gray-900 border-gray-900' : 'text-gray-900 hover:text-gray-600 border-transparent'
            }`}
          >
            <span>랭킹</span>
          </button>

          {/* 시세 */}
          <button 
            onClick={() => {
              if (setCurrentView) setCurrentView('market_trend');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-full transition-all cursor-pointer flex items-center gap-1 relative border-b-2 ${
              currentView === 'market_trend' ? 'text-gray-900 border-gray-950 font-extrabold' : 'text-gray-900 hover:text-gray-600 border-transparent'
            }`}
          >
            <span>시세</span>
            <span className="absolute top-[14px] -right-2 h-[5px] w-[5px] rounded-full bg-emerald-500 select-none animate-pulse" />
          </button>

          {/* 커뮤니티 */}
          <button 
            onClick={() => {
              if (setCurrentView) setCurrentView('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-full transition-all cursor-pointer border-b-2 ${
              currentView === 'community' ? 'text-blue-600 border-blue-600' : 'text-gray-900 hover:text-gray-600 border-transparent'
            }`}
          >
            커뮤니티
          </button>

          {/* 이벤트 */}
          <button 
            onClick={() => {
              if (setCurrentView) setCurrentView('event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-full transition-all cursor-pointer border-b-2 ${
              currentView === 'event' ? 'text-gray-900 border-gray-900' : 'text-gray-900 hover:text-gray-600 border-transparent'
            }`}
          >
            이벤트
          </button>

          {/* 공지사항 */}
          <button 
            onClick={() => {
              if (setCurrentView) setCurrentView('notice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-full transition-all cursor-pointer border-b-2 ${
              currentView === 'notice' ? 'text-gray-900 border-gray-900' : 'text-gray-900 hover:text-gray-600 border-transparent'
            }`}
          >
            공지사항
          </button>

          {/* 메가 카테고리 팝업 */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30 cursor-default bg-transparent" 
                onClick={() => setDropdownOpen(false)}
              />
              <div 
                className="absolute top-full left-4 lg:left-8 w-[980px] max-w-[95vw] bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 z-50 animate-fade-in grid grid-cols-3 gap-8 text-left border-t-4 border-t-gray-300 mt-1"
              >
              {/* 대중문화 / POP Culture */}
              <div className="space-y-4">
                <button
                  onClick={() => handleGroupClick('POP')}
                  className="w-full text-left font-display font-black text-xs sm:text-sm tracking-wider text-gray-900 border-b border-gray-200 pb-2 hover:text-red-500 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-sans font-black text-slate-850 text-[14px]">대중문화</span>
                    <span className="text-[10px] text-gray-400 font-bold font-mono">POP Culture</span>
                  </span>
                  <span className="bg-gray-100 text-gray-900 hover:bg-gray-800 hover:text-white transition-all text-[8px] font-mono font-black px-2 py-0.5 rounded-full select-none">GO</span>
                </button>
                <div className="grid grid-cols-1 gap-2">
                  {popSubcats.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex items-center w-full px-4 py-3 h-[42px] rounded-xl text-left text-xs font-bold text-slate-705 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer border border-transparent hover:border-gray-200 shadow-sm hover:shadow-sm"
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 스포츠 / SPORTS */}
              <div className="space-y-4 border-l border-gray-100 pl-6">
                <button
                  onClick={() => handleGroupClick('SPORTS')}
                  className="w-full text-left font-display font-black text-xs sm:text-sm tracking-wider text-gray-900 border-b border-gray-200 pb-2 hover:text-gray-900 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-sans font-black text-slate-850 text-[14px]">스포츠</span>
                    <span className="text-[10px] text-gray-400 font-bold font-mono">SPORTS</span>
                  </span>
                  <span className="bg-gray-100 text-gray-900 hover:bg-gray-800 hover:text-white transition-all text-[8px] font-mono font-black px-2 py-0.5 rounded-full select-none">GO</span>
                </button>
                <div className="grid grid-cols-1 gap-2">
                  {sportsSubcats.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex items-center w-full px-4 py-3 h-[42px] rounded-xl text-left text-xs font-bold text-slate-705 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer border border-transparent hover:border-gray-200 shadow-sm hover:shadow-sm"
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 아날로그 / ANALOG */}
              <div className="space-y-4 border-l border-gray-100 pl-6">
                <button
                  onClick={() => handleGroupClick('ANALOG')}
                  className="w-full text-left font-display font-black text-xs sm:text-sm tracking-wider text-gray-900 border-b border-gray-200 pb-2 hover:text-yellow-600 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-sans font-black text-slate-850 text-[14px]">아날로그</span>
                    <span className="text-[10px] text-gray-400 font-bold font-mono">ANALOG</span>
                  </span>
                  <span className="bg-gray-100 text-gray-900 hover:bg-gray-800 hover:text-white transition-all text-[8px] font-mono font-black px-2 py-0.5 rounded-full select-none">GO</span>
                </button>
                <div className="grid grid-cols-1 gap-2">
                  {analogSubcats.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex items-center w-full px-4 py-3 h-[42px] rounded-xl text-left text-xs font-bold text-slate-705 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer border border-transparent hover:border-gray-200 shadow-sm hover:shadow-sm"
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>

      {/* 모바일 검색바 */}
      {mobileSearchOpen && (
        <div className="w-full bg-gray-50 border-t border-gray-100 px-4 py-3 select-none flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="피규어, 빈티지토이, 희귀 LP 등 만능 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (setCurrentView) {
                  setCurrentView('main');
                }
                const target = document.querySelector('#deadline-section');
                if (target && e.target.value) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }}
              className="w-full h-9 bg-white border border-gray-200 rounded-xl px-4 pr-10 text-[11px] font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800">
              <Search size={14} className="stroke-2" />
            </div>
          </div>
          <button 
            onClick={() => setMobileSearchOpen(false)}
            className="text-[10px] font-black text-gray-500 hover:text-gray-900"
          >
            닫기
          </button>
        </div>
      )}

      {/* 모바일 5개 메뉴 탭 리스트 바 */}
      <div className="md:hidden w-full border-t border-gray-200 overflow-x-auto select-none no-scrollbar bg-gray-50/60 py-2">
        <div className="flex items-center gap-3 px-4 min-w-max">
          
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 text-[10px] font-black bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-900 relative cursor-pointer"
          >
            <Menu size={11} className="text-gray-800" />
            <span>전체 카테고리</span>
            {dropdownOpen && (
              <span className="absolute -bottom-1 left-12 w-2 h-2 bg-gray-300 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleScrollToSection('#recommendation-bento')}
            className="text-[10px] font-black bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-900 flex items-center gap-1"
          >
            <span>추천</span>
            <span className="bg-red-500 text-white font-mono text-[7px] px-1 rounded-sm">HOT</span>
          </button>

          <button
            onClick={() => {
              setSortBy('endingSoon');
              handleScrollToSection('#deadline-section');
            }}
            className="text-[10px] font-black bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-900"
          >
            마감임박
          </button>

          <button
            onClick={() => {
              if (setCurrentView) setCurrentView('ranking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[10px] font-black border rounded-full px-3 py-1.5 font-sans ${
              currentView === 'ranking' 
                ? 'bg-black border-black text-white font-extrabold' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            랭킹
          </button>

          <button
            onClick={() => {
              if (setCurrentView) setCurrentView('market_trend');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[10px] font-black border rounded-full px-3 py-1.5 font-sans ${
              currentView === 'market_trend' 
                ? 'bg-emerald-600 border-emerald-600 text-white font-extrabold' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            시세
          </button>

          <button
            onClick={() => {
              if (setCurrentView) setCurrentView('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[10px] font-black border rounded-full px-3 py-1.5 font-sans ${
              currentView === 'community' 
                ? 'bg-blue-50 border-blue-200 text-[#2962ff]' 
                : 'bg-white border-blue-100 text-[#2962ff] hover:bg-blue-50/40'
            }`}
          >
            커뮤니티
          </button>

          <button
            onClick={() => {
              if (setCurrentView) setCurrentView('event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[10px] font-black border rounded-full px-3 py-1.5 font-sans flex items-center gap-0.5 ${
              currentView === 'event' 
                ? 'bg-gray-100 border-gray-200 text-gray-900' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <span>이벤트</span>
          </button>

          <button
            onClick={() => {
              if (setCurrentView) setCurrentView('notice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-[10px] font-black border rounded-full px-3 py-1.5 font-sans flex items-center gap-0.5 ${
              currentView === 'notice' 
                ? 'bg-gray-100 border-gray-200 text-gray-900' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <span>공지사항</span>
          </button>

        </div>
      </div>

    </header>
  );
}

import React from 'react';
import { Sparkles, Trophy, Camera, ArrowRight } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/mockData';

interface CategorySectionProps {
  onSelectCategory: (name: string) => void;
  activeFilter: string;
  onNavigateToCategoryPage: (group: 'POP' | 'SPORTS' | 'ANALOG', subCategory?: string) => void;
}

export default function CategorySection({ 
  onSelectCategory, 
  activeFilter,
  onNavigateToCategoryPage
}: CategorySectionProps) {
  const popCategories = INITIAL_CATEGORIES.filter(c => c.group === 'POP');
  const sportsCategories = INITIAL_CATEGORIES.filter(c => c.group === 'SPORTS');
  const analogCategories = INITIAL_CATEGORIES.filter(c => c.group === 'ANALOG');

  const groups = [
    {
      key: 'POP',
      title: 'POP Culture',
      subtitle: '대중문화 • 애니메이션 • 피규어 • 아티스트 굿즈',
      description: '트렌디한 서브컬처 완구 및 한정 특전 피규어 컬렉션 목록',
      bgColor: 'bg-white border-gray-150',
      tagColor: 'bg-black text-white px-2.5 py-0.5',
      icon: <Sparkles className="text-black" size={18} />,
      categories: popCategories
    },
    {
      key: 'SPORTS',
      title: 'SPORTS Collectibles',
      subtitle: '스포츠카드 • 레트로 유니폼 • 한정판 스니커즈',
      description: '선수들의 명장면 카드 및 전설적 구단의 사인 친필 유니폼',
      bgColor: 'bg-white border-gray-150',
      tagColor: 'bg-black text-white px-2.5 py-0.5',
      icon: <Trophy className="text-black" size={18} />,
      categories: sportsCategories
    },
    {
      key: 'ANALOG',
      title: 'ANALOG Hobbies',
      subtitle: '희귀 바이닐 LP • 수동 필름카메라 • 구권 화폐',
      description: '클래식 필름 수동 작동 감성 및 구시대 귀중 레트로 전자기기',
      bgColor: 'bg-white border-gray-150',
      tagColor: 'bg-black text-white px-2.5 py-0.5',
      icon: <Camera className="text-black" size={18} />,
      categories: analogCategories
    }
  ];

  return (
    <section id="category-section" className="w-full py-12 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-mono border border-gray-200 px-3 py-1 bg-white rounded-full mb-4">
            COLLECTION PORTFOLIOS
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-black tracking-tight mt-6">
            취향 저격 테마별 한정판 소장품
          </h2>
          <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto">
            시간이 흐를수록 가치를 더하는 소장품들을 카테고리별로 둘러보세요.
          </p>
        </div>

        {/* 3-Way Grid Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {groups.map((grp) => (
            <div
              key={grp.key}
              onClick={() => onNavigateToCategoryPage(grp.key as 'POP' | 'SPORTS' | 'ANALOG')}
              className={`relative border rounded-3xl p-6 ${grp.bgColor} transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden group cursor-pointer hover:border-black/30 hover:-translate-y-0.5`}
            >
              <div>
                {/* Header elements */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold border rounded-full px-3 py-1 font-sans ${grp.tagColor}`}>
                    {grp.key}
                  </span>
                </div>

                <h3 className="font-sans font-extrabold text-lg text-gray-900 mb-1 group-hover:text-black transition-colors">
                  {grp.title}
                </h3>
                <p className="text-[11px] text-gray-400 mb-3 font-semibold">{grp.subtitle}</p>
                
                <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                  {grp.description}
                </p>

                {/* Subcategory list buttons */}
                <div className="space-y-2">
                  {grp.categories.map((subcat) => {
                    const isSelected = activeFilter === `category:${subcat.name}`;
                    return (
                      <button
                        key={subcat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToCategoryPage(grp.key as 'POP' | 'SPORTS' | 'ANALOG', subcat.name);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                          isSelected 
                            ? 'bg-black border-black text-white font-extrabold shadow-md' 
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm select-none">{subcat.icon}</span>
                          <span className="text-xs">{subcat.name}</span>
                        </div>
                        <span className={`text-[9px] font-medium tracking-tighter ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                          #{subcat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View Group and Filter footer */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToCategoryPage(grp.key as 'POP' | 'SPORTS' | 'ANALOG');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 border border-gray-200 text-xs font-bold text-gray-800 hover:text-black transition-all cursor-pointer"
                >
                  <span>{grp.key} 경매 목록 전체보기 (더보기)</span>
                  <ArrowRight size={12} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

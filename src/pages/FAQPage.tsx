import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

const FAQ_DATA = [
  {
    category: '경매/입찰',
    question: '입찰 후 취소할 수 있나요?',
    answer: '경매 공정성을 위해 입찰 후 임의 취소는 제한됩니다. 단, 시스템 오류나 운영 정책에 해당하는 경우 고객센터 문의를 통해 확인할 수 있습니다.'
  },
  {
    category: '즉시낙찰',
    question: '즉시낙찰은 무엇인가요?',
    answer: '판매자가 즉시낙찰가를 설정한 상품에 대해 구매자가 해당 금액으로 바로 낙찰받을 수 있는 기능입니다.'
  },
  {
    category: '배송/방문수거',
    question: '샥 계약택배 방문수거는 어떻게 진행되나요?',
    answer: '판매자가 방문수거를 신청하면 지정한 수거일과 장소에 맞춰 계약 택배사가 상품을 수거하는 방식입니다. 포장 완료 사진과 수거 장소 사진을 등록해야 합니다.'
  },
  {
    category: '환불/구매확정',
    question: '상품 수령 후 환불은 언제까지 가능한가요?',
    answer: '상품 수령완료 후 3일 이내 환불요청이 가능합니다. 구매확정을 완료하면 일반 환불 요청은 제한됩니다.'
  },
  {
    category: '결제/쿠폰',
    question: '쿠폰은 어디서 사용할 수 있나요?',
    answer: '낙찰 결제 또는 즉시낙찰 결제 화면에서 보유 쿠폰을 선택해 적용할 수 있습니다.'
  },
  {
    category: '계정/커뮤니티',
    question: '커뮤니티에서 상품을 공유할 수 있나요?',
    answer: '소모임 채팅방에서 내 출품 상품을 첨부하면 다른 사용자가 상품 카드 클릭을 통해 상세페이지로 이동할 수 있습니다.'
  }
];

const CATEGORIES = ['전체', '경매/입찰', '즉시낙찰', '결제/쿠폰', '배송/방문수거', '환불/구매확정', '계정/커뮤니티'];

export default function FAQPage({ onBack }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (idx: number) => {
    setOpenItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesQuery = faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    const matchesCat = activeCategory === '전체' || faq.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="max-w-[1180px] w-full mx-auto px-6 py-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-8 cursor-pointer inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors" onClick={onBack}>
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">메인 홈으로 돌아가기</span>
        </div>
        
        <div className="mb-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold leading-none">고객센터</span>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">자주하는 질문</h2>
          <p className="text-gray-500 font-medium">샥 이용 중 자주 묻는 질문을 확인해보세요.</p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          
          <div className="flex flex-col gap-6 mb-8">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="궁금한 내용을 검색해보세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] pl-10 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors font-sans"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    activeCategory === cat 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredFaqs.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                검색 결과가 없습니다.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openItems.includes(idx);
                return (
                  <div key={idx} className="py-4">
                    <button 
                      onClick={() => toggleItem(idx)}
                      className="w-full flex items-center justify-between text-left focus:outline-none group gap-4"
                    >
                      <div className="flex flex-col gap-1.5 flex-1 pr-4">
                        <span className="text-[11px] font-bold text-rose-500">{faq.category}</span>
                        <h4 className={`font-bold text-[15px] transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-black'}`}>
                          {faq.question}
                        </h4>
                      </div>
                      <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-gray-50 text-[14px] leading-relaxed text-gray-600 bg-gray-50/50 p-4 rounded-xl">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

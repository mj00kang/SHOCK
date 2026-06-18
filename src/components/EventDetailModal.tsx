import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { LuckyEventState, getOrders, isLuckyShockEvent } from '../utils/storageUtils';

interface EventDetailModalProps {
  event: LuckyEventState;
  onClose: () => void;
  currentUserNickname: string;
  userApplied: boolean;
  onApply: (eventId: string) => void;
}

export default function EventDetailModal({
  event,
  onClose,
  currentUserNickname,
  userApplied,
  onApply
}: EventDetailModalProps) {
  const isLuckyRaffle = isLuckyShockEvent(event);
  const isEnded = event.status === 'ended' || event.status === 'drawn' || event.status === 'closed' || event.status === 'completed';

  // Check if claimed
  const [isClaimed, setIsClaimed] = useState(false);
  useEffect(() => {
    if (isLuckyRaffle && isEnded) {
      const orders = getOrders();
      const claimed = orders.some(o => o.productId === event.id && o.orderType === 'lucky_win');
      setIsClaimed(claimed);
    }
  }, [event.id, isEnded, isLuckyRaffle]);

  const hasWon = event.winners.includes(currentUserNickname);

  const luckyShockTitleMap: Record<string, string> = {
    "lucky-001": "나이키 × 피스마이너스원 에어포스 1",
    "lucky-002": "빅뱅 미니앨범 3집",
    "lucky-003": "콘탁스 T3 티타늄 블랙",
    "lucky-004": "한정판 헤리티지 액션 피규어"
  };

  const getLuckyShockDisplayTitle = (ev: any) => {
    const id = String(ev.id || "");
    if (luckyShockTitleMap[id]) return luckyShockTitleMap[id];
    
    const rawName = ev.productName || ev.targetProductName || ev.prizeName || ev.title || "";
    if (rawName && !String(rawName).includes("100원 응모 이벤트")) {
      return String(rawName).replace(/^[|]$/g, "").replace(/^대상 상품[:：]?\s*/g, "").trim();
    }
    return "럭키샥 대상 상품";
  };

  // Format the title to focus on the product name for Lucky Shock events
  let displayTitle = event.title;
  let shortProductName = event.productName;

  if (isLuckyRaffle) {
    displayTitle = `🎁 [LUCKY 샥] ${getLuckyShockDisplayTitle(event)}`;

    const shortMap: Record<string, string> = {
      "lucky-001": "한정판 스니커즈",
      "lucky-002": "레어 앨범",
      "lucky-003": "빈티지 카메라",
      "lucky-004": "한정판 피규어"
    };
    if (shortMap[event.id]) {
        shortProductName = shortMap[event.id];
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="event-detail-modal">
      <div 
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Event Image */}
        <div className="relative h-48 md:h-56 bg-gray-100 flex-shrink-0">
          <img 
            src={event.image} 
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
            <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full w-fit mb-2 border ${
              isLuckyRaffle ? 'bg-red-500 border-rose-300 text-white animate-bounce' : 'bg-gray-800 border-gray-300 text-white'
            }`}>
              {event.eventType}
            </span>
            <h2 
              className="text-white text-lg md:text-2xl font-sans font-black drop-shadow-sm max-w-[90%]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.35
              }}
            >
              {displayTitle}
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-5">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl text-left text-xs text-slate-650">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">진행 기간</span>
              <div className="flex items-center gap-1.5 font-sans font-medium text-gray-900">
                <Calendar size={13} className="text-gray-800" />
                <span>{event.startAt.split('T')[0]} ~ {event.endAt.split('T')[0]}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">참가 정보</span>
              <div className="flex items-center gap-1.5 font-sans font-medium text-gray-900">
                <Users size={13} className="text-gray-800" />
                <span>현재 참여자: <strong className="font-mono text-gray-900">{event.participants.length}</strong>명</span>
              </div>
            </div>
          </div>

          {/* Event Content Description */}
          <div className="text-left space-y-3">
            <h3 className="font-sans font-bold text-gray-900 text-sm">상세 소개</h3>
            <p className="text-xs text-slate-650 leading-relaxed font-sans whitespace-pre-wrap bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {event.content}
            </p>
          </div>

          {/* Condition Box */}
          <div className="bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-2xl text-left text-xs space-y-1">
            <strong className="text-yellow-800 font-bold block">💡 이벤트 안내 사항</strong>
            <p className="text-gray-600 leading-normal font-sans">
              {isLuckyRaffle ? (
                '이 이벤트는 100 포인트를 사용하여 선결제 예약 형식으로 응모됩니다. 매주 진행되는 공정한 기계식 난수 추첨을 거쳐 단 한 명의 유저가 100원에 최종 낙찰받게 됩니다. 탈락 시 응모에 소요된 100원은 즉시 보정 반환됩니다.'
              ) : (
                '컬렉터들의 교람과 안심 교환을 돕기 위해 샥에서 보증 및 지원하는 프로모션입니다. 별도의 참가 수수료는 없으며 자유롭고 편안한 수집 커뮤니케이션을 지향합니다.'
              )}
            </p>
          </div>

        </div>

        {/* Clickable CTA Drawer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col items-center">
          {isEnded ? (
            <div className="w-full text-center py-2 bg-gray-200 rounded-xl text-gray-500 text-xs font-bold font-sans">
              이벤트가 성공적으로 마감되었습니다.
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-slate-450 block font-mono font-medium">참가 금액</span>
                <span className="text-sm font-sans font-black text-red-500">
                  {event.eventPrice > 0 ? `${event.eventPrice.toLocaleString()}원` : '참가비 무료'}
                </span>
              </div>

              <button
                disabled={userApplied}
                onClick={() => {
                  onApply(event.id);
                }}
                className={`cursor-pointer font-sans font-black text-xs px-6 py-3 rounded-xl transition-all ${
                  userApplied 
                    ? 'bg-emerald-100 border border-emerald-200 text-emerald-700 cursor-default' 
                    : 'bg-red-500 hover:bg-rose-600 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {userApplied ? '✓ 참여(응모) 완료' : isLuckyRaffle ? '🎁 100원 응모 신청' : '참여하기 후 입장'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

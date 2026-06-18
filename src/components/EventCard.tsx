import React from 'react';
import { Gift, Users, Calendar, HelpCircle, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { LuckyEventState, isLuckyShockEvent } from '../utils/storageUtils';

interface EventCardProps {
  event: LuckyEventState;
  userApplied: boolean;
  onSelect: (event: LuckyEventState) => void;
  onApply: (eventId: string) => void;
  isAdmin?: boolean;
  onDraw?: (eventId: string) => void;
  key?: string;
}

export default function EventCard({
  event,
  userApplied,
  onSelect,
  onApply,
  isAdmin,
  onDraw
}: EventCardProps) {
  const isLucky = isLuckyShockEvent(event);
  const isDrawn = event.status === 'drawn';
  const isEnded = event.status === 'ended' || isDrawn || event.status === 'closed' || event.status === 'completed';

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
  if (isLucky) {
    displayTitle = `🎁 [LUCKY 샥] ${getLuckyShockDisplayTitle(event)}`;
  }

  return (
    <div 
      onClick={() => onSelect(event)}
      className={`relative bg-white border rounded-[20px] overflow-hidden cursor-pointer flex flex-col md:flex-row p-[24px] gap-[24px] min-h-[220px] transition-all duration-300 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
        isEnded 
          ? 'border-[#E5E7EB] bg-gray-50 opacity-90' 
          : 'border-[#E5E7EB] hover:border-gray-300 hover:scale-[1.01]'
      }`}
    >
      {/* Image Block */}
      <div className="relative w-full md:w-44 h-44 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={event.image} 
          alt={event.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            isEnded ? 'grayscale' : ''
          }`}
        />
        
        {/* Floating cost badge specifically for Lucky Shark */}
        {isLucky && (
          <div className="absolute top-2.5 left-2.5 bg-red-500 text-white font-sans font-bold text-[11px] px-[10px] py-[4px] rounded-lg shadow-sm">
            응모가 100원
          </div>
        )}
      </div>

      {/* Narrative Section */}
      <div className="flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Header State Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
              isEnded 
                ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]' 
                : isLucky 
                  ? 'bg-rose-50 border-rose-100 text-rose-600' 
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827]'
            }`}>
              {isEnded ? '참여 완료됨' : '진행 대기중'}
            </span>

            <span className="text-[12px] text-[#6B7280] font-sans flex items-center gap-1.5 font-medium">
              <Calendar size={14} />
              <span>{event.startAt.split('T')[0]} ~ {event.endAt.split('T')[0]}</span>
            </span>
          </div>

          <h3 
            className="event-card-title font-sans font-black text-[#111827] text-[16px] md:text-[18px] mt-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.35
            }}
          >
            {displayTitle}
          </h3>

          <p className="text-[13px] text-[#6B7280] mt-2 line-clamp-2 md:line-clamp-2 font-sans leading-relaxed">
            {event.description}
          </p>

          {/* Participants Gauge */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-[#374151] font-sans">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-[#6B7280]" />
              <span>참여자 <strong className="font-bold text-[#111827]">{event.participants.length}</strong>명</span>
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
          <div className="text-[12px] font-sans text-[#6B7280] font-medium">
            {userApplied ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>추첨 예정</span>
              </span>
            ) : (
              <span>이벤트 내용을 상세히 확인해 보세요.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(event)}
              className={`cursor-pointer font-sans font-bold text-[13px] h-[36px] px-[16px] rounded-[10px] transition-all border ${
                userApplied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isEnded
                    ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]'
                    : isLucky
                      ? 'bg-[#111827] border-[#111827] text-white hover:bg-gray-800'
                      : 'bg-white hover:bg-gray-50 border-[#E5E7EB] text-[#111827]'
              }`}
            >
              {userApplied ? '참여 완료됨' : isEnded ? '종료됨' : isLucky ? '응모접수' : '이벤트 상세보기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

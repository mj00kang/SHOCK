import React, { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { LuckyEventState, getOrders } from '../utils/storageUtils';

interface LuckyEventCardProps {
  key?: string;
  event: LuckyEventState;
  onApply: (eventId: string) => void;
  onDraw: (eventId: string) => void;
  onClaim: (eventId: string, finalPrice: number) => void;
  currentUserId: string;
  currentUserNickname: string;
  userApplied: boolean;
  isAdmin: boolean;
}

export default function LuckyEventCard({
  event,
  onApply,
  onDraw,
  onClaim,
  currentUserId,
  currentUserNickname,
  userApplied,
  isAdmin
}: LuckyEventCardProps) {
  const [timeLeft, setTimeLeft] = useState('');

  // Countdowns ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(event.endAt).getTime();
      const diff = end - Date.now();

      if (diff <= 0 || event.status === 'drawn') {
        setTimeLeft('응모 마감 또는 추첨 완료');
        clearInterval(timer);
        return;
      }

      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`);
    }, 1000);

    return () => clearInterval(timer);
  }, [event.endAt, event.status]);

  const hasWon = event.winners.includes(currentUserNickname);
  const isDrawn = event.status === 'drawn';

  // State checks for virtual receipt
  const [isClaimed, setIsClaimed] = useState(false);
  useEffect(() => {
    const orders = getOrders();
    const claimed = orders.some(o => o.productId === event.id && o.orderType === 'lucky_win');
    setIsClaimed(claimed);
  }, [event.id, isDrawn]);

  return (
    <div className={`relative w-full bg-white border ${
      isDrawn && hasWon ? 'border-yellow-400 shadow-md ring-2 ring-yellow-50' : 'border-gray-200 shadow-sm hover:border-gray-300'
    } rounded-2xl overflow-hidden p-5 transition-all flex flex-col justify-between hover:-translate-y-1 hover:shadow-md duration-300 h-full`}>
      
      {/* Upper color strip for celebration */}
      {isDrawn && hasWon && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-rose-400 to-gray-300 animate-pulse z-10" />
      )}

      {/* Main card content */}
      <div className="flex flex-col flex-grow">
        {/* Floating image section */}
        <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 mb-4 flex items-center justify-center">
          <img
            src={event.image}
            alt={event.productName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Coral red floating price sticker */}
          <div className="absolute top-2.5 left-2.5 bg-[#EF4444] text-white font-mono text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
            RAFFLE 100원
          </div>

          {/* Countdown timer badge overlay */}
          {!isDrawn && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
              ⏱️ {timeLeft}
            </div>
          )}
        </div>

        {/* Right description block */}
        <div className="flex-grow flex flex-col justify-between w-full text-left">
          <div>
            {/* Header row metadata */}
            <h3 className="font-display font-extrabold text-gray-900 text-sm md:text-base mb-1.5 leading-snug line-clamp-2" title={event.title}>
              {event.title}
            </h3>
            
            <p className="text-xs text-gray-500 mb-3 leading-normal">
              대상 애장품: <span className="font-bold text-gray-900 border-b border-gray-300 line-clamp-1">{event.productName}</span>
            </p>

            {/* Real-time counters metrics info panel */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-sans mb-4 bg-gray-55 p-2.5 rounded-xl border border-gray-100 w-full justify-between">
              <span className="flex items-center gap-1.5">
                <Users size={12} className="text-gray-850" />
                <span>참가 <strong className="text-gray-900 font-mono font-bold">{event.participants.length}</strong>명</span>
              </span>
              <span className="text-slate-300 select-none">|</span>
              <span className="flex items-center gap-1.5">
                <Trophy size={11} className="text-yellow-500" />
                <span>당첨 인원 <strong className="text-gray-900 font-mono font-bold">{event.winnerCount}</strong>명</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower dynamic buttons segment */}
      <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 mt-auto w-full">
        {!isDrawn ? (
          // Pre-draw application menu
          <div className="w-full">
            {userApplied ? (
              <span className="text-emerald-600 font-bold flex items-center justify-center gap-1 bg-emerald-50 px-2.5 py-2.5 rounded-xl border border-emerald-150 w-full text-xs font-sans">
                <CheckCircle2 size={13} />
                <span>응모 완료! 발표 대기 중</span>
              </span>
            ) : (
              <button
                onClick={() => onApply(event.id)}
                className="w-full cursor-pointer text-xs font-extrabold font-sans py-2.5 px-4 rounded-xl transition-all bg-red-500 hover:bg-rose-600 border border-transparent text-white shadow-sm hover:shadow-md text-center"
              >
                🎁 단돈 100원 응모 접수
              </button>
            )}
          </div>
        ) : (
          // Post-draw results section
          <div className="w-full">
            <div className="flex flex-col gap-2.5 w-full bg-gray-55 p-3 rounded-xl border border-gray-200">
              <div className="text-xs text-center">
                <span className="block text-gray-500 mb-1">🎉 행운의 최종 낙찰자:</span>
                <strong className="text-yellow-800 font-black bg-yellow-100/70 border border-yellow-250 px-2.5 py-1 rounded-md inline-block">
                  {event.winners.join(', ') || '참가자 부재로 불당첨'}
                </strong>
              </div>

              {/* Reward virtual payment claim buttons */}
              <div className="w-full flex justify-center">
                {hasWon ? (
                  isClaimed ? (
                    <span className="text-[11px] text-gray-900 font-bold flex items-center gap-1 bg-gray-100 px-2.5 py-1.5 border border-gray-200 rounded-lg w-full justify-center">
                      <Sparkles size={12} className="text-yellow-500 animate-spin" />
                      <span>결제 완료! 발송 준비 중</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaim(event.id, event.eventPrice)}
                      className="w-full cursor-pointer bg-amber-550 hover:bg-amber-600 font-bold text-xs text-white py-2 rounded-lg shadow-sm transition-all text-center"
                    >
                      🎁 100원 결제하고 경품 청구!
                    </button>
                  )
                ) : (
                  <span className="text-[10px] text-slate-400 font-sans font-medium text-center">
                    아쉽게 낙첨되었습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

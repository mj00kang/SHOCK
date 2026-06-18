import React from 'react';
import { Gift, Users, Trophy, CheckCircle2 } from 'lucide-react';
import { LuckyEventState, isLuckyShockEvent } from '../utils/storageUtils';

interface EventSectionProps {
  events: LuckyEventState[];
  onApply: (eventId: string) => void;
  onDraw: (eventId: string) => void;
  onClaim: (eventId: string, finalPrice: number) => void;
  currentUserId: string;
  currentUserNickname: string;
  userRole: 'user' | 'admin';
  userAppliedIds: string[];
  onViewAll?: () => void;
}

export default function EventSection({
  events,
  onApply,
  onDraw,
  onClaim,
  currentUserId,
  currentUserNickname,
  userRole,
  userAppliedIds,
  onViewAll
}: EventSectionProps) {
  // Use all events for preview.
  const allEvents = events || [];
  
  // Statuses considered as active
  const activeStatuses = ['active', 'ongoing', 'open', 'live', 'pending', 'scheduled', '진행중', '진행 대기중', '응모 가능', '응모 대기중'];
  const activeEvents = allEvents.filter(e => activeStatuses.includes(e.status));
  const otherEvents = allEvents.filter(e => !activeStatuses.includes(e.status));
  const previewEvents = [...activeEvents, ...otherEvents].slice(0, 3);

  return (
    <section id="event-section" className="w-full py-16 px-4 md:px-8 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Module Header & More link (Community style) */}
        <div className="relative text-center pb-5 mb-8 border-b border-gray-200">
          <div className="text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-mono border border-gray-200 px-3 py-1 bg-white rounded-full mb-3 shadow-2xs w-fit">
              <Gift size={11} className="text-[#EF4444] animate-bounce" />
              <span>EVENT & PROMOTION</span>
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight mt-1">
              100원 응모 이벤트 & 기획전
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xl leading-relaxed">
              럭키샥 100원 응모 이벤트와 특별 수집 기획전을 확인해보세요.
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="md:absolute md:bottom-1 md:right-0 mt-6 md:mt-0 mx-auto cursor-pointer text-neutral-400 hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-1 select-none"
              title="전체 이벤트 목록 리스트로 이동"
            >
              <span>더보기</span>
              <span className="text-[10px] font-mono">→</span>
            </button>
          )}
        </div>

        {/* Events Layout container - 3 columns for 3 visible events */}
        {previewEvents.length > 0 ? (
          <div className="w-full max-w-7xl mx-auto pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewEvents.map((event) => {
              const userApplied = userAppliedIds.includes(event.id);
              const isEnded = ['drawn', 'ended', 'closed', 'finished', '종료', '종료됨'].includes(event.status);
              const hasWon = event.winners && event.winners.includes(currentUserNickname);

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

              let displayTitle = event.title;
              let shortProductName = event.productName;
              const isLucky = isLuckyShockEvent(event);
              if (isLucky) {
                displayTitle = `🎁 [LUCKY 샥] ${getLuckyShockDisplayTitle(event)}`;
                
                // Shorten product name to avoid repetition
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

              // Badge configuration
              let badgeText = isLucky ? '럭키샥' : '기획전';
              let badgeClass = isLucky ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200';
              if (isEnded) {
                badgeText = '종료';
                badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200';
              }

              return (
                <div
                  key={event.id}
                  className="w-full bg-white border border-gray-200 rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  <div className="flex flex-col flex-grow">
                    {/* Event Image */}
                    <div className="relative w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-[#F3F4F6] border border-gray-100 mb-4">
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      {/* Cost Tag Overlay */}
                      {(!isEnded && isLucky) && (
                        <div className="absolute top-2.5 left-2.5 bg-[#EF4444] text-white font-mono text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider">
                          100원 응모
                        </div>
                      )}
                    </div>

                    {/* Metadata and titles */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeClass}`}>
                          {badgeText}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {isEnded ? '종료됨' : '진행 중'}
                        </span>
                      </div>

                      <h3 
                        className="font-sans font-extrabold text-[#0F172A] text-[13px] md:text-[15px] mb-1.5" 
                        title={displayTitle}
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
                      {/* Removed description <p> for target product as requested */}

                      {/* Info stats pill box */}
                      <div className="flex items-center justify-between text-[12px] text-slate-500 font-sans mb-4 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <span className="flex items-center gap-1.5">
                          <Users size={12} className="text-[#64748B]" />
                          <span>참여자 <strong className="text-slate-800 font-bold">{event.participants.length}명</strong></span>
                        </span>
                        <div className="w-[1px] h-3 bg-gray-200"></div>
                        <span className="flex items-center gap-1">
                          <Trophy size={11} className="text-yellow-500" />
                          <span>당첨 <strong className="text-slate-850 font-bold">{event.winnerCount}명</strong></span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational action buttons */}
                  <div className="pt-3 border-t border-gray-100 mt-auto flex flex-col gap-2 w-full">
                    {!isEnded ? (
                      <div>
                        {isLucky ? (
                          userApplied ? (
                            <div className="w-full text-center text-emerald-600 font-bold flex items-center justify-center gap-1 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-150 text-xs font-sans">
                              <CheckCircle2 size={13} />
                              <span>응모 완료! 발표 대기 중</span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onApply(event.id);
                              }}
                              className="w-full cursor-pointer text-xs font-extrabold font-sans py-2.5 px-4 rounded-xl transition-all bg-red-500 hover:bg-rose-600 border border-transparent text-white shadow-xs hover:shadow-sm text-center"
                            >
                              단돈 100원 응모 접수
                            </button>
                          )
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onViewAll) onViewAll();
                            }}
                            className="w-full cursor-pointer text-xs font-extrabold font-sans py-2.5 px-4 rounded-xl transition-all bg-gray-900 hover:bg-gray-800 border border-transparent text-white shadow-xs hover:shadow-sm text-center"
                          >
                            상세보기
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex flex-col gap-2 bg-gray-50/70 p-2 rounded-xl border border-gray-150">
                          {isLucky ? (
                            <>
                              <div className="text-[11px] text-center">
                                <span className="text-slate-400 block mb-0.5">행운의 낙찰자:</span>
                                <strong className="text-amber-800 font-black bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md inline-block max-w-full truncate">
                                  {(event.winners && event.winners.length > 0) ? event.winners.join(', ') : '당첨자 없음'}
                                </strong>
                              </div>

                              {hasWon && (
                                <button
                                  onClick={() => onClaim(event.id, event.eventPrice)}
                                  className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 font-bold text-[11px] text-white py-1.5 rounded-lg shadow-xs transition-all text-center"
                                >
                                  경품 청구하기 (100원)
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={onViewAll}
                              className="w-full cursor-pointer bg-slate-300 font-bold text-[11px] text-white py-2 rounded-lg shadow-xs text-center"
                            >
                              종료된 이벤트
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-12 text-center text-slate-400 font-extrabold text-xs bg-white rounded-2xl border border-gray-200">
            진행 중인 이벤트가 없습니다.
          </div>
        )}

      </div>
    </section>
  );
}

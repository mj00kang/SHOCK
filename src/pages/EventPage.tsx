import React, { useState } from 'react';
import { 
  Gift, Users, Sparkles, AlertCircle, ArrowLeft, Calendar, 
  HelpCircle, CheckCircle2, Bookmark, Flame, Trophy
} from 'lucide-react';
import { LuckyEventState, isLuckyShockEvent } from '../utils/storageUtils';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

interface EventPageProps {
  events: LuckyEventState[];
  userAppliedIds: string[];
  onApply: (eventId: string) => void;
  onDraw: (eventId: string) => void;
  currentUserNickname: string;
  userRole: 'user' | 'admin';
  onBackToMain: () => void;
}

export default function EventPage({
  events,
  userAppliedIds,
  onApply,
  onDraw,
  currentUserNickname,
  userRole,
  onBackToMain
}: EventPageProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'lucky' | 'promotion' | 'ended'>('all');
  const [selectedEvent, setSelectedEvent] = useState<LuckyEventState | null>(null);

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    // 100% remove '소모임' eventTypes from event list
    if (event.eventType === '소모임') return false;

    // Check if ended
    const isEnded = event.status === 'ended' || event.status === 'drawn' || event.status === 'closed' || event.status === 'completed';
    
    if (selectedTab === 'ended') {
      return isEnded;
    }
    
    // For non-ended tabs, hide ended events
    if (isEnded) return false;

    if (selectedTab === 'all') return true;
    if (selectedTab === 'lucky') return isLuckyShockEvent(event);
    if (selectedTab === 'promotion') return !isLuckyShockEvent(event);
    
    return true;
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-8 md:pt-8 md:pb-16 selection:bg-sky-250">
        
        <div className="text-left">
          <button 
            onClick={onBackToMain}
            className="page-back-link group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>

        {/* Title Dashboard Section */}
        <div className="bg-white px-[32px] py-[28px] rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-left flex items-start gap-4">
          <div className="p-3 bg-red-500 rounded-2xl text-white animate-pulse shrink-0">
            <Gift size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-sans font-black text-[28px] md:text-[32px] text-gray-900 tracking-tight flex items-center gap-2">
              이벤트 & 프로모션 <span className="text-[11px] bg-red-500 text-white font-mono font-black px-2 py-0.5 rounded-full leading-none translate-y-0.5">PROMO</span>
            </h1>
            <p className="text-[14px] md:text-[15px] font-sans font-medium text-gray-500 mt-2">
              수집가들을 위한 100원 응모 이벤트와 특별 기획전을 확인해보세요.
            </p>
          </div>
        </div>

        {/* Categories Tab bar selector (with cute, round icon-like styling) */}
        <div className="flex flex-wrap items-center justify-start gap-[10px] border-b border-[#E5E7EB] pb-5 mt-[28px]">
          <button
            onClick={() => setSelectedTab('all')}
            className={`cursor-pointer px-4 h-10 rounded-full font-sans font-bold text-[14px] transition-all flex items-center justify-center ${
              selectedTab === 'all'
                ? 'bg-[#111827] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50'
            }`}
          >
            전체 이벤트
          </button>
          
          <button
            onClick={() => setSelectedTab('lucky')}
            className={`cursor-pointer px-4 h-10 rounded-full font-sans font-bold text-[14px] transition-all flex items-center justify-center gap-1.5 ${
              selectedTab === 'lucky'
                ? 'bg-[#111827] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50'
            }`}
          >
            럭키샥
          </button>
          
          <button
            onClick={() => setSelectedTab('promotion')}
            className={`cursor-pointer px-4 h-10 rounded-full font-sans font-bold text-[14px] transition-all flex items-center justify-center ${
              selectedTab === 'promotion'
                ? 'bg-[#111827] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50'
            }`}
          >
            기획전
          </button>

          <button
            onClick={() => setSelectedTab('ended')}
            className={`cursor-pointer px-4 h-10 rounded-full font-sans font-bold text-[14px] transition-all flex items-center justify-center ${
              selectedTab === 'ended'
                ? 'bg-[#111827] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50'
            }`}
          >
            종료된 이벤트
          </button>
        </div>

        {/* Safe Guide banner */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[16px] px-[18px] py-[16px] text-left flex items-start gap-3.5 box-border w-full mt-5 mb-6">
          <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-[14px] text-[#92400E] mb-1">
              럭키샥 응모 안내
            </h4>
            <p className="text-[13px] text-[#92400E] leading-relaxed font-sans">
              공정한 추첨을 위해 동일 기기 또는 동일 계정의 반복 응모는 제한될 수 있습니다. 응모는 정상적으로 접수된 참여자 기준으로 진행됩니다.
            </p>
          </div>
        </div>

        {/* Render grid of custom cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] text-left">
          {filteredEvents.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2 select-none">
              <p className="font-sans font-bold text-sm">
                {selectedTab === 'lucky' ? '진행 중인 럭키샥 이벤트가 없습니다.' : 
                 selectedTab === 'promotion' ? '진행 중인 기획전이 없습니다.' :
                 selectedTab === 'ended' ? '종료된 이벤트가 없습니다.' : '해당 행렬에 진행 중인 이벤트가 존재하지 않습니다.'}
              </p>
              {selectedTab !== 'ended' && (
                <p className="text-xs">상단의 다른 탭 카테고리를 눌러 수집 기획전에 응모해 보세요!</p>
              )}
            </div>
          ) : (
            filteredEvents.map(evt => {
              const applied = userAppliedIds.includes(evt.id);
              return (
                <EventCard
                  key={evt.id}
                  event={evt}
                  userApplied={applied}
                  onSelect={(e) => { setSelectedEvent(e); }}
                  onApply={onApply}
                  isAdmin={userRole === 'admin'}
                  onDraw={onDraw}
                />
              );
            })
          )}
        </div>

      </div>

      {/* Pop drawers for detailed modal logic */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          currentUserNickname={currentUserNickname}
          userApplied={userAppliedIds.includes(selectedEvent.id)}
          onApply={(id) => {
            onApply(id);
            // Dynamic update current open modal participant numbers
            setSelectedEvent(prev => {
              if (prev && prev.id === id) {
                const alreadyHas = prev.participants.includes(currentUserNickname);
                return {
                  ...prev,
                  participants: alreadyHas 
                    ? prev.participants 
                    : [...prev.participants, currentUserNickname]
                };
              }
              return prev;
            });
          }}
        />
      )}

    </div>
  );
}

import React from 'react';
import { Users, Timer, MessageSquare, ArrowRight } from 'lucide-react';
import { MeetupRoom } from '../utils/meetupGenerator';

interface MeetupCardProps {
  key?: React.Key;
  room: MeetupRoom;
  onEnter: (roomId: string) => void;
  isJoined?: boolean;
}

export default function MeetupCard({ room, onEnter, isJoined }: MeetupCardProps) {
  // Format dates elegantly
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return '방금 전';
      if (diffMin < 60) return `${diffMin}분 전`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}시간 전`;
      return `${Math.floor(diffHr / 24)}일 전`;
    } catch {
      return '최근';
    }
  };

  // Setup category group accent colors
  const getCategoryStyles = (group: 'POP' | 'SPORTS' | 'ANALOG') => {
    switch (group) {
      case 'POP':
        return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'SPORTS':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'ANALOG':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  return (
    <div 
      id={`meetup-card-${room.id}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left h-full relative group"
    >
      <div className="space-y-3">
        {/* Category Badge & Live Online Pulse */}
        <div className="meetup-card-topline">
          <div className="meetup-card-badges">
            <span className={`meetup-card-badge ${getCategoryStyles(room.categoryGroup)}`}>
              {room.categoryGroup}
            </span>
            <span className="meetup-card-badge bg-gray-50 border border-gray-100 text-gray-500">
              {room.subCategory}
            </span>
            {isJoined && (
              <span className="meetup-card-badge bg-gray-50 border border-gray-200 text-gray-900">
                참여중
              </span>
            )}
            {isJoined && (
              <span className="meetup-card-badge bg-gray-50 border border-gray-100 text-gray-600">
                내 소모임
              </span>
            )}
          </div>

          <div className="meetup-online-count">
            <span className="online-dot animate-pulse"></span>
            접속 {room.onlineCount}명
          </div>
        </div>

        {/* Meetup Title & Description */}
        <div className="space-y-1">
          <h3 className="font-sans font-black text-gray-900 text-base group-hover:text-gray-900 transition-colors line-clamp-1">
            {room.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>
      </div>

      {/* Metrics & Enter button at the bottom */}
      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 font-sans">
          <div className="flex items-center gap-1" title={`전체 참여 멤버 수: ${room.memberCount}명`}>
            <Users size={12} className="text-gray-400" />
            <span>{room.memberCount}명</span>
          </div>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-1" title="최근 메시지 시간">
            <Timer size={12} className="text-gray-400" />
            <span>{formatTimeAgo(room.lastMessageAt)}</span>
          </div>
        </div>

        {/* Entered arrow button */}
        <button
          onClick={() => onEnter(room.id)}
          className={`cursor-pointer inline-flex items-center gap-1.5 border text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
            isJoined 
              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white border-yellow-100 hover:border-transparent font-extrabold shadow-sm' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-800 hover:text-white border-gray-200 hover:border-transparent font-bold'
          }`}
        >
          <span>{isJoined ? '다시 입장' : '입장하기'}</span>
          <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

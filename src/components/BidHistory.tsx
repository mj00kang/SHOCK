import React from 'react';
import { BidRecord } from '../utils/storageUtils';
import { Trophy, Clock } from 'lucide-react';

interface BidHistoryProps {
  bids: BidRecord[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
  // Sort bids descending to show latest first
  const sortedBids = [...bids].sort((a, b) => b.bidPrice - a.bidPrice);

  // Highest bid is the first item in sorted list
  const highestBidId = sortedBids.length > 0 ? sortedBids[0].id : null;

  // Mask function: "민지컬렉터" -> "민지***"
  const maskNickname = (nickname: string) => {
    if (!nickname) return '비공개';
    if (nickname.length <= 2) {
      return nickname.slice(0, 1) + '*';
    }
    return nickname.slice(0, 2) + '*'.repeat(nickname.length - 2);
  };

  // Convert ISO date helper
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    } catch (e) {
      return isoString;
    }
  };

  if (sortedBids.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-gray-400 font-sans" id="bid-history-container">
        <p className="text-sm font-bold">아직 경매에 참여한 입찰자가 없습니다.</p>
        <p className="text-xs text-gray-400 mt-1">첫 번째 수집 입찰의 영광을 누려보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-left" id="bid-history-container">
      <h3 className="font-sans font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pl-1">
        <Clock size={13} className="text-gray-800" />
        <span>실시간 입찰 이력 ({sortedBids.length}건)</span>
      </h3>
      
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {sortedBids.map((bid, index) => {
          const isHighest = bid.id === highestBidId;
          return (
            <div 
              key={bid.id} 
              className={`p-3 rounded-xl border flex items-center justify-between text-sm transition-colors ${
                isHighest 
                  ? 'bg-gray-50 border-gray-200 shadow-sm' 
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isHighest ? 'bg-gray-800 animate-pulse' : 'bg-gray-300'}`}></span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-700 font-sans">
                      {maskNickname(bid.bidderNickname)}
                    </span>
                    {isHighest && (
                      <span className="inline-flex items-center gap-0.5 bg-gray-900 text-white text-[10px] font-black px-[13px] py-[9px] rounded-full uppercase scale-90">
                        <Trophy size={8} />
                        <span>최고 입찰자</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {formatTime(bid.bidAt)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`font-mono font-extrabold text-base ${isHighest ? 'text-gray-900' : 'text-gray-900'}`}>
                  {bid.bidPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 font-bold ml-0.5">원</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

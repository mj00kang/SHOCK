import React from 'react';
import { ShieldCheck, Truck, ArrowRightLeft, Sparkles, CheckCircle } from 'lucide-react';

interface EscrowStatusCardProps {
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  escrowStatus: 'none' | 'holding' | 'released' | 'refunded';
  deliveryStatus: 'preparing' | 'shipping' | 'delivered';
}

export default function EscrowStatusCard({
  paymentStatus,
  escrowStatus,
  deliveryStatus
}: EscrowStatusCardProps) {
  // Determine text and progress
  let step = 1;
  if (paymentStatus === 'paid') step = 2;
  if (deliveryStatus === 'shipping') step = 3;
  if (escrowStatus === 'released') step = 4;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm text-left max-w-full">
      <div className="flex items-start gap-4 mb-5">
        <span className="p-3 bg-gray-900 text-white rounded-2xl shrink-0 shadow-sm animate-pulse">
          <ShieldCheck size={22} className="stroke-[2.5]" />
        </span>
        <div>
          <h4 className="font-sans font-black text-gray-900 text-sm md:text-base flex items-center gap-1.5">
            <span>샥 안심 에스크로 거래 보호</span>
            <span className="bg-gray-900 text-white font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">ACTIVE</span>
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            샥은 상호 신뢰를 위해 직거래 혹은 포인트 거래가 아닌 <strong>100% 에스크로 중개 보관</strong> 방식을 채택하고 있습니다. 
            구매자가 수령 확인을 한 경우에만 대금이 안전하게 판매자에게 자동 정산됩니다.
          </p>
        </div>
      </div>

      {/* Progress Stepper Visualiser */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200">
        
        {/* Step 1 */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black ${
              step >= 1 ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-200 text-gray-400'
            }`}>
              1
            </span>
          </div>
          <p className={`text-[10px] font-sans font-black leading-none ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
            낙찰 완료
          </p>
          <span className="block text-[8px] text-gray-400">결제 대기</span>
        </div>

        {/* Step 2 */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black ${
              step >= 2 ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-200 text-gray-400'
            }`}>
              2
            </span>
          </div>
          <p className={`text-[10px] font-sans font-black leading-none ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
            에스크로 예치
          </p>
          <span className="block text-[8px] text-gray-500">대금 샥 보관</span>
        </div>

        {/* Step 3 */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black ${
              step >= 3 ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-200 text-gray-400'
            }`}>
              3
            </span>
          </div>
          <p className={`text-[10px] font-sans font-black leading-none ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
            안심 배송
          </p>
          <span className="block text-[8px] text-gray-500">운송장 배송중</span>
        </div>

        {/* Step 4 */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black ${
              step >= 4 ? 'bg-gray-900 text-white shadow-sm animate-bounce' : 'bg-gray-200 text-gray-400'
            }`}>
              4
            </span>
          </div>
          <p className={`text-[10px] font-sans font-black leading-none ${step >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>
            판매대금 정산
          </p>
          <span className="block text-[8px] text-slate-550">거래 완결</span>
        </div>

      </div>

      {/* Real-time status badge translation in readable language */}
      <div className="mt-4 p-3 bg-white/80 rounded-2xl border border-gray-200 flex items-center justify-between text-xs font-sans">
        <span className="text-gray-500 font-semibold">현재 에스크로 보호 상태:</span>
        <div className="flex items-center gap-1.5">
          {escrowStatus === 'none' && (
            <span className="bg-gray-100 text-gray-700 font-black px-2 py-1 rounded-md text-[10px] border border-gray-200">
              💵 입금 대기 중
            </span>
          )}
          {escrowStatus === 'holding' && (
            <div className="flex gap-1">
              <span className="bg-yellow-50 text-yellow-700 font-black px-2 py-1 rounded-md text-[10px] border border-yellow-200 animate-pulse">
                🛡️ 샥 머니 보관중
              </span>
              <span className="bg-gray-100 text-gray-900 font-black px-2 py-1 rounded-md text-[10px] border border-gray-200">
                {deliveryStatus === 'preparing' ? '📦 상품 발송준비' : '🚚 발송완료 배송중'}
              </span>
            </div>
          )}
          {escrowStatus === 'released' && (
            <span className="bg-gray-900 text-white font-black px-2.5 py-1 rounded-md text-[10px] flex items-center gap-1 shadow-sm">
              <CheckCircle size={11} />
              <span>🎉 정산 완료</span>
            </span>
          )}
          {escrowStatus === 'refunded' && (
            <span className="bg-rose-100 text-rose-700 font-black px-2 py-1 rounded-md text-[10px] border border-rose-200">
              ❌ 환불 처리 완료
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

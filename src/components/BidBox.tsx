import React, { useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { Flame, ShieldAlert, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BidBoxProps {
  product: Product;
  currentUserNickname: string;
  onBidSuccess: (bidAmount: number) => void;
  onBuyNowClick: () => void;
  onRequireLogin: () => void;
}

export default function BidBox({
  product,
  currentUserNickname,
  onBidSuccess,
  onBuyNowClick,
  onRequireLogin
}: BidBoxProps) {
  const minIncrement = product.minBidIncrement || 1000;
  const isNoBidsYet = product.bidCount === 0;
  const nextMinBid = isNoBidsYet ? product.startPrice : product.currentPrice + minIncrement;

  const [bidValue, setBidValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const isSeller = currentUserNickname && currentUserNickname === product.sellerNickname;
  const isLive = product.status === 'live';

  useEffect(() => {
    // Default the value to next minimum bid
    setBidValue(nextMinBid.toString());
    setErrorMsg('');
  }, [product.id, nextMinBid]);

  const handleQuickAdd = (amount: number) => {
    if (!currentUserNickname) {
      onRequireLogin();
      return;
    }
    const current = parseInt(bidValue) || nextMinBid;
    setBidValue((current + amount).toString());
    setErrorMsg('');
  };

  const handleBidButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserNickname) {
      onRequireLogin();
      return;
    }

    if (isSeller) {
      setErrorMsg('본인이 출품한 상품에는 입찰할 수 없습니다.');
      return;
    }

    const val = parseInt(bidValue);
    if (isNaN(val)) {
      setErrorMsg('입찰하실 정확한 원화 금액을 숫자로 입력해 주세요.');
      return;
    }

    if (val < nextMinBid) {
      setErrorMsg(`최소 입찰가 이상으로 입력해주세요.`);
      return;
    }

    if (!isLive || new Date(product.endAt) <= new Date()) {
      setErrorMsg('종료된 경매에는 입찰할 수 없습니다.');
      return;
    }

    setErrorMsg('');
    setIsConfirmModalOpen(true);
  };

  const confirmBid = () => {
    if (isSubmittingBid) return;
    setIsSubmittingBid(true);
    
    // Simulate slight processing and execute actual bid
    setTimeout(() => {
      const val = parseInt(bidValue);
      onBidSuccess(val);
      setIsConfirmModalOpen(false);
      setIsSubmittingBid(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#1F2937', '#F59E0B']
      });
    }, 400); // 400ms delay for visual feedback
  };

  // If auction concluded
  if (!isLive) {
    return (
      <div className="bg-gray-50 border border-slate-250 p-5 rounded-2xl text-center space-y-2 select-none font-sans" id="bid-box-container">
        <AlertCircle size={20} className="text-gray-400 mx-auto" />
        <h4 className="font-extrabold text-base text-gray-700">종료 및 정체된 거래</h4>
        <p className="text-xs text-gray-400 leading-normal">
          해당 상품 경매는 이미 {product.status === 'sold' ? '최종 체결 낙찰되었습니다' : '종료 또는 취소되었습니다'}.
        </p>
      </div>
    );
  }

  // If not logged in
  if (!currentUserNickname) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 p-5 rounded-2xl text-center space-y-3.5 font-sans" id="bid-box-container">
        <ShieldAlert size={20} className="text-gray-800 mx-auto" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-gray-900">안전 및 수집 보호 인증대기</h4>
          <p className="text-xs text-slate-450 leading-normal">
            중복 입찰 및 가짜 호가를 방지하기 위해 샥에 가입/로그인 후 경매 참여를 하실 수 있습니다.
          </p>
        </div>
        <button
          onClick={onRequireLogin}
          className="cursor-pointer inline-flex items-center justify-center bg-gray-900 hover:bg-gray-900 text-white font-black text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          간편 회원 인증/로그인하기
        </button>
      </div>
    );
  }

  // If user is the seller
  if (isSeller) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-center space-y-2 select-none font-sans" id="bid-box-container">
        <AlertCircle size={20} className="text-slate-450 mx-auto" />
        <h4 className="font-bold text-sm text-gray-700">내가 출품한 애장품</h4>
        <p className="text-xs text-slate-450 leading-relaxed">
          본인이 직접 개장하고 등록한 경매이므로 입찰 또는 타결을 행할 수 없습니다. 수집가분들의 소속 입찰을 기다려보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4 font-sans text-left" id="bid-box-container">
        {/* Bid Entry Form */}
        <form onSubmit={handleBidButtonClick} className="space-y-3.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              호가 입찰 가격 입력
            </label>
            <span className="text-xs text-gray-400 font-semibold">
              최소 입찰가: <strong className="text-gray-900 font-mono font-bold text-sm">{nextMinBid.toLocaleString()}원</strong>
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              className="w-full border border-gray-200 text-gray-900 font-mono font-extrabold text-lg px-4.5 py-3 rounded-xl focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 placeholder-slate-350 pr-12"
              value={bidValue}
              onChange={(e) => {
                setBidValue(e.target.value);
                setErrorMsg('');
              }}
              placeholder={nextMinBid.toString()}
            />
            <span className="absolute right-4.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-450">
              원
            </span>
          </div>

          {errorMsg && (
            <p className="text-sm font-bold text-red-500 flex items-center gap-1">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Quick taps incremental buttons */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { label: '+1천', val: 1000 },
              { label: '+5천', val: 5000 },
              { label: '+1만', val: 10000 },
              { label: '+5만', val: 50000 },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAdd(item.val)}
                className="cursor-pointer py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-black text-slate-650 rounded-lg transition-transform focus:outline-none active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Place Bid CTA */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-black text-base py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Flame size={13} className="animate-pulse text-red-500 fill-rose-350" />
            <span>경매 입찰하기</span>
          </button>
        </form>

        {/* Instance payment if buy now option exists */}
        {product.status === 'live' && new Date(product.endAt) > new Date() && (
          <div className="border-t border-gray-100 pt-4 space-y-3.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-yellow-800 uppercase tracking-widest flex items-center gap-1 font-mono">
                ⚡ INSTANT TRANSACTION OPTIONS
              </span>
              <span className="text-xs font-extrabold text-yellow-500">
                확정 낙찰
              </span>
            </div>
            
            <button
              onClick={onBuyNowClick}
              disabled={product.startAt && new Date(product.startAt) > new Date()}
              className="w-full bg-gray-900 hover:bg-slate-900 border border-gray-900 text-white font-extrabold text-base py-3.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-px transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:opacity-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
            >
              <span>즉시낙찰 구매하기 ({Math.floor(product.buyNowPrice || product.currentPrice * 1.4).toLocaleString()}원)</span>
            </button>
            
            <p className="text-xs text-gray-400 leading-normal font-sans">
              * 즉시낙찰 선택시 현재 입찰 과정이 바로 종료되고 에스크로 결제 화면으로 이동합니다.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-[22px] p-6 w-[420px] max-w-[calc(100vw-32px)] shadow-[0_24px_64px_rgba(15,23,42,0.22)] animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-black text-gray-900">입찰 내용을 확인해주세요</h3>
              <button 
                onClick={() => setIsConfirmModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="font-bold text-[15px] text-gray-800 line-clamp-2 leading-snug">
                {product.title}
              </div>

              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 font-bold">현재 입찰가</span>
                  <span className="text-gray-700 font-mono font-bold">{product.currentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 font-bold">최소 입찰가</span>
                  <span className="text-gray-700 font-mono font-bold">{nextMinBid.toLocaleString()}원</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-black">내 입찰가</span>
                  <span className="text-[22px] font-black text-gray-900 font-mono">
                    {parseInt(bidValue).toLocaleString()}원
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-slate-500 leading-relaxed bg-rose-50/50 p-3 flex gap-2 rounded-xl border border-rose-100">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                입찰은 완료 후 임의 취소가 제한됩니다. 입력한 금액으로 입찰을 진행하시겠습니까?
              </p>
            </div>

            <div className="mt-8 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-5 py-3 rounded-full font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors w-1/3 cursor-pointer"
                type="button"
                disabled={isSubmittingBid}
              >
                취소
              </button>
              <button 
                onClick={confirmBid}
                disabled={isSubmittingBid}
                className="px-5 py-3 rounded-full font-bold text-sm text-white bg-[#111827] hover:bg-black transition-colors w-2/3 cursor-pointer flex justify-center items-center gap-2 disabled:bg-gray-400"
                type="button"
              >
                {isSubmittingBid ? '입찰 처리 중...' : '입찰 확정하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

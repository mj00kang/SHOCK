import React, { useState } from 'react';
import { Landmark, Check, AlertCircle } from 'lucide-react';
import { addPayoutAccount } from '../utils/paymentUtils';

interface PayoutAccountFormProps {
  userId: string;
  onSuccess: () => void;
}

const BANK_PROVIDERS = ['국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크', '새마을금고', '우체국'];

export default function PayoutAccountForm({ userId, onSuccess }: PayoutAccountFormProps) {
  const [bankName, setBankName] = useState(BANK_PROVIDERS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!bankName) {
      setErrorMsg('은행을 선택해주세요.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMsg('계좌번호를 입력해주세요.');
      return;
    }
    
    // Check if account number consists of only digits and hyphens
    const cleanNum = accountNumber.replace(/[- ]/g, '');
    if (!/^[0-9]+$/.test(cleanNum)) {
      setErrorMsg('계좌번호는 숫자와 하이픈(-)만 허용됩니다.');
      return;
    }
    if (cleanNum.length < 8) {
      setErrorMsg('올바른 계좌번호를 입력해주세요.');
      return;
    }

    if (!accountHolder.trim()) {
      setErrorMsg('예금주명을 입력해주세요.');
      return;
    }

    try {
      addPayoutAccount(userId, bankName, accountNumber, accountHolder, nickname);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || '정산계좌 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md mx-auto text-left">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 bg-gray-100 rounded-xl text-gray-800 shrink-0">
          <Landmark size={18} className="stroke-[2.5]" />
        </span>
        <div>
          <h4 className="font-sans font-black text-slate-850 text-sm">판매자 정산계좌 등록</h4>
          <p className="text-[10px] text-gray-400">낙찰 가격에 대한 에스크로 보호 예치금을 전달받을 정산계좌입니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Bank Select */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            정산 은행 선호도
          </label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all font-sans"
          >
            {BANK_PROVIDERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Account Number */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            계좌번호 입력 (하이픈 포함 가능)
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="123-456-789012"
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* 3. Account Holder */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            정주 예금주명
          </label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="강민지"
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300"
          />
        </div>

        {/* 4. Alternate Nickname */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            정산 닉네임 별칭 (선택)
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="국민은행 마이정산"
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all mt-4"
        >
          <Check size={14} />
          <span>정산계좌 등록하기</span>
        </button>
      </form>
    </div>
  );
}

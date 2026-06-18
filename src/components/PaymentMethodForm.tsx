import React, { useState } from 'react';
import { CreditCard, Landmark, Check, AlertCircle } from 'lucide-react';
import { addPaymentMethod } from '../utils/paymentUtils';

interface PaymentMethodFormProps {
  userId: string;
  onSuccess: () => void;
}

const CARD_PROVIDERS = ['신한카드', '국민카드', '삼성카드', '현대카드', '롯데카드', '우리카드', '하나카드', 'NH농협카드'];
const BANK_PROVIDERS = ['국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크'];

export default function PaymentMethodForm({ userId, onSuccess }: PaymentMethodFormProps) {
  const [methodType, setMethodType] = useState<'card' | 'bank_transfer'>('card');
  const [provider, setProvider] = useState(CARD_PROVIDERS[0]);
  const [number, setNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [holderName, setHolderName] = useState('');
  const [pin6Digit, setPin6Digit] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTypeChange = (type: 'card' | 'bank_transfer') => {
    setMethodType(type);
    setProvider(type === 'card' ? CARD_PROVIDERS[0] : BANK_PROVIDERS[0]);
    setNumber('');
    setCardExpiry('');
    setHolderName('');
    setPin6Digit('');
    setNickname('');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!number.trim()) {
      setErrorMsg(methodType === 'card' ? '카드번호를 입력해주세요.' : '계좌번호를 입력해주세요.');
      return;
    }

    if (methodType === 'card') {
      const cleanNum = number.replace(/[- ]/g, '');
      if (cleanNum.length < 15 || cleanNum.length > 16 || isNaN(Number(cleanNum))) {
        setErrorMsg('올바른 15~16자리 카드번호를 입력해주세요.');
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        setErrorMsg('카드 유효기간(MM/YY)을 정확히 입력해주세요.');
        return;
      }
      if (!holderName.trim()) {
        setErrorMsg('카드 소유자명을 입력해주세요.');
        return;
      }
      if (pin6Digit.length !== 6 || isNaN(Number(pin6Digit))) {
        setErrorMsg('결제 비밀번호 6자리를 입력해주세요.');
        return;
      }
    } else {
      const cleanAcc = number.replace(/[- ]/g, '');
      if (cleanAcc.length < 10 || isNaN(Number(cleanAcc))) {
        setErrorMsg('올바른 계좌번호를 입력해 주세요 (숫자만 입력).');
        return;
      }
      if (!holderName.trim()) {
        setErrorMsg('예금주명을 입력해주세요.');
        return;
      }
    }

    try {
      addPaymentMethod(userId, methodType, provider, number, holderName, nickname);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || '결제수단 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md mx-auto text-left">
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => handleTypeChange('card')}
          className={`cursor-pointer flex-1 py-3 rounded-2xl font-sans font-black text-xs flex items-center justify-center gap-1.5 transition-all outline-none ${
            methodType === 'card'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CreditCard size={14} />
          <span>신용/체크카드</span>
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('bank_transfer')}
          className={`cursor-pointer flex-1 py-3 rounded-2xl font-sans font-black text-xs flex items-center justify-center gap-1.5 transition-all outline-none ${
            methodType === 'bank_transfer'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Landmark size={14} />
          <span>계좌이체</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Provider Select */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            {methodType === 'card' ? '카드사 선택' : '은행 선택'}
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all font-sans"
          >
            {(methodType === 'card' ? CARD_PROVIDERS : BANK_PROVIDERS).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Number Input */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            {methodType === 'card' ? '카드번호 입력 (- 빼고 숫자만)' : '계좌번호 입력 (- 빼고 숫자만)'}
          </label>
          <input
            type="text"
            maxLength={19}
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^0-9- ]/g, ''))}
            placeholder={methodType === 'card' ? '1234123412341234' : '1234567890123'}
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold font-mono text-slate-850 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Card Only fields: Expiry and Pin */}
        {methodType === 'card' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
                유효기간 (MM/YY)
              </label>
              <input
                type="text"
                placeholder="12/28"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-center text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
                결제 비밀번호 (6자리)
              </label>
              <input
                type="password"
                maxLength={6}
                placeholder="******"
                value={pin6Digit}
                onChange={(e) => setPin6Digit(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-center tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. Owner/Holder name */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            {methodType === 'card' ? '카드 소유자 실명' : '예금주 실명'}
          </label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="홍길동"
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* 4. Alternate Nickname */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            결제수단 별칭 (선택)
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={methodType === 'card' ? '주용 신한카드' : '쇼핑 전용 계좌'}
            className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all mt-6"
        >
          <Check size={14} />
          <span>결제수단 등록하기</span>
        </button>
      </form>
    </div>
  );
}

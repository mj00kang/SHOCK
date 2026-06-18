import React, { useState, useEffect } from 'react';
import { Truck, Check, AlertCircle } from 'lucide-react';
import { Address } from '../utils/addressUtils';

interface AddressFormProps {
  userId: string;
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
  addAddressFn: (userId: string, data: any, isDefault: boolean) => any;
  updateAddressFn: (userId: string, id: string, data: any) => any;
}

export default function AddressForm({
  userId,
  initialData,
  onSuccess,
  onCancel,
  addAddressFn,
  updateAddressFn
}: AddressFormProps) {
  const [label, setLabel] = useState('집');
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [deliveryMemo, setDeliveryMemo] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label || '집');
      setReceiverName(initialData.receiverName || '');
      setPhone(initialData.phone || '');
      setPostalCode(initialData.postalCode || '');
      setAddress1(initialData.address1 || '');
      setAddress2(initialData.address2 || '');
      setDeliveryMemo(initialData.deliveryMemo || '');
      setIsDefault(initialData.isDefault || false);
    } else {
      setLabel('집');
      setReceiverName('');
      setPhone('');
      setPostalCode('');
      setAddress1('');
      setAddress2('');
      setDeliveryMemo('');
      setIsDefault(false);
    }
    setErrorMsg('');
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!receiverName.trim()) {
      setErrorMsg('수령인 이름을 입력해주세요.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('연락처를 입력해주세요.');
      return;
    }
    if (!postalCode.trim()) {
      setErrorMsg('우편번호를 입력해주세요.');
      return;
    }
    if (!address1.trim()) {
      setErrorMsg('기본주소를 입력해주세요.');
      return;
    }
    if (!address2.trim()) {
      setErrorMsg('상세주소를 입력해주세요.');
      return;
    }

    const payload = {
      label: label.trim() || '배송지',
      receiverName: receiverName.trim(),
      phone: phone.trim(),
      postalCode: postalCode.trim(),
      address1: address1.trim(),
      address2: address2.trim(),
      deliveryMemo: deliveryMemo.trim(),
      isDefault
    };

    try {
      if (initialData) {
        updateAddressFn(userId, initialData.id, payload);
      } else {
        addAddressFn(userId, payload, isDefault);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || '배송지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm max-w-md mx-auto text-left">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 bg-gray-100 rounded-xl text-gray-800 shrink-0">
          <Truck size={18} className="stroke-[2.5]" />
        </span>
        <div>
          <h4 className="font-sans font-black text-slate-850 text-sm">
            {initialData ? '배송지 수정' : '새 배송지 등록'}
          </h4>
          <p className="text-[10px] text-gray-400">안전 에스크로 배송을 위한 배송지 주소록을 관리합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Label / Alias */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              배송지명 (예: 집, 회사)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="집"
              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>

          {/* Receiver Name */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              수령인 이름 *
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="홍길동"
              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            연락처 *
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
            className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300"
          />
        </div>

        {/* Postal Code & Address 1 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              우편번호 *
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="12345"
              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold font-mono text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              기본주소 *
            </label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="서울특별시 강남구 테헤란로"
              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>

        {/* Address 2 Detail */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            상세주소 *
          </label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="101동 202호"
            className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300"
          />
        </div>

        {/* Delivery Memo */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
            배송 요청사항
          </label>
          <input
            type="text"
            value={deliveryMemo}
            onChange={(e) => setDeliveryMemo(e.target.value)}
            placeholder="문 앞에 놓아주세요"
            className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-300"
          />
        </div>

        {/* Is Default Checkbox */}
        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id="make-default"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
          />
          <label htmlFor="make-default" className="text-xs font-bold text-slate-750 font-sans select-none cursor-pointer">
            기본 배송지로 설정하기
          </label>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex-1 py-3 text-xs font-bold text-slate-550 border border-gray-200 bg-white hover:bg-gray-50 font-sans rounded-xl transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            className="cursor-pointer flex-1 py-3 text-xs font-black text-white bg-gray-900 hover:bg-gray-900 flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all rounded-xl"
          >
            <Check size={13} className="stroke-[2.5]" />
            <span>저장하기</span>
          </button>
        </div>
      </form>
    </div>
  );
}

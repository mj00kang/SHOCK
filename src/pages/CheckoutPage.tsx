import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, Landmark, Plus, Truck, Info, AlertTriangle } from 'lucide-react';
import { Product } from '../data/mockData';
import { getProducts, getCoupons, saveCoupons, UserCoupon } from '../utils/storageUtils';
import { 
  getPaymentMethods, 
  createEscrowOrder, 
  payEscrowOrder, 
  PaymentMethod, 
  calculateServiceFee,
  ShippingAddress
} from '../utils/paymentUtils';
import PaymentMethodForm from '../components/PaymentMethodForm';
import { getAddresses, addAddress, Address } from '../utils/addressUtils';

interface CheckoutPageProps {
  productId: string;
  price: number; // final bid/instance price
  currentUserId: string;
  currentUserNickname: string;
  onBackToMain: () => void;
  onSuccess: () => void;
  onNavigateToMyPage?: (tab: string, targetOrderId?: string) => void;
}

export default function CheckoutPage({
  productId,
  price,
  currentUserId,
  currentUserNickname,
  onBackToMain,
  onSuccess,
  onNavigateToMyPage
}: CheckoutPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [isRegisteringMethod, setIsRegisteringMethod] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | undefined>(undefined);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');

  // Address lookup state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  // Shipping details state
  const [receiverName, setReceiverName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [deliveryMemo, setDeliveryMemo] = useState('');

  // Agreement and Confirmation state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // 1. Fetch Product
    const prods = getProducts();
    const found = prods.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    }

    // 2. Fetch Payment Options
    loadPaymentMethods();

    // 3. Fetch Saved Addresses & apply default
    if (currentUserId) {
      const addresses = getAddresses(currentUserId);
      setSavedAddresses(addresses);
      const defaultAddr = addresses.find(a => a.isDefault === true);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setReceiverName(defaultAddr.receiverName);
        setContactPhone(defaultAddr.phone);
        setPostalCode(defaultAddr.postalCode);
        setAddress1(defaultAddr.address1);
        setAddress2(defaultAddr.address2);
        setDeliveryMemo(defaultAddr.deliveryMemo || '');
      }
    }
  }, [productId, currentUserId]);

  const handleAddressChange = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (!addrId) {
      setReceiverName('');
      setContactPhone('');
      setPostalCode('');
      setAddress1('');
      setAddress2('');
      setDeliveryMemo('');
      return;
    }
    const found = savedAddresses.find(a => a.id === addrId);
    if (found) {
      setReceiverName(found.receiverName);
      setContactPhone(found.phone);
      setPostalCode(found.postalCode);
      setAddress1(found.address1);
      setAddress2(found.address2);
      setDeliveryMemo(found.deliveryMemo || '');
    }
  };

  const loadPaymentMethods = () => {
    const list = getPaymentMethods(currentUserId);
    setPaymentMethods(list);
    
    // Automatically select default payment method if it exists
    const defaultPm = list.find(m => m.isDefault);
    if (defaultPm) {
      setSelectedMethodId(defaultPm.id);
    } else if (list.length > 0) {
      setSelectedMethodId(list[0].id);
    }
  };

  // Coupon discount and eligibility logic
  const isCouponUsableForOrderType = (usableOn: string[], orderType: string) => {
    if (orderType === 'instant_deal') {
      return usableOn.includes('instant_deal') || usableOn.includes('instant_buy') || usableOn.includes('buy_now');
    }
    if (orderType === 'auction_win') {
      return usableOn.includes('auction_win');
    }
    return false;
  };

  const parsedOrderType = (product && product.buyNowPrice && Number(price) === Number(product.buyNowPrice)) ? 'instant_deal' : 'auction_win';

  const validCoupons = getCoupons().filter((c) => {
    const isOwner = String(c.userId) === String(currentUserId);
    const notUsed = !c.isUsed;
    const notExpired = new Date(c.expiresAt).getTime() > Date.now();
    const meetsMinOrder = price >= c.minOrderAmount;
    const isTypeValid = isCouponUsableForOrderType(c.usableOn, parsedOrderType);

    return isOwner && notUsed && notExpired && meetsMinOrder && isTypeValid;
  });

  const selectedCoupon = validCoupons.find(c => c.couponId === selectedCouponId);
  const couponDiscount = selectedCoupon ? selectedCoupon.discountAmount : 0;

  const serviceFee = calculateServiceFee(price);
  const shippingFee = 3000;
  const grandTotal = Math.max(0, price + serviceFee + shippingFee - couponDiscount);

  // Primary pay trigger initiating calculations
  const handlePayInitiation = () => {
    if (!product) return;
    if (!selectedMethodId) {
      alert('결제수단을 선택하거나 등록해주세요.');
      return;
    }

    // Validate shipping info
    if (!receiverName.trim()) {
      alert('배송지 수령인 성함을 정확히 입력해 주세요.');
      return;
    }
    if (!contactPhone.trim()) {
      alert('배송지 수령인 연락처 전화를 정확히 입력해 주세요.');
      return;
    }
    if (!postalCode.trim()) {
      alert('배송지 우편번호를 정확히 입력해 주세요.');
      return;
    }
    if (!address1.trim() || !address2.trim()) {
      alert('배송 기본주소 및 상세주소를 모두 성실하게 채워 주세요.');
      return;
    }

    // Terms check validation
    if (!termsAccepted) {
      alert('환불 가능 기간 및 구매확정 조건을 확인해주세요.');
      return;
    }

    // Display confirmation popup before finalizing transaction
    setShowInfoModal(true);
  };

  const executePayment = () => {
    if (!product) return;
    setShowInfoModal(false);
    setIsProcessing(true);

    const address: ShippingAddress = {
      receiverName: receiverName.trim(),
      phone: contactPhone.trim(),
      postalCode: postalCode.trim(),
      address1: address1.trim(),
      address2: address2.trim(),
      deliveryMemo: deliveryMemo.trim() || undefined
    };

    setTimeout(() => {
      try {
        // Save dynamically to address book if selected
        if (saveThisAddress && currentUserId) {
          try {
            const currentSaved = getAddresses(currentUserId);
            const exists = currentSaved.some(a => 
              a.address1 === address.address1 && 
              a.address2 === address.address2 && 
              a.receiverName === address.receiverName
            );
            if (!exists) {
              addAddress(currentUserId, {
                label: '배송지',
                receiverName: address.receiverName,
                phone: address.phone,
                postalCode: address.postalCode,
                address1: address.address1,
                address2: address.address2,
                deliveryMemo: address.deliveryMemo
              }, currentSaved.length === 0);
            }
          } catch (addrErr) {
            console.error('Failed to auto-save address:', addrErr);
          }
        }

        // Create actual escrow order record
        const order = createEscrowOrder({
          productId: product.id,
          productName: product.title,
          productImage: product.image,
          buyerId: currentUserId,
          buyerNickname: currentUserNickname,
          sellerId: product.sellerId,
          sellerNickname: product.sellerNickname || '정통수집가',
          finalPrice: price,
          shippingAddress: address,
          orderType: (product.buyNowPrice && Number(price) === Number(product.buyNowPrice)) ? 'instant_deal' : 'auction_win',
          couponId: selectedCoupon ? selectedCoupon.couponId : undefined,
          couponName: selectedCoupon ? selectedCoupon.name : undefined,
          couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
          originalTotalAmount: price + serviceFee + shippingFee,
          totalPaymentAmount: grandTotal
        });

        // Mark coupon as used after successful order creation
        if (selectedCoupon) {
          const updatedCoupons = getCoupons().map(c => {
            if (c.couponId === selectedCoupon.couponId && String(c.userId) === String(currentUserId)) {
              return {
                ...c,
                isUsed: true,
                usedAt: new Date().toISOString(),
                usedOrderId: order.id
              };
            }
            return c;
          });
          saveCoupons(updatedCoupons);
        }

        // Pay actual created order
        payEscrowOrder(order.id, selectedMethodId);
        setCompletedOrderId(order.id);
        setIsProcessing(false);
        setIsDone(true);
      } catch (err) {
        console.error('Error generating escrow order:', err);
        alert('에스크로 주문 생성 과정에 오류가 발생했습니다.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (isDone) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center animate-fade-in bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md shadow-2xl space-y-6">
          <span className="inline-flex justify-center items-center p-3.5 bg-gray-800/10 text-gray-900 rounded-full animate-bounce">
            <CheckCircle size={36} className="stroke-[2.5]" />
          </span>
          <div className="space-y-2">
            <h3 className="font-sans font-black text-gray-900 text-lg md:text-xl">에스크로 안전 결제 완료!</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              결제가 완료되었습니다. 상품 수령 후 3일 이내 환불 요청이 가능하며, 구매확정 시 판매자에게 정산됩니다.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100 space-y-1.5 font-sans text-xs">
            <div className="flex justify-between text-slate-450">
              <span>수령 상품명:</span>
              <span className="font-extrabold text-gray-700 truncate max-w-[180px]">{product?.title}</span>
            </div>
            <div className="flex justify-between text-slate-450">
              <span>수하인 정보:</span>
              <span className="font-bold text-gray-700">{receiverName} 수령인</span>
            </div>
            <div className="flex justify-between text-slate-450">
              <span>배송 주소:</span>
              <span className="font-mono text-gray-600 font-extrabold max-w-[180px] truncate">({postalCode}) {address1}</span>
            </div>
            <div className="flex justify-between items-center text-slate-450 pt-1.5 border-t border-gray-200">
              <span className="font-extrabold">총액:</span>
              <span className="font-bold font-mono text-sm text-gray-900">{grandTotal.toLocaleString()}원</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigateToMyPage) onNavigateToMyPage('purchases', completedOrderId);
              else onSuccess();
            }}
            className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3.5 rounded-xl shadow-sm transition-all"
          >
            구매내역 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[90vh] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page top header navigator */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBackToMain}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="text-left">
            <h1 className="font-sans font-black text-gray-900 text-base md:text-lg">에스크로 안전 주문결제</h1>
            <p className="text-[11px] text-slate-450">결제금액은 수취인의 구매확정 또는 중탁 완료 시까지 샥 안전 센터에 보관됩니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT AREA: Shipping and Payment Cards (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Purchased Product details banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="font-sans font-extrabold text-xs text-gray-900 mb-4 border-b border-gray-50 pb-2 flex items-center justify-between">
                <span>📦 대상 소장품 세부</span>
                <span className="text-[10px] text-gray-900 font-black">에스크로 정산 방식</span>
              </h3>
              {product ? (
                <div className="flex gap-4 items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] bg-gray-100 text-gray-600 border border-slate-205 font-mono font-black px-1.5 py-0.5 rounded-md uppercase">
                      {product.category}
                    </span>
                    <h4 className="font-sans font-extrabold text-xs text-gray-900 truncate mt-1">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">
                      제안가/낙찰 가격: <span className="font-mono font-bold text-gray-700">{price.toLocaleString()}원</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">데이터를 신속히 동기화하고 있습니다...</p>
              )}
            </div>

            {/* 2. SHIPPING ADDRESS FORM BLOCK */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
              <h3 className="font-sans font-extrabold text-xs text-gray-900 border-b border-gray-50 pb-2">
                📍 배송지 입력 정보
              </h3>

              {/* Saved Addresses dropdown selector */}
              <div className="space-y-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider font-sans">
                  🚚 내 배송지 불러오기
                </label>
                {savedAddresses.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic font-sans leading-normal">
                    등록된 배송지가 없습니다. 결제에 사용할 배송지를 입력해주세요.
                  </p>
                ) : (
                  <select
                    value={selectedAddressId}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs font-semibold text-slate-805 focus:outline-none"
                    id="saved-addresses-dropdown"
                  >
                    <option value="">직접 입력하기</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        [{addr.label}] {addr.receiverName} - {addr.address1} {addr.address2} {addr.isDefault ? ' (기본)' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-gray-600">
                    수령인 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="수령인 성함을 입력하세요"
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-gray-600">
                    연락처 전화 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="예: 010-0000-0000"
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-bold text-gray-600">
                  우편번호 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="우편번호 5자리"
                    className="w-32 text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const mockZips = ['06159', '13494', '48045', '04524', '34141'];
                      const randomZip = mockZips[Math.floor(Math.random() * mockZips.length)];
                      setPostalCode(randomZip);
                      setAddress1('서울특별시 중구 세종대로 110');
                    }}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-slate-205 text-gray-600 text-[10.5px] px-3.5 py-2 rounded-xl transition-all font-sans font-bold"
                  >
                    우편번호 찾기
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-gray-600">
                    기본 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="도로명 주소 혹은 지번 주소"
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-bold text-gray-600">
                    상세 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="동, 호수, 보조 기재 정보 등 상세 주소"
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-bold text-gray-600 font-sans">
                  배송 요청 전달 메시지 (선택)
                </label>
                <input
                  type="text"
                  value={deliveryMemo}
                  onChange={(e) => setDeliveryMemo(e.target.value)}
                  placeholder="예: 문 앞에 놓아주세요, 배송 전 전화 바랍니다"
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-slate-205 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-800 focus:outline-none transition-all font-sans"
                />
              </div>

              {/* Option to save current address */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100/50">
                <input
                  type="checkbox"
                  id="save-this-address"
                  checked={saveThisAddress}
                  onChange={(e) => setSaveThisAddress(e.target.checked)}
                  className="h-4.5 w-4.5 text-gray-800 border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                />
                <label htmlFor="save-this-address" className="text-xs font-bold text-gray-700 font-sans select-none cursor-pointer">
                  현재 입력한 배송지를 내 배송지록에 추가 저장하기
                </label>
              </div>
            </div>

            {/* 3. Escrow and payment gateway selection */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="font-sans font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                  <span>💳 안전 연동 결제 수단</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRegisteringMethod(!isRegisteringMethod)}
                  className="cursor-pointer text-[10px] font-black text-gray-900 hover:text-gray-900 flex items-center gap-0.5"
                >
                  <Plus size={11} />
                  <span>{isRegisteringMethod ? '등록 취소' : '새 결제수단 등록'}</span>
                </button>
              </div>

              {/* Toggle registering forms */}
              {isRegisteringMethod ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                  <PaymentMethodForm
                    userId={currentUserId}
                    onSuccess={() => {
                      setIsRegisteringMethod(false);
                      loadPaymentMethods();
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  {paymentMethods.length === 0 ? (
                    <div className="p-6 border border-dashed border-gray-200 text-center rounded-2xl text-gray-400 space-y-2">
                      <p className="text-xs font-bold leading-normal">안심 등록되어 있는 간편 연동 카드가 없습니다.</p>
                      <button
                        onClick={() => setIsRegisteringMethod(true)}
                        className="cursor-pointer text-[10px] font-black text-gray-600 hover:underline"
                      >
                        지금 신용카드 / 은행 계좌 1초 연결하기
                      </button>
                    </div>
                  ) : (
                    paymentMethods.map((m) => {
                      const selected = selectedMethodId === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMethodId(m.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                            selected
                              ? 'border-gray-500 bg-gray-50/20 text-gray-900 shadow-sm'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-xl ${selected ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {m.type === 'card' ? <CreditCard size={15} /> : <Landmark size={15} />}
                            </span>
                            <div>
                              <p className="text-xs font-black">{m.nickname}</p>
                              <p className="text-[10px] text-slate-450 font-mono mt-0.5">{m.provider} • {m.maskedNumber}</p>
                            </div>
                          </div>
                          <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] font-extrabold ${
                            selected ? 'border-gray-500 bg-gray-500 text-white' : 'border-slate-350'
                          }`}>
                            {selected && '✓'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT AREA: Totals & Agreement Panel (5 columns) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">

            {/* Coupon Application Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
              <div className="flex justify-between items-center border-b border-gray-55 pb-2">
                <h3 className="font-sans font-extrabold text-xs text-gray-900 flex items-center gap-1">
                  🎟️ 쿠폰 할인 적용
                </h3>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                  보유 {validCoupons.length}장
                </span>
              </div>
              
              {validCoupons.length === 0 ? (
                <div className="p-4 border border-dashed border-gray-200 bg-slate-50/50 rounded-2xl text-center text-gray-400 select-none">
                  <p className="text-[11px] font-sans">현재 조건에 사용 가능한 보유 쿠폰이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={selectedCouponId}
                    onChange={(e) => setSelectedCouponId(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-200 rounded-xl px-3.5 py-3 outline-none font-bold focus:border-gray-500 font-sans"
                  >
                    <option value="">-- 사용할 쿠폰 선택 --</option>
                    {validCoupons.map((coupon) => (
                      <option key={coupon.couponId} value={coupon.couponId}>
                        {coupon.name} (-{coupon.discountAmount.toLocaleString()}원)
                      </option>
                    ))}
                  </select>
                  {selectedCoupon && (
                    <div className="bg-rose-50 border border-rose-100/50 p-3 rounded-xl flex items-center justify-between text-[11px] text-rose-700 font-medium">
                      <span>{selectedCoupon.description}</span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedCouponId('')}
                        className="cursor-pointer text-[10px] font-extrabold underline hover:text-rose-900"
                      >
                        적용 해제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment breakdowns */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
              <h3 className="font-sans font-extrabold text-xs text-gray-900 border-b border-gray-50 pb-2">
                💰 최종 결제 수수료 및 산정 내역
              </h3>
              
              <div className="space-y-2.5 font-sans text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>소장품 낙찰/타결가:</span>
                  <span className="font-semibold text-gray-700">{price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>안심 패키지 배송비:</span>
                  <span className="font-semibold text-gray-700">{shippingFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>구매자 안전 수수료 (3%):</span>
                  <span className="text-gray-900 font-extrabold font-mono">{serviceFee.toLocaleString()}원</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>쿠폰 할인 적용:</span>
                    <span className="font-mono">-{couponDiscount.toLocaleString()}원</span>
                  </div>
                )}
                
                <div className="pt-3.5 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">최종 결제금액:</span>
                  <span className="font-black font-mono text-base text-rose-600">{grandTotal.toLocaleString()}원</span>
                </div>
              </div>

              {/* Safe Escrow Notice message */}
              <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl text-[10.5px] text-gray-500 leading-normal space-y-1.5 font-sans">
                <p className="font-black text-gray-700 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-gray-900" />
                  <span>샥 안심 위탁 결제 서비스 (Escrow)</span>
                </p>
                <p>상품 수령 후 3일 이내에는 환불 요청이 가능합니다. 단, 구매확정을 완료하면 판매자에게 정산이 진행되며 이후 일반 환불 요청이 제한됩니다.</p>
                <p>결제금액은 구매확정 전까지 샥 에스크로에 안전하게 보관됩니다.</p>
              </div>

              {/* Agreement checkbox block */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 bg-gray-50 border-slate-205 rounded-md text-gray-900 focus:ring-gray-800"
                  />
                  <span className="text-[11px] text-gray-600 font-bold leading-normal">
                    수령 후 3일 이내 환불 가능 기간과 구매확정 후 환불 제한 조건을 확인했습니다. (필수)
                  </span>
                </label>
              </div>

              {/* CTA button */}
              <button
                type="button"
                onClick={handlePayInitiation}
                disabled={isProcessing}
                className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/35 border-t-white rounded-full animate-spin mr-1"></span>
                    <span>위탁 결제 실행 중...</span>
                  </>
                ) : (
                  <span>{grandTotal.toLocaleString()}원 안전 에스크로 결제하기</span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 6. REAL REFUND NOTICE POPUP MODAL (환불 및 구매확정 안내) */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left space-y-5 animate-scale-in">
            <div className="flex gap-2.5 items-center text-yellow-600 border-b border-yellow-50 pb-3">
              <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
              <h3 className="font-sans font-black text-gray-900 text-sm md:text-base">환불 및 구매확정 안내</h3>
            </div>
            
            <div className="text-xs text-gray-500 space-y-3 font-sans leading-relaxed">
              <p>
                배달 완료 및 상품 수령 후 <strong>3일 이내</strong>에는 마이페이지를 통해 언제든 자유롭게 <strong>환불 요청</strong>이 가능합니다.
              </p>
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-700 font-medium">
                단, 구매자 수동으로 <strong>구매확정</strong>을 먼저 완료하거나 수령 후 3일이 경과하면 에스크로 잔고가 <strong>판매자에게 즉시 실시간 정산</strong>되므로, 이후에는 결제 중단 및 에스크로를 통한 직권 환불 요청이 제한됩니다.
              </div>
              <p className="text-[11px] text-gray-400">
                중요 예방 및 수탁 동의 정보를 완전히 숙지하셨다면 아래 동의 후 결제를 계속 진행하여 주시기 바랍니다.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-sans font-extrabold text-xs py-3 rounded-xl transition-all text-center"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={executePayment}
                className="cursor-pointer flex-1 bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3 rounded-xl shadow-sm transition-all text-center"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

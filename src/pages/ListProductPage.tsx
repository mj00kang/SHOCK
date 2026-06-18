import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, CheckCircle, Landmark, Search, TrendingUp } from 'lucide-react';
import { Product, INITIAL_CATEGORIES } from '../data/mockData';
import { getPayoutAccounts, addPayoutAccount } from '../utils/paymentUtils';
import { getProducts } from '../utils/storageUtils';

interface ListProductPageProps {
  onAddProduct: (newProduct: Partial<Product>) => void;
  onBackToMain: () => void;
  user?: any;
}

export default function ListProductPage({ onAddProduct, onBackToMain, user }: ListProductPageProps) {
  // Form States
  const [title, setTitle] = useState('');
  const [categoryGroup, setCategoryGroup] = useState<'POP' | 'SPORTS' | 'ANALOG' | ''>('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<'새상품급' | '상태우수' | '사용감 있음' | '빈티지' | ''>('');
  const [startPrice, setStartPrice] = useState<number | ''>('');
  const [minBidIncrement, setMinBidIncrement] = useState<number | ''>('');
  const [buyNowPrice, setBuyNowPrice] = useState<number | ''>('');
  const [endAt, setEndAt] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Market Trend Comparison (시세 검색) states
  const [selectedProductForTrend, setSelectedProductForTrend] = useState<Product | null>(null);
  const [trendSearchQuery, setTrendSearchQuery] = useState('');
  const [trendDropdownOpen, setTrendDropdownOpen] = useState(false);
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Auto-initialize market trend comparison product to prod_001 on component mount
  useEffect(() => {
    const allProds = getProducts();
    const defaultProduct = allProds.find(p => p.id === 'prod_001') || allProds[0] || null;
    if (defaultProduct) {
      setSelectedProductForTrend(defaultProduct);
      setTrendSearchQuery(defaultProduct.title);
    }
  }, []);

  const trendSuggestions = React.useMemo(() => {
    if (!trendSearchQuery.trim()) return [];
    // If the input is exactly equal to the selected product's title, don't show suggestion list
    if (selectedProductForTrend && trendSearchQuery === selectedProductForTrend.title) return [];
    const all = getProducts();
    return all.filter(p => p.title.toLowerCase().includes(trendSearchQuery.toLowerCase()));
  }, [trendSearchQuery, selectedProductForTrend]);

  // Payout Account states
  const [payoutAccounts, setPayoutAccounts] = useState<any[]>([]);
  const [selectedPayoutAccountId, setSelectedPayoutAccountId] = useState<string>('new');
  const [newBankName, setNewBankName] = useState('국민은행');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [newAccountNickname, setNewAccountNickname] = useState('');

  // Fetch payout accounts on load
  useEffect(() => {
    if (user?.id) {
      const accs = getPayoutAccounts(user.id);
      setPayoutAccounts(accs);
      if (accs.length > 0) {
        const defaultAcc = accs.find(a => a.isDefault) || accs[0];
        setSelectedPayoutAccountId(defaultAcc.id);
      } else {
        setSelectedPayoutAccountId('new');
      }
    }
  }, [user]);
  
  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Subcategories mapping
  const subCategories = categoryGroup 
    ? INITIAL_CATEGORIES.filter(c => c.group === categoryGroup) 
    : [];

  // Reset subcategory when major group changes - only reset if currently selected subcategory isn't in the new group to allow auto-fill to succeed
  useEffect(() => {
    if (categoryGroup) {
      const validSubcats = INITIAL_CATEGORIES.filter(c => c.group === categoryGroup);
      const isValid = validSubcats.some(s => s.name === categoryName);
      if (!isValid) {
        setCategoryName('');
      }
    } else {
      setCategoryName('');
    }
  }, [categoryGroup]);

  // Pre-populate endAt with default 3 days from now on initial mount
  useEffect(() => {
    if (!endAt) {
      const now = new Date();
      now.setDate(now.getDate() + 3); // 3 days from now
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setEndAt(`${year}-${month}-${date}T${hours}:${minutes}`);
    }
  }, []);

  const handleAutoFill = () => {
    setTitle('1997 오리지널 다마고치 한정판 슬레이트 블루 (풀패키지 최상급)');
    setCategoryGroup('ANALOG');
    setCategoryName('레트로');
    setDescription('1997년 일본 반다이 사에서 출시한 한정판 오리지널 다마고치 슬레이트 블루 색상 완품입니다. 실보관 상태 최상급으로, 오리지널 패키지 박스 및 한글 설명서, 당시 동봉 부속품까지 모두 유실 없이 보존된 민트급 레어 아이템입니다. 작동 테스트 완료하였으며 액션 상태 미세 음질 등 양호합니다.');
    setCondition('새상품급');
    setStartPrice(75000);
    setMinBidIncrement(5000);
    setBuyNowPrice(120000);
    setTagInput('다마고치,레트로완구,한정판,반다이,풀패키지');
    // Set a beautiful retro retro image
    setImages(['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80']);
    
    // Set default bank details
    if (selectedPayoutAccountId === 'new') {
      setNewAccountNumber('110-394-284910');
      setNewAccountHolder('홍길동');
      setNewAccountNickname('나의 메인 정산용');
    }
    
    // Success alert
    alert('⚡ 테스트용 샘플 데이터가 1초 만에 전 분야에 골고루 자동 입력되었습니다!\n즉시 하단의 [애장품 안전 출품 완료] 버튼을 눌러 동작을 테스트해 보세요!');
  };

  // Handle image upload and turn into base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      alert('최대 5장의 사진만 등록할 수 있습니다.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear input value so same file can be uploaded again if deleted
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Live validator helper
  const valForm = (isSubmit = false) => {
    const errs: Record<string, string> = {};
    const checkField = (field: string) => isSubmit || touched[field];

    if (checkField('title') && !title.trim()) {
      errs.title = '상품명을 입력해주세요.';
    }
    if (checkField('categoryGroup') && !categoryGroup) {
      errs.categoryGroup = '대분류를 선택해주세요.';
    }
    if (checkField('categoryName') && categoryGroup && !categoryName) {
      errs.categoryName = '소분류를 선택해주세요.';
    }
    if (checkField('description') && !description.trim()) {
      errs.description = '상품 설명을 상세히 채워주세요.';
    }
    if (checkField('condition') && !condition) {
      errs.condition = '상품 상태 정보를 선택해 주세요.';
    }

    // Start Price
    if (checkField('startPrice')) {
      if (startPrice === '') {
        errs.startPrice = '시작 입찰가를 책정해 주세요.';
      } else if (Number(startPrice) < 1000) {
        errs.startPrice = '시작 입찰가는 최소 1,000원 이상이어야 합니다.';
      } else if (isNaN(Number(startPrice))) {
        errs.startPrice = '숫자만 입력 가능합니다.';
      }
    }

    // Bid increments
    if (checkField('minBidIncrement')) {
      if (minBidIncrement === '') {
        errs.minBidIncrement = '최소 입찰 단위를 설정해 주세요.';
      } else if (Number(minBidIncrement) < 100) {
        errs.minBidIncrement = '최소 입찰 단위는 100원 이상이어야 합니다.';
      } else if (isNaN(Number(minBidIncrement))) {
        errs.minBidIncrement = '숫자만 입력해 주세요.';
      } else if (startPrice !== '' && Number(minBidIncrement) > Number(startPrice)) {
        errs.minBidIncrement = '최소 입찰 단위가 시작 입찰가보다 클 수 없습니다.';
      }
    }

    // Buy Now Price
    if (checkField('buyNowPrice') && buyNowPrice !== '') {
      const buyNowNum = Number(buyNowPrice);
      if (isNaN(buyNowNum)) {
        errs.buyNowPrice = '즉시낙찰가는 숫자로 입력해주세요.';
      } else if (buyNowNum <= 0) {
        errs.buyNowPrice = '즉시낙찰가는 0보다 커야 합니다.';
      } else if (startPrice !== '' && buyNowNum <= Number(startPrice)) {
        errs.buyNowPrice = '즉시낙찰가는 시작 입찰가보다 높아야 합니다.';
      } else if (minBidIncrement !== '' && buyNowNum < Number(minBidIncrement)) {
        errs.buyNowPrice = '즉시낙찰가는 최소 입찰 단위보다 작으면 안 됩니다.';
      }
    }

    // Date/time constraint
    if (checkField('endAt')) {
      if (!endAt) {
        errs.endAt = '경매 마감 시간을 설정해 주세요.';
      } else {
        const selectedDate = new Date(endAt).getTime();
        const currentDate = Date.now();
        if (selectedDate <= currentDate) {
          errs.endAt = '경매 종료시간은 현재 시간 이후로 설정해주세요.';
        }
      }
    }

    // Images count
    if (isSubmit && images.length === 0) {
      errs.images = '상품 사진을 최소 1장 이상 등록해주세요.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    valForm(false);
  }, [title, categoryGroup, categoryName, description, condition, startPrice, minBidIncrement, buyNowPrice, endAt, touched]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark everything as touched
    const allTouched = {
      title: true,
      categoryGroup: true,
      categoryName: true,
      description: true,
      condition: true,
      startPrice: true,
      minBidIncrement: true,
      buyNowPrice: true,
      endAt: true
    };
    setTouched(allTouched);

    const isValid = valForm(true);

    if (!isValid || images.length === 0) {
      const errorList: string[] = [];
      if (!title.trim()) errorList.push('• 상품명을 입력해주세요.');
      if (!categoryGroup) errorList.push('• 대분류를 선택해주세요.');
      if (categoryGroup && !categoryName) errorList.push('• 소분류를 선택해주세요.');
      if (!condition) errorList.push('• 상품 상태를 선택해주세요.');
      if (!description.trim()) errorList.push('• 상품 설명 내용을 상세히 작성해주세요.');
      if (!startPrice) {
        errorList.push('• 시작 입찰가를 설정해주세요.');
      } else if (Number(startPrice) < 1000) {
        errorList.push('• 시작 입찰가는 최소 1,000원 이상이어야 합니다.');
      }
      if (!minBidIncrement) {
        errorList.push('• 최소 입찰 단위를 설정해주세요.');
      } else if (Number(minBidIncrement) < 100) {
        errorList.push('• 최소 입찰 단위는 100원 이상이어야 합니다.');
      }
      if (!endAt) {
        errorList.push('• 경매 마감 시간을 지정해 주세요.');
      } else {
        const selectedDate = new Date(endAt).getTime();
        const currentDate = Date.now();
        if (selectedDate <= currentDate) {
          errorList.push('• 경매 종료시간은 현재 시간 이후여야 합니다.');
        }
      }
      if (images.length === 0) {
        errorList.push('• 상품 사진을 최소 1장 이상 등록해야 합니다.');
      }

      alert(`⚠️ 출품 양식에 누락되거나 잘못 입력된 항목이 있습니다:\n\n${errorList.join('\n')}\n\n💡 힌트: 상단의 '테스트 샘플 데이터로 1초 만에 자동 채우기' 버튼을 토치하시면 즉시 모든 필수 필드가 완성됩니다!`);

      if (images.length === 0) {
        setErrors(prev => ({ ...prev, images: '상품 사진을 최소 1장 이상 등록해주세요.' }));
      }
      // Scroll to top of the page
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Payout Account integration
    if (selectedPayoutAccountId === 'new') {
      if (!newAccountNumber.trim()) {
        alert('정산 계좌번호를 입력해주세요.');
        return;
      }
      const cleanNum = newAccountNumber.replace(/[- ]/g, '');
      if (!/^[0-9]+$/.test(cleanNum)) {
        alert('계좌번호는 숫자와 하이픈(-)만 허용됩니다.');
        return;
      }
      if (cleanNum.length < 8) {
        alert('올바른 계좌번호를 입력해주세요.');
        return;
      }
      if (!newAccountHolder.trim()) {
        alert('정산계좌 예금주명을 입력해주세요.');
        return;
      }

      if (user?.id) {
        try {
          addPayoutAccount(
            user.id,
            newBankName,
            newAccountNumber,
            newAccountHolder,
            newAccountNickname || `${newBankName} 정산계좌`
          );
        } catch (err: any) {
          alert(err.message || '정산계좌 등록 중 오류가 발생했습니다.');
          return;
        }
      }
    }

    // Generate tags list
    const tags = ['유저출품', categoryGroup.toLowerCase()];
    if (tagInput.trim()) {
      tagInput.split(',').forEach(t => {
        const clean = t.trim();
        if (clean && !tags.includes(clean)) tags.push(clean);
      });
    }

    // Ready to list!
    const newProduct: Partial<Product> = {
      title,
      categoryGroup: categoryGroup as 'POP' | 'SPORTS' | 'ANALOG',
      categoryName,
      description,
      image: images[0], // Set first uploaded image as preview thumbnail representation
      startPrice: Number(startPrice),
      currentPrice: Number(startPrice),
      buyNowPrice: buyNowPrice && Number(buyNowPrice) > 0 ? Number(buyNowPrice) : null,
      hasBuyNow: buyNowPrice && Number(buyNowPrice) > 0 ? true : false,
      isInstantDealAvailable: buyNowPrice && Number(buyNowPrice) > 0 ? true : false,
      bidCount: 0,
      likeCount: 0,
      startAt: new Date().toISOString(),
      endAt: new Date(endAt).toISOString(),
      auctionType: 'ascending',
      status: 'live',
      tags,
      sellerNickname: '내 애장품 보관고',
      sellerRating: 5.0,
      condition: condition as '새상품급' | '상태우수' | '사용감 있음' | '빈티지'
    };

    onAddProduct(newProduct);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50/60 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link Button */}
        <div className="flex items-center">
          <button
            onClick={onBackToMain}
            className="page-back-link group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>

        {/* Headline Header */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm text-left relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-gray-900">
              샥 REGISTRATION CENTER
            </span>
            <h1 className="font-display font-black text-2xl md:text-3xl text-slate-950 tracking-tight">
              애장품 출품하기 🦈
            </h1>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-2xl font-sans">
              소장하고 있는 애장품을 경매에 올려보세요. 투명하고 정직한 실시간 아레나 경매가 펼쳐집니다.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none" />
        </div>

        {/* Main Listing Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-left" style={{ fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
          
           {/* Section 1: Basic specifications */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-2">
              <h3 className="text-[13px] font-black tracking-wider text-gray-400 uppercase font-mono">
                01. 기본 정보 등록
              </h3>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 font-extrabold text-[10px] text-white rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-1 shrink-0"
              >
                ⚡ 테스트 샘플 데이터로 1초 만에 자동 채우기
              </button>
            </div>

            {/* Title Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>상품명 <strong className="text-red-500">*</strong></span>
                <span className="text-[11px] font-mono text-slate-450">{title.length}/60자</span>
              </label>
              <input
                type="text"
                placeholder="예: 2002 월드컵 기념 손흥민 사인 한정 축구공"
                maxLength={60}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => handleBlur('title')}
                className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                  errors.title ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30 focus:bg-white'
                }`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title}</p>}
            </div>

            {/* Categorization Dropdowns Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Group major */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  대분류 <strong className="text-red-500">*</strong>
                </label>
                <select
                  value={categoryGroup}
                  onChange={e => {
                    setCategoryGroup(e.target.value as any);
                    handleBlur('categoryGroup');
                  }}
                  onBlur={() => handleBlur('categoryGroup')}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border focus:outline-none bg-white transition-all ${
                    errors.categoryGroup ? 'border-rose-300 bg-rose-50/25' : 'border-gray-200 focus:border-gray-800'
                  }`}
                >
                  <option value="">대분류를 선택하세요</option>
                  <option value="POP">POP Culture / 대중문화</option>
                  <option value="SPORTS">SPORTS / 스포츠</option>
                  <option value="ANALOG">ANALOG / 아날로그</option>
                </select>
                {errors.categoryGroup && <p className="text-[10px] text-red-500 font-bold">{errors.categoryGroup}</p>}
              </div>

              {/* Sub Category Name dependent */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  소분류 <strong className="text-red-500">*</strong>
                </label>
                <select
                  value={categoryName}
                  disabled={!categoryGroup}
                  onChange={e => {
                    setCategoryName(e.target.value);
                    handleBlur('categoryName');
                  }}
                  onBlur={() => handleBlur('categoryName')}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border focus:outline-none transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400 ${
                    errors.categoryName ? 'border-rose-300 bg-rose-50/25' : 'border-gray-200 focus:border-gray-800'
                  }`}
                >
                  {!categoryGroup ? (
                    <option value="">대분류를 먼저 선택해주세요</option>
                  ) : (
                    <>
                      <option value="">소분류를 선택하세요</option>
                      {subCategories.map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.icon} {sub.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.categoryName && <p className="text-[10px] text-red-500 font-bold">{errors.categoryName}</p>}
              </div>
            </div>

            {/* Condition classification & custom tag row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  상품 상태 <strong className="text-red-500">*</strong>
                </label>
                <select
                  value={condition}
                  onChange={e => {
                    setCondition(e.target.value as any);
                    handleBlur('condition');
                  }}
                  onBlur={() => handleBlur('condition')}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border focus:outline-none bg-white transition-all ${
                    errors.condition ? 'border-rose-300 bg-rose-50/25' : 'border-gray-200 focus:border-gray-800'
                  }`}
                >
                  <option value="">상태를 선택하세요</option>
                  <option value="새상품급">✨ 새상품급 (보관 상태가 좋고 거의 새것에 가까운 상품)</option>
                  <option value="상태우수">⭐ 상태우수 (눈에 띄는 흠집이 거의 없는 상품)</option>
                  <option value="사용감 있음">♻️ 사용감 있음 (생활기스 또는 미세한 마찰 흔적이 있는 상품)</option>
                  <option value="빈티지">⚠️ 빈티지 (세월감이나 사용 흔적이 있으며, 일부 스크래치 또는 보관 흔적이 있을 수 있는 상품)</option>
                </select>
                {errors.condition && <p className="text-[10px] text-red-500 font-bold">{errors.condition}</p>}
              </div>

              {/* Tags delimiter inputs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  태그 입력 <span className="text-[10px] text-gray-400 font-normal">(쉼표로 구분)</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 친필사인, 한정판, 보증서유"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-800 bg-gray-50/30 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Large description block */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                상품 설명 <strong className="text-red-500">*</strong>
              </label>
              <textarea
                rows={4}
                placeholder="구입 경로, 보관 방법, 구성품 세부 내역 및 소장 가치 등을 솔직하고 상세하게 적어주세요."
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                  errors.description ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30 focus:bg-white'
                }`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-bold">{errors.description}</p>}
            </div>

          </div>

          {/* Section 2: Financial pricing & Deadline schedules */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h3 className="text-[13px] font-black tracking-wider text-gray-400 uppercase font-mono border-b border-gray-100 pb-2">
              02. 경매 가격 및 일정 설정
            </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Bid Price */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-gray-700">
                  시작 입찰가 <strong className="text-red-500">*</strong>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1000}
                    step={100}
                    placeholder="1000"
                    value={startPrice}
                    onChange={e => setStartPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    onBlur={() => handleBlur('startPrice')}
                    className={`w-full text-xs font-mono font-bold pr-8 pl-4 py-3 rounded-xl border focus:outline-none transition-all ${
                      errors.startPrice ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450 select-none">원</span>
                </div>
                {errors.startPrice && <p className="text-[10px] text-red-500 font-bold">{errors.startPrice}</p>}
              </div>

              {/* Minimally admissible bidding step */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-gray-700">
                  최소 입찰 단위 <strong className="text-red-500">*</strong>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={100}
                    step={100}
                    placeholder="100"
                    value={minBidIncrement}
                    onChange={e => setMinBidIncrement(e.target.value === '' ? '' : Number(e.target.value))}
                    onBlur={() => handleBlur('minBidIncrement')}
                    className={`w-full text-xs font-mono font-bold pr-8 pl-4 py-3 rounded-xl border focus:outline-none transition-all ${
                      errors.minBidIncrement ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450 select-none">원</span>
                </div>
                {errors.minBidIncrement && <p className="text-[10px] text-red-500 font-bold">{errors.minBidIncrement}</p>}
              </div>

              {/* Buy Now Price (즉시낙찰가) */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  <span>즉시낙찰가 <span className="text-[10px] text-slate-405 font-medium">(선택)</span></span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={100}
                    placeholder="예: 120000"
                    value={buyNowPrice}
                    onChange={e => setBuyNowPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    onBlur={() => handleBlur('buyNowPrice')}
                    className={`w-full text-xs font-mono font-bold pr-8 pl-4 py-3 rounded-xl border focus:outline-none transition-all ${
                      errors.buyNowPrice ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450 select-none">원</span>
                </div>
                {errors.buyNowPrice ? (
                  <p className="text-[10px] text-red-500 font-bold">{errors.buyNowPrice}</p>
                ) : (
                  <p className="text-[9px] text-slate-450 leading-tight">
                    구매자가 이 금액으로 바로 결제하면 경매 종료를 기다리지 않고 거래가 성사됩니다.
                  </p>
                )}
              </div>

              {/* End of live bidding countdown calendar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  경매 마감 시간 <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={e => setEndAt(e.target.value)}
                  onBlur={() => handleBlur('endAt')}
                  className={`w-full text-xs font-bold px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                    errors.endAt ? 'border-rose-300 bg-rose-50/25 focus:border-red-500' : 'border-gray-200 focus:border-gray-800 bg-gray-50/30'
                  }`}
                />
                {errors.endAt && <p className="text-[10px] text-red-500 font-bold">{errors.endAt}</p>}
              </div>
            </div>

            {/* 시세 검색 (Market Trend Comparison Area resembling KREAM screenshot) */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <TrendingUp size={15} className="text-emerald-500 animate-pulse" />
                <span>애장품 실시간 시세 조회</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline ml-1">거래 기록을 수집한 실시간 시세 리포트 입니다</span>
              </div>

              {/* Pill-shaped container wrapper mimicking user's reference screenshot */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-205/60 relative overflow-visible">
                
                {/* Product Detail presentation on the left */}
                <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                  <div className="w-[50px] h-[50px] bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center shadow-sm">
                    {selectedProductForTrend ? (
                      <img 
                        src={selectedProductForTrend.image} 
                        className="w-full h-full object-cover" 
                        alt="market-trend-product-thumb"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-gray-300 text-[10px] font-black font-sans text-center px-1">시세 조회</div>
                    )}
                  </div>

                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[10px] sm:text-[11px] text-red-500 font-bold tracking-tight h-4 font-sans uppercase">
                      {selectedProductForTrend ? selectedProductForTrend.category || '빈티지토이' : '정밀 마켓 시세'}
                    </span>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug truncate font-sans max-w-[280px] lg:max-w-[400px]">
                      {selectedProductForTrend ? selectedProductForTrend.title : '등록 예정인 애장품과 동일/유사한 상품 시세를 분석해보세요.'}
                    </h4>
                  </div>
                </div>

                {/* Right: Search autocomplete input box + 상세 보기 Button */}
                <div className="flex items-center gap-2 w-full md:w-auto relative shrink-0" onMouseLeave={() => setTrendDropdownOpen(false)}>
                  <div className="relative w-full md:w-72">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search size={14} />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="유사 상품명 또는 키워드 시세 검색..."
                      value={trendSearchQuery}
                      onChange={(e) => {
                        setTrendSearchQuery(e.target.value);
                        setTrendDropdownOpen(true);
                      }}
                      onFocus={() => setTrendDropdownOpen(true)}
                      className="w-full h-10 pl-9 pr-9 text-xs font-semibold bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-800 transition-all text-slate-900 shadow-sm"
                    />

                    {trendSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setTrendSearchQuery('');
                          setSelectedProductForTrend(null);
                          setTrendDropdownOpen(false);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 p-0.5 rounded-full"
                      >
                        <X size={13} />
                      </button>
                    )}

                    {/* Autocomplete Dropdown suggestions list */}
                    {trendDropdownOpen && trendSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 max-h-56 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl divide-y divide-gray-50">
                        {trendSuggestions.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              setSelectedProductForTrend(prod);
                              setTrendSearchQuery(prod.title);
                              setTrendDropdownOpen(false);
                            }}
                            className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-slate-800 font-sans"
                          >
                            <img src={prod.image} className="w-[30px] h-[30px] rounded-md object-cover border border-gray-150 flex-shrink-0" referrerPolicy="no-referrer" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold text-red-500 uppercase leading-none mb-0.5">{prod.category || '기타'}</p>
                              <p className="text-xs font-bold text-gray-900 truncate">{prod.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedProductForTrend) {
                        alert('검색어 창에 키워드를 입력하여 비교할 상품을 먼저 선택해주세요!');
                        return;
                      }
                      setIsTrendModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-full bg-[#111827] text-white hover:bg-slate-800 active:scale-95 text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer flex items-center justify-center"
                  >
                    상세 보기
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Section 3: Pictures registration file uploads */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h3 className="text-[13px] font-black tracking-wider text-gray-400 uppercase font-mono border-b border-gray-100 pb-2">
              03. 상품 사진 등록 (1 ~ 5장)
            </h3>

            <div className="space-y-3">
              {/* Photo Selectors Grid */}
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Upload Button Trigger */}
                {images.length < 5 && (
                  <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 shadow-sm group flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload size={20} className="text-gray-800 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-gray-900">사진 추가</span>
                    <span className="text-[8px] font-mono font-bold text-gray-400">{images.length}/5</span>
                  </label>
                )}

                {/* Micro previews cards */}
                {images.map((img, idx) => (
                  <div key={idx} className="w-24 h-24 rounded-2xl border border-gray-200 bg-gray-50 relative overflow-hidden group flex-shrink-0 shadow-sm">
                    <img src={img} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                    
                    {/* Badge showing cover pic */}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-gray-900 text-white font-sans text-[8px] font-black z-10 leading-none shadow-sm">
                        대표
                      </span>
                    )}

                    {/* Delete Cover button overlay */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer text-white z-10"
                    >
                      <X size={16} className="transform scale-90 group-hover:scale-100 transition-transform duration-200" />
                    </button>
                  </div>
                ))}

              </div>

              {errors.images && <p className="text-[10px] text-red-500 font-bold mt-1.5">{errors.images}</p>}
              
              <ul className="text-[10px] list-disc list-inside text-slate-450 space-y-1 pl-1 line-relaxed pt-2 leading-tight">
                <li>첫 번째 사진이 경매 메인 리스트의 **대표 노출 이미지**로 자동 안착됩니다.</li>
                <li>최소 1장 이상 등록해야 출품이 승인되며, 최대 5장까지 수용 가능합니다.</li>
                <li>PNG, JPG, WebP 등의 보편적인 이미지 형식을 지원합니다.</li>
              </ul>
            </div>

          </div>

          {/* Section 4: Seller Settlement Account info setup */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h3 className="text-[13px] font-black tracking-wider text-gray-400 uppercase font-mono border-b border-gray-100 pb-2">
              04. 판매자 정산계좌 연동 정보
            </h3>

            <div className="bg-gray-50/60 border border-gray-250/50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-gray-900" />
                <p className="text-[13px] font-bold text-gray-900 font-sans">에스크로 정산용 계좌 지정 및 등록</p>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal font-sans">
                구매자가 <strong>구매확정</strong>을 완료한 뒤 낙찰 대금을 실시간으로 정산받을 계좌입니다.
              </p>

              {payoutAccounts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700 block">등록된 정산계좌 선택</label>
                  <select
                    value={selectedPayoutAccountId}
                    onChange={(e) => setSelectedPayoutAccountId(e.target.value)}
                    className="w-full h-11 bg-white border border-gray-250 rounded-xl px-3.5 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-gray-205"
                  >
                    {payoutAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bankName} - {acc.accountNumber} ({acc.accountHolder}) {acc.nickname ? `[${acc.nickname}]` : ''}
                      </option>
                    ))}
                    <option value="new">➕ 새 정산계좌 직접 추가 후 등록</option>
                  </select>
                </div>
              )}

              {selectedPayoutAccountId === 'new' && (
                <div className="space-y-4 pt-2 border-t border-gray-200/50">
                  <p className="text-[10px] font-bold text-gray-800">새 정산 계좌 세부 정보 입력</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-sans">
                        정산 은행
                      </label>
                      <select
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-semibold text-gray-950"
                      >
                        {['국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크', '새마을금고', '우체국'].map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-sans">
                        예금주명
                      </label>
                      <input
                        type="text"
                        value={newAccountHolder}
                        onChange={(e) => setNewAccountHolder(e.target.value)}
                        placeholder="예: 홍길동"
                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-950"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-sans">
                        계좌번호 (하이픈 포함 가능)
                      </label>
                      <input
                        type="text"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                        placeholder="예: 123-456-789012"
                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-bold font-mono text-gray-950"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-sans">
                        계좌 별칭 (선택)
                      </label>
                      <input
                        type="text"
                        value={newAccountNickname}
                        onChange={(e) => setNewAccountNickname(e.target.value)}
                        placeholder="예: 나의 주거래 정산지"
                        className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-xs font-semibold text-gray-950"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real action submit button */}
          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-left text-xs text-gray-400 max-w-md">
              동물 보호 헌장 준수 및 가품 출품 시 제명 처리 동의로 간주되며, 등록된 상품은 실시간으로 입찰자에게 양도되는 상향식 옥션입니다.
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 active:translate-y-0.5 text-white font-extrabold text-sm px-10 py-4 rounded-2xl cursor-pointer shadow-md transition-all flex items-center gap-2 justify-center"
            >
              <CheckCircle size={18} />
              <span>애장품 안전 출품 완료</span>
            </button>
          </div>

        </form>

        {/* 실시간 시세 분석 리포트 모달 (Detailed Interactive KREAM-style Market Price Survey Modal) */}
        {isTrendModalOpen && selectedProductForTrend && (() => {
          const basePrice = selectedProductForTrend.currentPrice || selectedProductForTrend.startPrice || 100000;
          const suggestedPrice = Math.round((basePrice * 0.9) / 5000) * 5000;
          const suggestedBuyNow = Math.round((basePrice * 1.25) / 10000) * 10000;
          
          // Generate beautiful historical points matching search product
          const modalChartData = [
            { date: '05/20', price: Math.round(basePrice * 0.81) },
            { date: '05/25', price: Math.round(basePrice * 0.86) },
            { date: '05/30', price: Math.round(basePrice * 0.83) },
            { date: '06/04', price: Math.round(basePrice * 0.91) },
            { date: '06/09', price: Math.round(basePrice * 0.95) },
            { date: '06/14', price: Math.round(basePrice * 1.00) },
          ];

          const paddingX = 40;
          const paddingY = 18;
          const chartW = 440;
          const chartH = 110;
          
          const maxVal = Math.max(...modalChartData.map(d => d.price)) * 1.05;
          const minVal = Math.min(...modalChartData.map(d => d.price)) * 0.95;
          const range = maxVal - minVal || 1;

          const getX = (idx: number) => paddingX + (idx * (chartW - paddingX * 2)) / (modalChartData.length - 1);
          const getY = (val: number) => chartH - paddingY - ((val - minVal) * (chartH - paddingY * 2)) / range;

          const pointsStr = modalChartData.map((d, i) => `${getX(i).toFixed(1)},${getY(d.price).toFixed(1)}`).join(' ');
          const areaPointsStr = `${getX(0).toFixed(1)},${(chartH - paddingY).toFixed(1)} ${pointsStr} ${getX(modalChartData.length - 1).toFixed(1)},${(chartH - paddingY).toFixed(1)}`;

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs p-3">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="px-4.5 py-3 border-b border-gray-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={15} className="text-red-500 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-black text-gray-900 font-sans">실시간 애장품 시세 분석 리포트</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsTrendModalOpen(false);
                      setHoverIndex(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-slate-800">
                  
                  {/* Selected Product info card */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                    <img 
                      src={selectedProductForTrend.image} 
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      alt="compare-prod-thumb"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 text-left flex-1">
                      <span className="text-[9px] text-red-500 font-bold uppercase">{selectedProductForTrend.categoryGroup || '빈티지토이'}</span>
                      <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{selectedProductForTrend.title}</h4>
                      <p className="text-[9px] text-gray-400 font-medium font-mono leading-none mt-0.5">최종 거래가: {basePrice.toLocaleString()}원</p>
                    </div>
                  </div>

                  {/* Pricing metrics grid (bento-box info) */}
                  <div className="grid grid-cols-3 gap-2 text-center shrink-0">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2">
                      <span className="text-[8px] text-gray-400 font-semibold block">최근 실거래가</span>
                      <span className="text-xs font-black text-emerald-600 font-mono mt-0.5 block">{basePrice.toLocaleString()}원</span>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2">
                      <span className="text-[8px] text-gray-400 font-semibold block">최근 30일 추이</span>
                      <span className="text-xs font-black text-rose-500 font-mono mt-0.5 block">+18.4% ▲</span>
                    </div>
                    <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-2">
                      <span className="text-[8px] text-gray-400 font-semibold block">누적 성사 건수</span>
                      <span className="text-xs font-black text-slate-800 font-mono mt-0.5 block">24건</span>
                    </div>
                  </div>

                  {/* SVG Market Price Trend Chart Container */}
                  <div className="border border-slate-150 rounded-xl p-3 bg-white space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold font-sans">
                      <span>최근 전설 시세 변동 추이 (30일 간)</span>
                      <span className="text-emerald-500 font-sans">★ 실거래 성사 데이터 기반</span>
                    </div>
                    
                    {/* SVG Chart Drawing */}
                    <div className="w-full overflow-hidden flex items-center justify-center">
                      <svg 
                        width="100%" 
                        height={chartH} 
                        viewBox={`0 0 ${chartW} ${chartH}`}
                        className="overflow-visible"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const mouseX = e.clientX - rect.left;
                          const ratio = mouseX / rect.width;
                          const exactX = ratio * chartW;
                          
                          // Find closest data coordinate index
                          let closestIdx = 0;
                          let minDistance = Infinity;
                          for (let i = 0; i < modalChartData.length; i++) {
                            const dX = getX(i);
                            const dist = Math.abs(exactX - dX);
                            if (dist < minDistance) {
                              minDistance = dist;
                              closestIdx = i;
                            }
                          }
                          setHoverIndex(closestIdx);
                        }}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        <defs>
                          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>

                        {/* Chart Grid Lines */}
                        <line x1={paddingX} y1={paddingY} x2={chartW - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth="1" />
                        <line x1={paddingX} y1={(chartH / 2).toFixed(1)} x2={chartW - paddingX} y2={(chartH / 2).toFixed(1)} stroke="#f1f5f9" strokeWidth="1" />
                        <line x1={paddingX} y1={(chartH - paddingY).toFixed(1)} x2={chartW - paddingX} y2={(chartH - paddingY).toFixed(1)} stroke="#e2e8f0" strokeWidth="1" />

                        {/* Y-axis labels text coordinates */}
                        <text x={paddingX - 8} y={(paddingY + 3).toFixed(1)} textAnchor="end" className="text-[9px] fill-slate-400 font-semibold font-mono">{maxVal.toLocaleString()}</text>
                        <text x={paddingX - 8} y={(chartH / 2 + 3).toFixed(1)} textAnchor="end" className="text-[9px] fill-slate-400 font-semibold font-mono">{Math.round((maxVal + minVal) / 2).toLocaleString()}</text>
                        <text x={paddingX - 8} y={(chartH - paddingY + 3).toFixed(1)} textAnchor="end" className="text-[9px] fill-slate-400 font-semibold font-mono">{minVal.toLocaleString()}</text>

                        {/* Gradient Area under line */}
                        <polygon points={areaPointsStr} fill="url(#trendAreaGrad)" />

                        {/* Smoothed trend line curve */}
                        <polyline
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2"
                          points={pointsStr}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Interactive Scrub Hover Overlays */}
                        {hoverIndex !== null && modalChartData[hoverIndex] && (
                          <>
                            <line 
                              x1={getX(hoverIndex).toFixed(1)} 
                              y1={paddingY} 
                              x2={getX(hoverIndex).toFixed(1)} 
                              y2={(chartH - paddingY).toFixed(1)} 
                              stroke="#cbd5e1" 
                              strokeWidth="1" 
                              strokeDasharray="2 2" 
                            />
                            <circle 
                              cx={getX(hoverIndex).toFixed(1)} 
                              cy={getY(modalChartData[hoverIndex].price).toFixed(1)} 
                              r="5" 
                              fill="#EF4444" 
                              stroke="#FFFFFF" 
                              strokeWidth="2" 
                            />
                            {/* Hover tooltip text bubble dynamically adapted to screen limits */}
                            <g transform={`translate(${getX(hoverIndex) > chartW - 120 ? getX(hoverIndex) - 110 : getX(hoverIndex) + 8}, ${getY(modalChartData[hoverIndex].price) - 30})`}>
                              <rect width="90" height="34" fill="rgba(15, 23, 42, 0.9)" rx="6" />
                              <text x="8" y="13" fill="#ffffff" fontSize="8" fontWeight="bold">날짜: {modalChartData[hoverIndex].date}</text>
                              <text x="8" y="25" fill="#FDA4AF" fontSize="9" fontWeight="800" fontFamily="monospace">시세: {modalChartData[hoverIndex].price.toLocaleString()}원</text>
                            </g>
                          </>
                        )}

                        {/* X coordinates dates labels mapping */}
                        {modalChartData.map((d, i) => (
                          <g key={i}>
                            <text 
                              x={getX(i).toFixed(1)} 
                              y={(chartH - paddingY + 14).toFixed(1)} 
                              textAnchor="middle" 
                              className="text-[9px] fill-slate-400 font-bold"
                            >
                              {d.date}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Recommendation block & form sync CTA */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left space-y-3.5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400">📊 샥 빅데이터 AI 최적 시작가 제안</p>
                      <h5 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-normal">
                        해당 상품은 시세가 상승 중이며, 실거래 변동 기반의 등록 권장 가격은 다음과 같습니다:
                      </h5>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-[9px] text-gray-400 block font-semibold">추천 시작가 (시세 90%)</span>
                        <strong className="text-sm font-black text-rose-500 font-mono mt-0.5 block">{suggestedPrice.toLocaleString()} 원</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-semibold">추천 최소 입찰 단위</span>
                        <strong className="text-sm font-black text-gray-900 font-mono mt-0.5 block">5,000 원</strong>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-400 font-medium leading-relaxed font-sans">
                      * 이 가격 정보는 수집된 최근 거래기록과 가상 KREAM 기준입니다. 아래 "적용하기" 버튼을 터치하면 이 추천 낙찰 가격이 현재 출품서에 즉각 주입됩니다.
                    </div>
                  </div>

                </div>

                {/* Modal Actions Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2.5 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTrendModalOpen(false);
                      setHoverIndex(null);
                    }}
                    className="flex-1 h-12 rounded-xl border border-gray-200 hover:bg-gray-150 text-gray-700 text-xs font-black transition-colors"
                  >
                    닫기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStartPrice(suggestedPrice);
                      setMinBidIncrement(5000);
                      setBuyNowPrice(suggestedBuyNow);
                      setIsTrendModalOpen(false);
                      setHoverIndex(null);
                      alert(`💡 최적 시세 정보가 출품서에 적용되었습니다!\n- 시작 입찰가: ${suggestedPrice.toLocaleString()}원\n- 최소 입찰단위: 5,000원\n- 즉시 구매가: ${suggestedBuyNow.toLocaleString()}원`);
                    }}
                    className="flex-1 h-12 rounded-xl bg-[#111827] hover:bg-slate-800 text-white text-xs font-black transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    내 출품 조건으로 일괄 적용
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </main>
  );
}

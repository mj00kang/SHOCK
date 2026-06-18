import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Save } from 'lucide-react';
import { Product } from '../data/mockData';

interface ProductEditModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export default function ProductEditModal({
  isOpen,
  product,
  onClose,
  onSave
}: ProductEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('near_mint');
  const [tagsString, setTagsString] = useState('');
  const [buyNowPrice, setBuyNowPrice] = useState<string>('');
  const [endAt, setEndAt] = useState('');
  
  // Start price and min increment (read-only if bids exist)
  const [startPrice, setStartPrice] = useState<string>('');
  const [minBidIncrement, setMinBidIncrement] = useState<string>('1000');

  // Images state
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const hasBids = product ? (product.bidCount > 0 || (product as any).bidsCount > 0) : false;
  const isSold = product ? product.status === 'sold' : false;

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setCondition(product.condition || 'near_mint');
      setTagsString(product.tags ? product.tags.join(' ') : '');
      setBuyNowPrice(product.buyNowPrice ? product.buyNowPrice.toString() : '');
      setStartPrice(product.startPrice ? product.startPrice.toString() : '');
      setMinBidIncrement((product as any).minBidIncrement ? (product as any).minBidIncrement.toString() : '1000');
      
      // Convert UTC or ISO date to local datetime-local format for input
      try {
        const d = new Date(product.endAt);
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
        setEndAt(localISOTime);
      } catch (e) {
        setEndAt('');
      }

      // Load images (support product.images or fallback to singular product.image)
      if ((product as any).images && (product as any).images.length > 0) {
        setImagesList((product as any).images);
      } else {
        setImagesList([product.image]);
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Render check for sold items
  if (isSold) {
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center space-y-4">
          <p className="text-sm font-bold text-gray-900">이미 낙찰 완료(sold)된 상품은 수정할 수 없습니다.</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold">닫기</button>
        </div>
      </div>
    );
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (imagesList.length >= 5) {
      alert('사진은 최대 5장만 등록 가능합니다.');
      return;
    }
    setImagesList([...imagesList, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (imagesList.length <= 1) {
      alert('상품 대표 이미지는 최소 1장 이상 등록되어 있어야 합니다.');
      return;
    }
    setImagesList(imagesList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('상품명을 입력해 주세요.');
      return;
    }
    if (!description.trim()) {
      alert('상세 설명을 입력해 주세요.');
      return;
    }
    if (imagesList.length === 0) {
      alert('최소 1개 이상의 상품 사진이 등록되어야 합니다.');
      return;
    }

    // Parsing buy Now price
    const bnpValue = buyNowPrice.trim() ? parseInt(buyNowPrice) : undefined;
    if (bnpValue !== undefined && isNaN(bnpValue)) {
      alert('즉시낙찰가는 숫자로 정확히 써주세요.');
      return;
    }

    const startPrValue = parseInt(startPrice);
    if (isNaN(startPrValue)) {
      alert('시작가는 숫자로 입력해 주세요.');
      return;
    }

    const minBidIncValue = parseInt(minBidIncrement);
    if (isNaN(minBidIncValue)) {
      alert('최소 입찰 단위는 숫자로 입력해 주세요.');
      return;
    }

    // end time ISO format convert
    let finalEndAtISO = product.endAt;
    if (endAt) {
      try {
        finalEndAtISO = new Date(endAt).toISOString();
      } catch (err) {
        alert('날짜 형식이 올바르지 않습니다.');
        return;
      }
    }

    // parse tags
    const parsedTags = tagsString
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`.replace('##', '#'));

    const updatedProduct: Product = {
      ...product,
      title: title.trim(),
      description: description.trim(),
      condition: condition as any,
      tags: parsedTags,
      buyNowPrice: bnpValue,
      hasBuyNow: bnpValue !== undefined && bnpValue > 0 ? true : false,
      endAt: finalEndAtISO,
      image: imagesList[0], // Main preview is the first image
      images: imagesList as any, // Full array
      startPrice: startPrValue,
      minBidIncrement: minBidIncValue as any
    };

    onSave(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-sans font-black text-gray-900 text-sm">출품 애장품 수정</h3>
            {hasBids && (
              <p className="text-[10px] text-red-500 font-bold mt-0.5">⚠️ 입찰이 진행 중인 상품이므로 시작가와 입찰 단위는 수정 불가합니다.</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left font-sans">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">상품명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Condition */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">상품 상태등급</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-pointer focus:outline-none focus:border-gray-300"
            >
              <option value="unopened">미개봉 (Unopened)</option>
              <option value="new_with_tag">택 존재 새상품 (New with tag)</option>
              <option value="near_mint">S급 극미중고 (Near mint)</option>
              <option value="excellent">A급 민트급 (Excellent)</option>
              <option value="good">일반 중고품 (Good)</option>
              <option value="used">사용감 많은 빈티지 (Used)</option>
            </select>
          </div>

          {/* Start Price (Readonly if bids exist) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">경매 시작가 (원)</label>
            <input
              type="number"
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
              disabled={hasBids}
              className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${
                hasBids 
                  ? 'bg-gray-100 border-slate-250 text-gray-400 cursor-not-allowed font-mono' 
                  : 'bg-white border-gray-200 text-slate-850'
              }`}
            />
          </div>

          {/* Minimum bid increment (Readonly if bids exist) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">최소 입찰 단위 (원)</label>
            <input
              type="number"
              value={minBidIncrement}
              onChange={(e) => setMinBidIncrement(e.target.value)}
              disabled={hasBids}
              className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${
                hasBids 
                  ? 'bg-gray-100 border-slate-250 text-gray-400 cursor-not-allowed font-mono' 
                  : 'bg-white border-gray-200 text-slate-850'
              }`}
            />
          </div>

          {/* Buy Now Price */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">⚡ 즉시낙찰가 (원, 미기입 시 불가)</label>
            <input
              type="number"
              placeholder="즉시 낙찰 가능한 가격 입력"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">경매 종료 시각</label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 cursor-pointer focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">상품 상세정보 설명</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">태그 (공백 구분)</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none"
            />
          </div>

          {/* Multi layout photo section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              상품 사진 관리 ({imagesList.length}/5장)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="이미지 URL을 복사해 넣으세요"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="cursor-pointer bg-gray-900 text-white rounded-xl px-3.5 py-1.5 text-xs font-black flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Photos thumbnail preview lists */}
            <div className="flex flex-wrap gap-2 pt-1">
              {imagesList.map((url, idx) => (
                <div key={idx} className="relative h-14 w-14 rounded-md border border-gray-200 bg-slate-55 overflow-hidden group/thumb">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-gray-900 text-white text-[7px] text-center font-bold tracking-tight py-0.2">
                      대표사진
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover/thumb:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Save size={14} />
              <span>수정내용 등록 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

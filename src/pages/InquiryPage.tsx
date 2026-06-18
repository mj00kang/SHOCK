import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { getInquiries, saveInquiries, Inquiry, UserState } from '../utils/storageUtils';

interface InquiryPageProps {
  onBack: () => void;
  currentUser: UserState | null;
}

const INQUIRY_TYPES = [
  '거래/입찰', '결제/쿠폰', '배송/방문수거', '환불/구매확정', '계정/로그인', '커뮤니티', '기타'
];

export default function InquiryPage({ onBack, currentUser }: InquiryPageProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedType, setSelectedType] = useState(INQUIRY_TYPES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      const allInquiries = getInquiries();
      setInquiries(allInquiries.filter(inq => inq.userId === currentUser.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("로그인이 필요합니다.");
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요.");

    const newInquiry: Inquiry = {
      id: "inq-" + Date.now(),
      userId: currentUser.id,
      type: selectedType,
      title,
      content,
      relatedOrderId: relatedOrderId || undefined,
      status: "접수 완료",
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...getInquiries()];
    saveInquiries(updated);
    
    // Update local state
    setInquiries(prev => [newInquiry, ...prev]);
    
    // Reset form
    setTitle('');
    setContent('');
    setRelatedOrderId('');
    setSelectedType(INQUIRY_TYPES[0]);
    alert("문의가 접수되었습니다.");
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-gray-500 font-sans">
        로그인 후 이용할 수 있는 서비스입니다.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="max-w-[1180px] w-full mx-auto px-6 py-10 pb-20">
        
        {/* Header Section */}
        <div className="mb-8 cursor-pointer inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors" onClick={onBack}>
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">메인 홈으로 돌아가기</span>
        </div>
        
        <div className="mb-10 space-y-3">
          <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold leading-none">고객센터</span>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">1:1 문의</h2>
          <p className="text-gray-500 font-medium">거래, 결제, 배송, 환불 등 이용 중 불편한 점을 문의해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Form */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)] h-fit">
            <h3 className="font-black text-lg text-gray-900 mb-6">문의 내용 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">문의 유형 *</label>
                <select 
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                >
                  {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">제목 *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요"
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">관련 주문번호 (선택)</label>
                <input 
                  type="text" 
                  value={relatedOrderId}
                  onChange={e => setRelatedOrderId(e.target.value)}
                  placeholder="ord-0123... (선택 사항)"
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">내용 *</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="문의하실 내용을 상세히 적어주세요."
                  className="w-full min-h-[140px] border border-gray-200 rounded-xl p-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 resize-y"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">첨부 이미지 (선택)</label>
                <input 
                  type="file" 
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] py-2 text-sm focus:outline-none"
                  accept="image/*"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white rounded-full h-[44px] px-5 font-extrabold flex items-center justify-center hover:bg-black transition-colors"
              >
                문의 접수하기
              </button>
            </form>
          </div>

          {/* Right: List */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)] h-fit">
            <h3 className="font-black text-lg text-gray-900 mb-6">내 문의 내역</h3>
            
            {inquiries.length === 0 ? (
              <div className="py-16 text-center space-y-2 text-gray-400">
                <p className="font-bold">접수된 문의내역이 없습니다.</p>
                <p className="text-xs">궁금한 점이나 불편한 사항이 있다면 언제든 문의해주세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                          {inq.type}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 text-[11px] font-bold ${inq.answer ? 'text-green-600' : 'text-rose-500'}`}>
                        {inq.answer ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {inq.status}
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-2 truncate">{inq.title}</h4>
                    <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">{inq.content}</p>
                    
                    {inq.answer && (
                      <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-100/50 -mx-2 -mb-2 p-3 rounded-lg text-xs leading-relaxed text-gray-800">
                        <div className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-green-500"/>
                          답변
                        </div>
                        {inq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

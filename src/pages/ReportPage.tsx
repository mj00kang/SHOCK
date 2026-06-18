import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { getReports, saveReports, Report, UserState } from '../utils/storageUtils';

interface ReportPageProps {
  onBack: () => void;
  currentUser: UserState | null;
}

const REPORT_TYPES = [
  '허위 상품/가품 의심', '사기 의심 거래', '부적절한 게시글/댓글', '욕설/비방/괴롭힘', '거래 외부 유도', '기타'
];

export default function ReportPage({ onBack, currentUser }: ReportPageProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0]);
  const [content, setContent] = useState('');
  const [targetId, setTargetId] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      const allReports = getReports();
      setReports(allReports.filter(rep => rep.userId === currentUser.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("신고 내용을 입력해주세요.");

    const newReport: Report = {
      id: "rep-" + Date.now(),
      userId: currentUser.id,
      reportType: selectedType,
      targetType: 'user_input',
      targetId: targetId || undefined,
      content,
      status: "접수 완료",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReport, ...getReports()];
    saveReports(updated);
    
    // Update local state
    setReports(prev => [newReport, ...prev]);
    
    // Reset form
    setContent('');
    setTargetId('');
    setSelectedType(REPORT_TYPES[0]);
    alert("신고가 접수되었습니다. 운영 정책에 따라 검토됩니다.");
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
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold leading-none">고객센터</span>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">신고하기</h2>
          <p className="text-gray-500 font-medium">부적절한 상품, 허위 거래, 사기 의심, 커뮤니티 위반 내용을 신고해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Form */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)] h-fit">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-rose-500" size={24} />
              <h3 className="font-black text-lg text-gray-900">신고 내용 작성</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">신고 유형 *</label>
                <select 
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                >
                  {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">신고 대상 (상품ID / 게시글ID / 닉네임 유저 등 식별 가능값 입력)</label>
                <input 
                  type="text" 
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  placeholder="예: prd-001, 게시글ID, 상대방 닉네임"
                  className="w-full h-[44px] border border-gray-200 rounded-xl px-[14px] text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">신고 상세 내용 *</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="신고하실 내용을 구체적으로 적어주세요. (증빙이 어려울 경우 조치가 지연될 수 있습니다.)"
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

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-[11px] text-gray-500 leading-normal">
                신고 접수 후 운영 정책에 따라 검토됩니다. 허위 신고나 악의적 신고는 서비스 이용 제한 대상이 될 수 있습니다.
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white rounded-full h-[44px] px-5 font-extrabold flex items-center justify-center hover:bg-black transition-colors"
              >
                신고 제출하기
              </button>
            </form>
          </div>

          {/* Right: List */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 md:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.04)] h-fit">
            <h3 className="font-black text-lg text-gray-900 mb-6">내 신고 내역</h3>
            
            {reports.length === 0 ? (
              <div className="py-16 text-center space-y-2 text-gray-400">
                <p className="font-bold">접수된 신고 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(rep => (
                  <div key={rep.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded">
                          {rep.reportType}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {new Date(rep.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                        <Clock size={12}/>
                        {rep.status}
                      </div>
                    </div>
                    {rep.targetId && (
                      <div className="text-[11px] text-gray-500 font-bold mb-1">
                        신고 대상: <span className="text-gray-900">{rep.targetId}</span>
                      </div>
                    )}
                    <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mt-2">{rep.content}</p>
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

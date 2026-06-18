import React from 'react';
import { ShieldCheck, ArrowLeft, Volume2 } from 'lucide-react';
import { Notice } from '../data/mockData';

interface NoticePageProps {
  notices: Notice[];
  onSelectNotice: (notice: Notice) => void;
  onBackToMain: () => void;
}

export default function NoticePage({ notices, onSelectNotice, onBackToMain }: NoticePageProps) {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20">
      {/* Module Title Section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <button 
            onClick={onBackToMain}
            className="page-back-link group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>메인으로 돌아가기</span>
          </button>
          
          <div className="flex items-center gap-3">
            <Volume2 size={32} className="text-[#EF4444]" />
            <div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-gray-900 tracking-tight">공지사항</h1>
              <p className="text-gray-500 text-sm mt-1">샥 가이드 및 새소식을 전해드립니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10">
        <div className="bg-white border text-left border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="p-5 rounded-2xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group shadow-xs text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-900 font-extrabold flex items-center gap-1 bg-gray-200 px-2.5 py-1 rounded-md font-mono tracking-wider">
                      <ShieldCheck size={12} />
                      <span>OFFICIAL</span>
                    </span>
                    <span className="text-xs text-gray-500 font-mono font-medium">{notice.createdAt}</span>
                  </div>

                  <h3 className="font-sans font-extrabold text-gray-900 text-base leading-snug group-hover:text-red-600 transition-colors mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-sans">
                    {notice.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

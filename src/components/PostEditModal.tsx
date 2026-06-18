import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { CommunityPost } from '../utils/storageUtils';

interface PostEditModalProps {
  isOpen: boolean;
  post: CommunityPost | null;
  onClose: () => void;
  onSave: (updatedPost: CommunityPost) => void;
}

const subCategoriesMap: Record<'pop' | 'sports' | 'analog', string[]> = {
  pop: ['피규어', '아이돌 포카', '트레카', '굿즈'],
  sports: ['스포츠 카드', '유니폼', '시그니처 저지', '레트로 소품'],
  analog: ['바이닐/LP', '빈티지 완구', '카메라/카세트', '클래식 소품']
};

export default function PostEditModal({
  isOpen,
  post,
  onClose,
  onSave
}: PostEditModalProps) {
  const [title, setTitle] = useState('');
  const [boardGroup, setBoardGroup] = useState<'pop' | 'sports' | 'analog'>('pop');
  const [subCategory, setSubCategory] = useState('');
  const [content, setContent] = useState('');
  const [tagsString, setTagsString] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setBoardGroup((post.boardGroup === 'all' ? 'pop' : post.boardGroup) as any);
      setSubCategory(post.boardSubCategory || '');
      setContent(post.content || '');
      setTagsString(post.tags ? post.tags.join(' ') : '');
    }
  }, [post, isOpen]);

  // Handle board group change to auto-set first option of new list
  const handleBoardGroupChange = (group: 'pop' | 'sports' | 'analog') => {
    setBoardGroup(group);
    setSubCategory(subCategoriesMap[group][0]);
  };

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 성실하게 입력해 주세요.');
      return;
    }

    const subCategorySelected = subCategory || subCategoriesMap[boardGroup][0];

    // parse tags
    const parsedTags = tagsString
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const updatedPost: CommunityPost = {
      ...post,
      title: title.trim(),
      boardGroup,
      boardSubCategory: subCategorySelected,
      content: content.trim(),
      tags: parsedTags,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedPost);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-sans font-black text-gray-900 text-sm">게시글 수정</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
          {/* Board Group (관심사) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">메인 카테고리</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'pop', label: 'POP 🧸' },
                { key: 'sports', label: 'SPORTS ⚽' },
                { key: 'analog', label: 'ANALOG 📻' },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handleBoardGroupChange(b.key as any)}
                  className={`cursor-pointer py-2 px-3 border rounded-xl text-xs font-bold font-sans text-center transition-all ${
                    boardGroup === b.key
                      ? 'border-gray-800 bg-gray-100 text-gray-900 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub category */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">세부 카테고리</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-sans focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 cursor-pointer"
            >
              {subCategoriesMap[boardGroup].map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">제목</label>
            <input
              type="text"
              placeholder="게시글 대제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4.5 py-3 text-xs text-gray-900 font-sans focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">본문 내용</label>
            <textarea
              rows={6}
              placeholder="자유롭게 사진이나 수집품의 사연을 기재하고 의견을 나누어 보세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4.5 py-3 text-xs text-gray-900 font-sans focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">태그 (공백으로 구분)</label>
            <input
              type="text"
              placeholder="예: 피규어 리미티드 보컬로이드 (자동으로 #이 추가됩니다)"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4.5 py-3 text-xs text-gray-900 font-sans focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Send size={14} />
              <span>수정 적용하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, Eye, Search, PlusCircle, ArrowLeft, 
  Sparkles, Flame, User, MessageCircle, Send, Check, Tag, Info, Bookmark, Users
} from 'lucide-react';
import { 
  CommunityPost, getCommunityPosts, saveCommunityPosts, 
  getComments, Comment 
} from '../utils/storageUtils';
import PostModal from '../components/PostModal';
import MeetupSection from '../components/MeetupSection';

interface CommunityPageProps {
  currentUserNickname: string;
  onBackToMain: () => void;
  onEnterRoom: (roomId: string) => void;
  initialTab?: 'board' | 'meetup';
}

export default function CommunityPage({ 
  currentUserNickname, 
  onBackToMain,
  onEnterRoom,
  initialTab = 'board'
}: CommunityPageProps) {
  // Top Active Tab State: 'board' (게시판), 'meetup' (소모임)
  const [activeTab, setActiveTab] = useState<'board' | 'meetup'>(initialTab);

  // Synchronize initialTab if it changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Database states
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // Filter States
  const [currentBoardGroup, setCurrentBoardGroup] = useState<'all' | 'pop' | 'sports' | 'analog'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Write Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBoardGroup, setNewBoardGroup] = useState<'pop' | 'sports' | 'analog'>('pop');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsString, setNewTagsString] = useState('');

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fresh load of posts
  const loadPosts = () => {
    setPosts(getCommunityPosts());
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Update specific post in core list
  const handleUpdatePost = (updatedPost: CommunityPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    if (selectedPost && selectedPost.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
  };

  // Subcategories mapping
  const subCategoriesMap: Record<'pop' | 'sports' | 'analog', string[]> = {
    pop: ['피규어', '아이돌 포카', '트레카', '굿즈'],
    sports: ['스포츠 카드', '유니폼', '시그니처 저지', '레트로 소품'],
    analog: ['바이닐/LP', '빈티지 완구', '카메라/카세트', '클래식 소품']
  };

  // Safe reset of subcategories on major board switch
  const handleBoardGroupChange = (group: 'all' | 'pop' | 'sports' | 'analog') => {
    setCurrentBoardGroup(group);
    setSelectedSubCategory('all');
    setCurrentPage(1);
  };

  // Filter logic
  const filteredPosts = posts.filter(post => {
    // 1. Group filter
    if (currentBoardGroup !== 'all' && post.boardGroup !== currentBoardGroup) return false;
    // 2. Subcategory filter
    if (selectedSubCategory !== 'all' && post.boardSubCategory !== selectedSubCategory) return false;
    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      const matchTag = post.tags?.some(t => t.toLowerCase().includes(q)) || false;
      if (!matchTitle && !matchContent && !matchAuthor && !matchTag) return false;
    }
    return true;
  });

  // Sort by latest (createdAt descending, tie break with id descending)
  const sortedFilteredPosts = [...filteredPosts].sort((a, b) => {
    const dateComp = b.createdAt.localeCompare(a.createdAt);
    if (dateComp !== 0) return dateComp;
    return b.id.localeCompare(a.id);
  });

  const ITEMS_PER_PAGE = 10;
  const totalItems = sortedFilteredPosts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = sortedFilteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Hot Popular Posts: sorted by calculated score = (likes * 3) + (comments * 2.5) + (views * 0.1)
  const getHotPosts = () => {
    const scored = [...posts].map(p => {
      const commentsCount = getComments().filter(c => c.postId === p.id).length;
      const score = (p.likes * 3) + (commentsCount * 2.5) + (p.views * 0.1);
      return { p, score };
    });
    // Sort in descending order
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.p);
  };

  const hotPosts = getHotPosts();

  // Create post submit action
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('제목과 내용을 성실하게 입력해 주새요.');
      return;
    }

    const subCategorySelected = newSubCategory || subCategoriesMap[newBoardGroup][0];

    // parse tags
    const parsedTags = newTagsString
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const newPost: CommunityPost = {
      id: `post-user-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: currentUserNickname || '명예콜렉터',
      boardGroup: newBoardGroup,
      boardSubCategory: subCategorySelected,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      likes: 0,
      comments: 0,
      tags: parsedTags
    };

    // Save
    const allPosts = [newPost, ...getCommunityPosts()];
    saveCommunityPosts(allPosts);
    setPosts(allPosts);

    // Reset writing values
    setNewTitle('');
    setNewContent('');
    setNewTagsString('');
    setIsWriteModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50/40 min-h-screen py-6 md:py-10 selection:bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        
        {/* Navigation / Header Title section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left pt-2 pb-2">
          <div className="space-y-3">
            <button 
              onClick={onBackToMain}
              className="page-back-link group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>메인으로 돌아가기</span>
            </button>
            <h1 className="font-sans font-black text-[28px] md:text-[32px] text-gray-900 tracking-tight">
              커뮤니티
            </h1>
            <p className="text-[15px] font-sans text-gray-500 max-w-2xl">
              애장품 수집가들과 자유롭게 정보를 나누고 이야기를 공유해보세요.
            </p>
          </div>
        </div>

        {/* Top-level Interactive Tabs */}
        <div className="flex border-b border-gray-200 gap-6 overflow-x-auto scroller-hidden">
          <button
            onClick={() => setActiveTab('board')}
            className={`cursor-pointer pb-4 border-b-2 font-sans text-[15px] text-center flex items-center gap-2 transition-all outline-none whitespace-nowrap ${
              activeTab === 'board'
                ? 'border-gray-900 text-gray-900 font-extrabold'
                : 'border-transparent text-gray-400 hover:text-gray-600 font-bold'
            }`}
          >
            <span>자유 게시판</span>
          </button>
          <button
            onClick={() => setActiveTab('meetup')}
            className={`cursor-pointer pb-4 border-b-2 font-sans text-[15px] text-center flex items-center gap-2 transition-all outline-none whitespace-nowrap ${
              activeTab === 'meetup'
                ? 'border-gray-900 text-gray-900 font-extrabold'
                : 'border-transparent text-gray-400 hover:text-gray-600 font-bold'
            }`}
          >
            <span>수집가 소모임</span>
            <span className="bg-gray-100 text-gray-600 font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
              LIVE
            </span>
          </button>
        </div>

        {activeTab === 'meetup' ? (
          <div className="space-y-6 pt-2">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4 text-left">
              <span className="p-3 bg-gray-100 rounded-2xl text-gray-800 shrink-0">
                <Users size={22} className="stroke-[2.5]" />
              </span>
              <div>
                <h2 className="font-sans font-black text-gray-900 text-sm md:text-base">수집가들의 소모임 소통방</h2>
                <p className="text-xs text-gray-500 mt-1">
                  트레이딩 카드, 아이돌 포카, 피규어, 스포츠카드, LP, 아날로그 기기 등 오색찬란한 수집가들의 대화방이 준비되어 있습니다. 입장하여 따뜻하고 유쾌한 소통을 이끌어 보세요.
                </p>
              </div>
            </div>
            
            <MeetupSection onEnterRoom={onEnterRoom} />
          </div>
        ) : (
          <>
            {/* Popular Hot Topic Cards (상위 3개 노출) */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-left pb-2">
                <span className="font-sans font-extrabold text-[18px] text-gray-900">실시간 인기글</span>
              </div>

              {hotPosts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-[18px] p-10 text-center shadow-[0_2px_4px_rgba(15,23,42,0.02)]">
                  <p className="text-[14px] text-gray-500 font-sans">아직 인기글이 없습니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {hotPosts.map((post, index) => {
                    const postComments = getComments().filter(c => c.postId === post.id).length;
                    return (
                      <div 
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="bg-white border border-gray-200 p-5 rounded-[18px] text-left cursor-pointer transition-all hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex flex-col min-w-0"
                      >
                        <div className="mb-3">
                          <span className="text-[11px] font-sans font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                            BEST {index + 1}
                          </span>
                        </div>
                        <h3 className="font-sans font-extrabold text-[#111827] text-[15px] md:text-[16px] tracking-tight line-clamp-1 mb-1.5">
                          {post.title}
                        </h3>
                        <p className="text-[13px] text-[#6B7280] line-clamp-2 md:line-clamp-2 font-sans mb-4 flex-1">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between text-[12px] text-[#9CA3AF] font-sans">
                          <span className="truncate max-w-[120px]">{post.author}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <ThumbsUp size={12} />
                              <span>{post.likes}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={12} />
                              <span>{postComments}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

        {/* Search Filter & Write Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-155 select-none text-left mb-6">
          <div>
            <p className="text-[14px] font-sans text-gray-500">
              총 <strong className="text-gray-950 font-extrabold">{sortedFilteredPosts.length}</strong>개의 글 소통 중
            </p>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-[240px] relative">
              <input 
                type="text"
                placeholder="제목, 내용, 태그 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[40px] md:h-[44px] pl-10 pr-4 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-full text-[13px] focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all shadow-[0_2px_4px_rgba(15,23,42,0.02)]"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-[13px] h-[40px] md:h-[44px] px-6 rounded-full flex items-center justify-center gap-2 shadow-[0_2px_4px_rgba(15,23,42,0.06)] transition-all flex-shrink-0"
            >
              <PlusCircle size={14} />
              <span>글쓰기</span>
            </button>
          </div>
        </div>

        {/* Main Feed structure with Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Block Filters (Sidebar) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 lg:p-5 rounded-[18px] border border-gray-200 shadow-[0_8px_24px_rgba(15,23,42,0.04)] text-left flex flex-row lg:flex-col gap-4 overflow-x-auto scroller-hidden">
              <div className="min-w-[max-content] lg:min-w-0 flex-1 space-y-2 lg:space-y-4">
                <span className="hidden lg:block text-[12px] font-extrabold text-gray-400 uppercase tracking-wider font-sans px-1">게시판 카테고리</span>
                <div className="flex flex-row lg:flex-col gap-1.5">
                  <button 
                    onClick={() => handleBoardGroupChange('all')}
                    className={`cursor-pointer flex-shrink-0 text-left font-sans font-bold text-[14px] px-4 h-[44px] flex items-center rounded-xl transition-all ${
                      currentBoardGroup === 'all' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    전체 토크
                  </button>
                  <button 
                    onClick={() => handleBoardGroupChange('pop')}
                    className={`cursor-pointer flex-shrink-0 text-left font-sans font-bold text-[14px] px-4 h-[44px] flex items-center rounded-xl transition-all ${
                      currentBoardGroup === 'pop' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    POP 게시판
                  </button>
                  <button 
                    onClick={() => handleBoardGroupChange('sports')}
                    className={`cursor-pointer flex-shrink-0 text-left font-sans font-bold text-[14px] px-4 h-[44px] flex items-center rounded-xl transition-all ${
                      currentBoardGroup === 'sports' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    SPORTS 게시판
                  </button>
                  <button 
                    onClick={() => handleBoardGroupChange('analog')}
                    className={`cursor-pointer flex-shrink-0 text-left font-sans font-bold text-[14px] px-4 h-[44px] flex items-center rounded-xl transition-all ${
                      currentBoardGroup === 'analog' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ANALOG 게시판
                  </button>
                </div>
              </div>

              {/* Sub Categories filters */}
              {currentBoardGroup !== 'all' && (
                <div className="hidden lg:block border-t border-gray-100 pt-4 space-y-2">
                  <span className="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider font-sans px-1">소분류</span>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <button
                      onClick={() => { setSelectedSubCategory('all'); setCurrentPage(1); }}
                      className={`cursor-pointer font-sans font-bold text-[13px] px-4 h-[36px] flex items-center rounded-lg transition-all ${
                        selectedSubCategory === 'all' 
                          ? 'bg-gray-100 text-gray-900 font-extrabold' 
                          : 'bg-transparent text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      전체보기
                    </button>
                    {subCategoriesMap[currentBoardGroup].map(scName => (
                      <button
                        key={scName}
                        onClick={() => { setSelectedSubCategory(scName); setCurrentPage(1); }}
                        className={`cursor-pointer font-sans font-bold text-[13px] px-4 h-[36px] flex items-center rounded-lg transition-all ${
                          selectedSubCategory === scName 
                            ? 'bg-gray-100 text-gray-900 font-extrabold' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {scName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Friendly guide box */}
            <div className="hidden lg:block bg-gray-50 p-4.5 rounded-2xl border border-gray-200 text-left text-[12px] text-gray-500 font-sans space-y-1.5">
              <strong className="text-gray-900 font-bold flex items-center gap-1.5 mb-2">
                <Info size={14} className="text-gray-800 shrink-0" />
                <span>커뮤니티 안내</span>
              </strong>
              <p className="leading-relaxed">
                타인을 배려하고 매너있는 표현을 사용해주세요.
              </p>
            </div>
          </div>

          {/* Right Feed Table/Cards List */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* List Feed */}
            {sortedFilteredPosts.length === 0 ? (
              <div className="bg-white rounded-[18px] border border-gray-200 p-12 text-center text-gray-500 space-y-2">
                <p className="font-sans font-bold text-[15px]">해당 검색어와 일치하는 게시글이 없습니다.</p>
                <p className="text-sm">다른 키워드로 검색해보세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3.5">
                  {paginatedPosts.map(post => {
                    const commentsCount = getComments().filter(c => c.postId === post.id).length;
                    return (
                      <div 
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="bg-white border border-gray-200 p-5 lg:p-6 rounded-[18px] cursor-pointer transition-all hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left min-w-0"
                      >
                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-gray-50 text-gray-600 border border-gray-200 text-[11px] font-bold px-2 py-0.5 rounded-md font-sans">
                              {post.boardGroup === 'pop' ? 'POP' : post.boardGroup === 'sports' ? 'SPORTS' : post.boardGroup === 'analog' ? 'ANALOG' : '기타'}
                            </span>
                            {post.boardSubCategory && (
                              <span className="text-gray-400 text-[12px] font-medium px-1 font-sans">
                                {post.boardSubCategory}
                              </span>
                            )}
                          </div>

                          <h4 className="font-sans font-extrabold text-gray-900 text-[16px] md:text-[18px] leading-snug line-clamp-1">
                            {post.title}
                          </h4>

                          <p className="text-[14px] text-gray-500 font-sans leading-relaxed line-clamp-2">
                            {post.content}
                          </p>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {post.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center text-[12px] text-gray-400 font-sans font-medium hover:text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-[12px] text-gray-400 font-sans mt-2">
                            <span className="font-semibold text-gray-600 font-sans">{post.author}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                            <span>{post.createdAt}</span>
                          </div>
                        </div>

                        {/* Metas */}
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-5 md:gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-gray-100 md:border-transparent mt-2 md:mt-0">
                          <div className="flex items-center gap-3 text-[12px] text-gray-400 font-sans">
                            <span className="flex items-center gap-1.5">
                              <Eye size={14} />
                              <span>{post.views}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <ThumbsUp size={14} />
                              <span>{post.likes}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-[13px] text-gray-600 border border-gray-100 font-sans">
                            <MessageSquare size={13} />
                            <strong className="font-bold relative">{commentsCount}</strong>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Pagination Navigation */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6 pb-2" id="community-pagination">
                    <button
                      disabled={activePage === 1}
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="cursor-pointer px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-200 bg-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none select-none"
                    >
                      이전
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum, idx, arr) => (
                        <React.Fragment key={pageNum}>
                          <button
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 350, behavior: 'smooth' });
                            }}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all ${
                              activePage === pageNum
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                          {idx < arr.length - 1 && (
                            <span className="text-gray-200 font-sans text-xs select-none">|</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      disabled={activePage === totalPages}
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="cursor-pointer px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-200 bg-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none select-none"
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
        </>
        )}

      </div>

      {/* Write Post Modal Form Popup */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="write-post-modal">
          <div 
            className="bg-white rounded-[24px] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-sans font-extrabold text-gray-900 text-[18px]">
                새 이야기 한 장 적기
              </h2>
              <button 
                onClick={() => setIsWriteModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <XCircle onClose={() => setIsWriteModalOpen(false)} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700 font-sans">제목</label>
                <input
                  type="text"
                  placeholder="이야기를 잘 나타낼 수 있는 제목을 적어주세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={50}
                  className="w-full h-11 bg-white border border-gray-300 rounded-[12px] px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all font-sans"
                />
              </div>

              {/* Dynamic Category Choice Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 font-sans">카테고리</label>
                  <select
                    value={newBoardGroup}
                    onChange={(e) => {
                      const selectedGroup = e.target.value as 'pop' | 'sports' | 'analog';
                      setNewBoardGroup(selectedGroup);
                      // Auto-init subcategory
                      setNewSubCategory(subCategoriesMap[selectedGroup][0]);
                    }}
                    className="w-full h-11 bg-white border border-gray-300 rounded-[12px] px-4 text-[14px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans cursor-pointer"
                  >
                    <option value="pop">POP 게시판</option>
                    <option value="sports">SPORTS 게시판</option>
                    <option value="analog">ANALOG 게시판</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 font-sans">소분류</label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full h-11 bg-white border border-gray-300 rounded-[12px] px-4 text-[14px] text-gray-900 focus:outline-none focus:border-gray-500 font-sans cursor-pointer"
                  >
                    {subCategoriesMap[newBoardGroup].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700 font-sans">내용</label>
                <textarea
                  placeholder="작성하고 싶은 애장품 이야기를 자유롭게 적어주세요."
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-[12px] p-4 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-700 font-sans">태그</label>
                <input
                  type="text"
                  placeholder="태그를 스페이스로 구분해 작성하세요 (예: 피규어 라이프)"
                  value={newTagsString}
                  onChange={(e) => setNewTagsString(e.target.value)}
                  className="w-full h-11 bg-white border border-gray-300 rounded-[12px] px-4 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all font-sans"
                />
              </div>

              {/* Action Buttons inside Write Form */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="w-full sm:w-auto cursor-pointer font-sans bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[14px] h-[48px] px-6 rounded-[12px] transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-[14px] h-[48px] px-8 rounded-[12px] transition-all flex items-center justify-center shadow-sm"
                >
                  등록
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Interactive Detail post with user commenting modal overlay */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          currentUserNickname={currentUserNickname}
          onUpdatePost={handleUpdatePost}
        />
      )}

    </div>
  );
}

// Compact Close button wrapper icon to pass lint/syntax checks elegantly
function XCircle({ onClose }: { onClose: () => void }) {
  return (
    <span 
      onClick={onClose}
      className="p-1 px-2.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer text-xs font-bold sans"
    >
      닫기
    </span>
  );
}

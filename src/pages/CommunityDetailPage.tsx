import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Eye, ThumbsUp, Tag, MessageSquare } from 'lucide-react';
import { CommunityPost, Comment, getComments, saveComments, saveCommunityPosts, getCommunityPosts } from '../utils/storageUtils';

interface CommunityDetailPageProps {
  postId: string;
  posts: CommunityPost[];
  onBack: () => void;
  currentUserNickname: string;
}

export default function CommunityDetailPage({
  postId,
  posts,
  onBack,
  currentUserNickname
}: CommunityDetailPageProps) {
  const [post, setPost] = useState<CommunityPost | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [animatedLike, setAnimatedLike] = useState(false);

  useEffect(() => {
    // 1. Array.isArray fallback
    const safePosts = Array.isArray(posts) ? posts : getCommunityPosts() || [];
    
    // 2. Safely find post by comparing String
    const foundPost = safePosts.find(p => String(p.id) === String(postId));
    
    if (foundPost) {
      setPost(foundPost);
      // Load comments
      const allComments = getComments();
      setComments(allComments.filter(c => String(c.postId) === String(postId)));

      // Increment views
      const allPosts = getCommunityPosts();
      const idx = allPosts.findIndex(item => String(item.id) === String(postId));
      if (idx !== -1) {
        allPosts[idx].views += 1;
        saveCommunityPosts(allPosts);
        setPost({ ...allPosts[idx] });
      }
    } else {
      setPost(undefined);
    }
  }, [postId, posts]);

  if (!post) {
    return (
      <div className="bg-gray-50/40 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-[18px] p-10 text-center shadow-[0_4px_12px_rgba(15,23,42,0.04)] max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">게시글을 찾을 수 없습니다</h2>
          <p className="text-sm text-gray-500 mb-6 font-sans">삭제되었거나 존재하지 않는 커뮤니티 글입니다.</p>
          <button 
            onClick={onBack}
            className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-2.5 rounded-full transition-colors"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setAnimatedLike(true);
    setTimeout(() => setAnimatedLike(false), 500);

    const allPosts = getCommunityPosts();
    const idx = allPosts.findIndex(item => String(item.id) === String(postId));
    if (idx !== -1) {
      allPosts[idx].likes += 1;
      saveCommunityPosts(allPosts);
      setPost({ ...allPosts[idx] });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comment-usr-${Date.now()}`,
      postId: post.id,
      author: currentUserNickname || '친절한콜렉터',
      content: newCommentText.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    const allComments = getComments();
    saveComments([...allComments, newComment]);
    setComments([...comments, newComment]);
    setNewCommentText('');

    const allPosts = getCommunityPosts();
    const idx = allPosts.findIndex(item => String(item.id) === String(postId));
    if (idx !== -1) {
      allPosts[idx].comments = (allPosts[idx].comments || 0) + 1;
      saveCommunityPosts(allPosts);
    }
  };

  return (
    <div className="bg-gray-50/40 min-h-screen py-6 md:py-10">
      <div className="max-w-3xl mx-auto px-4 xl:px-0 space-y-6">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="cursor-pointer page-back-link group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-bold"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* Post Container */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden text-left">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Category Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                {post.boardGroup === 'all' ? '전체 토크' : post.boardGroup.toUpperCase()}
              </span>
              {post.boardSubCategory && (
                <span className="bg-gray-50 border border-gray-100 text-gray-500 text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {post.boardSubCategory}
                </span>
              )}
            </div>
            
            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="font-sans font-black text-2xl md:text-3xl text-gray-900 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 rounded-full px-2.5 py-1">
                  <User size={13} className="text-gray-400" />
                  <span className="font-bold text-gray-700">{post.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{post.createdAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} className="text-gray-400" />
                  <span>조회 {post.views}</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap font-sans min-h-[120px] pt-2">
              {post.content}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-gray-50 border border-gray-200 text-gray-500 font-bold px-3 py-1 rounded-md">
                    <Tag size={10} className="text-gray-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Like Button */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <button
                onClick={handleLike}
                className={`cursor-pointer inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 font-bold text-[14px] transition-all ${
                  animatedLike ? 'scale-105 group border-gray-900 bg-gray-900 text-white' : ''
                }`}
              >
                <ThumbsUp size={16} className={animatedLike ? 'text-white' : 'text-gray-400'} />
                <span>동감해요 {post.likes}</span>
              </button>
            </div>

          </div>

          {/* Comments Section */}
          <div className="bg-gray-50/50 border-t border-gray-100 p-6 md:p-8 space-y-6">
            <h3 className="font-sans font-bold text-[15px] text-gray-900 flex items-center gap-1.5">
              <MessageSquare size={16} />
              댓글 {comments.length}
            </h3>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="따뜻한 댓글을 남겨보세요..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-white border border-gray-200 text-gray-900 px-4 h-[44px] rounded-full text-[14px] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 font-sans transition-all shadow-[0_2px_4px_rgba(15,23,42,0.02)]"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="cursor-pointer bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-full px-6 h-[44px] flex items-center justify-center font-bold text-[14px] transition-all shadow-sm flex-shrink-0"
              >
                등록
              </button>
            </form>

            <div className="space-y-4 pt-4">
              {comments.length === 0 ? (
                <p className="text-[13px] text-gray-400 py-4 text-center font-sans">
                  아직 첫 댓글이 없습니다.
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col gap-2 shadow-[0_2px_4px_rgba(15,23,42,0.02)]">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-bold text-gray-900 font-sans flex items-center gap-1">
                        <User size={12} className="text-gray-400" />
                        {comment.author}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-gray-700 text-[14px] leading-relaxed font-sans px-1 pt-1">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-8 text-center border-t border-gray-100 mt-6">
              <button 
                onClick={onBack}
                className="cursor-pointer text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors"
              >
                 목록으로 돌아가기 
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

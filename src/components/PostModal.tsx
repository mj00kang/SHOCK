import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, MessageSquare, Eye, Send, Calendar, User, Tag } from 'lucide-react';
import { CommunityPost, Comment, getComments, saveComments, saveCommunityPosts, getCommunityPosts } from '../utils/storageUtils';

interface PostModalProps {
  post: CommunityPost;
  onClose: () => void;
  currentUserNickname: string;
  onUpdatePost: (updatedPost: CommunityPost) => void;
}

export default function PostModal({
  post,
  onClose,
  currentUserNickname,
  onUpdatePost
}: PostModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [animatedLike, setAnimatedLike] = useState(false);

  // Load comments and increment views on open
  useEffect(() => {
    // 1. Load comments for this post
    const allComments = getComments();
    const postComments = allComments.filter(c => c.postId === post.id);
    setComments(postComments);

    // 2. Increment views count
    const allPosts = getCommunityPosts();
    const updatedPosts = allPosts.map(p => {
      if (p.id === post.id) {
        const up = { ...p, views: p.views + 1 };
        // Trigger parent state update
        setTimeout(() => onUpdatePost(up), 0);
        return up;
      }
      return p;
    });
    saveCommunityPosts(updatedPosts);
  }, [post.id]);

  const handleLike = () => {
    setAnimatedLike(true);
    setTimeout(() => setAnimatedLike(false), 500);

    const allPosts = getCommunityPosts();
    const updatedPosts = allPosts.map(p => {
      if (p.id === post.id) {
        const up = { ...p, likes: p.likes + 1 };
        onUpdatePost(up);
        return up;
      }
      return p;
    });
    saveCommunityPosts(updatedPosts);
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

    // Save logic
    const allComments = getComments();
    const updatedAllComments = [...allComments, newComment];
    saveComments(updatedAllComments);

    // Update local state comments
    setComments([...comments, newComment]);
    setNewCommentText('');

    // Update comment count on post
    const allPosts = getCommunityPosts();
    const updatedPosts = allPosts.map(p => {
      if (p.id === post.id) {
        const up = { ...p, comments: (p.comments || 0) + 1 };
        onUpdatePost(up);
        return up;
      }
      return p;
    });
    saveCommunityPosts(updatedPosts);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="post-modal-container">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 text-gray-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {post.boardGroup === 'all' ? '전체 토크' : `${post.boardGroup.toUpperCase()}`}
            </span>
            {post.boardSubCategory && (
              <span className="bg-gray-100 text-slate-650 text-[10px] font-bold px-2.5 py-1 rounded-md">
                {post.boardSubCategory}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Post Core Meta */}
          <div className="space-y-4 text-left">
            <h2 className="font-sans font-extrabold text-gray-900 text-[20px] md:text-[24px] leading-snug">
              {post.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 border-b border-gray-100 pb-5">
              <span className="flex items-center gap-1">
                <User size={14} className="text-gray-400" />
                <span className="font-semibold text-gray-700 font-sans">{post.author}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                <span className="font-sans">{post.createdAt}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} className="text-gray-400" />
                <span>조회 {post.views}</span>
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap text-left font-sans pt-2 pb-8">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-left">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-gray-50 border border-gray-200 text-gray-500 font-bold px-2.5 py-0.5 rounded-md">
                  <Tag size={10} className="text-gray-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Interaction Row */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleLike}
              className={`cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[13px] transition-all ${
                animatedLike ? 'animate-bounce' : ''
              }`}
            >
              <ThumbsUp size={14} className={animatedLike ? 'text-gray-900' : 'text-gray-400'} />
              <span>좋아요 {post.likes}</span>
            </button>
          </div>

          {/* Comments Feed Area */}
          <div className="border-t border-gray-100 pt-6 space-y-4 text-left mt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-sans font-bold text-[15px] text-gray-900">
                댓글 {comments.length}
              </h3>
            </div>

            {comments.length === 0 ? (
              <p className="text-[13px] text-gray-400 py-6 text-center font-sans">
                아직 등록된 댓글이 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 flex flex-col gap-1.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-bold text-gray-900 font-sans">{comment.author}</span>
                      <span className="text-gray-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-gray-700 text-[14px] leading-relaxed font-sans">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Comment Input Footer */}
        <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 bg-white flex gap-2">
          <input
            type="text"
            placeholder="댓글을 남겨보세요..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 px-4 h-[44px] rounded-full text-[14px] focus:outline-none focus:border-gray-300 focus:bg-white font-sans transition-all"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="cursor-pointer bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full px-5 h-[44px] flex items-center justify-center font-bold text-[14px] transition-all shadow-sm flex-shrink-0"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}

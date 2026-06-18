import React, { useState } from 'react';
import { 
  MessageSquare, ThumbsUp, Eye, ShieldCheck, Volume2, 
  ChevronRight, Users, MessageCircle 
} from 'lucide-react';
import { Notice } from '../data/mockData';
import { CommunityPost } from '../utils/storageUtils';
import { getMeetupRooms, MeetupRoom } from '../utils/meetupGenerator';

interface CommunitySectionProps {
  posts: CommunityPost[];
  notices: Notice[];
  onSelectPost: (post: CommunityPost) => void;
  onSelectNotice: (notice: Notice) => void;
  onViewAll?: () => void;
  onViewAllMeetups?: () => void;
  onEnterMeetupRoom?: (roomId: string) => void;
}

export default function CommunitySection({ 
  posts, 
  notices, 
  onSelectPost, 
  onSelectNotice,
  onViewAll,
  onViewAllMeetups,
  onEnterMeetupRoom
}: CommunitySectionProps) {
  // Take first 3 posts on home page preview
  const visiblePosts = posts.slice(0, 3);

  // Take first 3 meetup rooms
  const activeMeetups = getMeetupRooms().slice(0, 3);
  
  // Take first 3 notices
  const visibleNotices = notices.slice(0, 3);

  return (
    <section id="community-section" className="w-full py-16 px-4 md:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Module Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] uppercase tracking-widest text-[#EF4444] font-extrabold font-mono border border-gray-200 px-3 py-1 bg-white rounded-full mb-3">
            COLLECTORS PLAZA
          </span>
          <h2 className="font-display font-black text-[26px] md:text-[32px] text-gray-900 tracking-tight mt-3">
            컬렉션 커뮤니티 & 새소식
          </h2>
          <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto">
            같은 취향을 가진 수집가들과 소장 이야기를 공유하고, 트렌디한 피드로 자유롭게 소통하는 공간입니다.
          </p>
        </div>

        <div className="flex flex-col space-y-12">
          
          {/* Block 1: Popular Board Posts */}
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-800" />
                <h3 className="font-display font-extrabold text-lg text-gray-900">커뮤니티 인기 토크</h3>
              </div>
              <span className="text-[11px] font-extrabold text-gray-800 tracking-wider font-sans bg-gray-100 px-2.5 py-0.5 rounded-full">
                실시간 멤버 포스팅
              </span>
            </div>

            {/* Cards mapping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between group shadow-sm text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        post.boardGroup === 'pop' ? 'bg-pink-50 text-pink-700 border border-pink-100' :
                        post.boardGroup === 'sports' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        post.boardGroup === 'analog' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {post.boardGroup === 'all' ? '전체 토크' : `${post.boardGroup.toUpperCase()}`}
                      </span>
                      {post.boardSubCategory && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-gray-500 tracking-tight">
                          {post.boardSubCategory}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-gray-400">작성자: {post.author}</span>
                    </div>

                    <h4 className="font-sans font-bold text-gray-900 group-hover:text-gray-900 transition-colors text-[17px] leading-snug line-clamp-1 mb-1.5">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                      {post.content}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-sans">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1 font-bold">
                        <Eye size={12} className="text-gray-400" />
                        <span>조회 {post.views}</span>
                      </span>
                      <span className="flex items-center gap-1 text-red-500 font-bold">
                        <ThumbsUp size={11} />
                        <span>좋아요 {post.likes}</span>
                      </span>
                    </div>
                    <span className="text-gray-400 font-sans">{post.createdAt}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Block 2: Popular Meetups */}
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-800" />
                <h3 className="font-display font-extrabold text-lg text-gray-900">시선집중 인기 소모임</h3>
              </div>
              <span className="text-[11px] font-extrabold text-gray-800 tracking-wider font-sans bg-gray-100 px-2.5 py-0.5 rounded-full">
                LIVE 대화 중
              </span>
            </div>

            {/* Meetup list: Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeMeetups.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onEnterMeetupRoom?.(room.id)}
                  className="cursor-pointer px-5 py-[18px] rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-sm transition-all flex flex-col justify-between hover:-translate-y-0.5 text-left group"
                >
                  <div>
                    <div className="flex items-center justify-end mb-2.5">
                      <span className="text-[11px] text-gray-400 font-sans font-medium">
                        {room.onlineCount}명 대화 중
                      </span>
                    </div>
                    
                    <h4 className="font-sans font-bold text-gray-900 text-[17px] leading-snug line-clamp-1 group-hover:text-gray-900 transition-colors mb-1.5">
                      {room.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                      {room.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-gray-100/80 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-sans flex items-center gap-1">
                      <Users size={12} />
                      <span>누적 {room.memberCount}명</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterMeetupRoom?.(room.id);
                      }}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-sans font-black text-[11px] px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                    >
                      입장하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View full link buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onViewAll}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-[15px] font-extrabold text-white bg-gray-900 px-6 py-3 rounded-xl hover:bg-gray-900 transition-all shadow-sm"
            >
              <span>📋 자유 게시판 가기</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={onViewAllMeetups}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-[15px] font-extrabold text-gray-900 bg-gray-100 border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-200/70 transition-all shadow-sm"
            >
              <span>🤝 수집가 소모임 가기</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

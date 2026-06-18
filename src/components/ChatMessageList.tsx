import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../utils/meetupGenerator';
import { getProducts } from '../utils/storageUtils';

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserNickname: string;
  onNavigateToProductDetail?: (productId: string) => void;
}

export default function ChatMessageList({ 
  messages, 
  currentUserNickname,
  onNavigateToProductDetail 
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever message counts change
  useEffect(() => {
    const scrollToEnd = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    // Scroll immediately
    scrollToEnd();

    // Scroll again after browser paints new elements
    const timer = setTimeout(scrollToEnd, 60);
    return () => clearTimeout(timer);
  }, [messages]);

  // Format message time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 bg-gray-50 max-h-[550px] min-h-[400px] border border-gray-100 rounded-2xl"
    >
      {messages.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-xs">
          아직 대화가 없습니다. 첫 메시지를 보내보세요!
        </div>
      ) : (
        messages.map((msg, index) => {
          const isSystem = msg.type === 'system' || msg.author === '시스템';
          const isMe = msg.author === currentUserNickname;

          if (isSystem) {
            return (
              <div 
                key={msg.id || index}
                className="flex justify-center my-3 animate-fade-in font-sans"
              >
                <span className="text-[10px] md:text-xs text-slate-450 bg-gray-100/80 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  📢 {msg.content}
                </span>
              </div>
            );
          }

          if (msg.type === 'product') {
            const allProducts = getProducts();
            const actualProduct = msg.productId ? allProducts.find(p => String(p.id) === String(msg.productId)) : null;
            const isDeletedOrMissing = !actualProduct;
            
            const snapshot = (msg.productSnapshot || {}) as any;
            const title = snapshot.title || '알 수 없는 상품';
            const image = snapshot.image || '';
            const price = snapshot.currentPrice || 0;
            const categoryText = snapshot.categoryGroup && snapshot.subCategory
              ? `${snapshot.categoryGroup} / ${snapshot.subCategory}`
              : snapshot.categoryGroup || snapshot.subCategory || '기타';
            const statusLabel = snapshot.status === 'live' ? '진행중' : '종료';

            return (
              <div 
                key={msg.id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 w-full`}
              >
                {/* Author name label */}
                {!isMe && (
                  <span className="text-[10px] font-black text-gray-600 ml-1.5 font-sans">
                    {msg.author}
                  </span>
                )}

                <div className={`flex items-end gap-1.5 max-w-[90%] md:max-w-[380px] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Product Card Bubble */}
                  <div 
                    onClick={() => {
                      if (!isDeletedOrMissing && onNavigateToProductDetail && msg.productId) {
                        onNavigateToProductDetail(msg.productId);
                      }
                    }}
                    id={`chat-msg-product-${msg.productId || index}`}
                    className={`bg-white border border-gray-200 rounded-[16px] p-3 text-left flex gap-3 transition-all duration-150 shadow-sm ${
                      isDeletedOrMissing 
                        ? 'opacity-60 cursor-not-allowed select-none' 
                        : 'cursor-pointer hover:border-gray-400 hover:shadow-md'
                    }`}
                    style={{ maxWidth: '360px' }}
                  >
                    {/* Image */}
                    {image ? (
                      <img 
                        src={image} 
                        alt={title} 
                        referrerPolicy="no-referrer"
                        className="w-[72px] h-[72px] rounded-[12px] object-cover bg-gray-100 shrink-0" 
                      />
                    ) : (
                      <div className="w-[72px] h-[72px] rounded-[12px] bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-xl">📦</span>
                      </div>
                    )}

                    {/* Content text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Category & Badge Row */}
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-400 font-bold truncate">
                            {categoryText}
                          </span>
                          {!isDeletedOrMissing && (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              snapshot.status === 'live' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100 font-sans' 
                                : 'bg-gray-100 text-gray-550 border border-gray-200 font-sans'
                            }`}>
                              {statusLabel}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-[14px] font-extrabold text-gray-900 leading-snug line-clamp-2 mb-1">
                          {title}
                        </h4>
                      </div>

                      {/* Price / Bottom row */}
                      <div className="mt-1">
                        {isDeletedOrMissing ? (
                          <p className="text-[12px] font-bold text-rose-500">
                            현재 확인할 수 없는 상품입니다.
                          </p>
                        ) : (
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-[14px] font-extrabold text-gray-900">
                              {price.toLocaleString()}원
                            </p>
                            <span className="text-[12px] text-gray-500 hover:text-gray-900 font-bold transition-colors">
                              상품 보러가기 →
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Msg Time stamp */}
                  <span className="text-[9px] text-gray-400 font-medium font-sans whitespace-nowrap shrink-0">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={msg.id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              {/* Author name label */}
              {!isMe && (
                <span className="text-[10px] font-black text-gray-600 ml-1.5 font-sans">
                  {msg.author}
                </span>
              )}

              <div className={`flex items-end gap-1.5 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Text & Image Bubble */}
                <div 
                  className={`flex flex-col gap-2 px-4 py-2.5 rounded-[16px] text-xs md:text-sm font-sans break-all shadow-sm leading-relaxed ${
                    isMe 
                      ? 'bg-gray-900 text-white rounded-tr-xs border border-gray-900' 
                      : 'bg-white text-gray-900 rounded-tl-xs border border-gray-200'
                  }`}
                >
                  {msg.type === 'image' && msg.imageUrl && (
                    <img 
                      src={msg.imageUrl} 
                      alt={msg.imageName || "채팅 이미지"} 
                      className="max-w-[100%] md:max-w-[260px] rounded-[10px] object-cover mt-1 mb-1 cursor-pointer"
                      referrerPolicy="no-referrer"
                      onClick={() => {
                        // Optional image zoom can be implemented later, or just open in new tab
                      }}
                    />
                  )}
                  {msg.content && <span>{msg.content}</span>}
                </div>

                {/* Msg Time stamp */}
                <span className="text-[9px] text-gray-400 font-medium font-sans whitespace-nowrap shrink-0">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

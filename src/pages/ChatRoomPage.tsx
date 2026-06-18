import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ShieldAlert, Sparkles, Send, X } from 'lucide-react';
import { 
  getChatMessages, 
  addChatMessage, 
  addImageChatMessage,
  getMeetupRooms, 
  MeetupRoom, 
  ChatMessage,
  joinMeetupRoom,
  addProductChatMessage
} from '../utils/meetupGenerator';
import { getProducts } from '../utils/storageUtils';
import ChatMessageList from '../components/ChatMessageList';
import ChatInput from '../components/ChatInput';

interface ChatRoomPageProps {
  roomId: string;
  currentUserId?: string;
  currentUserNickname: string;
  onBackToCommunity: () => void;
  onNavigateToProductDetail?: (productId: string) => void;
}

export default function ChatRoomPage({
  roomId,
  currentUserId,
  currentUserNickname,
  onBackToCommunity,
  onNavigateToProductDetail
}: ChatRoomPageProps) {
  const [room, setRoom] = useState<MeetupRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Predefined chat simulate responses to give real-time lively dynamic feel on active view!
  const SIMULATE_RESPONSES: Record<string, { author: string; content: string }[]> = {
    'trading-card': [
      { author: '지우존엄', content: 'PSA 9등급 보관케이스도 교환 카페에서 거래가 되나요?' },
      { author: '레어마스터K', content: '전 웬만하면 홀로그램 하드슬리브만 씌워서 보관하는데 상태 꽤 무난하더라고요 ㅎㅎ' },
      { author: '라이카아재', content: '맞아요, 자외선 차단 투명 피팅 케이스 쓰는 것도 강력 추천해 드립니다!' }
    ],
    'photocard': [
      { author: '블랙러브', content: '이번 정규 앨범 미공개 포카 시세 궁금해요ㅠ 혹시 아시는 분 계신가요?' },
      { author: '포카루팡', content: '지금 미개봉 패키지 시세로 치면 보통 2.5만에서 3.0만 사이인 것 같아요!' },
      { author: '지우존엄', content: '미공포는 수량이 한정이라 가격 떨어질 기미가 안 보이네요 ㄷㄷ' }
    ],
    'figure': [
      { author: '피규어러브', content: '이번에 새로 오더넣은 1/7 스케일 피규어 드디어 배송 시작했대요!' },
      { author: '우주세기건덕', content: '축하드려요! 오면 꼭 장식장 인증샷 한 방 부탁드립니다 ㅋㅋㅋ' },
      { author: '덕질대장', content: '스케일 피규어는 습도 조절 진짜 조심해야 함요. 밀폐 장식장에 실리카겔 필수!' }
    ],
    'sports-card': [
      { author: '조단레드', content: '이번 시즌 루키 한정 싸인카드 드디어 낙찰받았습니다 대박!!' },
      { author: '레어마스터K', content: '우와 시리얼 몇 번인가요?! 완전 대박 축하드려요!! 🔥' },
      { author: '우주세기건덕', content: '스포츠카드는 정말 타이밍이 생명인 듯요.. 부럽습니다.' }
    ],
    'sneakers': [
      { author: '조단레드', content: '새 조던 신발 실착했더니 바로 주름지네요 ㅠ 크림 세제 쓰면 자국 펴지나요?' },
      { author: '포카루팡', content: '다리미 약한 스팀으로 타올 대고 살살 펴주면 복구된다는 팁 봤어요!' },
      { author: '블랙러브', content: '와 운동화 고수 의견 추천 ㄳ요 저도 슈키퍼 무조건 넣어두고 있습니다 ㅋㅋ' }
    ],
    'lp': [
      { author: '바이닐헤븐', content: '오늘 밤은 비틀즈 애비 로드 오리지널 프레싱으로 턴테이블 돌리는데 지직거리는 잡음이 너무 달콤하네요' },
      { author: '라이카아재', content: '아날로그의 정수네요... 저도 귀정화 기구 세팅하고 바이닐 판 청소 중입니다.' },
      { author: '덕질대장', content: '크.. 진공관 앰프에 타래 조합은 못 참죠.' }
    ],
    'vintage-camera': [
      { author: '라이카아재', content: '중고 명기 수동 렌즈 조리개 고착 이슈 생긴 거 수리 잘하는 곳 혹시 충무로에 있을까요?' },
      { author: '바이닐헤븐', content: '남대문 수입상가 뒤편에 오랫동안 수리해오신 장인분들 매장 몇 군데 있습니다!' },
      { author: '포카루팡', content: '저도 장인 골목에서 셔터 스피드 오차 맞췄는데 대만족했었어요 ㅎㅎ' }
    ],
    'retro': [
      { author: '우주세기건덕', content: '백라이트 개조한 게임보이 오리지널 노란색 팩 소장 중인데 화면이 진짜 극락입니다.' },
      { author: '레어마스터K', content: '와 부럽습니다ㅠ 카세트 플레이어도 오리지널 밸트 가는 거 마니아들 많더라구요' },
      { author: '바이닐헤븐', content: '레트로 게임기 기판 털 때는 역시 접점부활제가 만병통치약이죠 ㅋㅋㅋ' }
    ]
  };

  // Predefined default sim
  const DEFAULT_SIM = [
    { author: '익명의 콜렉터', content: '안녕하세요! 다들 어떤 보물들을 주로 모으고 계신가요?' },
    { author: '수집가짱', content: '반갑습니다~ 오늘도 평화롭게 소장 줍줍하고 갑시다 ㅎㅎ' }
  ];

  // Load room data & message feed
  const loadRoomAndMessages = () => {
    const rooms = getMeetupRooms();
    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom) {
      setRoom(targetRoom);
    } else {
      // Fallback if custom generated room
      setRoom({
        id: roomId,
        title: '커스텀 아티장 소모임',
        categoryGroup: 'POP',
        subCategory: '일반수집',
        description: '자유로운 소통이 이뤄지는 대화방입니다.',
        memberCount: 15,
        onlineCount: 3,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }

    const msgs = getChatMessages(roomId);
    setMessages(msgs);
  };

  useEffect(() => {
    loadRoomAndMessages();
  }, [roomId]);

  useEffect(() => {
    let resolvedUserId = currentUserId;
    if (!resolvedUserId) {
      try {
        const cachedUser = localStorage.getItem('shock_current_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          resolvedUserId = parsed?.id;
        }
      } catch (e) {
        console.error('Error parsing shock_current_user in ChatRoomPage', e);
      }
    }
    if (resolvedUserId && roomId) {
      joinMeetupRoom(resolvedUserId, roomId);
    }
  }, [roomId, currentUserId]);

  // Simulate real-time replies
  useEffect(() => {
    const fallbackList = SIMULATE_RESPONSES[roomId] || DEFAULT_SIM;
    
    const interval = setInterval(() => {
      // 15% chance of getting a message every 10 seconds to feel live
      if (Math.random() < 0.3) {
        const randomIndex = Math.floor(Math.random() * fallbackList.length);
        const randomItem = fallbackList[randomIndex];
        // Check if randomItem or fallback exist
        if (randomItem && randomItem.author !== currentUserNickname) {
          addChatMessage(roomId, randomItem.author, randomItem.content, 'user');
          setMessages(getChatMessages(roomId));
        }
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [roomId, currentUserNickname]);

  const handleSendMessage = (text: string, image?: { name: string; type: string; dataUrl: string }) => {
    if (image) {
      addImageChatMessage(roomId, currentUserNickname, text, image.dataUrl, image.name);
    } else {
      addChatMessage(roomId, currentUserNickname, text, 'user');
    }
    setMessages(getChatMessages(roomId));
  };

  const handleAttachProduct = (selectedProduct: any) => {
    if (!currentUserId) return;
    addProductChatMessage(roomId, currentUserNickname, selectedProduct.id, {
      id: selectedProduct.id,
      title: selectedProduct.title,
      image: selectedProduct.images?.[0] || selectedProduct.image || selectedProduct.thumbnail,
      currentPrice: selectedProduct.currentPrice || selectedProduct.finalPrice || selectedProduct.price || 0,
      buyNowPrice: selectedProduct.buyNowPrice,
      categoryGroup: selectedProduct.categoryGroup,
      subCategory: selectedProduct.categoryName || selectedProduct.subCategory,
      status: selectedProduct.status,
      endAt: selectedProduct.endAt
    });
    setMessages(getChatMessages(roomId));
    setIsProductModalOpen(false);
  };

  const getCategoryStyles = (group: 'POP' | 'SPORTS' | 'ANALOG') => {
    switch (group) {
      case 'POP':
        return 'bg-pink-500 text-white';
      case 'SPORTS':
        return 'bg-emerald-500 text-white';
      case 'ANALOG':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  if (!room) return null;

  return (
    <main className="w-full min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-8 selection:bg-gray-200 text-left">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBackToCommunity}
          className="page-back-link group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>커뮤니티 소모임으로 돌아가기</span>
        </button>

        {/* Chat Room Master Info Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[9px] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase ${getCategoryStyles(room.categoryGroup)}`}>
                {room.categoryGroup}
              </span>
              <span className="text-[10px] text-gray-500 font-extrabold bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full font-mono">
                {room.subCategory}
              </span>
            </div>
            <h1 className="font-sans font-black text-gray-900 text-xl tracking-tight">
              {room.title}
            </h1>
            <p className="text-xs text-gray-500">
              {room.description}
            </p>
          </div>

          {/* Counts metrics */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-bold font-sans">
              <Users size={14} className="text-gray-400" />
              <span>정원 {room.memberCount}명</span>
            </div>
            <span className="text-slate-350">|</span>
            <div className="flex items-center gap-1 text-xs font-black text-emerald-600 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>동접 {room.onlineCount}명</span>
            </div>
          </div>
        </div>

        {/* Dynamic Chats Feed & Controls Card container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4 flex flex-col">
          {/* Rules and guidelines alert badge widget */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-start gap-2 text-[11px] text-sky-850">
            <Sparkles size={14} className="text-gray-800 shrink-0 mt-0.5 animate-spin" />
            <p className="font-sans leading-relaxed">
              <strong>실시간 아날로그 감성방:</strong> 같은 취향의 마니아들과 대화를 즐비해보세요! 부적절한 언사나 가품 거래 유도는 자동 제재 조치됩니다.
            </p>
          </div>

          {/* Chat Messages Scrolling List Feed */}
          <ChatMessageList 
            messages={messages} 
            currentUserNickname={currentUserNickname} 
            onNavigateToProductDetail={onNavigateToProductDetail}
          />

          {/* Chat Composer Input form */}
          <ChatInput 
            onSend={handleSendMessage} 
            onAttachProductClick={() => setIsProductModalOpen(true)}
            placeholder="소장품 이야기와 출품 상품을 함께 공유해보세요..."
          />
        </div>

        {/* My Products Attach Modal - Beautiful, Accessible & Stylized */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="chat-product-picker-modal">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100 text-left">
              
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">내 출품 상품 첨부</h3>
                  <p className="text-xs text-gray-400 mt-1">채팅방에 공유할 상품을 선택해주세요.</p>
                </div>
                <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                  id="picker-modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {(() => {
                  const allProductsList = getProducts();
                  
                  const isMyProduct = (product: any) => {
                    const currentId = String(currentUserId || "");
                    const currentNick = String(currentUserNickname || "");
                    const hasMatchedId = [
                      product.sellerId,
                      product.ownerId,
                      product.userId,
                      product.createdBy,
                      product.seller?.id
                    ].some(id => String(id || "") === currentId);
                    const hasMatchedNick = product.sellerNickname && String(product.sellerNickname) === currentNick;
                    return hasMatchedId || hasMatchedNick;
                  };

                  const attachableProducts = allProductsList.filter(product =>
                    isMyProduct(product) &&
                    !["deleted", "removed"].includes(String(product.status || "").toLowerCase())
                  );

                  // Debug logs as requested
                  console.log("currentUser.id:", currentUserId);
                  console.log("products.length:", allProductsList.length);
                  console.log("myListedProducts.length:", allProductsList.filter(isMyProduct).length);
                  console.log("attachableProducts.length:", attachableProducts.length);
                  console.log("products details:", allProductsList.map((p: any) => ({ title: p.title, sellerId: p.sellerId, status: p.status })));

                  if (attachableProducts.length === 0) {
                    return (
                      <div className="text-center py-12 px-4 space-y-3">
                        <span className="text-4xl block">📦</span>
                        <p className="text-sm font-semibold text-gray-500">첨부할 수 있는 출품 상품이 없습니다.</p>
                        <p className="text-xs text-gray-400 font-sans">새로운 소장품을 입찰방이나 상점에 먼저 등록해보세요.</p>
                      </div>
                    );
                  }

                  return attachableProducts.map((prod) => {
                    const priceLabel = prod.currentPrice ? `${prod.currentPrice.toLocaleString()}원` : '입찰 없음';
                    const categoryLabel = prod.categoryGroup && prod.categoryName
                      ? `${prod.categoryGroup} / ${prod.categoryName}`
                      : prod.categoryGroup || prod.categoryName || '기타';

                    const getStatusBadge = () => {
                      const statusLower = String(prod.status || "").toLowerCase();
                      if (statusLower === 'live' || statusLower === 'active' || statusLower === 'selling') {
                        return (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wide text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100 font-sans">
                            경매 진행 중
                          </span>
                        );
                      }
                      if (statusLower === 'sold' || statusLower === 'completed') {
                        return (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 font-sans">
                            낙찰 및 주문완료
                          </span>
                        );
                      }
                      if (statusLower === 'shipping') {
                        return (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wide text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100 font-sans">
                            배송중
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200 font-sans uppercase">
                          {prod.status || '대기'}
                        </span>
                      );
                    };

                    return (
                      <div 
                        key={prod.id}
                        id={`picker-item-${prod.id}`}
                        className="flex gap-3 p-3 bg-gray-50 border border-gray-150 rounded-2xl hover:border-gray-400 hover:bg-white transition-all duration-150 items-center"
                      >
                        {/* Image */}
                        {prod.image || prod.images?.[0] ? (
                          <img 
                            src={prod.images?.[0] || prod.image} 
                            alt={prod.title} 
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover bg-gray-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                            <span className="text-xl">📦</span>
                          </div>
                        )}

                        {/* Title & Stats */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 font-bold tracking-tight uppercase mb-0.5">
                            {categoryLabel}
                          </p>
                          <h4 className="text-sm font-extrabold text-gray-900 truncate mb-1">
                            {prod.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-sans">현재가</span>
                            <span className="text-xs font-black text-gray-905">{priceLabel}</span>
                            {getStatusBadge()}
                          </div>
                        </div>

                        {/* Action trigger Button */}
                        <button
                          type="button"
                          onClick={() => handleAttachProduct(prod)}
                          id={`picker-select-${prod.id}`}
                          className="px-3 py-2 text-xs font-extrabold bg-gray-900 text-white hover:bg-slate-800 rounded-xl transition-all font-sans cursor-pointer whitespace-nowrap"
                        >
                          선택
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-150 rounded-xl transition-all cursor-pointer border border-gray-200 bg-white"
                >
                  닫기
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}

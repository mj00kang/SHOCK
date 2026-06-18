export interface MeetupRoom {
  id: string;
  title: string;
  categoryGroup: 'POP' | 'SPORTS' | 'ANALOG';
  subCategory: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  author: string;
  content: string;
  createdAt: string;
  type: 'user' | 'system' | 'product' | 'image';
  productId?: string;
  productSnapshot?: {
    id: string;
    title: string;
    image: string;
    currentPrice: number;
    buyNowPrice?: number | null;
    categoryGroup?: string;
    subCategory?: string;
    status: string;
    endAt?: string;
  };
  imageUrl?: string;
  imageName?: string;
}

const STORAGE_KEYS = {
  MEETUPS: 'shock_meetups_v1',
  CHAT_MESSAGES_PREFIX: 'shock_chat_msgs_'
};

const INITIAL_MEETUPS: MeetupRoom[] = [
  {
    id: 'trading-card',
    title: '트레이딩카드 교환 모임',
    categoryGroup: 'POP',
    subCategory: '트레이딩카드',
    description: '카드 교환, 시세 정보, 보관 팁을 나누는 채팅방',
    memberCount: 42,
    onlineCount: 8,
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'photocard',
    title: '아이돌 포카 교환방',
    categoryGroup: 'POP',
    subCategory: '아이돌 포카',
    description: '포카 교환, 양도, 포장 팁을 공유하는 채팅방',
    memberCount: 89,
    onlineCount: 15,
    lastMessageAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'figure',
    title: '피규어 수집가 모임',
    categoryGroup: 'POP',
    subCategory: '피규어',
    description: '피규어 보관, 진열, 입찰 정보를 나누는 채팅방',
    memberCount: 124,
    onlineCount: 22,
    lastMessageAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sports-card',
    title: '스포츠카드 루키카드방',
    categoryGroup: 'SPORTS',
    subCategory: '스포츠카드',
    description: '루키카드, 그레이딩, 시세 이야기를 나누는 채팅방',
    memberCount: 56,
    onlineCount: 11,
    lastMessageAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sneakers',
    title: '운동화 컬렉터 방',
    categoryGroup: 'SPORTS',
    subCategory: '운동화',
    description: '한정판 운동화, 보관, 실착/미실착 이야기를 나누는 채팅방',
    memberCount: 95,
    onlineCount: 17,
    lastMessageAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'lp',
    title: '희귀 LP 감상회',
    categoryGroup: 'ANALOG',
    subCategory: '희귀 LP/음반',
    description: 'LP 수집, 턴테이블, 음반 상태 이야기를 나누는 채팅방',
    memberCount: 38,
    onlineCount: 6,
    lastMessageAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vintage-camera',
    title: '빈티지 카메라 입문방',
    categoryGroup: 'ANALOG',
    subCategory: '빈티지 카메라',
    description: '필름카메라 모델, 렌즈, 수리 정보를 공유하는 채팅방',
    memberCount: 61,
    onlineCount: 9,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'retro',
    title: '레트로 수집방',
    categoryGroup: 'ANALOG',
    subCategory: '레트로',
    description: '레트로 게임기, 카세트, 오래된 기기 이야기를 나누는 채팅방',
    memberCount: 77,
    onlineCount: 12,
    lastMessageAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'trading-card': [
    { id: 'm-tc-1', roomId: 'trading-card', author: '시스템', content: '트레이딩카드 교환 모임에 오신 것을 환영합니다! 🎉', createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), type: 'system' },
    { id: 'm-tc-2', roomId: 'trading-card', author: '지우존엄', content: '이번 주 카드 교환 모임 오시는 분 있나요?? 실시간 교환해용', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-tc-3', roomId: 'trading-card', author: '레어마스터K', content: '저 성수동 샥 매장 근처 카페에서 2시에 포켓몬 고등급 팩 들고 갑니다!', createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-tc-4', roomId: 'trading-card', author: '포카루팡', content: '오 저도 이번에 PSA 10 받은 리자몽 들고 갈게요 ㅋㅋ 기대됩니다.', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), type: 'user' }
  ],
  'photocard': [
    { id: 'm-pc-1', roomId: 'photocard', author: '시스템', content: '아이돌 포카 교환방이 활성화되었습니다. 💖', createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), type: 'system' },
    { id: 'm-pc-2', roomId: 'photocard', author: '포카루팡', content: '포카 포장할 때 탑로더랑 하드케이스 필수인가요? 초보라 여쭤봅니다 ㅎㅎ', createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-pc-3', roomId: 'photocard', author: '블랙러브', content: '네! 파손 위험 있어서 에어캡이랑 하드케이스는 무조건 매너입니당', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-pc-4', roomId: 'photocard', author: '포카루팡', content: '아하 친절한 설명 감사합니다! 바로 하드케이스 주문해야겠네요.', createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), type: 'user' }
  ],
  'figure': [
    { id: 'm-fg-1', roomId: 'figure', author: '시스템', content: '피규어 수집가 모임에 오신 것을 환영합니다! 🧸', createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), type: 'system' },
    { id: 'm-fg-2', roomId: 'figure', author: '덕질대장', content: '이 피규어 오리지널 미개봉 시세 어느 정도일까요? 요즘 좀 오른 것 같던데', createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-fg-3', roomId: 'figure', author: '피규어러브', content: '정품 일판 기준으로 요즘 25만~30만 선에서 거래되는 것 같아요!', createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), type: 'user' },
    { id: 'm-fg-4', roomId: 'figure', author: '우주세기건덕', content: '개봉품은 헤드 하자 없어도 18만 이하로 뚝 떨어지니 참고하세여.', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), type: 'user' }
  ],
  'lp': [
    { id: 'm-lp-1', roomId: 'lp', author: '시스템', content: '희귀 LP 감상회 방이 개설되었습니다. 📻', createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), type: 'system' },
    { id: 'm-lp-2', roomId: 'lp', author: '바이닐헤븐', content: '다들 바이닐/LP 보관하실 때 겨울철이랑 장마철 습도 관리는 어떻게 하시나요?', createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), type: 'user' },
    { id: 'm-lp-3', roomId: 'lp', author: '라이카아재', content: '제습기 약하게 항상 틀어두고 겉비닐(속비닐 포함) 2중으로 씌워서 세워 보관합니다.', createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), type: 'user' }
  ]
};

export const getMeetupRooms = (): MeetupRoom[] => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.MEETUPS);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error loading meetups from localStorage', e);
  }
  
  // Scaffolding initial meetups if empty
  localStorage.setItem(STORAGE_KEYS.MEETUPS, JSON.stringify(INITIAL_MEETUPS));
  return INITIAL_MEETUPS;
};

export const saveMeetupRooms = (rooms: MeetupRoom[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEETUPS, JSON.stringify(rooms));
};

export const getChatMessages = (roomId: string): ChatMessage[] => {
  const key = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${roomId}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error(`Error loading chat for room ${roomId}`, e);
  }

  // Fallback to initial seed if available, or create empty list with a welcome message
  const initial = INITIAL_CHAT_MESSAGES[roomId] || [
    {
      id: `m-sys-${roomId}`,
      roomId,
      author: '시스템',
      content: '새로운 소모임 대화방이 생성되었습니다! 아름답고 깨끗한 소통 문화를 지켜주세요. 🤝',
      createdAt: new Date().toISOString(),
      type: 'system'
    }
  ];
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

export const saveChatMessages = (roomId: string, messages: ChatMessage[]): void => {
  const key = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${roomId}`;
  localStorage.setItem(key, JSON.stringify(messages));
};

export const addChatMessage = (roomId: string, author: string, content: string, type: 'user' | 'system' = 'user'): ChatMessage => {
  const messages = getChatMessages(roomId);
  const newMsg: ChatMessage = {
    id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    roomId,
    author,
    content,
    createdAt: new Date().toISOString(),
    type
  };
  
  const updatedMessages = [...messages, newMsg];
  saveChatMessages(roomId, updatedMessages);
  
  // Update last active message time in MeetupRoom list
  const rooms = getMeetupRooms();
  const updatedRooms = rooms.map(room => {
    if (room.id === roomId) {
      return {
        ...room,
        lastMessageAt: newMsg.createdAt
      };
    }
    return room;
  });
  saveMeetupRooms(updatedRooms);
  
  return newMsg;
};

export const addProductChatMessage = (
  roomId: string,
  author: string,
  productId: string,
  productSnapshot: any
): ChatMessage => {
  const messages = getChatMessages(roomId);
  const newMsg: ChatMessage = {
    id: `m-prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    roomId,
    author,
    content: `[상품 교환] ${productSnapshot.title}`,
    createdAt: new Date().toISOString(),
    type: 'product',
    productId,
    productSnapshot
  };
  
  const updatedMessages = [...messages, newMsg];
  saveChatMessages(roomId, updatedMessages);
  
  const rooms = getMeetupRooms();
  const updatedRooms = rooms.map(room => {
    if (room.id === roomId) {
      return {
        ...room,
        lastMessageAt: newMsg.createdAt
      };
    }
    return room;
  });
  saveMeetupRooms(updatedRooms);
  
  return newMsg;
};

export const addImageChatMessage = (
  roomId: string,
  author: string,
  content: string,
  imageUrl: string,
  imageName: string
): ChatMessage => {
  const messages = getChatMessages(roomId);
  const newMsg: ChatMessage = {
    id: `m-img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    roomId,
    author,
    content,
    createdAt: new Date().toISOString(),
    type: 'image',
    imageUrl,
    imageName
  };
  
  const updatedMessages = [...messages, newMsg];
  saveChatMessages(roomId, updatedMessages);
  
  const rooms = getMeetupRooms();
  const updatedRooms = rooms.map(room => {
    if (room.id === roomId) {
      return {
        ...room,
        lastMessageAt: newMsg.createdAt
      };
    }
    return room;
  });
  saveMeetupRooms(updatedRooms);
  
  return newMsg;
};

export interface JoinedMeetupRoom {
  id: string;
  userId: string;
  roomId: string;
  joinedAt: string;
  lastVisitedAt: string;
}

export const getJoinedMeetupRooms = (userId?: string): JoinedMeetupRoom[] => {
  const key = 'shock_joined_meetup_rooms';
  try {
    const cached = localStorage.getItem(key);
    if (!cached) {
      return [];
    }
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed)) {
      if (userId) {
        return parsed.filter(r => r && r.userId === userId);
      }
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Error parsing shock_joined_meetup_rooms safely, recovering empty array', e);
    return [];
  }
};

export const saveJoinedMeetupRooms = (rooms: JoinedMeetupRoom[]): void => {
  try {
    const arr = Array.isArray(rooms) ? rooms : [];
    localStorage.setItem('shock_joined_meetup_rooms', JSON.stringify(arr));
  } catch (e) {
    console.error('Error saving shock_joined_meetup_rooms', e);
  }
};

export const joinMeetupRoom = (userId: string, roomId: string): void => {
  if (!userId || !roomId) return;
  try {
    const rooms = getJoinedMeetupRooms();
    const existingIndex = rooms.findIndex(r => r && r.userId === userId && r.roomId === roomId);
    const now = new Date().toISOString();
    
    if (existingIndex !== -1) {
      rooms[existingIndex].lastVisitedAt = now;
    } else {
      const newRecord: JoinedMeetupRoom = {
        id: `joined_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId,
        roomId,
        joinedAt: now,
        lastVisitedAt: now
      };
      rooms.push(newRecord);
    }
    saveJoinedMeetupRooms(rooms);
  } catch (e) {
    console.error('Error running joinMeetupRoom', e);
  }
};

export const getUserJoinedMeetupRooms = (userId: string): JoinedMeetupRoom[] => {
  if (!userId) return [];
  try {
    const rooms = getJoinedMeetupRooms();
    return rooms.filter(r => r && r.userId === userId);
  } catch (e) {
    console.error('Error running getUserJoinedMeetupRooms', e);
    return [];
  }
};

export const updateMeetupLastVisited = (userId: string, roomId: string): void => {
  joinMeetupRoom(userId, roomId);
};



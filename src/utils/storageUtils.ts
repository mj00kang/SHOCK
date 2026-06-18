import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_NOTICES, Product, Category, Notice, products as newProducts, auctions as newAuctions } from '../data/mockData';
import { generateAllMockPosts, generateAllMockComments, CommunityPost, Comment } from './communityPostGenerator';

export type { CommunityPost, Comment };

// 가상 로그인 사용자 정보 (테스트를 위한 풍족한 500만 샥머니 기본 지급!)
export interface UserState {
  id: string;
  nickname: string;
  email: string;
  role: 'user' | 'admin';
  coins: number; // 가압 결제 및 실전 입찰 성립에 쓰이는 가상 충전 샥머니
  likes: string[]; // 찜한 상품 ID 목록
  joinedLuckyEvents: string[]; // 응모 접수 완료된 100원 래플 이벤트 ID 목록
}

const DEFAULT_USER: UserState = {
  id: 'usr-928',
  nickname: '리미티드 수퍼콜렉터',
  email: 'collector_pro@shock.co.kr',
  role: 'user', // 기본 일반유저 모드, 헤더에서 실시간 ADMIN 모드 전환 가능
  coins: 5000000, 
  likes: [],
  joinedLuckyEvents: []
};

const STORAGE_KEYS = {
  PRODUCTS: 'shock_products_v2',
  USER: 'shock_user_v2',
  BIDS: 'shock_bids_v2',
  COMMUNITY_V3: 'shock_community_v3',
  COMMENTS_V3: 'shock_comments_v3',
  NOTICES: 'shock_notices_v2',
  LUCKY_EVENTS_V7: 'shock_lucky_events_v7',
  ORDERS: 'shock_orders_v2',
  INQUIRIES: 'syak_inquiries',
  REPORTS: 'syak_reports'
};

export interface Inquiry {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  relatedOrderId?: string;
  image?: string;
  status: string;
  createdAt: string;
  answer?: string;
}

export interface Report {
  id: string;
  userId: string;
  reportType: string;
  targetType: string;
  targetId?: string;
  productId?: string;
  orderId?: string;
  content: string;
  image?: string;
  status: string;
  createdAt: string;
}

export interface BidRecord {
  id: string;
  productId: string;
  bidderNickname: string;
  bidderId: string;
  bidPrice: number;
  bidAt: string;
}

export interface OrderState {
  id: string;
  productId: string;
  title?: string;
  productTitle?: string;
  image?: string;
  productImage?: string;
  buyerId: string;
  buyerNickname: string;
  sellerId?: string;
  sellerNickname: string;
  finalPrice: number;
  orderType: 'bid_win' | 'buy_now' | 'lucky_win' | 'instant_deal' | 'auction_win';
  paymentStatus: 'unpaid' | 'paid';
  escrowStatus?: 'none' | 'holding' | 'released' | 'refunded';
  deliveryStatus: 'preparing' | 'shipping' | 'delivered' | 'confirmed' | 'pickup_requested' | 'pickup_ready' | 'picked_up';
  orderStatus?: 'pending_payment' | 'paid' | 'shipping' | 'delivered' | 'cancelled' | 'completed' | 'pickup_requested' | 'pickup_ready' | 'picked_up';
  itemPrice?: number;
  serviceFee?: number;
  shippingFee?: number;
  totalPaymentAmount?: number;
  shippingAddress?: any;
  paidAt?: string;
  createdAt: string;
  courier?: string;
  carrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  pickupMethod?: string;
  pickupDate?: string;
  pickupAddress?: string;
  pickupTimeSlot?: string;
  pickupPlacePhoto?: string;
  packagePhoto?: string;
  refundStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
  refundReason?: string;
  refundDetail?: string;
  refundAvailableUntil?: string;
  buyerConfirmedAt?: string;
  escrowReleasedAt?: string;
  payoutStatus?: string;
  couponId?: string | null;
  couponName?: string;
  couponDiscount?: number;
  originalTotalAmount?: number;
}

export interface LuckyEventState {
  id: string;
  eventType: '럭키샥' | '소모임' | '기획전' | string;
  title: string;
  productName: string; // Used for lucky shock
  image: string;
  eventPrice: number;
  startAt: string;
  endAt: string;
  winnerCount: number;
  participants: string[]; // 유저 ID 또는 닉네임 리스팅
  winners: string[]; // 최종 행운 당첨자 닉네임 목록
  status: 'live' | 'ended' | 'drawn' | 'closed' | 'completed';
  description: string;
  content: string;
  type?: string;
  category?: string;
  kind?: string;
  badge?: string;
  isLuckyShock?: boolean;
  isLucky?: boolean;
  tags?: string[];
}

export const isLuckyShockEvent = (event: LuckyEventState) => {
  const text = [
    event.type,
    event.category,
    event.eventType,
    event.kind,
    event.title,
    event.badge,
    ...(Array.isArray(event.tags) ? event.tags : [])
  ].filter(Boolean).join(" ").toLowerCase();

  return (
    event.isLuckyShock === true ||
    event.isLucky === true ||
    text.includes("lucky") ||
    text.includes("lucky shock") ||
    text.includes("럭키샥") ||
    text.includes("100원 응모")
  );
};

const DEFAULT_LUCKY_EVENTS = (): LuckyEventState[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return [
    {
      id: 'lucky-001',
      eventType: '럭키샥',
      type: 'luckyShock',
      category: '럭키샥',
      isLuckyShock: true,
      title: '🎁 [LUCKY SHOCK] 나이키 x 피스마이너스원 에어포스 1',
      productName: '나이키 x 피스마이너스원 에어포스 1 ',
      image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220113_32%2F1642061470208Y6IOP_JPEG%2F43197304747787293_267417019.jpg&type=sc960_832',
      eventPrice: 100,
      startAt: '2026-06-10T00:00:00Z',
      endAt: '2026-06-20T00:00:00Z',
      winnerCount: 1,
      participants: ['101', '102', '103', '104', '105', '106', '107'],
      winners: [],
      status: 'live',
      description: '단돈 100원으로 인생 희귀 명품 수집물을 쟁취해보세요!',
      content: '지드래곤 피스마이너스원 포스'
    },
    {
      id: 'lucky-002',
      eventType: '럭키샥',
      type: 'luckyShock',
      category: '럭키샥',
      isLuckyShock: true,
      title: '🎁 [LUCKY SHOCK] 미개봉 초판 빅뱅 미니앨범 3집',
      productName: ' [미개봉 초판] 빅뱅 미니앨범 3집',
      image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250812_70%2F175496442842114elT_JPEG%2F9762897393151332_1831934851.jpg&type=sc960_832',
      eventPrice: 100,
      startAt: '2026-06-10T00:00:00Z',
      endAt: '2026-06-25T00:00:00Z',
      winnerCount: 1,
      participants: ['201', '202', '203', '204'],
      winners: [],
      status: 'live',
      description: '단돈 100원으로 빅뱅 미니앨범 초판을 쟁취해보세요!',
      content: '[미개봉 초판] 빅뱅 미니앨범 3집'
    },
    {
      id: 'lucky-003',
      eventType: '럭키샥',
      type: 'luckyShock',
      category: '럭키샥',
      isLuckyShock: true,
      title: '🎁 [LUCKY SHOCK] 콘탁스 T3 티타늄 블랙',
      productName: '콘탁스(Contax) T3 티타늄 블랙',
      image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230705_163%2F1688532670454b1kjE_JPEG%2F4313643354396896_1231841538.jpg&type=sc960_832',
      eventPrice: 100,
      startAt: new Date(now).toISOString(),
      endAt: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
      winnerCount: 1,
      participants: ['포카루팡', '라이카아재', '블랙러브'],
      winners: [],
      status: 'live',
      description: '단돈 100원으로 콘탁스(Contax) T3 티타늄 블랙을 얻을 수 있는 찬스!',
      content: '콘탁스(Contax) T3 티타늄 블랙 미개봉 박스 제품입니다.'
    },
    {
      id: 'lucky-004',
      eventType: '럭키샥',
      type: 'luckyShock',
      category: '럭키샥',
      isLuckyShock: true,
      title: '🎁 [LUCKY SHOCK] 한정판 헤리티지 액션 피규어',
      productName: '피스마이너스원 X G-DRAGON 오리지널 한정판 헤리티지 액션 피규어',
      image: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260530_40%2F1780073548300Qzhwl_JPEG%2F114206484426757733_662201560.jpeg&type=sc960_832',
      eventPrice: 100,
      startAt: new Date(now).toISOString(),
      endAt: new Date(now + 10 * 60 * 1000).toISOString(),
      winnerCount: 1,
      participants: ['우주세기건덕', '조단레드', '지우존엄'],
      winners: [],
      status: 'live',
      description: '피스마이너스원과 지드래곤의 역사적 콜라보 아트를 100원에 응모하세요.',
      content: '글로벌 아이콘 지드래곤의 한정 레이블 피스마이너스원 독점 한정판 액션 피규어입니다.'
    },
    {
      id: 'event-gathering-01',
      eventType: '소모임',
      type: 'gathering',
      category: '소모임',
      isLuckyShock: false,
      title: '🤝 주말 오프라인 TCG 트레이딩 카드 교환 모임',
      productName: '카드 교환 소모임',
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80',
      eventPrice: 0,
      startAt: new Date(now - 1 * dayMs).toISOString(),
      endAt: new Date(now + 3 * dayMs).toISOString(),
      winnerCount: 0,
      participants: ['포카루팡', '지우존엄', '레어마스터K', '조단레드'],
      winners: [],
      status: 'live',
      description: '카드 수집가들이 한자리에 모여 직접 눈으로 확인하며 교환 및 친목을 도모하는 소모임입니다.',
      content: '성수동 샥 갤러리 아뜰리에에서 소중히 보관해온 포켓몬, 유희왕, 스포츠카드 등을 안심 교환할 수 있는 장을 엽니다. 가품 감정 시연 및 슬리브 추천 기프티콘 증정 등 풍성한 콜렉터스 혜택이 마련되어 있으니 가벼운 마음으로 입장해 보세요!'
    },
    {
      id: 'event-exhibition-01',
      eventType: '기획전',
      type: 'promotion',
      category: '기획전',
      isLuckyShock: false,
      title: '⚡ POP 컬렉터 특별 주간 기획전',
      productName: '팝 컬처 스페셜전',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      eventPrice: 0,
      startAt: new Date(now).toISOString(),
      endAt: new Date(now + 5 * dayMs).toISOString(),
      winnerCount: 0,
      participants: ['덕질대장', '피규어러브', '우주세기건덕'],
      winners: [],
      status: 'live',
      description: '피규어, 아이돌 포카, 트레카, 완구 등 최고 인기를 누리는 명예 소장품만 한자리에 모았습니다.',
      content: '글로벌 팝 컬처 시장을 뒤흔든 오리지널 희귀 피규어, 미공포 포카, 고등급 PSA 카드를 특별 선정해 메인 전시에 업로드했습니다. 프리미엄 등급 보정률이 확실한 진품들의 향연을 감상하시고 경합 낙찰의 영광을 잡으세요!'
    },
    {
      id: 'event-exhibition-02',
      eventType: '기획전',
      type: 'promotion',
      category: '기획전',
      isLuckyShock: false,
      title: '📻 ANALOG 클래식 빈티지 위크 기획전',
      productName: '클래식 빈티지전',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      eventPrice: 0,
      startAt: new Date(now - 2 * dayMs).toISOString(),
      endAt: new Date(now + 4 * dayMs).toISOString(),
      winnerCount: 0,
      participants: ['라이카아재', '바이닐헤븐', '카세트가이'],
      winners: [],
      status: 'live',
      description: '희귀 바이닐 LP, 빈티지 수동 카메라, 옛날 귀중 우표 등 박물관급 아날로그 마스터피스 기획전.',
      content: '진정한 시간이 멈춘 아름다운 감성을 전하는 기획전입니다. 라이카 크롬 바디, 최초 프레싱 수입 비틀즈 음반, 조선 시대의 귀중 엽전 화폐들을 샥 입찰 테이블에서 만나보세요. 세월이 축적해온 본질의 가치를 인정하는 컬렉터분들에게 선사합니다.'
    },
    {
      id: 'event-ended-01',
      eventType: '소모임',
      title: '❌ [종료] 클래식 축구 레트로 유니폼 컬렉터 정모 1차',
      productName: '축구 유니폼 정모',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
      eventPrice: 0,
      startAt: new Date(now - 10 * dayMs).toISOString(),
      endAt: new Date(now - 3 * dayMs).toISOString(),
      winnerCount: 0,
      participants: ['유니폼매니아', '축구돌이', '레드데빌'],
      winners: [],
      status: 'ended',
      description: '해외 구단 시그니처 정품 메치원 및 올드 저지 애호가들의 성공리에 마감된 첫 번째 정식 오프라인 모임.',
      content: '기대에 가득 차 개시한 축구 유니폼 교환회가 전원 참여로 성황리에 마감되었습니다. 스폰서 마킹 자가 복구 시연 및 80년대 레어 구단 저지 실물 영접으로 뜨거웠던 현장 소식이었으며, 호응에 힘입어 다음 달 2차 정모를 커뮤니티 게시판을 통해 예고할 예정입니다.'
    }
  ];
};


const PRODUCT_SEED_VERSION = 'category-80-products-v11';

export const initStorage = (forceReset = false) => {
  let isTargetSeed = false;
  try {
    const seedVersion = localStorage.getItem('shock_product_seed_version');
    if (seedVersion === PRODUCT_SEED_VERSION) {
      isTargetSeed = true;
    }
  } catch (e) {
    isTargetSeed = false;
  }

  // Check if our extensive V3 community exists
  const hasCommunity = localStorage.getItem(STORAGE_KEYS.COMMUNITY_V3);
  const hasEvents = localStorage.getItem(STORAGE_KEYS.LUCKY_EVENTS_V7);

  if (forceReset || !isTargetSeed || !hasCommunity || !hasEvents) {
    if (forceReset || !isTargetSeed) {
      let userProducts: any[] = [];
      try {
        const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            userProducts = parsed.filter(p => String(p.id).startsWith('prod-user-custom'));
          }
        }
      } catch (e) {
        // ignore
      }

      const initialMock = INITIAL_PRODUCTS();
      
      // Combine with the newly added 80 products
      
      const mappedNewProducts = (newProducts || []).map((p: any, idx: number) => {
        const auction = (newAuctions || []).find((a: any) => a.productId === p.id) || ({} as any);
        
        const categoryToKeyword: Record<string, string> = {
          '빈티지토이': 'toy,vintage',
          '피규어': 'figurine',
          '트레이딩카드': 'tradingcard',
          '아이돌 포카': 'kpop,idol',
          '스포츠카드': 'sportscard',
          '유니폼/의류 굿즈': 'jersey',
          '운동화': 'sneakers',
          '사인볼/공': 'baseball,basketball',
          '스포츠 굿즈': 'sports',
          '희귀 LP/음반': 'vinyl,record',
          '빈티지 카메라': 'camera,vintage',
          '화폐': 'coins,currency',
          '우표': 'stamp',
          '로스트미디어': 'cassette,vhs',
          '레트로': 'retro,electronics',
          '굿즈': 'merchandise'
        };
        const keyword = categoryToKeyword[p.category] || 'collectible';
        // Generate a locked deterministic image index
        const lock = idx + 100;
        
        const userProvidedImage = p.images && p.images.length > 0 && p.images[0].trim() !== "" ? p.images[0] : null;
        const generatedImage = userProvidedImage || `https://loremflickr.com/800/600/${keyword}?lock=${lock}`;

        const correctGroup = INITIAL_CATEGORIES.find((c: any) => c.name === p.category)?.group || 'POP';

        return {
          ...p,
          categoryName: p.category,
          categoryGroup: correctGroup,
          image: generatedImage,
          images: userProvidedImage ? p.images : [generatedImage],
          startPrice: auction.startPrice || 0,
          currentPrice: auction.currentPrice || 0,
          buyNowPrice: auction.buyNowPrice || null,
          bidCount: Math.floor(Math.random() * 20),
          startAt: auction.startAt || new Date().toISOString(),
          endAt: auction.endAt || new Date(Date.now() + 86400000).toISOString(),
          sellerNickname: '수집가_' + p.sellerId.replace('seller_', ''),
          isInstantDealAvailable: !!auction.buyNowPrice,
        };
      });

      const combined = [...initialMock, ...mappedNewProducts, ...userProducts];

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(combined));
      localStorage.setItem('shock_product_seed_version', PRODUCT_SEED_VERSION);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
      localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    
    // Always scaffold extensive posts and comments if not existing
    if (forceReset || !hasCommunity) {
      const gPosts = generateAllMockPosts();
      const gComments = generateAllMockComments(gPosts);
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_V3, JSON.stringify(gPosts));
      localStorage.setItem(STORAGE_KEYS.COMMENTS_V3, JSON.stringify(gComments));
    }

    // Always scaffold default events if not existing
    if (forceReset || !hasEvents) {
      localStorage.setItem(STORAGE_KEYS.LUCKY_EVENTS_V7, JSON.stringify(DEFAULT_LUCKY_EVENTS()));
    }

    console.log('SHOCK Clean LocalStorage dynamic databases booted safely with category 3 each rules.');
  }
};

function generateStorageTrendData(currentPrice: number): { date: string; price: number; volume: number }[] {
  const data: { date: string; price: number; volume: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateStr = String(d.getDate()).padStart(2, '0');
    const dateFormatted = `${month}/${dateStr}`;

    let price: number;
    if (i === 0) {
      price = currentPrice;
    } else {
      const randRatio = -0.10 + Math.random() * 0.20;
      price = Math.round((currentPrice * (1 + randRatio)) / 100) * 100;
    }

    const volume = Math.floor(Math.random() * 150) + 10;

    data.push({
      date: dateFormatted,
      price,
      volume
    });
  }
  return data;
}

export function normalizeProduct(product: any): Product {
  const buyNowRaw = product.buyNowPrice ?? product.instantPrice ?? product.instantDealPrice ?? product.buyoutPrice ?? product.immediatePrice ?? product.quickBuyPrice ?? product.directPrice;
  const buyNowPriceVal = buyNowRaw ? Number(buyNowRaw) : 0;
  
  // Convert any Dutch or Descending auctions to Ascending
  const pType = product.auctionType;
  const pTypeLabel = product.auctionTypeLabel;
  const pMethod = product.auctionMethod;

  const normalizedType = (pType === 'descending' || pType === 'dutch') ? 'ascending' : pType;
  const normalizedTypeLabel = (pTypeLabel === '하향식') ? '상향식' : pTypeLabel;
  const normalizedMethod = (pMethod === '하향식') ? '상향식' : pMethod;

  let images = product.images || [product.image].filter(Boolean);
  let title = product.title;
  let description = product.description;
  let image = product.image;

  if (!image && (!images || images.length === 0)) {
    const lock = product.id ? parseInt(product.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000);
    image = `https://loremflickr.com/800/600/collectible?lock=${lock}`;
    images = [image];
  }

  if (title && (title.includes('포뮬러 1') || title.includes('F1'))) {
    image = 'https://loremflickr.com/800/600/formula1,racing?lock=333';
    images = [image];
    title = '레드불 레이싱 F1 머신 실착 타이어 조각 한정판';
    description = '포뮬러 1 레드불 레이싱 오리지널 타이어 조각 컬렉티블입니다. 레이싱 매니아를 위한 소장 가치가 뛰어납니다.';
  }

  let endAt = product.endAt;
  const exactly24HrsMs = Date.now() + 24 * 60 * 60 * 1000;
  const isPast = endAt ? new Date(endAt).getTime() <= Date.now() : true;
  const isTooFarFuture = endAt ? new Date(endAt).getTime() > exactly24HrsMs : false;
  
  if (!endAt || isTooFarFuture || (isPast && product.status === 'live')) {
    // 사용자가 '타이머를 24시간 마감으로 맞춰달라'고 요청했으므로, 
    // 라이브 경매 상품의 시간 보정 시 24시간(혹은 매우 근접한) 값으로 일괄 맞춥니다.
    endAt = new Date(exactly24HrsMs).toISOString();
  }

  const currentPriceVal = Number(product.currentPrice || product.price || 10000);
  let trendData = product.trendData;
  if (!trendData || trendData.length === 0) {
    trendData = generateStorageTrendData(currentPriceVal);
  }

  // Ensure categoryGroup exists and is accurate
  let categoryGroup = product.categoryGroup;
  if (!categoryGroup || categoryGroup === 'POP') {
     // We need to re-check if categoryName maps to another group
     const catName = product.categoryName || product.category;
     if (catName) {
       const groupMatch = INITIAL_CATEGORIES.find(c => c.name === catName)?.group;
       if (groupMatch) {
         categoryGroup = groupMatch;
       }
     }
  }

  return {
    ...product,
    images: images,
    image: image,
    title: title,
    description: description,
    categoryGroup: categoryGroup || 'POP',
    categoryName: product.categoryName || product.category || '기타',
    auctionType: normalizedType,
    auctionTypeLabel: normalizedTypeLabel,
    auctionMethod: normalizedMethod,
    buyNowPrice: buyNowPriceVal > 0 ? buyNowPriceVal : null,
    hasBuyNow: buyNowPriceVal > 0,
    status: product.status || 'live',
    endAt: endAt,
    trendData: trendData
  };
}

export const getProducts = (): Product[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS) || localStorage.getItem('shock_products') || '[]';
    let parsed = JSON.parse(raw);
    parsed = Array.isArray(parsed) ? parsed : [];
    
    // Override product images dynamically from mockData so that manual edits in mockData.ts reflect without clearing local storage
    const allMockProducts = [...INITIAL_PRODUCTS(), ...(newProducts || [])];
    parsed = parsed.map((p: any) => {
      const mockHit = allMockProducts.find((m: any) => m.id === p.id) as any;
      if (mockHit && mockHit.images && mockHit.images.length > 0 && mockHit.images[0].trim() !== '') {
        p.images = mockHit.images;
        p.image = mockHit.image || mockHit.images[0];
      }
      return p;
    });

    const normalized = parsed.map(normalizeProduct);
    return normalized;
  } catch {
    const initial = INITIAL_PRODUCTS().map(normalizeProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initial));
    localStorage.setItem('shock_products', JSON.stringify(initial));
    return initial;
  }
};

export const saveProducts = (prods: Product[]) => {
  const normalized = prods.map(normalizeProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(normalized));
  localStorage.setItem('shock_products', JSON.stringify(normalized));
};

export const getUser = (): UserState => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || JSON.stringify(DEFAULT_USER));
  } catch {
    return DEFAULT_USER;
  }
};

export const saveUser = (user: UserState) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getBids = (): BidRecord[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]');
  } catch {
    return [];
  }
};

export const saveBids = (bids: BidRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
};

export const getCommunityPosts = (): CommunityPost[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_V3) || '[]');
  } catch {
    return [];
  }
};

export const saveCommunityPosts = (posts: CommunityPost[]) => {
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_V3, JSON.stringify(posts));
};

// Comments Management
export const getComments = (): Comment[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS_V3) || '[]');
  } catch {
    return [];
  }
};

export const saveComments = (comments: Comment[]) => {
  localStorage.setItem(STORAGE_KEYS.COMMENTS_V3, JSON.stringify(comments));
};

export const getNotices = (): Notice[] => {
  initStorage();
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  return INITIAL_NOTICES;
};

export const getLuckyEvents = (): LuckyEventState[] => {
  initStorage();
  try {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.LUCKY_EVENTS_V7) || '[]');
    let needsUpdate = false;
    
    // Repair titles dynamically
    const repaired = events.map((event: any, index: number) => {
      const rawTitle = String(event.title || "");
      const rawProduct = String(event.productName || event.targetProductName || "");

      const isLuckyShock =
        rawTitle.includes("LUCKY SHOCK") ||
        rawTitle.includes("럭키샥") ||
        rawTitle.includes("100원 응모 이벤트") ||
        rawProduct.includes("나이키") ||
        rawProduct.includes("빅뱅") ||
        rawProduct.includes("콘탁스");

      if (isLuckyShock && rawTitle.includes("100원 응모 이벤트")) {
        needsUpdate = true;
        const titleMap: Record<string, string> = {
          'lucky-001': '나이키 × 피스마이너스원 에어포스 1',
          'lucky-002': '빅뱅 미니앨범 3집',
          'lucky-003': '콘탁스 T3 티타늄 블랙',
          'lucky-004': '한정판 헤리티지 액션 피규어',
        };

        const fixedName = titleMap[event.id] || titleMap[`lucky-00${index + 1}`] || event.productName || '특별 상품';

        return {
          ...event,
          title: `🎁 [LUCKY SHOCK] ${fixedName}`,
          productName: fixedName
        };
      }
      return event;
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEYS.LUCKY_EVENTS_V7, JSON.stringify(repaired));
      return repaired;
    }

    return events;
  } catch {
    return DEFAULT_LUCKY_EVENTS();
  }
};

export const saveLuckyEvents = (events: LuckyEventState[]) => {
  localStorage.setItem(STORAGE_KEYS.LUCKY_EVENTS_V7, JSON.stringify(events));
};

export const getOrders = (): OrderState[] => {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  } catch {
    return [];
  }
};

export const saveOrders = (orders: OrderState[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const updateCoins = (amount: number): number => {
  const user = getUser();
  user.coins += amount;
  saveUser(user);
  return user.coins;
};

export interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  name: string;
  type: 'fixed' | 'shipping';
  discountAmount: number;
  description: string;
  minOrderAmount: number;
  usableOn: string[];
  isUsed: boolean;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
  usedOrderId?: string;
}

export const getCoupons = (): UserCoupon[] => {
  try {
    const raw = localStorage.getItem('syak_coupons');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCoupons = (coupons: UserCoupon[]) => {
  localStorage.setItem('syak_coupons', JSON.stringify(coupons));
};

export const initCouponsForUser = (userId: string) => {
  const coupons = getCoupons();
  const userCoupons = coupons.filter(c => String(c.userId) === String(userId));
  if (userCoupons.length === 0) {
    const nowISO = new Date().toISOString();
    const defaultCoupons: UserCoupon[] = [
      {
        id: "coupon-first-win-" + Date.now(),
        userId: userId,
        couponId: "first-win-3000",
        name: "첫 낙찰 3,000원 할인 쿠폰",
        type: "fixed",
        discountAmount: 3000,
        description: "첫 낙찰 또는 첫 즉시낙찰 결제 시 사용할 수 있는 쿠폰입니다.",
        minOrderAmount: 10000,
        usableOn: ["auction_win", "buy_now", "instant_buy"],
        isUsed: false,
        issuedAt: nowISO,
        expiresAt: "2026-12-31T23:59:59.000Z"
      },
      {
        id: "coupon-free-shipping-" + Date.now() + "-1",
        userId: userId,
        couponId: "free-shipping-3000",
        name: "계약택배 배송비 무료 쿠폰",
        type: "shipping",
        discountAmount: 3000,
        description: "샥 계약택배 배송비에 사용할 수 있는 쿠폰입니다.",
        minOrderAmount: 0,
        usableOn: ["auction_win", "buy_now", "instant_buy"],
        isUsed: false,
        issuedAt: nowISO,
        expiresAt: "2026-12-31T23:59:59.000Z"
      },
      {
        id: "coupon-lucky-syak-" + Date.now() + "-2",
        userId: userId,
        couponId: "lucky-syak-1000",
        name: "럭키샥 참여자 1,000원 할인 쿠폰",
        type: "fixed",
        discountAmount: 1000,
        description: "럭키샥 100원 응모 이벤트 참여자 전용 쿠폰입니다.",
        minOrderAmount: 5000,
        usableOn: ["auction_win", "buy_now", "instant_buy"],
        isUsed: false,
        issuedAt: nowISO,
        expiresAt: "2026-12-31T23:59:59.000Z"
      }
    ];
    const updated = [...coupons, ...defaultCoupons];
    saveCoupons(updated);
    return defaultCoupons;
  }
  return userCoupons;
};

// -- Inquiries --
export const getInquiries = (): Inquiry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
  return data ? JSON.parse(data) : [];
};

export const saveInquiries = (inquiries: Inquiry[]) => {
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
};

// -- Reports --
export const getReports = (): Report[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  return data ? JSON.parse(data) : [];
};

export const saveReports = (reports: Report[]) => {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
};

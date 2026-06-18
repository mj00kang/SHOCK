import { generateMockProducts } from '../utils/productGenerator';

export interface Category {
  id: string;
  group: 'POP' | 'SPORTS' | 'ANALOG';
  name: string;
  icon: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  categoryGroup: 'POP' | 'SPORTS' | 'ANALOG';
  categoryName: string;
  image: string;
  images?: string[];
  currentPrice: number;
  startPrice: number;
  buyNowPrice?: number | null;
  hasBuyNow?: boolean;
  isInstantDealAvailable?: boolean;
  minBidIncrement?: number;
  bidCount: number;
  bidsCount?: number;
  likeCount: number;
  startAt: string; // ISO String
  endAt: string;   // ISO String
  auctionType: 'ascending'; // Only upward bidding supported in MVP
  status: 'live' | 'sold' | 'ended' | 'cancelled';
  tags: string[];
  description: string;
  sellerNickname: string;
  sellerRating: number;
  sellerId?: string;
  condition?: '새상품급' | '상태우수' | '사용감 있음' | '빈티지' | string;
  isUserListed?: boolean;
  buyerId?: string;
  buyerNickname?: string;
  soldAt?: string;
  finalPrice?: number;
  orderId?: string;
  deliveryStatus?: string;
  deliveredAt?: string;
  trendData?: { date: string; price: number; volume: number }[];
}

export interface Banner {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  buttonText: string;
  targetSection: string;
  bgColor: string;
  accentColor: string;
  image: string;
}

export interface CommunityPost {
  id: string;
  type: 'general' | 'qa' | 'gathering' | 'tip';
  title: string;
  author: string;
  createdAt: string;
  views: number;
  content: string;
  likes: number;
  updatedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  createdAt: string;
  content: string;
}

// 3대 취향 저격 수집 분류 및 카테고리 데이터
export const INITIAL_CATEGORIES: Category[] = [
  // POP Culture
  { id: 'p1', group: 'POP', name: '빈티지토이', icon: '🧸', description: '시간의 깊이를 품은 고전 아날로그 레어 완구' },
  { id: 'p2', group: 'POP', name: '피규어', icon: '🤖', description: '한정판 오리지널 스케일 피규어 컬렉션' },
  { id: 'p3', group: 'POP', name: '트레이딩카드', icon: '🃏', description: '포켓몬, 유희왕 등 고그레이드 희귀 정품 카드' },
  { id: 'p4', group: 'POP', name: '아이돌 포카', icon: '🌟', description: '희귀 홀로그램 및 미공개 공식 특전 포토카드' },
  { id: 'p5', group: 'POP', name: '굿즈', icon: '🎒', description: '한정 오리지널 테마 굿즈 컬렉티블' },

  // SPORTS
  { id: 's1', group: 'SPORTS', name: '스포츠카드', icon: '🏀', description: 'NBA, MLB 오토 루키 리미티드 카드 에디션' },
  { id: 's2', group: 'SPORTS', name: '유니폼/의류 굿즈', icon: '👕', description: '전설적인 스포츠 구단의 역사적 실착 유니폼' },
  { id: 's3', group: 'SPORTS', name: '운동화', icon: '👟', description: '미개봉 데드스탁 소장용 스니커즈' },
  { id: 's4', group: 'SPORTS', name: '사인볼/공', icon: '⚾', description: '전설적인 레전드 선수의 소장 가치 친필 사인볼' },
  { id: 's5', group: 'SPORTS', name: '스포츠 굿즈', icon: '🏆', description: '올림픽 및 정규 시즌 기념 레트로 레어 기념패' },

  // ANALOG
  { id: 'a1', group: 'ANALOG', name: '희귀 LP/음반', icon: '📻', description: '전설적 아티스트의 최초 프레싱 및 한정 바이닐' },
  { id: 'a2', group: 'ANALOG', name: '빈티지 카메라', icon: '📷', description: '수공예 클래식 라이카 크롬 바디 및 오리지널 수동 렌즈' },
  { id: 'a3', group: 'ANALOG', name: '화폐', icon: '💵', description: '역사적 가치를 담은 기념 주화 및 미사용 구권 지폐' },
  { id: 'a4', group: 'ANALOG', name: '우표', icon: '✉️', description: '소장 예술의 시작, 귀중한 역사 우표 특별 콜렉션' },
  { id: 'a5', group: 'ANALOG', name: '로스트미디어', icon: '📼', description: '소장용 빈티지 테이프 및 희귀 미수록 음반 레코드' },
  { id: 'a6', group: 'ANALOG', name: '레트로', icon: '📺', description: '클래식한 감성이 숨 쉬는 초기형 작동 전자기기' },
];

export const INITIAL_PRODUCTS = (): Product[] => {
  return [];
};

// 샥 프로모션 배너 (3종 테마 롤링용)
export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-001',
    type: 'lucky_shock',
    title: '🎁 럭키샥 100원 응모 이벤트',
    subtitle: '매주 진행되는 미개봉 명품 헤리티지 래플! 희귀 빈티지 워크맨부터 컬렉티블 슈즈까지 100원에 쟁취할 절체절명의 수집 명소!',
    buttonText: '100원 응모하러 가기',
    targetSection: '#event-section',
    bgColor: 'from-sky-500 to-indigo-600',
    accentColor: '#0EA5E9',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'banner-002',
    type: 'gathering',
    title: '🃏 주말 오프라인\n카드 컬렉터스 교환 소모임',
    subtitle: '성수동 샥 갤러리 아뜰리에에서 미개봉 카드 개봉 행사 및 레어 등급 직접 오프라인 교환 행사가 오픈됩니다.',
    buttonText: '커뮤니티 모임 일정 확인',
    targetSection: '#community-section',
    bgColor: 'from-teal-400 to-sky-600',
    accentColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'banner-003',
    type: 'hot_bids',
    title: '🔥 소장가들이 치열하게 격돌하는 격전 실시간 매물',
    subtitle: '초희귀 포켓몬 1세대 리자몽 초판 카드부터 베컴 실착 친필 사인 저지까지! 한 치 양보 없는 명품 수집 호가 전쟁에 합류해보세요.',
    buttonText: '실시간 경매 리스트 보기',
    targetSection: '#deadline-section',
    bgColor: 'from-blue-600 to-cyan-500',
    accentColor: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=80'
  }
];

// 커뮤니티 트렌딩 게시물 데이터
export const INITIAL_GATHERINGS: CommunityPost[] = [
  {
    id: 'post-001',
    type: 'gathering',
    title: '📢 [오프콜렉트] 성수동 샥 팝업카드 스토어 오프라인 정보교환 및 카드 트레이딩 소모임 안내',
    author: '레어마스터K',
    createdAt: '2026-06-09',
    views: 894,
    likes: 45,
    content: `안녕하세요, 샥 패밀리 수집가 여러분!\n이번 주 토요일 오후 2시 성수동 팝업 아뜰리에에서 "제 4회 카드 트레이더 전원 교환회"를 정식 개최합니다.\n각자 개인적으로 소중히 소장 중인 다양한 등급 그레이딩 카드 혹은 스포츠 단장 실착 에디션 유니폼이나 굿즈들 들고 오셔서 커피 한잔하며 자유롭게 친목 도모하고 실물 분석도 나눌 수 있는 명쾌한 시간입니다. 참여는 100% 선착순이며 응모하신 분들께는 샥 공식 일러스트 레トロ 굿즈 스티커를 무상 증정합니다.`
  },
  {
    id: 'post-002',
    type: 'tip',
    title: '💡 초점 보관 지식: 빈티지 수동 필름카메라 및 렌즈 곰팡이 방지 방습 보관 가이드',
    author: '라이카아재',
    createdAt: '2026-06-08',
    views: 1205,
    likes: 92,
    content: `여름철 장마 습도는 소중한 고전 기계식 렌즈와 셔터 기어에 치명적인 침입 공사를 초래해 수집 가격 가치를 무려 70% 가까이 갉아먹는 주범입니다.\n가장 추천하는 보전책은 전자기식 무습도 진공 보관함을 마련하는 것이지만, 가성비를 도모하신다면 완전 밀폐식 기밀박스에 대용량 실리카겔을 깔아두어 건조한 실내 대기 상태(습도 35%~40%)를 온전히 동결시키는 방법이 훌륭합니다. 직사광선 조사는 코팅막을 들뜨게 하니 꼭 서늘한 음지에 배치해주세요!`
  },
  {
    id: 'post-003',
    type: 'qa',
    title: '❓ 한정판 아이돌 공식 포토카드(포카) 정황 시세 형성 핵심 기준이 뭘까요?',
    author: '포카루팡',
    createdAt: '2026-06-09',
    views: 432,
    likes: 12,
    content: `요즘 대면 팬사인회 한정 특전으로 풀리는 포카 및 미공개 이벤트 굿즈 호가가 앨범 판매가의 몇 배를 훌쩍 호가하는 현상을 목격하였습니다.\n경험 많은 콜렉터분들께서 보시기에 이런 굿즈 시장의 프리미엄을 결정하는 중심 수치는 역시 멤버 인기도와 한정 수량 비율일까요? 혹은 훼손 없는 모서리 처리 같은 등급 컨디션이 압도적 비율을 가지는지 고수님들의 노하우를 듣고 싶습니다.`
  },
  {
    id: 'post-004',
    type: 'general',
    title: '📸 이번에 샥에서 낙출받은 드래곤볼 피규어 영접했습니다. 상태 예술이네요.',
    author: '우주세기건덕',
    createdAt: '2026-06-09',
    views: 650,
    likes: 38,
    content: `출품된 매물 중 꼭 가지고 싶었으나 전설적인 단종으로 헤맸던 한정 메가하우스 셀렉션 피규어를 무사히 낙찰 성공받았습니다!\n판매자 콜렉터분께서 어찌나 소중히 취급하셨는지 3중 완충 포장에 튼튼한 무지 박스로 발송해주셔서 찌그러짐 하나 없이 우수하게 안착했습니다. 샥 경매 플랫폼은 정말 매너 좋고 애정이 넘치는 찐 매니아들의 템플 단지 같습니다. 너무 행복합니다!`
  }
];

// 서비스 공식 새소식 안내 데이터
export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '💎 중고 애장품 경매 플랫폼 ‘샥(SHOCK)’ 서비스 오픈 안내',
    createdAt: '2026-06-10',
    content: '샥은 피규어, 트레이딩카드, 굿즈, 빈티지 물품처럼 개인의 취향과 소장 가치가 있는 중고 애장품을 경매와 즉시낙찰 방식으로 거래할 수 있는 C2C 플랫폼입니다. 사용자는 상품 탐색부터 입찰, 즉시낙찰, 결제, 배송, 정산 흐름까지 한 번에 확인할 수 있으며, 커뮤니티와 소모임 기능을 통해 관심사가 비슷한 이용자들과 자유롭게 소통할 수 있습니다. 거래 성사 시에는 판매 금액 기준 3%의 서비스 수수료가 적용됩니다.'
  },
  {
    id: 'notice-2',
    title: '🎁 럭키샥 100원 응모 이벤트 안내',
    createdAt: '2026-06-10',
    content: '럭키샥은 희귀 애장품이나 한정 상품을 100원으로 응모할 수 있는 샥의 특별 이벤트입니다. 이벤트 페이지에서 대상 상품과 진행 기간을 확인한 뒤 응모할 수 있으며, 응모가 종료되면 참여자 중 당첨자가 선정됩니다. 당첨 결과와 관련 안내는 이벤트 페이지와 알림센터를 통해 확인할 수 있습니다.'
  },
  {
    id: 'notice-3',
    title: '⏰ 마감 직전 입찰 자동 연장 안내',
    createdAt: '2026-06-09',
    content: '공정한 경매 참여를 위해 마감 직전에 새로운 입찰이 발생하면 경매 시간이 자동으로 연장됩니다. 이는 마지막 순간의 빠른 입찰로 인해 다른 사용자가 대응하지 못하는 상황을 줄이고, 모든 참여자에게 충분한 입찰 기회를 제공하기 위한 기능입니다. 자동 연장 여부와 남은 시간은 상품 상세 페이지에서 실시간으로 확인할 수 있습니다.'
  }
];

// --- NEW DATA ADDED BY USER REQUEST ---
export interface NewProduct {
  id: string;
  sellerId: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  condition: string;
  auctionType: "ascending" | "descending";
  status: "live";
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface NewAuction {
  id: string;
  productId: string;
  auctionType: "ascending" | "descending";
  startPrice: number;
  currentPrice: number;
  hasBuyNow?: boolean;
  buyNowPrice?: number | null;
  minBidIncrement?: number;
  floorPrice?: number;
  decrementAmount?: number;
  decrementInterval?: number;
  startAt: string;
  endAt: string;
  status: "live";
}

export const products: NewProduct[] = [
  {
    id: "prod_001",
    sellerId: "seller_202",
    title: "1990년대 영실업 오리지널 다간 X 로봇 (박스 없음, 생활감 있음)",
    category: "빈티지토이",
    description: "1990년대 영실업 오리지널 다간 X 로봇 (박스 없음, 생활감 있음) 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260131_206%2F1769792120938zgOaj_JPEG%2F28169589077644198_725263945.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 69,
    likeCount: 5,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_002",
    sellerId: "seller_303",
    title: "빈티지 미피 레고 벌크 1kg 세트 (80-90년대 올드 레고 포함)",
    category: "빈티지토이",
    description: "빈티지 미피 레고 벌크 1kg 세트 (80-90년대 올드 레고 포함) 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20221013_266%2F1665628749564WCFOB_JPEG%2F66764592269718511_987886649.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 169,
    likeCount: 31,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_003",
    sellerId: "seller_404",
    title: "1980년대 일제 반다이 초합금 혼 마징가 Z (파츠 완품)",
    category: "빈티지토이",
    description: "1980년대 일제 반다이 초합금 혼 마징가 Z (파츠 완품) 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240715_66%2F1721031655418FQWWg_PNG%2F28332542273803561_125568716.png&type=a340"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 444,
    likeCount: 10,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_004",
    sellerId: "seller_101",
    title: "추억의 세일러문 요술봉 (고전 완구, 작동 확인, 약간의 변색)",
    category: "빈티지토이",
    description: "추억의 세일러문 요술봉 (고전 완구, 작동 확인, 약간의 변색) 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20251002_163%2F1759386895911kMFlm_JPEG%2F3027022805692440_922203000.jpeg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 61,
    likeCount: 16,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_005",
    sellerId: "seller_202",
    title: "빈티지 맥도날드 해피밀 토이 90년대 레트로 20종 일괄 판매",
    category: "빈티지토이",
    description: "빈티지 맥도날드 해피밀 토이 90년대 레트로 20종 일괄 판매 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260425_215%2F1777125859233sy4Hv_JPEG%2F953838324114792_994348019.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 475,
    likeCount: 29,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_006",
    sellerId: "seller_303",
    title: "핫토이 아이언맨 마크85 다이캐스트 (풀박스, 개봉 양품)",
    category: "피규어",
    description: "핫토이 아이언맨 마크85 다이캐스트 (풀박스, 개봉 양품) 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20251105_56%2F1762308227293LXO88_JPEG%2F23559537442627330_329275514.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 173,
    likeCount: 0,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_007",
    sellerId: "seller_404",
    title: "원피스 아츠제로 루피 기어4 스네이크맨 정품 (박스 보유)",
    category: "피규어",
    description: "원피스 아츠제로 루피 기어4 스네이크맨 정품 (박스 보유) 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260421_131%2F1776725448390egLNl_JPEG%2F48692938509882173_55042699.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 426,
    likeCount: 34,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_008",
    sellerId: "seller_101",
    title: "[미개봉] 귀멸의 칼날 렌고쿠 쿄쥬로 1/8 스케일 피규어",
    category: "피규어",
    description: "[미개봉] 귀멸의 칼날 렌고쿠 쿄쥬로 1/8 스케일 피규어 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20251024_5%2F1761271533440B2g0p_JPEG%2F4482962419506952_1951178596.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 268,
    likeCount: 33,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_009",
    sellerId: "seller_202",
    title: "반프레스토 드래곤볼 손오공 에어로블 정품 피규어",
    category: "피규어",
    description: "반프레스토 드래곤볼 손오공 에어로블 정품 피규어 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250813_271%2F17550375689837u6VI_JPEG%2F9491387779962238_1541651195.jpeg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 300,
    likeCount: 19,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_010",
    sellerId: "seller_303",
    title: "넨도로이드 1000번 하츠네 미쿠 (파츠 분실 없음, 상태 S급)",
    category: "피규어",
    description: "넨도로이드 1000번 하츠네 미쿠 (파츠 분실 없음, 상태 S급) 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250408_44%2F1744102114043BRcXW_JPEG%2F62405420996075424_810386616.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 374,
    likeCount: 27,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_011",
    sellerId: "seller_404",
    title: "포켓몬카드 리자몽 VMAX SSR (PSA 10 정품 등급 카드)",
    category: "트레이딩카드",
    description: "포켓몬카드 리자몽 VMAX SSR (PSA 10 정품 등급 카드) 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220518_274%2F1652814173676u7a90_JPEG%2F53950007480271794_554451916.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 107,
    likeCount: 28,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_012",
    sellerId: "seller_101",
    title: "유희왕 푸른 눈의 백룡 초기 울트라 레어 (S급 소장용 상태)",
    category: "트레이딩카드",
    description: "유희왕 푸른 눈의 백룡 초기 울트라 레어 (S급 소장용 상태) 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20251202_127%2F1764665355197qJ3aq_PNG%2F18770896271493771_1975115058.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 358,
    likeCount: 33,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_013",
    sellerId: "seller_202",
    title: "디지몬 카드 게임 알파몬 시크릿 패러렐 (미판/탑로더 보관)",
    category: "트레이딩카드",
    description: "디지몬 카드 게임 알파몬 시크릿 패러렐 (미판/탑로더 보관) 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250708_111%2F175196585806544SXP_PNG%2F1.png&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 440,
    likeCount: 24,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_014",
    sellerId: "seller_303",
    title: "원피스 카드 게임 몽키 D. 루피 코믹 패러렐 (정품 슬리브 포함)",
    category: "트레이딩카드",
    description: "원피스 카드 게임 몽키 D. 루피 코믹 패러렐 (정품 슬리브 포함) 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240329_49%2F1711639016264eIuRC_JPEG%2F38941700137436666_1308222954.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 283,
    likeCount: 23,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_015",
    sellerId: "seller_404",
    title: "포켓몬카드 25주년 피카츄 프로모 카드 (미개봉 새상품)",
    category: "트레이딩카드",
    description: "포켓몬카드 25주년 피카츄 프로모 카드 (미개봉 새상품) 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230206_85%2F1675622404997X3ADz_JPEG%2F76758188672745376_1943593373.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 403,
    likeCount: 15,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_016",
    sellerId: "seller_101",
    title: "뉴진스 민지 OMG 공방 포카 (하자 전혀 없음, 탑로더 발송)",
    category: "아이돌 포카",
    description: "뉴진스 민지 OMG 공방 포카 (하자 전혀 없음, 탑로더 발송) 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240203_118%2F17068967563493oBhb_JPEG%2F108032540053350002_1723600232.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 91,
    likeCount: 27,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_017",
    sellerId: "seller_202",
    title: "세븐틴 호시 FML 럭키드로우 사운드웨이브 특전 포카",
    category: "아이돌 포카",
    description: "세븐틴 호시 FML 럭키드로우 사운드웨이브 특전 포카 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250717_157%2F1752719227729OBCi6_JPEG%2F11177901822650990_1537903848.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 97,
    likeCount: 18,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_018",
    sellerId: "seller_303",
    title: "아이브 장원영 배디 영통팬싸 미공포 (소장용 급처)",
    category: "아이돌 포카",
    description: "아이브 장원영 배디 영통팬싸 미공포 (소장용 급처) 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240309_4%2F17099645406084Xtxp_JPEG%2F111100383317585469_332835238.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 242,
    likeCount: 5,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_019",
    sellerId: "seller_404",
    title: "에스파 카리나 드라마 팝업스토어 한정 오프라인 포카",
    category: "아이돌 포카",
    description: "에스파 카리나 드라마 팝업스토어 한정 오프라인 포카 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240322_197%2F17111193633711PHNj_JPEG%2F112255191191415971_1347467814.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 498,
    likeCount: 25,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_020",
    sellerId: "seller_101",
    title: "BTS 정국 골든 위버스 특전 미공개 포토카드 일괄",
    category: "아이돌 포카",
    description: "BTS 정국 골든 위버스 특전 미공개 포토카드 일괄 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240905_104%2F1725520376354T0Mmj_JPEG%2FKakaoTalk_20240905_110236532_23.jpg&type=a340"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 324,
    likeCount: 6,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_021",
    sellerId: "seller_202",
    title: "오타니 쇼헤이 2018 Topps Chrome 루키 카드 (PSA 9 등급)",
    category: "스포츠카드",
    description: "오타니 쇼헤이 2018 Topps Chrome 루키 카드 (PSA 9 등급) 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260314_110%2F1773485699993PsyYW_JPEG%2F404363867690645_1721794073.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 138,
    likeCount: 41,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_022",
    sellerId: "seller_303",
    title: "마이클 조던 1996 Fleer 메탈 유니버스 베이스 카드",
    category: "스포츠카드",
    description: "마이클 조던 1996 Fleer 메탈 유니버스 베이스 카드 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20251220_121%2F1766176799969nUExV_JPEG%2F100309745092388042_207228142.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 208,
    likeCount: 27,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_023",
    sellerId: "seller_404",
    title: "손흥민 2022 Panini Prizm 카타르 월드컵 실버 프리즘",
    category: "스포츠카드",
    description: "손흥민 2022 Panini Prizm 카타르 월드컵 실버 프리즘 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250205_258%2F17387443137854LYw7_JPEG%2F72877246822632711_1293900089.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 398,
    likeCount: 42,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_024",
    sellerId: "seller_101",
    title: "리오넬 메시 2014 Panini 월드컵 베이스 카드 (소장용)",
    category: "스포츠카드",
    description: "리오넬 메시 2014 Panini 월드컵 베이스 카드 (소장용) 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20251119_108%2F1763533954483fIjKI_JPEG%2F46735351244318110_1919320191.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 147,
    likeCount: 13,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_025",
    sellerId: "seller_202",
    title: "르브론 제임스 2003 Topps 루키 카드 (보관 상태 최상, 노그레이딩)",
    category: "스포츠카드",
    description: "르브론 제임스 2003 Topps 루키 카드 (보관 상태 최상, 노그레이딩) 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230326_160%2F1679764325455WywoG_JPEG%2F80900105066485487_754659339.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 56,
    likeCount: 4,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_026",
    sellerId: "seller_303",
    title: "2002 한일월드컵 대한민국 국가대표 홈 유니폼 (안정환 마킹, L)",
    category: "유니폼/의류 굿즈",
    description: "2002 한일월드컵 대한민국 국가대표 홈 유니폼 (안정환 마킹, L) 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260208_140%2F1770528423824S3hxG_JPEG%2F104661243946157740_1290161503.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 363,
    likeCount: 37,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_027",
    sellerId: "seller_404",
    title: "14-15 레알 마드리드 홈 유니폼 (호날두 마킹, 정품 L사이즈)",
    category: "유니폼/의류 굿즈",
    description: "14-15 레알 마드리드 홈 유니폼 (호날두 마킹, 정품 L사이즈) 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20221208_32%2F1670485462829i2uSa_JPEG%2F71621308549634655_1172053847.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 93,
    likeCount: 32,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_028",
    sellerId: "seller_101",
    title: "[미개봉 새상품] LA 다저스 오타니 쇼헤이 오센틱 홈 유니폼",
    category: "유니폼/의류 굿즈",
    description: "[미개봉 새상품] LA 다저스 오타니 쇼헤이 오센틱 홈 유니폼 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260327_282%2F17745997775750Ruvc_JPEG%2F53993724687990144_311709520.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 251,
    likeCount: 47,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_029",
    sellerId: "seller_202",
    title: "토트넘 홋스퍼 23-24 홈 유니폼 (손흥민 친필 자수, 국내 M)",
    category: "유니폼/의류 굿즈",
    description: "토트넘 홋스퍼 23-24 홈 유니폼 (손흥민 친필 자수, 국내 M) 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240226_5%2F1708954384827G3G3g_PNG%2F110090218628174597_2052614536.png&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 327,
    likeCount: 49,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_030",
    sellerId: "seller_303",
    title: "시카고 불스 마이클 조던 어웨이 유니폼 (90s 빈티지 챔피온판)",
    category: "유니폼/의류 굿즈",
    description: "시카고 불스 마이클 조던 어웨이 유니폼 (90s 빈티지 챔피온판) 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230215_192%2F1676431049725pmA07_JPEG%2F77566884546152493_247736850.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 368,
    likeCount: 45,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_031",
    sellerId: "seller_404",
    title: "나이키 에어 조던 1 하이 OG 시카고 2022 (270mm, 풀박스 나이키탭)",
    category: "운동화",
    description: "나이키 에어 조던 1 하이 OG 시카고 2022 (270mm, 풀박스 나이키탭) 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250110_31%2F1736509164374BXyOp_JPEG%2F70641997205929036_1453676208.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 162,
    likeCount: 23,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_032",
    sellerId: "seller_101",
    title: "아디다스 이지부스트 350 V2 지브라 (265mm, 실착 3회 극미중고)",
    category: "운동화",
    description: "아디다스 이지부스트 350 V2 지브라 (265mm, 실착 3회 극미중고) 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250323_131%2F1742718433005zlFlw_JPEG%2F69301631837230638_1288642732.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 317,
    likeCount: 3,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_033",
    sellerId: "seller_202",
    title: "나이키 x 사카이 베이퍼와플 블랙 검 (275mm, 크림택 부착)",
    category: "운동화",
    description: "나이키 x 사카이 베이퍼와플 블랙 검 (275mm, 크림택 부착) 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20201109_278%2F1604882145639pipUf_JPEG%2F6017988337560266_1248465715.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 398,
    likeCount: 15,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_034",
    sellerId: "seller_303",
    title: "뉴발란스 992 그레이 (260mm, 박스 풀셋 상태 A급)",
    category: "운동화",
    description: "뉴발란스 992 그레이 (260mm, 박스 풀셋 상태 A급) 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240426_201%2F1714136345636qcxMk_JPEG%2F115272188351502951_2146495553.JPG&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 49,
    likeCount: 36,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_035",
    sellerId: "seller_404",
    title: "아식스 x 키코 코스타디노프 젤 퀀텀 (280mm, 박스포함 풀구성)",
    category: "운동화",
    description: "아식스 x 키코 코스타디노프 젤 퀀텀 (280mm, 박스포함 풀구성) 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240517_216%2F1715926542052rrSYx_JPEG%2F117062440758376687_295444268.JPG&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 235,
    likeCount: 3,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_036",
    sellerId: "seller_101",
    title: "류현진 한화 이글스 복귀 기념 친필 사인볼 (전용 큐브 포함)",
    category: "사인볼/공",
    description: "류현진 한화 이글스 복귀 기념 친필 사인볼 (전용 큐브 포함) 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250704_133%2F1751628378947f4ruM_JPEG%2F26798661744289880_127118616.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 369,
    likeCount: 40,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_037",
    sellerId: "seller_202",
    title: "손흥민 국가대표 친필 사인 축구공 (KFA 공인구, 당첨 인증 가능)",
    category: "사인볼/공",
    description: "손흥민 국가대표 친필 사인 축구공 (KFA 공인구, 당첨 인증 가능) 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230603_67%2F16858041340288QioD_JPEG%2F5069161852660492_200460011.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 383,
    likeCount: 11,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_038",
    sellerId: "seller_303",
    title: "이정후 샌프란시스코 자이언츠 이적 첫해 친필 사인 야구볼",
    category: "사인볼/공",
    description: "이정후 샌프란시스코 자이언츠 이적 첫해 친필 사인 야구볼 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220611_265%2F1654956295741uyS4V_JPEG%2F56092123564416659_1867612026.jpeg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 241,
    likeCount: 45,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_039",
    sellerId: "seller_404",
    title: "KBO 레전드 이승엽 삼성 라이온즈 은퇴 기념 친필 사인구",
    category: "사인볼/공",
    description: "KBO 레전드 이승엽 삼성 라이온즈 은퇴 기념 친필 사인구 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20251222_83%2F1766401935038IDr77_JPEG%2F46536166844334520_1456387328.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 347,
    likeCount: 42,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_040",
    sellerId: "seller_101",
    title: "NBA 스티븐 커리 골든스테이트 워리어스 친필 사인 농구공",
    category: "사인볼/공",
    description: "NBA 스티븐 커리 골든스테이트 워리어스 친필 사인 농구공 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240718_88%2F1721283075294nuxHL_PNG%2F4512904224377732_451567447.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 310,
    likeCount: 29,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_041",
    sellerId: "seller_202",
    title: "2024 기아 타이거즈 통합 우승 기념 한정판 머플러 (새상품)",
    category: "스포츠 굿즈",
    description: "2024 기아 타이거즈 통합 우승 기념 한정판 머플러 (새상품) 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260506_197%2F1778054633118N6VrX_JPEG%2F20488998897485636_2106444847.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 318,
    likeCount: 2,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_042",
    sellerId: "seller_303",
    title: "프리미어리그 리버풀 FC 안필드 스타디움 직관 한정 뱃지 세트",
    category: "스포츠 굿즈",
    description: "프리미어리그 리버풀 FC 안필드 스타디움 직관 한정 뱃지 세트 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20231231_69%2F17039492693169Pth8_PNG%2F34674301106025964_1549958618.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 160,
    likeCount: 28,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_043",
    sellerId: "seller_404",
    title: "MLB LA 다저스 오타니 쇼헤이 한정판 스타디움 버블헤드 인형",
    category: "스포츠 굿즈",
    description: "MLB LA 다저스 오타니 쇼헤이 한정판 스타디움 버블헤드 인형 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260310_238%2F1773128029263fhCHH_JPEG%2F107261015365264927_1049323169.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 308,
    likeCount: 16,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_044",
    sellerId: "seller_101",
    title: "파리 생제르맹(PSG) 이강인 공식 라이선스 스마트폰 케이스 (미개봉)",
    category: "스포츠 굿즈",
    description: "파리 생제르맹(PSG) 이강인 공식 라이선스 스마트폰 케이스 (미개봉) 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230516_12%2F1684239747451UXUtO_JPEG%2F10733053275540516_2122972347.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 148,
    likeCount: 8,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_045",
    sellerId: "seller_202",
    title: "토트넘 홋스퍼 공식 오피셜 대형 장우산 (택 달린 새상품)",
    category: "스포츠 굿즈",
    description: "토트넘 홋스퍼 공식 오피셜 대형 장우산 (택 달린 새상품) 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230809_280%2F16915205869174Lnzf_JPEG%2F6532674022044191_2089717167.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 64,
    likeCount: 33,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_046",
    sellerId: "seller_303",
    title: "김광석 4집 오리지널 초판 바이닐 LP (자켓/알판 상태 최상)",
    category: "희귀 LP/음반",
    description: "김광석 4집 오리지널 초판 바이닐 LP (자켓/알판 상태 최상) 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250726_256%2F1753508781624O3cL9_JPEG%2F87641546768752460_1955874584.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 110,
    likeCount: 25,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_047",
    sellerId: "seller_404",
    title: "김현식 5집 빈티지 바이닐 (1990년 오리지널 서라벌레코드 발매반)",
    category: "희귀 LP/음반",
    description: "김현식 5집 빈티지 바이닐 (1990년 오리지널 서라벌레코드 발매반) 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220208_142%2F1644325415510oG5Tw_JPEG%2F45461258145794432_239196506.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 402,
    likeCount: 30,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_048",
    sellerId: "seller_101",
    title: "타일러 더 크리에이터 (Tyler, The Creator) IGOR 한정판 핑크 바이닐",
    category: "희귀 LP/음반",
    description: "타일러 더 크리에이터 (Tyler, The Creator) IGOR 한정판 핑크 바이닐 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250308_52%2F1741411386073F6qmn_JPEG%2F10527268176412040_1781004918.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 64,
    likeCount: 26,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_049",
    sellerId: "seller_202",
    title: "유재하 '사랑하기 때문에' 1987년 초판 LP (가사지 포함 오리지널)",
    category: "희귀 LP/음반",
    description: "유재하 '사랑하기 때문에' 1987년 초판 LP (가사지 포함 오리지널) 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20241219_150%2F1734580432746Bc2jA_JPEG%2F15906730563455349_721770602.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 264,
    likeCount: 28,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_050",
    sellerId: "seller_303",
    title: "비틀즈 (The Beatles) Abbey Road UK 오리지널 리마스터반 LP",
    category: "희귀 LP/음반",
    description: "비틀즈 (The Beatles) Abbey Road UK 오리지널 리마스터반 LP 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250624_147%2F1750740597466wN2sB_JPEG%2F28929883606073279_142690301.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 467,
    likeCount: 29,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_051",
    sellerId: "seller_404",
    title: "라이카(Leica) M3 실버 바디 (셔터 전구간 정상, 바디 단품)",
    category: "빈티지 카메라",
    description: "라이카(Leica) M3 실버 바디 (셔터 전구간 정상, 바디 단품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230217_133%2F1676618908853YrD9e_JPEG%2F3921592720045199_323275696.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 144,
    likeCount: 26,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_052",
    sellerId: "seller_101",
    title: "미놀타 X-700 필름 카메라 + 50mm F1.4 렌즈 (노출계 작동 완벽)",
    category: "빈티지 카메라",
    description: "미놀타 X-700 필름 카메라 + 50mm F1.4 렌즈 (노출계 작동 완벽) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20241106_295%2F1730887921692KXCY9_JPEG%2F17141147452686100_1093636611.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 482,
    likeCount: 12,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_053",
    sellerId: "seller_202",
    title: "캐논 오토보이 3 데이터백 (y2k 감성 스냅 필름 카메라, 결과물 확인)",
    category: "빈티지 카메라",
    description: "캐논 오토보이 3 데이터백 (y2k 감성 스냅 필름 카메라, 결과물 확인) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20221110_181%2F1668058789866vkiqs_JPEG%2F69194569583169505_136778366.jpg&type=a340"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 86,
    likeCount: 25,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_054",
    sellerId: "seller_303",
    title: "올림푸스 뮤 zoom 105 빈티지 콤팩트 카메라 (새 배터리 포함)",
    category: "빈티지 카메라",
    description: "올림푸스 뮤 zoom 105 빈티지 콤팩트 카메라 (새 배터리 포함) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20191019_124%2F15714971774103FaU1_JPEG%2F8858720015957892_259844503.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 291,
    likeCount: 22,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_055",
    sellerId: "seller_404",
    title: "후지필름 파인픽스 초기형 y2k 빈티지 디카 (xd 카드, 충전기 포함)",
    category: "빈티지 카메라",
    description: "후지필름 파인픽스 초기형 y2k 빈티지 디카 (xd 카드, 충전기 포함) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260501_158%2F1777643886955Dwa1w_JPEG%2F9800230088577596_522966749.JPG&type=a340"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 8,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_056",
    sellerId: "seller_101",
    title: "1998년 500원 주화 (희귀 연도, 유통주화 중 상태 양호)",
    category: "화폐",
    description: "1998년 500원 주화 (희귀 연도, 유통주화 중 상태 양호) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250308_35%2F1741428230794Y5ASl_PNG%2F16767907491838347_1825085885.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 8,
    likeCount: 15,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_057",
    sellerId: "seller_202",
    title: "조선시대 상평통보 당이전 실제 엽전 3점 일괄 판매",
    category: "화폐",
    description: "조선시대 상평통보 당이전 실제 엽전 3점 일괄 판매 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250518_94%2F1747559363320MYOrX_JPEG%2F2162451460151536_292285887.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 83,
    likeCount: 29,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_058",
    sellerId: "seller_303",
    title: "한국은행 구권 10,000원권 연속 일련번호 5장 묶음 (미사용)",
    category: "화폐",
    description: "한국은행 구권 10,000원권 연속 일련번호 5장 묶음 (미사용) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250210_137%2F17391952145228Ivkp_JPEG%2F21212301335591093_119332068.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 85,
    likeCount: 29,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_059",
    sellerId: "seller_404",
    title: "미국 1880년대 모건 실버 달러 올드 은화 (진품 보장)",
    category: "화폐",
    description: "미국 1880년대 모건 실버 달러 올드 은화 (진품 보장) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260304_11%2F1772618682321RS255_JPEG%2F106751567437696135_1591552997.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 18,
    likeCount: 21,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_060",
    sellerId: "seller_101",
    title: "2002 한일월드컵 기념 주화 3종 세트 (오리지널 케이스 포함)",
    category: "화폐",
    description: "2002 한일월드컵 기념 주화 3종 세트 (오리지널 케이스 포함) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250502_156%2F1746188009967utfHO_JPEG%2F16247499754288377_1533570113.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 148,
    likeCount: 14,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_061",
    sellerId: "seller_202",
    title: "1970-80년대 대한민국 대통령 취임 기념 우표 첩 (일괄 처분)",
    category: "우표",
    description: "1970-80년대 대한민국 대통령 취임 기념 우표 첩 (일괄 처분) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250321_47%2F1742522513552DuiGO_JPEG%2F50899805339661448_487379347.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 108,
    likeCount: 26,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_062",
    sellerId: "seller_303",
    title: "크리스마스 씰 1990년대~2000년대 연도별 수집 모음집",
    category: "우표",
    description: "크리스마스 씰 1990년대~2000년대 연도별 수집 모음집 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260111_271%2F1768132817895afUhQ_JPEG%2F17650057027787711_2073666021.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 310,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_063",
    sellerId: "seller_404",
    title: "1950년대 한국전쟁 시기 발행된 희귀 우표 5종 콜렉션",
    category: "우표",
    description: "1950년대 한국전쟁 시기 발행된 희귀 우표 5종 콜렉션 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260308_144%2F17729749287881zbNY_JPEG%2F17174499123296591_1624902775.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 207,
    likeCount: 13,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_064",
    sellerId: "seller_101",
    title: "영국 엘리자베스 2세 여왕 즉위 기념 빈티지 해외 우표 세트",
    category: "우표",
    description: "영국 엘리자베스 2세 여왕 즉위 기념 빈티지 해외 우표 세트 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260524_250%2F1779560354608hbR0b_JPEG%2F113693157936349531_2047993949.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 37,
    likeCount: 32,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_065",
    sellerId: "seller_202",
    title: "대한민국 역대 우표 수집 바인더 앨범 (총 150장 이상 수집품)",
    category: "우표",
    description: "대한민국 역대 우표 수집 바인더 앨범 (총 150장 이상 수집품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260401_246%2F1775022050615v5h9C_JPEG%2F64903414577887217_1272118492.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 212,
    likeCount: 20,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_066",
    sellerId: "seller_303",
    title: "90년대 비디오대여점용 만화 '피구왕 통키' SBS 더빙판 VHS 테이프",
    category: "로스트미디어",
    description: "90년대 비디오대여점용 만화 '피구왕 통키' SBS 더빙판 VHS 테이프 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20211130_258%2F1638255040422vu1eM_JPEG%2F39390936127583258_489362242.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 91,
    likeCount: 48,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_067",
    sellerId: "seller_404",
    title: "추억의 고전 애니 '포켓몬스터 1기' 전편 VHS 비디오 세트 (곽팩)",
    category: "로스트미디어",
    description: "추억의 고전 애니 '포켓몬스터 1기' 전편 VHS 비디오 세트 (곽팩) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250128_128%2F1738052750213p5Iiu_JPEG%2F27656926183529598_1279469840.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 79,
    likeCount: 41,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_068",
    sellerId: "seller_101",
    title: "2000년대 초반 홍대 인디 밴드 가내수공업 데모 카세트테이프",
    category: "로스트미디어",
    description: "2000년대 초반 홍대 인디 밴드 가내수공업 데모 카세트테이프 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250309_62%2F1741508398789r7uFO_JPEG%2F75641203929639551_413389674.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 210,
    likeCount: 4,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_069",
    sellerId: "seller_202",
    title: "80년대 국산 오락실 기판(PCB) '보글보글' 패밀리 카피본 (작동 확인)",
    category: "로스트미디어",
    description: "80년대 국산 오락실 기판(PCB) '보글보글' 패밀리 카피본 (작동 확인) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260427_179%2F1777277839792wEIz3_PNG%2F27835767650649569_1989863736.png&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 475,
    likeCount: 4,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_070",
    sellerId: "seller_303",
    title: "90년대 지방 로컬 방송국 로고송 및 광고 녹음 카세트테이프",
    category: "로스트미디어",
    description: "90년대 지방 로컬 방송국 로고송 및 광고 녹음 카세트테이프 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250921_216%2F1758444447096BCzNf_JPEG%2F21432678217667525_449399599.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 499,
    likeCount: 28,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_071",
    sellerId: "seller_404",
    title: "현대 컴보이 (닌텐도 NES 국내 정발판) 본체 및 알팩 2종 세트",
    category: "레트로",
    description: "현대 컴보이 (닌텐도 NES 국내 정발판) 본체 및 알팩 2종 세트 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260213_130%2F1770943824915OOQOB_JPEG%2F61744797213894267_1623326141.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 74,
    likeCount: 9,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_072",
    sellerId: "seller_101",
    title: "닌텐도 게임보이 컬러 투명 보라 (IPS 백라이트 개조 완료, 극미품)",
    category: "레트로",
    description: "닌텐도 게임보이 컬러 투명 보라 (IPS 백라이트 개조 완료, 극미품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220620_79%2F16557172087578V5Ol_JPEG%2F56853051465374789_764843641.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 409,
    likeCount: 26,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_073",
    sellerId: "seller_202",
    title: "소니 플레이스테이션 1 (PS1) 7000번대 박스셋 + 타이틀 3장",
    category: "레트로",
    description: "소니 플레이스테이션 1 (PS1) 7000번대 박스셋 + 타이틀 3장 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20241215_194%2F1734209553665Haj7I_JPEG%2F59602318651178143_1075949775.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "ascending",
    status: "live",
    viewCount: 465,
    likeCount: 24,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_074",
    sellerId: "seller_303",
    title: "세가 새턴 (Sega Saturn) 일본판 초기형 본체 (컨트롤러 2개 포함)",
    category: "레트로",
    description: "세가 새턴 (Sega Saturn) 일본판 초기형 본체 (컨트롤러 2개 포함) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20170527_99%2Fgworld_1495831210858hwHYF_JPEG%2F19137511486496428_416003693.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "descending",
    status: "live",
    viewCount: 148,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_075",
    sellerId: "seller_404",
    title: "닌텐도 64 피카츄 에디션 오렌지 한정판 본체 (북미판)",
    category: "레트로",
    description: "닌텐도 64 피카츄 에디션 오렌지 한정판 본체 (북미판) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210330_176%2F16170687310433sGRQ_JPEG%2F18204565872134013_541078145.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 460,
    likeCount: 17,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_076",
    sellerId: "seller_101",
    title: "스튜디오 지브리 이웃집 토토로 오리지널 오르골 (일판 정품)",
    category: "굿즈",
    description: "스튜디오 지브리 이웃집 토토로 오리지널 오르골 (일판 정품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250521_97%2F1747803741987SUPtF_JPEG%2F81936579096893686_885240334.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 182,
    likeCount: 39,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_077",
    sellerId: "seller_202",
    title: "스타벅스 2015년 한정판 시애틀 1호점 텀블러 (미사용 소장품)",
    category: "굿즈",
    description: "스타벅스 2015년 한정판 시애틀 1호점 텀블러 (미사용 소장품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20171030_286%2Fastkorea_1509343229048KoAyM_JPEG%2F32649529670655695_-1585920607.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 216,
    likeCount: 25,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_078",
    sellerId: "seller_303",
    title: "해리포터 유니버셜 스튜디오 정품 올리반더 지팡이 (해리포터 모델)",
    category: "굿즈",
    description: "해리포터 유니버셜 스튜디오 정품 올리반더 지팡이 (해리포터 모델) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250101_218%2F1735728583033m9mQs_JPEG%2F5996166066502456_503961998.jpg&type=sc960_832"],
    condition: "사용감 있음",
    auctionType: "descending",
    status: "live",
    viewCount: 106,
    likeCount: 14,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_079",
    sellerId: "seller_404",
    title: "에반게리온 극장판 한정 레이/아스카 오리지널 일러스트 포스터 세트",
    category: "굿즈",
    description: "에반게리온 극장판 한정 레이/아스카 오리지널 일러스트 포스터 세트 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260102_31%2F1767339428155mf8jG_JPEG%2F21788638936720500_1678812057.jpg&type=sc960_832"],
    condition: "빈티지",
    auctionType: "ascending",
    status: "live",
    viewCount: 334,
    likeCount: 7,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_080",
    sellerId: "seller_101",
    title: "도쿄 디즈니랜드 한정 미키마우스 빈티지 팝콘통 (인테리어 소품)",
    category: "굿즈",
    description: "도쿄 디즈니랜드 한정 미키마우스 빈티지 팝콘통 (인테리어 소품) 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220321_199%2F1647833407427uWNVv_PNG%2F48969187082222783_840872115.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "descending",
    status: "live",
    viewCount: 498,
    likeCount: 8,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_081",
    sellerId: "seller_104",
    title: "1980년대 미미의 집 오리지널 풀세트 정품 [최상급 S급 보전상태]",
    category: "빈티지토이",
    description: "1980년대 미미의 집 오리지널 풀세트 정품 [최상급 S급 보전상태] 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250328_101%2F1743134239528y80N2_JPEG%2F5024060249970980_179171850.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 104,
    likeCount: 68,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_082",
    sellerId: "seller_102",
    title: "우주보안관 장고 오리지널 양철 장난감 [미사용 오리지널 패키지]",
    category: "빈티지토이",
    description: "우주보안관 장고 오리지널 양철 장난감 [미사용 오리지널 패키지] 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240121_62%2F1705846567469ykDSS_JPEG%2F106982463160438222_452017772.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 496,
    likeCount: 71,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_083",
    sellerId: "seller_102",
    title: "태권V 복각판 다이캐스트 한정판 로보트 [리미티드 보증 증서 필속]",
    category: "빈티지토이",
    description: "태권V 복각판 다이캐스트 한정판 로보트 [리미티드 보증 증서 필속] 상품입니다. 어린 시절의 향수를 자극하는 오리지널 빈티지 완구입니다. 세월의 흔적이 오히려 빈티지한 멋을 더해주며, 장식용으로도 훌륭합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/sunny/?src=http%3A%2F%2Fimage.g9.co.kr%2Fg%2F864052710%2Fn&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 245,
    likeCount: 87,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_084",
    sellerId: "seller_106",
    title: "원피스 아카이브 메가하우스 한정판 조로 백화 에디션 [최상급 S급 보전상태]",
    category: "피규어",
    description: "원피스 아카이브 메가하우스 한정판 조로 백화 에디션 [최상급 S급 보전상태] 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230103_221%2F1672733326327aKM4Y_JPEG%2F73869154155845284_34345536.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 233,
    likeCount: 25,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_085",
    sellerId: "seller_102",
    title: "에반게리온 초호기 리얼 그레이드 한정 메탈릭 도색완성 [미사용 오리지널 패키지]",
    category: "피규어",
    description: "에반게리온 초호기 리얼 그레이드 한정 메탈릭 도색완성 [미사용 오리지널 패키지] 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210419_230%2F1618797050939HYBhH_JPEG%2FB000LQNC0I_image1_ss.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 221,
    likeCount: 31,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_086",
    sellerId: "seller_108",
    title: "포켓몬 테라리움 컬렉션 스페셜 에디션 전 6종 피규어 [리미티드 보증 증서 필속]",
    category: "피규어",
    description: "포켓몬 테라리움 컬렉션 스페셜 에디션 전 6종 피규어 [리미티드 보증 증서 필속] 상품입니다. 정교한 디테일과 뛰어난 조형미를 자랑하는 한정판 피규어입니다. 콜렉터들의 마음을 사로잡을 희소성 높은 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20211224_140%2F1640319921770EeFQI_JPEG%2F41455701495367845_1387893736.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 273,
    likeCount: 58,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_087",
    sellerId: "seller_101",
    title: "유희왕 삼환신 프리즈마틱 시크릿 레어 컬렉션 [최상급 S급 보전상태]",
    category: "트레이딩카드",
    description: "유희왕 삼환신 프리즈마틱 시크릿 레어 컬렉션 [최상급 S급 보전상태] 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210519_65%2F1621399826894A0Ex2_JPEG%2F22535669596440887_1217060104.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 139,
    likeCount: 86,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_088",
    sellerId: "seller_104",
    title: "포켓몬 카드 25주년 골든 박스 스페셜 패키지 [미사용 오리지널 패키지]",
    category: "트레이딩카드",
    description: "포켓몬 카드 25주년 골든 박스 스페셜 패키지 [미사용 오리지널 패키지] 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250125_187%2F1737734126314TzWxi_JPEG%2F24143137130082428_1093765473.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 375,
    likeCount: 42,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_089",
    sellerId: "seller_106",
    title: "매직 더 개더링 (MTG) 영문 레어 포일 카드 무더기 [리미티드 보증 증서 필속]",
    category: "트레이딩카드",
    description: "매직 더 개더링 (MTG) 영문 레어 포일 카드 무더기 [리미티드 보증 증서 필속] 상품입니다. 투자가치가 뛰어난 고등급 트레이딩 카드입니다. 슬리브와 탑로더에 이중 보관하여 상태를 완벽하게 유지했습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260529_13%2F1780064517060JfxHJ_JPEG%2F126698300299153346_892849719.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 285,
    likeCount: 15,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_090",
    sellerId: "seller_107",
    title: "아이브 장원영 미공개 팬사인회 수지 특전 포토카드 [최상급 S급 보전상태]",
    category: "아이돌 포카",
    description: "아이브 장원영 미공개 팬사인회 수지 특전 포토카드 [최상급 S급 보전상태] 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250317_144%2F1742143056199jEMeU_JPEG%2F13841177487556764_783924113.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 543,
    likeCount: 24,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_091",
    sellerId: "seller_108",
    title: "뉴진스 민지 오리지널 포니테일 버니즈 1기 스페셜 포카 [미사용 오리지널 패키지]",
    category: "아이돌 포카",
    description: "뉴진스 민지 오리지널 포니테일 버니즈 1기 스페셜 포카 [미사용 오리지널 패키지] 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250307_208%2F1741317271675iRDFS_JPEG%2F92521115658638298_839769044.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 330,
    likeCount: 58,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_092",
    sellerId: "seller_110",
    title: "방탄소년단 BTS 정국 골든 솔로 에라 공식 친필 포카 [리미티드 보증 증서 필속]",
    category: "아이돌 포카",
    description: "방탄소년단 BTS 정국 골든 솔로 에라 공식 친필 포카 [리미티드 보증 증서 필속] 상품입니다. 팬들의 뜨거운 사랑을 받는 한정판 포토카드입니다. 미세한 기스나 하자 없이 깨끗하게 보관된 최상급 상태입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240314_95%2F1710396945840WyHb3_JPEG%2F1106719932717378_1992885968.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 118,
    likeCount: 38,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_093",
    sellerId: "seller_101",
    title: "세일러문 오리지널 미라클 로망스 한정 화장품 파우치 [최상급 S급 보전상태]",
    category: "굿즈",
    description: "세일러문 오리지널 미라클 로망스 한정 화장품 파우치 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20240905_179%2F1725510737269Lxv8s_JPEG%2F74388577080299109_1741782507.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 193,
    likeCount: 65,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_094",
    sellerId: "seller_103",
    title: "귀멸의 칼날 무한열차 에디션 공식 아트북 & 캔배지 세트 [미사용 오리지널 패키지]",
    category: "굿즈",
    description: "귀멸의 칼날 무한열차 에디션 공식 아트북 & 캔배지 세트 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260121_237%2F176899816202361Bao_JPEG%2F103130994154027602_1990306275.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 243,
    likeCount: 79,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_095",
    sellerId: "seller_106",
    title: "신세기 에반게리온 네르프 공식 엠블럼 올인원 백팩 [리미티드 보증 증서 필속]",
    category: "굿즈",
    description: "신세기 에반게리온 네르프 공식 엠블럼 올인원 백팩 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250404_50%2F17437545833249oL5d_JPEG%2F19372609439536641_45547343.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 359,
    likeCount: 87,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_096",
    sellerId: "seller_107",
    title: "루카 돈치치 2018 파니니 프리즘 루키 실버 그레이딩 카드 [최상급 S급 보전상태]",
    category: "스포츠카드",
    description: "루카 돈치치 2018 파니니 프리즘 루키 실버 그레이딩 카드 [최상급 S급 보전상태] 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: [""],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 452,
    likeCount: 41,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_097",
    sellerId: "seller_106",
    title: "르브론 제임스 시그니처 크롬 고등급 리미티드 패키지 [미사용 오리지널 패키지]",
    category: "스포츠카드",
    description: "르브론 제임스 시그니처 크롬 고등급 리미티드 패키지 [미사용 오리지널 패키지] 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250803_116%2F17541876552074bgYL_JPEG%2F29805708670044209_1577704021.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 127,
    likeCount: 77,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_098",
    sellerId: "seller_108",
    title: "쇼헤이 오타니 레전더리 투타겸업 기념 인서트 루키 카드 [리미티드 보증 증서 필속]",
    category: "스포츠카드",
    description: "쇼헤이 오타니 레전더리 투타겸업 기념 인서트 루키 카드 [리미티드 보증 증서 필속] 상품입니다. 스포츠 레전드의 가치를 담은 한정판 스포츠 카드입니다. 팬이라면 절대 놓칠 수 없는 특별한 컬렉션 아이템입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230716_273%2F1689464388271s2LnI_JPEG%2F15179381879002031_635108341.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 95,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_099",
    sellerId: "seller_102",
    title: "리오넬 메시 바르셀로나 2015 챔피언스리그 결승 실착 레플리카 [최상급 S급 보전상태]",
    category: "유니폼/의류 굿즈",
    description: "리오넬 메시 바르셀로나 2015 챔피언스리그 결승 실착 레플리카 [최상급 S급 보전상태] 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20241101_262%2F1730449478282kCo4R_JPEG%2F64582313417584786_198673755.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 65,
    likeCount: 74,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_100",
    sellerId: "seller_103",
    title: "손흥민 토트넘 홋스퍼 친필사인 22/23 시즌 공식 홈 저지 [미사용 오리지널 패키지]",
    category: "유니폼/의류 굿즈",
    description: "손흥민 토트넘 홋스퍼 친필사인 22/23 시즌 공식 홈 저지 [미사용 오리지널 패키지] 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20231017_128%2F1697546576564d0PCj_JPEG%2F5977851439384204_830103657.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 358,
    likeCount: 22,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_101",
    sellerId: "seller_103",
    title: "르브론 제임스 LA 레이커스 시그니처 챔피언 트레이닝 스타 저지 [리미티드 보증 증서 필속]",
    category: "유니폼/의류 굿즈",
    description: "르브론 제임스 LA 레이커스 시그니처 챔피언 트레이닝 스타 저지 [리미티드 보증 증서 필속] 상품입니다. 역사적인 가치를 지닌 레전드 유니폼 및 의류 굿즈입니다. 실착용으로는 물론, 액자에 넣어 전시하기에도 완벽합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230511_167%2F16837893748961SmvW_JPEG%2F831855344528715_737761318.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 410,
    likeCount: 7,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_102",
    sellerId: "seller_107",
    title: "나이키 에어 조던 1 레트로 하이 OG 시카고 2015 미개봉 데드스탁 [최상급 S급 보전상태]",
    category: "운동화",
    description: "나이키 에어 조던 1 레트로 하이 OG 시카고 2015 미개봉 데드스탁 [최상급 S급 보전상태] 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260310_157%2F17730777891579GOSf_JPEG%2F21482382041385936_1297830168.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 437,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_103",
    sellerId: "seller_104",
    title: "아디다스 이지부스트 350 V2 지브라 오리지널 초판 박스 풀셋 [미사용 오리지널 패키지]",
    category: "운동화",
    description: "아디다스 이지부스트 350 V2 지브라 오리지널 초판 박스 풀셋 [미사용 오리지널 패키지] 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240912_153%2F1726137180326QoRAw_JPEG%2F16490598370856939_190048514.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 169,
    likeCount: 63,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_104",
    sellerId: "seller_103",
    title: "나이키 SB 덩크 로우 오리지널 트래비스 스캇 스페셜 팩 [리미티드 보증 증서 필속]",
    category: "운동화",
    description: "나이키 SB 덩크 로우 오리지널 트래비스 스캇 스페셜 팩 [리미티드 보증 증서 필속] 상품입니다. 스니커즈 매니아들의 워너비 한정판 스니커즈입니다. 시간이 흐를수록 프리미엄이 붙는 완벽한 데드스탁 제품입니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20201119_14%2F1605757793886MeqS0_JPEG%2F6893628716537426_1330101683.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 393,
    likeCount: 73,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_105",
    sellerId: "seller_102",
    title: "펠레 (Pele) 브라질 국가대표 은퇴 기념 친필 사인 축구공 [최상급 S급 보전상태]",
    category: "사인볼/공",
    description: "펠레 (Pele) 브라질 국가대표 은퇴 기념 친필 사인 축구공 [최상급 S급 보전상태] 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250107_139%2F1736239430234ifjtu_JPEG%2F22607015945727214_631204438.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 221,
    likeCount: 59,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_106",
    sellerId: "seller_110",
    title: "쇼헤이 오타니 MLB 정규 시즌 리얼 게임 사용 사인 가죽 야구공 [미사용 오리지널 패키지]",
    category: "사인볼/공",
    description: "쇼헤이 오타니 MLB 정규 시즌 리얼 게임 사용 사인 가죽 야구공 [미사용 오리지널 패키지] 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20250904_137%2F17569967586249o1O8_JPEG%2F1403884971339611_848742683.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 280,
    likeCount: 57,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_107",
    sellerId: "seller_108",
    title: "스테판 커리 골든스테이트 오토그래프 올스타 공인 농구공 [리미티드 보증 증서 필속]",
    category: "사인볼/공",
    description: "스테판 커리 골든스테이트 오토그래프 올스타 공인 농구공 [리미티드 보증 증서 필속] 상품입니다. 레전드 선수의 숨결이 담긴 친필 사인볼입니다. 진품을 인증할 수 있는 완벽한 보증과 함께 제공됩니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20170504_184%2Fbuybuy_1493826761948WF4uI_JPEG%2Fsss.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 360,
    likeCount: 38,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_108",
    sellerId: "seller_101",
    title: "맨체스터 유나이티드 올드 트래포드 경기장 아크릴 디오라마 브릭 [최상급 S급 보전상태]",
    category: "스포츠 굿즈",
    description: "맨체스터 유나이티드 올드 트래포드 경기장 아크릴 디오라마 브릭 [최상급 S급 보전상태] 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20251207_57%2F17651088634462Uuqf_JPEG%2F10741874256654567_1494782072.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 287,
    likeCount: 45,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_109",
    sellerId: "seller_104",
    title: "마이클 조던 시카고불스 우승 반지 레플리카 6종 세트 럭셔리 케이스 [미사용 오리지널 패키지]",
    category: "스포츠 굿즈",
    description: "마이클 조던 시카고불스 우승 반지 레플리카 6종 세트 럭셔리 케이스 [미사용 오리지널 패키지] 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20251208_218%2F1765167697643Vqct6_JPEG%2F99300619755466813_1541296002.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 421,
    likeCount: 24,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_110",
    sellerId: "seller_106",
    title: "포뮬러 1 (F1) 레드불 레이싱 프라모델 컬렉티블 소품 [리미티드 보증 증서 필속]",
    category: "스포츠 굿즈",
    description: "포뮬러 1 (F1) 레드불 레이싱 프라모델 컬렉티블 소품 [리미티드 보증 증서 필속] 상품입니다. 경기장의 감동을 그대로 간직한 스포츠 오피셜 굿즈입니다. 희소성 있는 한정판 굿즈로 컬렉션을 완성해보세요. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260512_28%2F1778556499498Cl70A_JPEG%2F33110028269893387_207072690.jpeg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 305,
    likeCount: 54,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_111",
    sellerId: "seller_106",
    title: "핑크 플로이드 (Pink Floyd) The Dark Side of the Moon 오리지널 초판 LP [최상급 S급 보전상태]",
    category: "희귀 LP/음반",
    description: "핑크 플로이드 (Pink Floyd) The Dark Side of the Moon 오리지널 초판 LP [최상급 S급 보전상태] 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250410_264%2F17442140796306qMwF_JPEG%2F15969694752576590_424544019.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 225,
    likeCount: 37,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_112",
    sellerId: "seller_103",
    title: "유재하 1집 ‘사랑하기 때문에’ 1987년 서라벌레코드 정품 초판 오리지널 LP [미사용 오리지널 패키지]",
    category: "희귀 LP/음반",
    description: "유재하 1집 ‘사랑하기 때문에’ 1987년 서라벌레코드 정품 초판 오리지널 LP [미사용 오리지널 패키지] 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250220_6%2F1740057027402DQ8Au_JPEG%2F16518938521723486_981053466.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 300,
    likeCount: 70,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_113",
    sellerId: "seller_106",
    title: "마이클 잭슨 Thriller 1982년 영문 오리지널 게이트폴드 한정 LP [리미티드 보증 증서 필속]",
    category: "희귀 LP/음반",
    description: "마이클 잭슨 Thriller 1982년 영문 오리지널 게이트폴드 한정 LP [리미티드 보증 증서 필속] 상품입니다. 아날로그의 깊은 울림을 전해주는 오리지널 빈티지 바이닐과 희귀 음반입니다. 자켓과 알판 모두 최상의 컨디션을 유지하고 있습니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220518_100%2F1652843285140pSuew_PNG%2F53979068676844688_2031539153.png&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 155,
    likeCount: 64,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_114",
    sellerId: "seller_109",
    title: "롤라이플렉스 (Rolleiflex) 2.8F 중형 이안반사 하이 클래스 필름카메라 [최상급 S급 보전상태]",
    category: "빈티지 카메라",
    description: "롤라이플렉스 (Rolleiflex) 2.8F 중형 이안반사 하이 클래스 필름카메라 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230306_255%2F1678088648956TEHqm_JPEG%2F5391332808608596_1299885967.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 298,
    likeCount: 50,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_115",
    sellerId: "seller_102",
    title: "하셀브라드 (Hasselblad) 500C/M 수동 바디 + 80mm 자이스 플라나 렌즈 [미사용 오리지널 패키지]",
    category: "빈티지 카메라",
    description: "하셀브라드 (Hasselblad) 500C/M 수동 바디 + 80mm 자이스 플라나 렌즈 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20220811_129%2F1660199791205YxWJv_JPEG%2F61335574920030353_1769443372.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 398,
    likeCount: 24,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_116",
    sellerId: "seller_104",
    title: "미놀타 (Minolta) X-700 클래식 실버 레트로 렌즈 풀박스 패키지 [리미티드 보증 증서 필속]",
    category: "빈티지 카메라",
    description: "미놀타 (Minolta) X-700 클래식 실버 레트로 렌즈 풀박스 패키지 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210723_169%2F1627019365915E4BAI_JPEG%2F28155264353956146_210155432.JPG&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 432,
    likeCount: 43,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_117",
    sellerId: "seller_105",
    title: "조선시대 상평통보 당백전 오리지널 유광 보존 통보 엽전 [최상급 S급 보전상태]",
    category: "화폐",
    description: "조선시대 상평통보 당백전 오리지널 유광 보존 통보 엽전 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240413_16%2F1713013550807MVwLz_JPEG%2F40922135748309271_1585461390.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 300,
    likeCount: 73,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_118",
    sellerId: "seller_104",
    title: "1982년 최초 발행 주화 500원 미사용 고광택 수집용 아크릴 보증판 [미사용 오리지널 패키지]",
    category: "화폐",
    description: "1982년 최초 발행 주화 500원 미사용 고광택 수집용 아크릴 보증판 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260202_265%2F1770003241860XfsWs_JPEG%2F80133703477195770_1037311985.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 340,
    likeCount: 6,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_119",
    sellerId: "seller_108",
    title: "대한민국 오백원 구권 지폐 미사용 극미급 일련번호 연번 세트 [리미티드 보증 증서 필속]",
    category: "화폐",
    description: "대한민국 오백원 구권 지폐 미사용 극미급 일련번호 연번 세트 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250821_78%2F1755735111240jvENO_JPEG%2F89867980357643946_1095522265.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 368,
    likeCount: 39,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_120",
    sellerId: "seller_108",
    title: "1884년 우정총국 개국 기념 문위우표 5문/10문 오리지널 실물 [최상급 S급 보전상태]",
    category: "우표",
    description: "1884년 우정총국 개국 기념 문위우표 5문/10문 오리지널 실물 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20260421_241%2F1776754039689EmCHF_JPEG%2F39304124801643170_1377307342.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 359,
    likeCount: 72,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_121",
    sellerId: "seller_108",
    title: "대한민국 제1대 대통령 취임 기념 우표 전지 무보수 진공 앨범 [미사용 오리지널 패키지]",
    category: "우표",
    description: "대한민국 제1대 대통령 취임 기념 우표 전지 무보수 진공 앨범 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20241216_280%2F1734357550087eoQ2X_JPEG%2F3584345931997582_1059607700.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 65,
    likeCount: 8,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_122",
    sellerId: "seller_110",
    title: "영국 1840년 월드 최초 페니 블랙(Penny Black) 1페니 우표 [리미티드 보증 증서 필속]",
    category: "우표",
    description: "영국 1840년 월드 최초 페니 블랙(Penny Black) 1페니 우표 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20230705_115%2F1688566622526uPC4X_JPEG%2F13194466323448227_340741308.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 353,
    likeCount: 82,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_123",
    sellerId: "seller_105",
    title: "미출시 서태지와 아이들 1992년 비공개 테크노 리믹스 릴테이프 데모 [최상급 S급 보전상태]",
    category: "로스트미디어",
    description: "미출시 서태지와 아이들 1992년 비공개 테크노 리믹스 릴테이프 데모 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20250405_282%2F1743812725851w8fHq_JPEG%2F14339580680708811_808478944.JPG&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 415,
    likeCount: 48,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_124",
    sellerId: "seller_103",
    title: "1980년대 대한뉴스 검열 삭제 본본 16mm 셀룰로이드 필름 영화 [미사용 오리지널 패키지]",
    category: "로스트미디어",
    description: "1980년대 대한뉴스 검열 삭제 본본 16mm 셀룰로이드 필름 영화 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20190403_277%2Fretro_k_1554284895271y0atQ_JPEG%2F77592074910767276_14908660.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 392,
    likeCount: 23,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_125",
    sellerId: "seller_105",
    title: "고전 마징가Z 대 비디오 대마왕 희귀 미출시 VHS 한정 비디오테이프 [리미티드 보증 증서 필속]",
    category: "로스트미디어",
    description: "고전 마징가Z 대 비디오 대마왕 희귀 미출시 VHS 한정 비디오테이프 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20231015_52%2F1697374555055xNVGg_JPEG%2F7523004852861197_1603855769.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 187,
    likeCount: 79,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_126",
    sellerId: "seller_108",
    title: "소니 (Sony) 오리지널 워크맨 WM-2 레트로 클래식 작동 워크맨 [최상급 S급 보전상태]",
    category: "레트로",
    description: "소니 (Sony) 오리지널 워크맨 WM-2 레트로 클래식 작동 워크맨 [최상급 S급 보전상태] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260416_7%2F1776335865761Ggd3b_JPEG%2F110468780903088497_1552246002.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 173,
    likeCount: 54,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_127",
    sellerId: "seller_103",
    title: "닌텐도 패미컴 오리지널 초기형 패키지 팩 5개 세트 100% 작동 [미사용 오리지널 패키지]",
    category: "레트로",
    description: "닌텐도 패미컴 오리지널 초기형 패키지 팩 5개 세트 100% 작동 [미사용 오리지널 패키지] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20190913_293%2F1568313320524EnApT_JPEG%2F5673155074851253_1982140550.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 444,
    likeCount: 64,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
  {
    id: "prod_128",
    sellerId: "seller_102",
    title: "샤프 (Sharp) 부블박스 클래식 대형 휴대 카세트 라디오 1985 [리미티드 보증 증서 필속]",
    category: "레트로",
    description: "샤프 (Sharp) 부블박스 클래식 대형 휴대 카세트 라디오 1985 [리미티드 보증 증서 필속] 상품입니다. 아날로그 감성을 듬뿍 담은 희귀한 아이템입니다. 세월이 지날수록 그 특별한 가치가 더욱 빛을 발합니다. 소장 가치가 뛰어난 특별한 기회를 놓치지 마세요. 상세 이미지와 상태 설명을 꼼꼼히 확인해 주시고 많은 관심 부탁드립니다.",
    images: ["https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20260523_299%2F1779489357986f83V1_JPEG%2F54054285125932226_790849650.jpg&type=sc960_832"],
    condition: "새상품급",
    auctionType: "ascending",
    status: "live",
    viewCount: 77,
    likeCount: 76,
    createdAt: "2026-06-13T19:22:22.000Z"
  },
];

export const auctions: NewAuction[] = [
  {
    id: "auc_001",
    productId: "prod_001",
    auctionType: "ascending",
    startPrice: 40000,
    hasBuyNow: true,
    buyNowPrice: 56000,
    
    
    
    
    currentPrice: 50000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_002",
    productId: "prod_002",
    auctionType: "descending",
    startPrice: 80000,
    hasBuyNow: true,
    buyNowPrice: 112000,
    
    
    
    
    currentPrice: 80000,
    floorPrice: 40000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_003",
    productId: "prod_003",
    auctionType: "ascending",
    startPrice: 350000,
    hasBuyNow: true,
    buyNowPrice: 489999,
    
    
    
    
    currentPrice: 380000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_004",
    productId: "prod_004",
    auctionType: "descending",
    startPrice: 200000,
    hasBuyNow: true,
    buyNowPrice: 280000,
    
    
    
    
    currentPrice: 200000,
    floorPrice: 100000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_005",
    productId: "prod_005",
    auctionType: "ascending",
    startPrice: 140000,
    hasBuyNow: true,
    buyNowPrice: 196000,
    
    
    
    
    currentPrice: 160000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_006",
    productId: "prod_006",
    auctionType: "descending",
    startPrice: 190000,
    hasBuyNow: true,
    buyNowPrice: 266000,
    
    
    
    
    currentPrice: 190000,
    floorPrice: 95000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_007",
    productId: "prod_007",
    auctionType: "ascending",
    startPrice: 380000,
    hasBuyNow: true,
    buyNowPrice: 532000,
    
    
    
    
    currentPrice: 410000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_008",
    productId: "prod_008",
    auctionType: "descending",
    startPrice: 240000,
    hasBuyNow: true,
    buyNowPrice: 336000,
    
    
    
    
    currentPrice: 240000,
    floorPrice: 120000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_009",
    productId: "prod_009",
    auctionType: "ascending",
    startPrice: 220000,
    hasBuyNow: true,
    buyNowPrice: 308000,
    
    
    
    
    currentPrice: 230000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_010",
    productId: "prod_010",
    auctionType: "descending",
    startPrice: 120000,
    hasBuyNow: true,
    buyNowPrice: 168000,
    
    
    
    
    currentPrice: 120000,
    floorPrice: 60000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_011",
    productId: "prod_011",
    auctionType: "ascending",
    startPrice: 190000,
    hasBuyNow: true,
    buyNowPrice: 266000,
    
    
    
    
    currentPrice: 220000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_012",
    productId: "prod_012",
    auctionType: "descending",
    startPrice: 370000,
    hasBuyNow: true,
    buyNowPrice: 517999,
    
    
    
    
    currentPrice: 370000,
    floorPrice: 185000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_013",
    productId: "prod_013",
    auctionType: "ascending",
    startPrice: 370000,
    hasBuyNow: true,
    buyNowPrice: 517999,
    
    
    
    
    currentPrice: 380000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_014",
    productId: "prod_014",
    auctionType: "descending",
    startPrice: 70000,
    hasBuyNow: true,
    buyNowPrice: 98000,
    
    
    
    
    currentPrice: 70000,
    floorPrice: 35000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_015",
    productId: "prod_015",
    auctionType: "ascending",
    startPrice: 410000,
    hasBuyNow: true,
    buyNowPrice: 574000,
    
    
    
    
    currentPrice: 450000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_016",
    productId: "prod_016",
    auctionType: "descending",
    startPrice: 370000,
    hasBuyNow: true,
    buyNowPrice: 517999,
    
    
    
    
    currentPrice: 370000,
    floorPrice: 185000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_017",
    productId: "prod_017",
    auctionType: "ascending",
    startPrice: 170000,
    hasBuyNow: true,
    buyNowPrice: 237999,
    
    
    
    
    currentPrice: 210000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_018",
    productId: "prod_018",
    auctionType: "descending",
    startPrice: 480000,
    hasBuyNow: true,
    buyNowPrice: 672000,
    
    
    
    
    currentPrice: 480000,
    floorPrice: 240000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_019",
    productId: "prod_019",
    auctionType: "ascending",
    startPrice: 10000,
    hasBuyNow: true,
    buyNowPrice: 14000,
    
    
    
    
    currentPrice: 50000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_020",
    productId: "prod_020",
    auctionType: "descending",
    startPrice: 330000,
    hasBuyNow: true,
    buyNowPrice: 461999,
    
    
    
    
    currentPrice: 330000,
    floorPrice: 165000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_021",
    productId: "prod_021",
    auctionType: "ascending",
    startPrice: 360000,
    hasBuyNow: true,
    buyNowPrice: 503999,
    
    
    
    
    currentPrice: 360000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_022",
    productId: "prod_022",
    auctionType: "descending",
    startPrice: 60000,
    hasBuyNow: true,
    buyNowPrice: 84000,
    
    
    
    
    currentPrice: 60000,
    floorPrice: 30000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_023",
    productId: "prod_023",
    auctionType: "ascending",
    startPrice: 30000,
    hasBuyNow: true,
    buyNowPrice: 42000,
    
    
    
    
    currentPrice: 40000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_024",
    productId: "prod_024",
    auctionType: "descending",
    startPrice: 70000,
    hasBuyNow: true,
    buyNowPrice: 98000,
    
    
    
    
    currentPrice: 70000,
    floorPrice: 35000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_025",
    productId: "prod_025",
    auctionType: "ascending",
    startPrice: 370000,
    hasBuyNow: true,
    buyNowPrice: 517999,
    
    
    
    
    currentPrice: 410000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_026",
    productId: "prod_026",
    auctionType: "descending",
    startPrice: 320000,
    hasBuyNow: true,
    buyNowPrice: 448000,
    
    
    
    
    currentPrice: 320000,
    floorPrice: 160000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_027",
    productId: "prod_027",
    auctionType: "ascending",
    startPrice: 90000,
    hasBuyNow: true,
    buyNowPrice: 125999,
    
    
    
    
    currentPrice: 120000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_028",
    productId: "prod_028",
    auctionType: "descending",
    startPrice: 370000,
    hasBuyNow: true,
    buyNowPrice: 517999,
    
    
    
    
    currentPrice: 370000,
    floorPrice: 185000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_029",
    productId: "prod_029",
    auctionType: "ascending",
    startPrice: 20000,
    hasBuyNow: true,
    buyNowPrice: 28000,
    
    
    
    
    currentPrice: 50000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_030",
    productId: "prod_030",
    auctionType: "descending",
    startPrice: 460000,
    hasBuyNow: true,
    buyNowPrice: 644000,
    
    
    
    
    currentPrice: 460000,
    floorPrice: 230000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_031",
    productId: "prod_031",
    auctionType: "ascending",
    startPrice: 190000,
    hasBuyNow: true,
    buyNowPrice: 266000,
    
    
    
    
    currentPrice: 210000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_032",
    productId: "prod_032",
    auctionType: "descending",
    startPrice: 230000,
    hasBuyNow: true,
    buyNowPrice: 322000,
    
    
    
    
    currentPrice: 230000,
    floorPrice: 115000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_033",
    productId: "prod_033",
    auctionType: "ascending",
    startPrice: 240000,
    hasBuyNow: true,
    buyNowPrice: 336000,
    
    
    
    
    currentPrice: 260000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_034",
    productId: "prod_034",
    auctionType: "descending",
    startPrice: 30000,
    hasBuyNow: true,
    buyNowPrice: 42000,
    
    
    
    
    currentPrice: 30000,
    floorPrice: 15000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_035",
    productId: "prod_035",
    auctionType: "ascending",
    startPrice: 100000,
    hasBuyNow: true,
    buyNowPrice: 140000,
    
    
    
    
    currentPrice: 130000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_036",
    productId: "prod_036",
    auctionType: "descending",
    startPrice: 120000,
    hasBuyNow: true,
    buyNowPrice: 168000,
    
    
    
    
    currentPrice: 120000,
    floorPrice: 60000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_037",
    productId: "prod_037",
    auctionType: "ascending",
    startPrice: 290000,
    hasBuyNow: true,
    buyNowPrice: 406000,
    
    
    
    
    currentPrice: 290000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_038",
    productId: "prod_038",
    auctionType: "descending",
    startPrice: 310000,
    hasBuyNow: true,
    buyNowPrice: 434000,
    
    
    
    
    currentPrice: 310000,
    floorPrice: 155000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_039",
    productId: "prod_039",
    auctionType: "ascending",
    startPrice: 470000,
    hasBuyNow: true,
    buyNowPrice: 658000,
    
    
    
    
    currentPrice: 500000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_040",
    productId: "prod_040",
    auctionType: "descending",
    startPrice: 20000,
    hasBuyNow: true,
    buyNowPrice: 28000,
    
    
    
    
    currentPrice: 20000,
    floorPrice: 10000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_041",
    productId: "prod_041",
    auctionType: "ascending",
    startPrice: 180000,
    hasBuyNow: true,
    buyNowPrice: 251999,
    
    
    
    
    currentPrice: 180000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_042",
    productId: "prod_042",
    auctionType: "descending",
    startPrice: 10000,
    hasBuyNow: true,
    buyNowPrice: 14000,
    
    
    
    
    currentPrice: 10000,
    floorPrice: 5000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_043",
    productId: "prod_043",
    auctionType: "ascending",
    startPrice: 320000,
    hasBuyNow: true,
    buyNowPrice: 448000,
    
    
    
    
    currentPrice: 340000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_044",
    productId: "prod_044",
    auctionType: "descending",
    startPrice: 410000,
    hasBuyNow: true,
    buyNowPrice: 574000,
    
    
    
    
    currentPrice: 410000,
    floorPrice: 205000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_045",
    productId: "prod_045",
    auctionType: "ascending",
    startPrice: 390000,
    hasBuyNow: true,
    buyNowPrice: 546000,
    
    
    
    
    currentPrice: 400000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_046",
    productId: "prod_046",
    auctionType: "descending",
    startPrice: 140000,
    hasBuyNow: true,
    buyNowPrice: 196000,
    
    
    
    
    currentPrice: 140000,
    floorPrice: 70000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_047",
    productId: "prod_047",
    auctionType: "ascending",
    startPrice: 210000,
    hasBuyNow: true,
    buyNowPrice: 294000,
    
    
    
    
    currentPrice: 250000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_048",
    productId: "prod_048",
    auctionType: "descending",
    startPrice: 50000,
    hasBuyNow: true,
    buyNowPrice: 70000,
    
    
    
    
    currentPrice: 50000,
    floorPrice: 25000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_049",
    productId: "prod_049",
    auctionType: "ascending",
    startPrice: 150000,
    hasBuyNow: true,
    buyNowPrice: 210000,
    
    
    
    
    currentPrice: 160000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_050",
    productId: "prod_050",
    auctionType: "descending",
    startPrice: 400000,
    hasBuyNow: true,
    buyNowPrice: 560000,
    
    
    
    
    currentPrice: 400000,
    floorPrice: 200000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_051",
    productId: "prod_051",
    auctionType: "ascending",
    startPrice: 480000,
    hasBuyNow: true,
    buyNowPrice: 672000,
    
    
    
    
    currentPrice: 500000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_052",
    productId: "prod_052",
    auctionType: "descending",
    startPrice: 20000,
    hasBuyNow: true,
    buyNowPrice: 28000,
    
    
    
    
    currentPrice: 20000,
    floorPrice: 10000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_053",
    productId: "prod_053",
    auctionType: "ascending",
    startPrice: 410000,
    hasBuyNow: true,
    buyNowPrice: 574000,
    
    
    
    
    currentPrice: 410000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_054",
    productId: "prod_054",
    auctionType: "descending",
    startPrice: 320000,
    hasBuyNow: true,
    buyNowPrice: 448000,
    
    
    
    
    currentPrice: 320000,
    floorPrice: 160000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_055",
    productId: "prod_055",
    auctionType: "ascending",
    startPrice: 60000,
    hasBuyNow: true,
    buyNowPrice: 84000,
    
    
    
    
    currentPrice: 60000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_056",
    productId: "prod_056",
    auctionType: "descending",
    startPrice: 220000,
    hasBuyNow: true,
    buyNowPrice: 308000,
    
    
    
    
    currentPrice: 220000,
    floorPrice: 110000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_057",
    productId: "prod_057",
    auctionType: "ascending",
    startPrice: 280000,
    hasBuyNow: true,
    buyNowPrice: 392000,
    
    
    
    
    currentPrice: 300000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_058",
    productId: "prod_058",
    auctionType: "descending",
    startPrice: 180000,
    hasBuyNow: true,
    buyNowPrice: 251999,
    
    
    
    
    currentPrice: 180000,
    floorPrice: 90000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_059",
    productId: "prod_059",
    auctionType: "ascending",
    startPrice: 230000,
    hasBuyNow: true,
    buyNowPrice: 322000,
    
    
    
    
    currentPrice: 250000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_060",
    productId: "prod_060",
    auctionType: "descending",
    startPrice: 440000,
    hasBuyNow: true,
    buyNowPrice: 616000,
    
    
    
    
    currentPrice: 440000,
    floorPrice: 220000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_061",
    productId: "prod_061",
    auctionType: "ascending",
    startPrice: 350000,
    hasBuyNow: true,
    buyNowPrice: 489999,
    
    
    
    
    currentPrice: 370000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_062",
    productId: "prod_062",
    auctionType: "descending",
    startPrice: 10000,
    hasBuyNow: true,
    buyNowPrice: 14000,
    
    
    
    
    currentPrice: 10000,
    floorPrice: 5000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_063",
    productId: "prod_063",
    auctionType: "ascending",
    startPrice: 300000,
    hasBuyNow: true,
    buyNowPrice: 420000,
    
    
    
    
    currentPrice: 300000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_064",
    productId: "prod_064",
    auctionType: "descending",
    startPrice: 310000,
    hasBuyNow: true,
    buyNowPrice: 434000,
    
    
    
    
    currentPrice: 310000,
    floorPrice: 155000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_065",
    productId: "prod_065",
    auctionType: "ascending",
    startPrice: 10000,
    hasBuyNow: true,
    buyNowPrice: 14000,
    
    
    
    
    currentPrice: 20000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_066",
    productId: "prod_066",
    auctionType: "descending",
    startPrice: 440000,
    hasBuyNow: true,
    buyNowPrice: 616000,
    
    
    
    
    currentPrice: 440000,
    floorPrice: 220000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_067",
    productId: "prod_067",
    auctionType: "ascending",
    startPrice: 400000,
    hasBuyNow: true,
    buyNowPrice: 560000,
    
    
    
    
    currentPrice: 430000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_068",
    productId: "prod_068",
    auctionType: "descending",
    startPrice: 260000,
    hasBuyNow: true,
    buyNowPrice: 364000,
    
    
    
    
    currentPrice: 260000,
    floorPrice: 130000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_069",
    productId: "prod_069",
    auctionType: "ascending",
    startPrice: 130000,
    hasBuyNow: true,
    buyNowPrice: 182000,
    
    
    
    
    currentPrice: 170000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_070",
    productId: "prod_070",
    auctionType: "descending",
    startPrice: 450000,
    hasBuyNow: true,
    buyNowPrice: 630000,
    
    
    
    
    currentPrice: 450000,
    floorPrice: 225000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_071",
    productId: "prod_071",
    auctionType: "ascending",
    startPrice: 290000,
    hasBuyNow: true,
    buyNowPrice: 406000,
    
    
    
    
    currentPrice: 300000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_072",
    productId: "prod_072",
    auctionType: "descending",
    startPrice: 40000,
    hasBuyNow: true,
    buyNowPrice: 56000,
    
    
    
    
    currentPrice: 40000,
    floorPrice: 20000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_073",
    productId: "prod_073",
    auctionType: "ascending",
    startPrice: 470000,
    hasBuyNow: true,
    buyNowPrice: 658000,
    
    
    
    
    currentPrice: 510000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_074",
    productId: "prod_074",
    auctionType: "descending",
    startPrice: 210000,
    hasBuyNow: true,
    buyNowPrice: 294000,
    
    
    
    
    currentPrice: 210000,
    floorPrice: 105000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_075",
    productId: "prod_075",
    auctionType: "ascending",
    startPrice: 480000,
    hasBuyNow: true,
    buyNowPrice: 672000,
    
    
    
    
    currentPrice: 510000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_076",
    productId: "prod_076",
    auctionType: "descending",
    startPrice: 460000,
    hasBuyNow: true,
    buyNowPrice: 644000,
    
    
    
    
    currentPrice: 460000,
    floorPrice: 230000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_077",
    productId: "prod_077",
    auctionType: "ascending",
    startPrice: 480000,
    hasBuyNow: true,
    buyNowPrice: 672000,
    
    
    
    
    currentPrice: 510000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_078",
    productId: "prod_078",
    auctionType: "descending",
    startPrice: 270000,
    hasBuyNow: true,
    buyNowPrice: 378000,
    
    
    
    
    currentPrice: 270000,
    floorPrice: 135000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_079",
    productId: "prod_079",
    auctionType: "ascending",
    startPrice: 30000,
    hasBuyNow: true,
    buyNowPrice: 42000,
    
    
    
    
    currentPrice: 60000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_080",
    productId: "prod_080",
    auctionType: "descending",
    startPrice: 300000,
    hasBuyNow: true,
    buyNowPrice: 420000,
    
    
    
    
    currentPrice: 300000,
    floorPrice: 150000,
    decrementAmount: 1000,
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_081",
    productId: "prod_081",
    auctionType: "ascending",
    startPrice: 666000,
    hasBuyNow: true,
    buyNowPrice: 932399,
    
    
    
    
    currentPrice: 750600,
    
    minBidIncrement: 33000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_082",
    productId: "prod_082",
    auctionType: "ascending",
    startPrice: 266000,
    hasBuyNow: true,
    buyNowPrice: 372400,
    
    
    
    
    currentPrice: 301400,
    
    minBidIncrement: 13000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_083",
    productId: "prod_083",
    auctionType: "ascending",
    startPrice: 475000,
    hasBuyNow: true,
    buyNowPrice: 665000,
    
    
    
    
    currentPrice: 490300,
    
    minBidIncrement: 23000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_084",
    productId: "prod_084",
    auctionType: "ascending",
    startPrice: 556000,
    hasBuyNow: true,
    buyNowPrice: 778400,
    
    
    
    
    currentPrice: 619200,
    
    minBidIncrement: 27000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_085",
    productId: "prod_085",
    auctionType: "ascending",
    startPrice: 392000,
    hasBuyNow: true,
    buyNowPrice: 548800,
    
    
    
    
    currentPrice: 563000,
    
    minBidIncrement: 19000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_086",
    productId: "prod_086",
    auctionType: "ascending",
    startPrice: 382000,
    hasBuyNow: true,
    buyNowPrice: 534800,
    
    
    
    
    currentPrice: 399300,
    
    minBidIncrement: 19000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_087",
    productId: "prod_087",
    auctionType: "ascending",
    startPrice: 757000,
    hasBuyNow: true,
    buyNowPrice: 1059800,
    
    
    
    
    currentPrice: 790300,
    
    minBidIncrement: 37000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_088",
    productId: "prod_088",
    auctionType: "ascending",
    startPrice: 64000,
    hasBuyNow: true,
    buyNowPrice: 89600,
    
    
    
    
    currentPrice: 88200,
    
    minBidIncrement: 3000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_089",
    productId: "prod_089",
    auctionType: "ascending",
    startPrice: 752000,
    hasBuyNow: true,
    buyNowPrice: 1052800,
    
    
    
    
    currentPrice: 832000,
    
    minBidIncrement: 37000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_090",
    productId: "prod_090",
    auctionType: "ascending",
    startPrice: 85000,
    hasBuyNow: true,
    buyNowPrice: 118999,
    
    
    
    
    currentPrice: 143500,
    
    minBidIncrement: 4000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_091",
    productId: "prod_091",
    auctionType: "ascending",
    startPrice: 527000,
    hasBuyNow: true,
    buyNowPrice: 737800,
    
    
    
    
    currentPrice: 660700,
    
    minBidIncrement: 26000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_092",
    productId: "prod_092",
    auctionType: "ascending",
    startPrice: 87000,
    hasBuyNow: true,
    buyNowPrice: 121799,
    
    
    
    
    currentPrice: 263000,
    
    minBidIncrement: 4000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_093",
    productId: "prod_093",
    auctionType: "ascending",
    startPrice: 717000,
    hasBuyNow: true,
    buyNowPrice: 1003799,
    
    
    
    
    currentPrice: 747000,
    
    minBidIncrement: 35000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_094",
    productId: "prod_094",
    auctionType: "ascending",
    startPrice: 428000,
    hasBuyNow: true,
    buyNowPrice: 599200,
    
    
    
    
    currentPrice: 569000,
    
    minBidIncrement: 21000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_095",
    productId: "prod_095",
    auctionType: "ascending",
    startPrice: 126000,
    hasBuyNow: true,
    buyNowPrice: 176400,
    
    
    
    
    currentPrice: 205600,
    
    minBidIncrement: 6000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_096",
    productId: "prod_096",
    auctionType: "ascending",
    startPrice: 505000,
    hasBuyNow: true,
    buyNowPrice: 707000,
    
    
    
    
    currentPrice: 531000,
    
    minBidIncrement: 25000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_097",
    productId: "prod_097",
    auctionType: "ascending",
    startPrice: 759000,
    hasBuyNow: true,
    buyNowPrice: 1062600,
    
    
    
    
    currentPrice: 786200,
    
    minBidIncrement: 37000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_098",
    productId: "prod_098",
    auctionType: "ascending",
    startPrice: 711000,
    hasBuyNow: true,
    buyNowPrice: 995399,
    
    
    
    
    currentPrice: 762600,
    
    minBidIncrement: 35000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_099",
    productId: "prod_099",
    auctionType: "ascending",
    startPrice: 686000,
    hasBuyNow: true,
    buyNowPrice: 960399,
    
    
    
    
    currentPrice: 813800,
    
    minBidIncrement: 34000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_100",
    productId: "prod_100",
    auctionType: "ascending",
    startPrice: 688000,
    hasBuyNow: true,
    buyNowPrice: 963199,
    
    
    
    
    currentPrice: 872600,
    
    minBidIncrement: 34000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_101",
    productId: "prod_101",
    auctionType: "ascending",
    startPrice: 204000,
    hasBuyNow: true,
    buyNowPrice: 285600,
    
    
    
    
    currentPrice: 347000,
    
    minBidIncrement: 10000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_102",
    productId: "prod_102",
    auctionType: "ascending",
    startPrice: 396000,
    hasBuyNow: true,
    buyNowPrice: 554400,
    
    
    
    
    currentPrice: 527300,
    
    minBidIncrement: 19000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_103",
    productId: "prod_103",
    auctionType: "ascending",
    startPrice: 504000,
    hasBuyNow: true,
    buyNowPrice: 705600,
    
    
    
    
    currentPrice: 638400,
    
    minBidIncrement: 25000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_104",
    productId: "prod_104",
    auctionType: "ascending",
    startPrice: 426000,
    hasBuyNow: true,
    buyNowPrice: 596400,
    
    
    
    
    currentPrice: 466800,
    
    minBidIncrement: 21000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_105",
    productId: "prod_105",
    auctionType: "ascending",
    startPrice: 349000,
    hasBuyNow: true,
    buyNowPrice: 488599,
    
    
    
    
    currentPrice: 461000,
    
    minBidIncrement: 17000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_106",
    productId: "prod_106",
    auctionType: "ascending",
    startPrice: 321000,
    hasBuyNow: true,
    buyNowPrice: 449400,
    
    
    
    
    currentPrice: 367500,
    
    minBidIncrement: 16000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_107",
    productId: "prod_107",
    auctionType: "ascending",
    startPrice: 813000,
    hasBuyNow: true,
    buyNowPrice: 1138200,
    
    
    
    
    currentPrice: 1072000,
    
    minBidIncrement: 40000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_108",
    productId: "prod_108",
    auctionType: "ascending",
    startPrice: 774000,
    hasBuyNow: true,
    buyNowPrice: 1083600,
    
    
    
    
    currentPrice: 786200,
    
    minBidIncrement: 38000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_109",
    productId: "prod_109",
    auctionType: "ascending",
    startPrice: 219000,
    hasBuyNow: true,
    buyNowPrice: 306600,
    
    
    
    
    currentPrice: 358300,
    
    minBidIncrement: 10000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_110",
    productId: "prod_110",
    auctionType: "ascending",
    startPrice: 694000,
    hasBuyNow: true,
    buyNowPrice: 971599,
    
    
    
    
    currentPrice: 735400,
    
    minBidIncrement: 34000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_111",
    productId: "prod_111",
    auctionType: "ascending",
    startPrice: 664000,
    hasBuyNow: true,
    buyNowPrice: 929599,
    
    
    
    
    currentPrice: 871600,
    
    minBidIncrement: 33000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_112",
    productId: "prod_112",
    auctionType: "ascending",
    startPrice: 320000,
    hasBuyNow: true,
    buyNowPrice: 448000,
    
    
    
    
    currentPrice: 369500,
    
    minBidIncrement: 16000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_113",
    productId: "prod_113",
    auctionType: "ascending",
    startPrice: 87000,
    hasBuyNow: true,
    buyNowPrice: 121799,
    
    
    
    
    currentPrice: 102400,
    
    minBidIncrement: 4000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_114",
    productId: "prod_114",
    auctionType: "ascending",
    startPrice: 652000,
    hasBuyNow: true,
    buyNowPrice: 912800,
    
    
    
    
    currentPrice: 713600,
    
    minBidIncrement: 32000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_115",
    productId: "prod_115",
    auctionType: "ascending",
    startPrice: 721000,
    hasBuyNow: true,
    buyNowPrice: 1009399,
    
    
    
    
    currentPrice: 789800,
    
    minBidIncrement: 36000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_116",
    productId: "prod_116",
    auctionType: "ascending",
    startPrice: 143000,
    hasBuyNow: true,
    buyNowPrice: 200200,
    
    
    
    
    currentPrice: 185400,
    
    minBidIncrement: 7000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_117",
    productId: "prod_117",
    auctionType: "ascending",
    startPrice: 205000,
    hasBuyNow: true,
    buyNowPrice: 287000,
    
    
    
    
    currentPrice: 293800,
    
    minBidIncrement: 10000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_118",
    productId: "prod_118",
    auctionType: "ascending",
    startPrice: 527000,
    hasBuyNow: true,
    buyNowPrice: 737800,
    
    
    
    
    currentPrice: 581900,
    
    minBidIncrement: 26000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_119",
    productId: "prod_119",
    auctionType: "ascending",
    startPrice: 532000,
    hasBuyNow: true,
    buyNowPrice: 744800,
    
    
    
    
    currentPrice: 596000,
    
    minBidIncrement: 26000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_120",
    productId: "prod_120",
    auctionType: "ascending",
    startPrice: 246000,
    hasBuyNow: true,
    buyNowPrice: 344400,
    
    
    
    
    currentPrice: 383000,
    
    minBidIncrement: 12000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_121",
    productId: "prod_121",
    auctionType: "ascending",
    startPrice: 607000,
    hasBuyNow: true,
    buyNowPrice: 849800,
    
    
    
    
    currentPrice: 835200,
    
    minBidIncrement: 30000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_122",
    productId: "prod_122",
    auctionType: "ascending",
    startPrice: 458000,
    hasBuyNow: true,
    buyNowPrice: 641200,
    
    
    
    
    currentPrice: 600800,
    
    minBidIncrement: 22000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_123",
    productId: "prod_123",
    auctionType: "ascending",
    startPrice: 672000,
    hasBuyNow: true,
    buyNowPrice: 940799,
    
    
    
    
    currentPrice: 780000,
    
    minBidIncrement: 33000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_124",
    productId: "prod_124",
    auctionType: "ascending",
    startPrice: 100000,
    hasBuyNow: true,
    buyNowPrice: 140000,
    
    
    
    
    currentPrice: 240000,
    
    minBidIncrement: 5000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_125",
    productId: "prod_125",
    auctionType: "ascending",
    startPrice: 41000,
    hasBuyNow: true,
    buyNowPrice: 57399,
    
    
    
    
    currentPrice: 171200,
    
    minBidIncrement: 2000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_126",
    productId: "prod_126",
    auctionType: "ascending",
    startPrice: 172000,
    hasBuyNow: true,
    buyNowPrice: 240799,
    
    
    
    
    currentPrice: 254600,
    
    minBidIncrement: 8000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_127",
    productId: "prod_127",
    auctionType: "ascending",
    startPrice: 669000,
    hasBuyNow: true,
    buyNowPrice: 936599,
    
    
    
    
    currentPrice: 685900,
    
    minBidIncrement: 33000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
  {
    id: "auc_128",
    productId: "prod_128",
    auctionType: "ascending",
    startPrice: 190000,
    hasBuyNow: true,
    buyNowPrice: 266000,
    
    
    
    
    currentPrice: 356400,
    
    minBidIncrement: 9000,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: new Date(Date.now() + (6 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString(),
    status: "live"
  },
];

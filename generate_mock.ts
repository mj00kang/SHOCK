import fs from 'fs';

const data = {
  "빈티지토이": [
    "1990년대 영실업 오리지널 다간 X 로봇 (박스 없음, 생활감 있음)",
    "빈티지 미피 레고 벌크 1kg 세트 (80-90년대 올드 레고 포함)",
    "1980년대 일제 반다이 초합금 혼 마징가 Z (파츠 완품)",
    "추억의 세일러문 요술봉 (고전 완구, 작동 확인, 약간의 변색)",
    "빈티지 맥도날드 해피밀 토이 90년대 레트로 20종 일괄 판매"
  ],
  "피규어": [
    "핫토이 아이언맨 마크85 다이캐스트 (풀박스, 개봉 양품)",
    "원피스 아츠제로 루피 기어4 스네이크맨 정품 (박스 보유)",
    "[미개봉] 귀멸의 칼날 렌고쿠 쿄쥬로 1/8 스케일 피규어",
    "반프레스토 드래곤볼 손오공 에어로블 정품 피규어",
    "넨도로이드 1000번 하츠네 미쿠 (파츠 분실 없음, 상태 S급)"
  ],
  "트레이딩카드": [
    "포켓몬카드 리자몽 VMAX SSR (PSA 10 정품 등급 카드)",
    "유희왕 푸른 눈의 백룡 초기 울트라 레어 (S급 소장용 상태)",
    "디지몬 카드 게임 알파몬 시크릿 패러렐 (미판/탑로더 보관)",
    "원피스 카드 게임 몽키 D. 루피 코믹 패러렐 (정품 슬리브 포함)",
    "포켓몬카드 25주년 피카츄 프로모 카드 (미개봉 새상품)"
  ],
  "아이돌포카": [
    "뉴진스 민지 OMG 공방 포카 (하자 전혀 없음, 탑로더 발송)",
    "세븐틴 호시 FML 럭키드로우 사운드웨이브 특전 포카",
    "아이브 장원영 배디 영통팬싸 미공포 (소장용 급처)",
    "에스파 카리나 드라마 팝업스토어 한정 오프라인 포카",
    "BTS 정국 골든 위버스 특전 미공개 포토카드 일괄"
  ],
  "스포츠카드": [
    "오타니 쇼헤이 2018 Topps Chrome 루키 카드 (PSA 9 등급)",
    "마이클 조던 1996 Fleer 메탈 유니버스 베이스 카드",
    "손흥민 2022 Panini Prizm 카타르 월드컵 실버 프리즘",
    "리오넬 메시 2014 Panini 월드컵 베이스 카드 (소장용)",
    "르브론 제임스 2003 Topps 루키 카드 (보관 상태 최상, 노그레이딩)"
  ],
  "유니폼/의류 굿즈": [
    "2002 한일월드컵 대한민국 국가대표 홈 유니폼 (안정환 마킹, L)",
    "14-15 레알 마드리드 홈 유니폼 (호날두 마킹, 정품 L사이즈)",
    "[미개봉 새상품] LA 다저스 오타니 쇼헤이 오센틱 홈 유니폼",
    "토트넘 홋스퍼 23-24 홈 유니폼 (손흥민 친필 자수, 국내 M)",
    "시카고 불스 마이클 조던 어웨이 유니폼 (90s 빈티지 챔피온판)"
  ],
  "운동화": [
    "나이키 에어 조던 1 하이 OG 시카고 2022 (270mm, 풀박스 나이키탭)",
    "아디다스 이지부스트 350 V2 지브라 (265mm, 실착 3회 극미중고)",
    "나이키 x 사카이 베이퍼와플 블랙 검 (275mm, 크림택 부착)",
    "뉴발란스 992 그레이 (260mm, 박스 풀셋 상태 A급)",
    "아식스 x 키코 코스타디노프 젤 퀀텀 (280mm, 박스포함 풀구성)"
  ],
  "사인볼/공": [
    "류현진 한화 이글스 복귀 기념 친필 사인볼 (전용 큐브 포함)",
    "손흥민 국가대표 친필 사인 축구공 (KFA 공인구, 당첨 인증 가능)",
    "이정후 샌프란시스코 자이언츠 이적 첫해 친필 사인 야구볼",
    "KBO 레전드 이승엽 삼성 라이온즈 은퇴 기념 친필 사인구",
    "NBA 스티븐 커리 골든스테이트 워리어스 친필 사인 농구공"
  ],
  "스포츠 굿즈": [
    "2024 기아 타이거즈 통합 우승 기념 한정판 머플러 (새상품)",
    "프리미어리그 리버풀 FC 안필드 스타디움 직관 한정 뱃지 세트",
    "MLB LA 다저스 오타니 쇼헤이 한정판 스타디움 버블헤드 인형",
    "파리 생제르맹(PSG) 이강인 공식 라이선스 스마트폰 케이스 (미개봉)",
    "토트넘 홋스퍼 공식 오피셜 대형 장우산 (택 달린 새상품)"
  ],
  "희귀 LP/음반": [
    "김광석 4집 오리지널 초판 바이닐 LP (자켓/알판 상태 최상)",
    "김현식 5집 빈티지 바이닐 (1990년 오리지널 서라벌레코드 발매반)",
    "타일러 더 크리에이터 (Tyler, The Creator) IGOR 한정판 핑크 바이닐",
    "유재하 '사랑하기 때문에' 1987년 초판 LP (가사지 포함 오리지널)",
    "비틀즈 (The Beatles) Abbey Road UK 오리지널 리마스터반 LP"
  ],
  "빈티지 카메라": [
    "라이카(Leica) M3 실버 바디 (셔터 전구간 정상, 바디 단품)",
    "미놀타 X-700 필름 카메라 + 50mm F1.4 렌즈 (노출계 작동 완벽)",
    "캐논 오토보이 3 데이터백 (y2k 감성 스냅 필름 카메라, 결과물 확인)",
    "올림푸스 뮤 zoom 105 빈티지 콤팩트 카메라 (새 배터리 포함)",
    "후지필름 파인픽스 초기형 y2k 빈티지 디카 (xd 카드, 충전기 포함)"
  ],
  "화폐": [
    "1998년 500원 주화 (희귀 연도, 유통주화 중 상태 양호)",
    "조선시대 상평통보 당이전 실제 엽전 3점 일괄 판매",
    "한국은행 구권 10,000원권 연속 일련번호 5장 묶음 (미사용)",
    "미국 1880년대 모건 실버 달러 올드 은화 (진품 보장)",
    "2002 한일월드컵 기념 주화 3종 세트 (오리지널 케이스 포함)"
  ],
  "우표": [
    "1970-80년대 대한민국 대통령 취임 기념 우표 첩 (일괄 처분)",
    "크리스마스 씰 1990년대~2000년대 연도별 수집 모음집",
    "1950년대 한국전쟁 시기 발행된 희귀 우표 5종 콜렉션",
    "영국 엘리자베스 2세 여왕 즉위 기념 빈티지 해외 우표 세트",
    "대한민국 역대 우표 수집 바인더 앨범 (총 150장 이상 수집품)"
  ],
  "로스트미디어": [
    "90년대 비디오대여점용 만화 '피구왕 통키' SBS 더빙판 VHS 테이프",
    "추억의 고전 애니 '포켓몬스터 1기' 전편 VHS 비디오 세트 (곽팩)",
    "2000년대 초반 홍대 인디 밴드 가내수공업 데모 카세트테이프",
    "80년대 국산 오락실 기판(PCB) '보글보글' 패밀리 카피본 (작동 확인)",
    "90년대 지방 로컬 방송국 로고송 및 광고 녹음 카세트테이프"
  ],
  "레트로": [
    "현대 컴보이 (닌텐도 NES 국내 정발판) 본체 및 알팩 2종 세트",
    "닌텐도 게임보이 컬러 투명 보라 (IPS 백라이트 개조 완료, 극미품)",
    "소니 플레이스테이션 1 (PS1) 7000번대 박스셋 + 타이틀 3장",
    "세가 새턴 (Sega Saturn) 일본판 초기형 본체 (컨트롤러 2개 포함)",
    "닌텐도 64 피카츄 에디션 오렌지 한정판 본체 (북미판)"
  ],
  "굿즈": [
    "스튜디오 지브리 이웃집 토토로 오리지널 오르골 (일판 정품)",
    "스타벅스 2015년 한정판 시애틀 1호점 텀블러 (미사용 소장품)",
    "해리포터 유니버셜 스튜디오 정품 올리반더 지팡이 (해리포터 모델)",
    "에반게리온 극장판 한정 레이/아스카 오리지널 일러스트 포스터 세트",
    "도쿄 디즈니랜드 한정 미키마우스 빈티지 팝콘통 (인테리어 소품)"
  ]
};

const sellerIds = ["seller_101", "seller_202", "seller_303", "seller_404"];
const imageUrls = [
  "https://images.unsplash.com/photo-1596460107916-430662021049?w=800&q=80",
  "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80",
  "https://images.unsplash.com/photo-1611032598370-5807afbba129?w=800&q=80"
];

let productsStr = '\n// --- NEW DATA ADDED BY USER REQUEST ---\n' +
'export interface NewProduct {\n' +
'  id: string;\n' +
'  sellerId: string;\n' +
'  title: string;\n' +
'  category: string;\n' +
'  description: string;\n' +
'  images: string[];\n' +
'  condition: string;\n' +
'  auctionType: "ascending" | "descending";\n' +
'  status: "live";\n' +
'  viewCount: number;\n' +
'  likeCount: number;\n' +
'  createdAt: string;\n' +
'}\n\n' +
'export interface NewAuction {\n' +
'  id: string;\n' +
'  productId: string;\n' +
'  auctionType: "ascending" | "descending";\n' +
'  startPrice: number;\n' +
'  currentPrice: number;\n' +
'  buyNowPrice?: number;\n' +
'  minBidIncrement?: number;\n' +
'  floorPrice?: number;\n' +
'  decrementAmount?: number;\n' +
'  decrementInterval?: number;\n' +
'  startAt: string;\n' +
'  endAt: string;\n' +
'  status: "live";\n' +
'}\n\n' +
'export const products: NewProduct[] = [\n';

let auctionsStr = 'export const auctions: NewAuction[] = [\n';

let counter = 1;

for (const [key, titles] of Object.entries(data)) {
  const category = key === '아이돌포카' ? '아이돌 포카' : key;
  titles.forEach((title, idx) => {
    const id = 'prod_' + counter.toString().padStart(3, '0');
    const auctionId = 'auc_' + counter.toString().padStart(3, '0');
    const isAscending = counter % 2 !== 0; // 50:50 distribution
    const auctionType = isAscending ? 'ascending' : 'descending';
    const condition = ["새상품", "거의 새것", "사용감 약간", "빈티지"][idx % 4];
    const image = imageUrls[counter % imageUrls.length];
    
    // prices
    const startPrice = Math.floor(Math.random() * 50 + 1) * 10000;
    const currentPrice = startPrice + (isAscending ? (Math.floor(Math.random() * 5)*10000) : -(Math.floor(Math.random() * 1)*10000));
    const now = '2026-06-13T19:22:22.000Z';
    const future = '2026-06-16T19:22:22.000Z';
    
    productsStr += '  {\n' +
'    id: "' + id + '",\n' +
'    sellerId: "' + sellerIds[counter % sellerIds.length] + '",\n' +
'    title: "' + title.replace(/"/g, '\\"') + '",\n' +
'    category: "' + category + '",\n' +
'    description: "' + title.replace(/"/g, '\\"') + ' 소장 가치가 뛰어납니다. 많은 관심 바랍니다.",\n' +
'    images: ["' + image + '"],\n' +
'    condition: "' + condition + '",\n' +
'    auctionType: "' + auctionType + '",\n' +
'    status: "live",\n' +
'    viewCount: ' + Math.floor(Math.random() * 500) + ',\n' +
'    likeCount: ' + Math.floor(Math.random() * 50) + ',\n' +
'    createdAt: "' + now + '"\n' +
'  },\n';

    if (isAscending) {
      auctionsStr += '  {\n' +
'    id: "' + auctionId + '",\n' +
'    productId: "' + id + '",\n' +
'    auctionType: "ascending",\n' +
'    startPrice: ' + startPrice + ',\n' +
'    currentPrice: ' + currentPrice + ',\n' +
'    buyNowPrice: ' + (startPrice * 2) + ',\n' +
'    minBidIncrement: 5000,\n' +
'    startAt: "' + now + '",\n' +
'    endAt: "' + future + '",\n' +
'    status: "live"\n' +
'  },\n';
    } else {
      auctionsStr += '  {\n' +
'    id: "' + auctionId + '",\n' +
'    productId: "' + id + '",\n' +
'    auctionType: "descending",\n' +
'    startPrice: ' + startPrice + ',\n' +
'    currentPrice: ' + currentPrice + ',\n' +
'    floorPrice: ' + Math.floor(startPrice * 0.5) + ',\n' +
'    decrementAmount: 1000,\n' +
'    decrementInterval: 3600,\n' +
'    startAt: "' + now + '",\n' +
'    endAt: "' + future + '",\n' +
'    status: "live"\n' +
'  },\n';
    }
    counter++;
  });
}

productsStr += '];\n';
auctionsStr += '];\n';

const existingData = fs.readFileSync('src/data/mockData.ts', 'utf8');
fs.writeFileSync('src/data/mockData.ts', existingData + productsStr + '\n' + auctionsStr);
console.log('Finished appending 80 products and auctions.');

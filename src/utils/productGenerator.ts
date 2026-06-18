import { Product } from '../data/mockData';

// Pools of naming data for POP Culture
const POP_NAMES: Record<string, string[]> = {
  '빈티지토이': [
    '1980년대 미미의 집 오리지널 풀세트 정품',
    '우주보안관 장고 오리지널 양철 장난감',
    '태권V 복각판 다이캐스트 한정판 로보트',
    '1995년 토이스토리 버즈 라이트이어 오리지널 띵토이',
    '일본 하라주쿠 빈티지 테디베어 한정 에디션',
    '독일 슈타이프 클래식 봉제 인형 리미티드',
    '포켓몬스터 1세대 수동 팽이 스타터 세트',
    '고전 마법소녀 셀러문 요술봉 작동완구 세트',
    '추억의 국산 아카데미 과학 무선 조종 탱크',
    'vintage 다카라 변신 로봇 고전 프라모델'
  ],
  '피규어': [
    '원피스 아카이브 메가하우스 한정판 조로 백화 에디션',
    '에반게리온 초호기 리얼 그레이드 한정 메탈릭 도색완성',
    '포켓몬 테라리움 컬렉션 스페셜 에디션 전 6종 피규어',
    '귀멸의 칼날 렌고쿠 쿄쥬로 아닐플렉스 한정 1/8 스케일',
    '아이언맨 마크85 다이캐스트 핫토이 최고컨디션 피규어',
    '짱구는 못말려 거대 액션가면 소프비 한정 피규어',
    '센과 치히로 가오나시 정품 태엽 구동 오르골',
    '베어브릭 1000% 디즈니 토이스토리 우디 스페셜 피규어',
    '하츠네 미쿠 심포니 한정 하이 스케일 피규어',
    '드래곤볼 제일복권 라스트원상 골든 프리저 디오라마'
  ],
  '트레이딩카드': [
    '유희왕 삼환신 프리즈마틱 시크릿 레어 컬렉션',
    '포켓몬 카드 25주년 골든 박스 스페셜 패키지',
    '매직 더 개더링 (MTG) 영문 레어 포일 카드 무더기',
    '디지몬 카드 전설의 로얄나이츠 골드 프레임 덱',
    '유희왕 푸른 눈의 백룡 레전더리 초기 울트라 레어 카드',
    '포켓몬 리자몽 VMAX SSR 샤이니스타 특전 카드',
    '원피스 카드 게임 1주년 뮤 오리지널 정품 보드',
    '스파이더맨 마블 코믹스 오리지널 스케치 인서트 카드',
    '포켓몬 뮤츠 EX 이치방 스페셜 스페셜티 카드',
    '유희왕 블매걸 오리지널 시크릿 에디션 스탠다드'
  ],
  '아이돌 포카': [
    '아이브 장원영 미공개 팬사인회 수지 특전 포토카드',
    '뉴진스 민지 오리지널 포니테일 버니즈 1기 스페셜 포카',
    '방탄소년단 BTS 정국 골든 솔로 에라 공식 친필 포카',
    '세븐틴 호시 오리지널 스페셜 팬미팅 특권 포토카드',
    '에스파 카리나 드라마 앨범 미공개 럭키드로우 포카',
    '르세라핌 김채원 피어나 공식 비하인드 독점 홀로그램 포카',
    '블랙핑크 제니 헤라 미공개 브랜드 앰버서더 스페셜 세트',
    '트와이스 사나 시그널 스페셜 샵 특전 투명 포카',
    '레드벨벳 아이린 피카부 공식 홀로그램 티켓 특전',
    'NCT 재현 미공개 럭키드로우 프리미엄 보존 포토카드'
  ],
  '굿즈': [
    '세일러문 오리지널 미라클 로망스 한정 화장품 파우치',
    '귀멸의 칼날 무한열차 에디션 공식 아트북 & 캔배지 세트',
    '신세기 에반게리온 네르프 공식 엠블럼 올인원 백팩',
    '이웃집 토토로 지브리 오리지널 도자기 식기 럭셔리 세트',
    '슬램덩크 극장판 공식 서태웅 피규어 & 키링 단독 패키지',
    '포켓몬 미개봉 공식 잠만보 메가 안대 굿즈',
    '해리포터 그린고트 은행 한정 금화 복각 키링 세트',
    '스튜디오 지브리 하울의 움직이는 성 한정 보석 보석함',
    '마블 어벤져스 정품 타노스 건틀렛 실물 주조 키링',
    '스타워즈 다스베이더 정품 사운드 광선검 레플리카'
  ]
};

// Pools of naming data for SPORTS
const SPORTS_NAMES: Record<string, string[]> = {
  '스포츠카드': [
    '루카 돈치치 2018 파니니 프리즘 루키 실버 그레이딩 카드',
    '르브론 제임스 시그니처 크롬 고등급 리미티드 패키지',
    '쇼헤이 오타니 레전더리 투타겸업 기념 인서트 루키 카드',
    '코비 브라이언트 2003 탑스 크롬 레트로 콜렉션 카드',
    '손흥민 파니니 돈러스 로드 투 카타르 골드 사인 카드',
    '리오넬 메시 2014 월드컵 프리즘 블루 리플랙터 레어',
    '크리스티아누 호날두 맨유 시절 스페셜 플래티넘 루키',
    '마이클 조던 어퍼덱 클래식 골드 메탈릭 카드',
    '이강인 PSG 이적 기념 파니니 오토그래프 한정 카드',
    '스테판 커리 워리어스 레전드 스리포인트 스페셜 로드'
  ],
  '유니폼/의류 굿즈': [
    '리오넬 메시 바르셀로나 2015 챔피언스리그 결승 실착 레플리카',
    '손흥민 토트넘 홋스퍼 친필사인 22/23 시즌 공식 홈 저지',
    '르브론 제임스 LA 레이커스 시그니처 챔피언 트레이닝 스타 저지',
    '지네딘 지단 레알 마드리드 갈락티코 1기 시절 귀중 오리지널 유니폼',
    '김연아 피겨 스케이팅 주니어 세계선수권 훈련용 오리지널 스웨터',
    '스티븐 제라드 리버풀 안필드 이별 영웅 헌정 사인 유니폼',
    '티에리 앙리 아스날 무패우승 2004 하이버리 한정 기념 저지',
    '티에리 프랑스 대표팀 1998 월드컵 영광 오리지널 유니폼',
    '마이클 조던 95시즌 복귀전 이스턴 올스타 한정 레트로 저지',
    '페이커 이상혁 T1 트레블 영광 서머리그 한정 시그니처 유니폼'
  ],
  '운동화': [
    '나이키 에어 조던 1 레트로 하이 OG 시카고 2015 미개봉 데드스탁',
    '아디다스 이지부스트 350 V2 지브라 오리지널 초판 박스 풀셋',
    '나이키 SB 덩크 로우 오리지널 트래비스 스캇 스페셜 팩',
    '나이키 에어맥스 97 실버 불릿 클래식 미착용 스니커즈',
    '뉴발란스 992 그레이 잡스 에디션 오리지널 데드스탁 소장용',
    '나이키 에어포스 1 로우 피스마이너스원 파라노이즈 파트 1',
    '아식스 오니츠카타이거 빈티지 킬빌 옐로우 리미티드 스니커즈',
    '에어 조던 11 레트로 브레드 미착용 실물 소장 패키지',
    '아디다스 삼바 오리지널 빈티지 독일 카라멜 슈즈',
    '미즈노 클래식 천연가죽 축구화 카와사키 한정 스니커즈'
  ],
  '사인볼/공': [
    '펠레 (Pele) 브라질 국가대표 은퇴 기념 친필 사인 축구공',
    '쇼헤이 오타니 MLB 정규 시즌 리얼 게임 사용 사인 가죽 야구공',
    '스테판 커리 골든스테이트 오토그래프 올스타 공인 농구공',
    '손흥민 국가대표 센추리클럽 가입 전설 친필 사인 공인구',
    '류현진 다저스 95마일 광속구 기록 친필 마킹 박스 사인볼',
    '박지성 2002 월드컵 포르투갈전 발리슛 기념 친필 사인구',
    '타이거 우즈 마스터스 토너먼트 우승 타이틀리스트 친필 사인 골프공',
    '김연경 배구 국가대표 세계 올림픽 전설 친필 사인 미카사 배구공',
    '리오넬 메시 월드컵 영광 기념 엠블럼 친필 사인 미니볼',
    '차범근 분데스리가 시절 가치 갈망 친필 사인 역사 레트로 축구선물'
  ],
  '스포츠 굿즈': [
    '맨체스터 유나이티드 올드 트래포드 경기장 아크릴 디오라마 브릭',
    '마이클 조던 시카고불스 우승 반지 레플리카 6종 세트 럭셔리 케이스',
    '포뮬러 1 (F1) 레드불 레이싱 오리지널 타이어 조각 컬렉티블 소품',
    '2002 한일월드컵 공식 피파 라이선스 우승컵 세라믹 미니어처 프레임',
    '손흥민 이달의 선수상 아시아 무대 최초 트로피 레플리카 굿즈',
    '박찬호 메이저리그 최초의 완봉승 티켓 원본 슬리브 액자 보존판',
    '전설의 투수 선동열 해태타이거즈 공식 무패 행진 기념 타올 엠블럼',
    '시카고 불스 우승 연맹 파니니 100주년 한정 핀 배지 패키지',
    '페라리 F1 피트크루 오리지널 한정 가방 메신저백 굿즈',
    '엘에이 다저스 류현진 올스타 무대 실버 스페셜 주조 기념 주화'
  ]
};

// Pools of naming data for ANALOG
const ANALOG_NAMES: Record<string, string[]> = {
  '희귀 LP/음반': [
    '핑크 플로이드 (Pink Floyd) The Dark Side of the Moon 오리지널 초판 LP',
    '유재하 1집 ‘사랑하기 때문에’ 1987년 서라벌레코드 정품 초판 오리지널 LP',
    '마이클 잭슨 Thriller 1982년 영문 오리지널 게이트폴드 한정 LP',
    '김광석 4집 ‘서른 즈음에’ 1994년 희소 정반 LP 최고등급 LP',
    '데이비드 보위 (David Bowie) 오리지널 초판 픽처 바이닐 리미티드 에디션',
    '퀸 (Queen) A Night at the Opera 1975년 영국 EMI 오리지널 프레스 LP',
    '신중현과 엽전들 1집 1974년 지구레코드 기념 가치 고음반',
    '체트 베이커 (Chet Baker) Chet Is Back 1962 이탈리아 RCA 바디 LP',
    '들국화 1집 ‘행진’ 1985년 오리지널 초판 바이닐 게이트폴드 소장용',
    '너바나 (Nirvana) Nevermind 1991 오리지널 블루스 모던 프레스 헤리티지'
  ],
  '빈티지 카메라': [
    '롤라이플렉스 (Rolleiflex) 2.8F 중형 이안반사 하이 클래스 필름카메라',
    '하셀브라드 (Hasselblad) 500C/M 수동 바디 + 80mm 자이스 플라나 렌즈',
    '미놀타 (Minolta) X-700 클래식 실버 레트로 렌즈 풀박스 패키지',
    '콘탁스 (Contax) T2 티타늄 실버 최고명기 레트로 컴팩트 자동카메라',
    '올림푸스 (Olympus) OM-1 블랙 오리지널 빈티지 50mm 수동렌즈 세트',
    '라이카 (Leica) IIIf 1951년 바디 바르낙 복고식 사운드 스태프 카메라',
    '캐논 (Canon) F-1 레이크 플래시드 동계 올림픽 영광 한정 SLR 바디',
    '폴라로이드 SX-70 오리지널 브라운 세틀 가죽 빈티지 즉석카메라',
    '니콘 (Nikon) FM2 오리지널 황동 수동 카메라 정품 바디 최고점',
    '야시카 (Yashica) Electro 35 GSN 필름카메라 골드 버튼 킷'
  ],
  '화폐': [
    '조선시대 상평통보 당백전 오리지널 유광 보존 통보 엽전',
    '1982년 최초 발행 주화 500원 미사용 고광택 수집용 아크릴 보증판',
    '대한민국 오백원 구권 지폐 미사용 극미급 일련번호 연번 세트',
    '고대 로마 제국 아우구스투스 황제 오리지널 실버 데나리우스 주화',
    '미국 1881년 모건 실버 달러 고등급 은화 PSA 인증서',
    '1970년 대한민국 오십원 초기 동전 극최상 등급 수집 캡슐',
    '구한말 대동전 오리지널 귀중 청동 주화 고화폐',
    '영국 엘리자베스 2세 대관식 골드 실버 기념 금화 케이스셋',
    '덕수궁 주조 고화폐 은표 명품 박스 콜렉트',
    '일제강점기 미사용한 조선은행 백원권 지폐 희귀본'
  ],
  '우표': [
    '1884년 우정총국 개국 기념 문위우표 5문/10문 오리지널 실물',
    '대한민국 제1대 대통령 취임 기념 우표 전지 무보수 진공 앨범',
    '영국 1840년 월드 최초 페니 블랙(Penny Black) 1페니 우표',
    '대한제국 독수리 문양 스페셜 미사용 기념 우표',
    '1988 서울 올림픽 공식 개막식 기념 우표 전지 초판',
    '중국 문화대혁명 마오쩌둥 붉은 우표 전설 한정 프레임',
    '조선 우표 제1호 고전 한정 수집 바인더',
    '우주선 아폴로 11호 달 착륙 기념 미우주국 한정 우표 실물',
    '세계 희귀 조류 특별 우표 12종 골드 프레임 박스',
    '한국 철도 개통 100주년 특별 리미티드 철제 우표 패키지'
  ],
  '로스트미디어': [
    '미출시 서태지와 아이들 1992년 비공개 테크노 리믹스 릴테이프 데모',
    '1980년대 대한뉴스 검열 삭제 본본 16mm 셀룰로이드 필름 영화',
    '고전 마징가Z 대 비디오 대마왕 희귀 미출시 VHS 한정 비디오테이프',
    '90년대 유명 PC 미소녀 연애 시뮬레이션 원본 골드 디스켓 소장용',
    '초기 무성 영화 원본 흑백 한정 영사기 테이프 비하인드',
    '1960년대 한국 고전 가요 미발매 원본 카세트 라디오 릴',
    'KBS 공식 아카이브 누락 초기 만화영화 사운드트랙 녹음 데모테이프',
    '아이돌 데뷔 전 비공개 쇼케이스 모니터링용 홈비디오 VHS 팩',
    '레트로 아케이드 오리지널 개발용 한정 소스 ROM 침 플레이트',
    '기밀 취급 폐기본 동독 군사 비밀 레이더 가이딩 기록 마그네틱'
  ],
  '레트로': [
    '소니 (Sony) 오리지널 워크맨 WM-2 레트로 클래식 작동 워크맨',
    '닌텐도 패미컴 오리지널 초기형 패키지 팩 5개 세트 100% 작동',
    '샤프 (Sharp) 부블박스 클래식 대형 휴대 카세트 라디오 1985',
    '고전 내셔널 파나소닉 진공관 라디오 우드 에디션 1968',
    '매킨토시 (Macintosh) Classic II 전원 정상 고전 컴퓨터 패키지',
    '닌텐도 게임보이 컬러 스페셜 아날로그 포켓 투명 에디션 팩셋',
    '세가 (Sega) 새턴 레트로 타이틀 10종 포함 일본 정품 콘솔 기기',
    '애플 아이팟 포토 1세대 휠버전 미착용 보호필름 보관 기기',
    '금성사 골드스타 오리지널 컬러 미니 CRT 브라운관 텔레비전 📺',
    '아이와 (Aiwa) 고음질 카세트 레코더 복고 스타일 리얼 팩지'
  ]
};

// Seller nickname pool
const SELLERS = [
  '앤틱가디언', '수집광장', '레트로빌리지', '타임머신샵',
  '덕질연구소', '뮤지엄프로', '한정판대장', '클래식바람',
  '레어러브', '콜렉터하우스', '메모리빈티지', '헤리티지딜러'
];

const REAL_IMAGES: Record<string, string[]> = {
  '빈티지토이': [
    'https://images.unsplash.com/photo-1533227268428-f9ed0900f953?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596460107916-430662021049?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800&auto=format&fit=crop&q=80'
  ],
  '피규어': [
    'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549316131-0cedaa48408a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80'
  ],
  '트레이딩카드': [
    'https://images.unsplash.com/photo-1611032598370-5807afbba129?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613771404724-17c1e83aef30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601556121511-062cf4d54629?w=800&auto=format&fit=crop&q=80'
  ],
  '아이돌 포카': [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614036417651-efe5912149d8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  ],
  '굿즈': [
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
  ],
  '스포츠카드': [
    'https://images.unsplash.com/photo-1621570169561-0c2a2e193ee1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621570273826-621598f86f8a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621570169695-0eeb9bb4428d?w=800&auto=format&fit=crop&q=80'
  ],
  '유니폼/의류 굿즈': [
    'https://images.unsplash.com/photo-1508244751656-764baa913aa5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&auto=format&fit=crop&q=80'
  ],
  '운동화': [
    'https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
  ],
  '사인볼/공': [
    'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519861531473-920026eca9f8?w=800&auto=format&fit=crop&q=80'
  ],
  '스포츠 굿즈': [
    'https://images.unsplash.com/photo-1532585250325-e5da48d3eb10?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506044738734-7db3dfeb0b0d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&auto=format&fit=crop&q=80'
  ],
  '희귀 LP/음반': [
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539628399213-d6aa89c93074?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80'
  ],
  '빈티지 카메라': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510127852285-a33dd1f487c1?w=800&auto=format&fit=crop&q=80'
  ],
  '화폐': [
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587372439169-c6da9d1c8258?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580519542036-ed47f3ca612a?w=800&auto=format&fit=crop&q=80'
  ],
  '우표': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop&q=80'
  ],
  '로스트미디어': [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?w=800&auto=format&fit=crop&q=80'
  ],
  '레트로': [
    'https://images.unsplash.com/photo-1550418290-a8d86ad674a6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585250020473-b295bc15b2e6?w=800&auto=format&fit=crop&q=80'
  ]
};

function generateTrendData(currentPrice: number): { date: string; price: number; volume: number }[] {
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

export function generateMockProducts(): Product[] {
  const products: Product[] = [];
  const now = new Date();

  // Create products for each group to ensure 3 items per subcategory (Total = 48)
  const groups: ('POP' | 'SPORTS' | 'ANALOG')[] = ['POP', 'SPORTS', 'ANALOG'];

  let idCounter = 100;

  groups.forEach((group) => {
    const subNames = group === 'POP' ? POP_NAMES : (group === 'SPORTS' ? SPORTS_NAMES : ANALOG_NAMES);
    const subCategories = Object.keys(subNames);

    subCategories.forEach((categoryName) => {
      const titles = subNames[categoryName];
      
      for (let i = 0; i < 3; i++) {
        const titleBase = titles[i % titles.length];
        const conditions = [
          '최상급 S급 보전상태', '미사용 오리지널 패키지', '리미티드 보증 증서 필속'
        ];
        const condition = conditions[i % conditions.length];
        const title = `${titleBase} [${condition}]`;

        const startPrice = Math.floor((Math.random() * 80 + 3) * 10) * 1000;
        const bidCount = Math.floor(Math.random() * 15) + 1;
        const bidIncrement = Math.floor((Math.random() * 15 + 5) * 10) * 100;
        const currentPrice = startPrice + (bidCount * bidIncrement);
        
        let buyNowPrice;
        if (i === 0) {
          // Exactly 1 item per subcategory (the first one) has Buy Now
          buyNowPrice = Math.floor(currentPrice * 1.4 / 1000) * 1000;
        }

        const likeCount = Math.floor(Math.random() * 85) + 3;

        let hoursToAdd = 0;
        let minutesToAdd = 0;

        if (i === 0) {
          minutesToAdd = 15;
        } else if (i === 1) {
          hoursToAdd = 2;
        } else {
          hoursToAdd = 48;
        }

        const startAt = new Date(now.getTime() - (Math.random() * 48 * 60 * 60 * 1000)).toISOString();
        const endAt = new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000) + (minutesToAdd * 60 * 1000)).toISOString();

        const groupTag = group.toLowerCase();
        const catTag = categoryName.replace(/\//g, '').replace(/\s+/g, '');
        const tags = [groupTag, catTag, '실시간', '소장가치'];

        const sellerNickname = SELLERS[(idCounter * 7) % SELLERS.length];
        const sellerRating = parseFloat((4.5 + (Math.random() * 0.5)).toFixed(1));

        const description = `전 세계 매니아와 대가들의 열정이 어린 ${group} 계열 ${categoryName} 소장 가치 극대화 전설 희귀 파트입니다. 수집 동반자의 안락한 주방 및 장식장 금고에서 철저하게 실내 조도 및 온습도의 전방위 제어를 통해 장기 안착시킨 제품입니다. 실물 구동 점검 및 그레이딩 검체를 통과하여 수집용으로 극강의 컨디션을 고스란히 영접하실 수 있습니다. 가치를 아시는 진정한 입찰 유저 패밀리의 아레나 도전을 대환영합니다.`;

        const imageList = REAL_IMAGES[categoryName];
        const image = imageList && imageList[i % imageList.length]
          ? imageList[i % imageList.length]
          : `gradient://${group}/${categoryName}/${i + 1}`;

        products.push({
          id: `gen-prod-${group.toLowerCase()}-${idCounter++}`,
          title,
          categoryGroup: group,
          categoryName,
          image,
          startPrice,
          currentPrice,
          buyNowPrice,
          isInstantDealAvailable: buyNowPrice !== undefined,
          bidCount,
          likeCount,
          startAt,
          endAt,
          auctionType: 'ascending',
          status: 'live',
          tags,
          description,
          sellerNickname,
          sellerRating,
          trendData: generateTrendData(currentPrice)
        });
      }
    });
  });

  return products;
}


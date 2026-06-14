export interface Newsletter {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  status?: string;
}

export interface PageContent {
  id: string;
  sub_page_id: string;
  body: string;
  sort_order: number;
}

export interface SubPage {
  id: string;
  newsletter_id: string;
  title: string;
  page_number: number;
  category: string;
  created_at?: string;
  newsletters?: Newsletter | null; // Joined relation from Supabase
  page_contents: PageContent[];    // Joined relation from Supabase
  municipality_slug?: string;      // Multi-tenant slug
}

export const mockNewsletterPages: SubPage[] = [
  // HAENAM PAGES (Orange Theme)
  {
    id: "page-1",
    newsletter_id: "newsletter-1",
    title: "구글 딥마인드, 차세대 다중언어 AI 모델 발표",
    page_number: 1,
    category: "인공지능 뉴스",
    municipality_slug: "haenam",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "해남군 소식지",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c1", sub_page_id: "page-1", body: "구글 딥마인드가 새로운 구조의 다중언어 추론 AI 모델을 전격 공개했습니다. 이번 모델은 복잡한 다단계 논리 연산과 소스코드 제너레이션에서 큰 도약을 이뤄냈습니다.", sort_order: 1 },
      { id: "c2", sub_page_id: "page-1", body: "이전 세대 모델 대비 추론 속도가 40% 이상 향상되었으며, 특히 자연어 명령을 기반으로 실시간으로 애플리케이션 프로토타입을 빌드하는 기능이 포함되어 현업 개발자들의 뜨거운 관심을 받고 있습니다.", sort_order: 2 },
      { id: "c3", sub_page_id: "page-1", body: "주요 사양 및 이점:\n• 컨텍스트 윈도우 200만 토큰 지원\n• 자체 오류 디버깅(Self-Correction) 정확도 89% 달성\n• 50개 이상의 프로그래밍 언어 신속 분석", sort_order: 3 }
    ]
  },
  {
    id: "page-2",
    newsletter_id: "newsletter-1",
    title: "현대 웹 개발 트렌드: Next.js와 SSR의 성숙",
    page_number: 2,
    category: "테크 동향",
    municipality_slug: "haenam",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "해남군 소식지",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c4", sub_page_id: "page-2", body: "2026년 현재 프론트엔드 생태계에서 Next.js App Router는 확고부동한 표준으로 정착했습니다. 리액트 서버 컴포넌트(RSC) 모델은 데이터 페칭의 병목 현상을 해결해 줍니다.", sort_order: 1 },
      { id: "c5", sub_page_id: "page-2", body: "특히 최근 도입된 부분 사전 렌더링(PPR, Partial Prerendering) 기술은 정적 쉘을 즉시 로드하면서 동적 콘텐츠는 스트리밍 형태로 전송하여 최상의 사용자 경험을 제공합니다.", sort_order: 2 },
      { id: "c6", sub_page_id: "page-2", body: "클라이언트 사이드 자바스크립트 번들 크기가 평균 35% 감소하면서 모바일 환경에서의 첫 페이지 로딩(LCP) 지표가 혁신적으로 향상되었습니다.", sort_order: 3 }
    ]
  },
  {
    id: "page-3",
    newsletter_id: "newsletter-1",
    title: "에이전트 중심 코딩의 도래",
    page_number: 3,
    category: "인공지능 뉴스",
    municipality_slug: "haenam",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "해남군 소식지",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c7", sub_page_id: "page-3", body: "단순한 코드 자동완성을 뛰어넘어 기획, 아키텍처 설계, 구현, 디버깅까지 종합적으로 연동해 수행하는 '에이전트형 AI 코딩 비서'가 완전히 안착했습니다.", sort_order: 1 },
      { id: "c8", sub_page_id: "page-3", body: "개발자는 더 이상 반복적이고 기계적인 코딩에 시간을 소모하지 않고, 전체 시스템 아키텍처의 설계 검토와 의사결정에 더 많은 역량을 쏟고 있습니다. 에이전트 협동 모델의 시대가 열린 것입니다.", sort_order: 2 }
    ]
  },
  {
    id: "page-4",
    newsletter_id: "newsletter-1",
    title: "Supabase와 Next.js 실시간 데이터 동기화",
    page_number: 4,
    category: "개발 팁",
    municipality_slug: "haenam",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "해남군 소식지",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c9", sub_page_id: "page-4", body: "Supabase는 클라이언트에서 직접 데이터베이스 변경 사항을 리스닝할 수 있는 Realtime API를 제공합니다. 이를 통해 폴링(Polling) 없이 실시간 데이터 연동이 가능합니다.", sort_order: 1 },
      { id: "c10", sub_page_id: "page-4", body: "가장 중요한 것은 Row Level Security (RLS) 설정입니다. RLS 정책을 활성화하지 않은 채 데이터베이스를 프론트엔드에 노출하면 심각한 보안 이슈가 발생할 수 있습니다. 꼭 테이블 설정에서 RLS를 확인하세요.", sort_order: 2 }
    ]
  },
  {
    id: "page-5",
    newsletter_id: "newsletter-1",
    title: "글로벌 개발자 만족도 조사 리포트",
    page_number: 5,
    category: "트렌드 리포트",
    municipality_slug: "haenam",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "해남군 소식지",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c11", sub_page_id: "page-5", body: "최근 발표된 글로벌 개발자 서베이 리포트에 따르면, Backend-as-a-Service(BaaS) 플랫폼 중 Supabase가 88%의 만족도를 달성하며 압도적인 1위를 지켜냈습니다.", sort_order: 1 },
      { id: "c12", sub_page_id: "page-5", body: "가장 주된 이유로는 PostgreSQL 본연의 강력한 릴레이션 지원과 간결하고 일관된 JS SDK 및 편리한 마이그레이션 도구가 꼽혔습니다. 개발자 10명 중 9명은 차기 프로젝트에 도입할 의향을 비췄습니다.", sort_order: 2 }
    ]
  },

  // WANDO PAGES (Green Theme)
  {
    id: "page-w1",
    newsletter_id: "newsletter-2",
    title: "완도군, 대한민국 최초 해양치유센터 본격 가동",
    page_number: 1,
    category: "군정소식",
    municipality_slug: "wando",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-2",
      title: "완도군 소식지",
      description: "완도 명품 바다와 치유 테라피 소식을 전합니다"
    },
    page_contents: [
      { id: "cw1", sub_page_id: "page-w1", body: "전남 완도군에서 청정 바닷물과 해조류, 갯벌 등 해양 자원을 치료와 치유에 활용하는 대한민국 최초의 '해양치유센터'가 본격 가동을 시작했습니다.", sort_order: 1 },
      { id: "cw2", sub_page_id: "page-w1", body: "센터는 해수풀, 머드 테라피실, 해조류 거품 테라피실 등 16개의 현대식 해양치유 테라피 시설을 갖추고 있어 몸과 마음의 피로를 푸는 웰니스 관광객들에게 큰 호응을 얻고 있습니다.", sort_order: 2 },
      { id: "cw3", sub_page_id: "page-w1", body: "주요 시설 특징:\n• 100% 여과된 청정 심층 해수 공급\n• 맞춤형 테라피 관리사 30명 상시 대기\n• 해조류 추출물을 활용한 프리미엄 스킨케어", sort_order: 3 }
    ]
  },
  {
    id: "page-w2",
    newsletter_id: "newsletter-2",
    title: "친환경 ASC 국제 인증 전복, 유럽 수출 판로 개척",
    page_number: 2,
    category: "특산물 뉴스",
    municipality_slug: "wando",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-2",
      title: "완도군 소식지",
      description: "완도 명품 바다와 치유 테라피 소식을 전합니다"
    },
    page_contents: [
      { id: "cw4", sub_page_id: "page-w2", body: "완도산 전복이 친환경 수산물 국제 인증인 ASC(Aquaculture Stewardship Council)를 획득하고 글로벌 시장 공략에 속도를 내고 있습니다.", sort_order: 1 },
      { id: "cw5", sub_page_id: "page-w2", body: "엄격한 친환경 사육 기준과 어장 관리 규격을 통과한 완도 전복은 바이어들의 극찬 속에 이번 달부터 프랑스 및 벨기에 등 서유럽 백화점과 대형 마트 식품관에 수출 공급됩니다.", sort_order: 2 }
    ]
  },
  {
    id: "page-w3",
    newsletter_id: "newsletter-2",
    title: "청산도 슬로길, 유채꽃 만발 '느림의 축제' 개막",
    page_number: 3,
    category: "관광 정보",
    municipality_slug: "wando",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-2",
      title: "완도군 소식지",
      description: "완도 명품 바다와 치유 테라피 소식을 전합니다"
    },
    page_contents: [
      { id: "cw6", sub_page_id: "page-w3", body: "아시아 최초 슬로시티로 지정된 완도군 청산도에서 봄바람을 따라 만발한 노란 유채꽃과 돌담길이 조화를 이루는 '청산도 슬로길 걷기 축제'가 개막했습니다.", sort_order: 1 },
      { id: "cw7", sub_page_id: "page-w3", body: "축제 참가자들은 번잡한 일상을 잠시 멈추고 슬로길 코스를 천천히 걸으며 완도 청정 해안의 비경과 봄꽃 내음을 오감으로 느낄 수 있습니다. 슬로푸드 체험 등 다채로운 프로그램이 마련되어 있습니다.", sort_order: 2 }
    ]
  },

  // JINDO PAGES (Blue Theme)
  {
    id: "page-j1",
    newsletter_id: "newsletter-3",
    title: "진도 신비의 바닷길 축제, 역대 최다 관람객 유치",
    page_number: 1,
    category: "축제 뉴스",
    municipality_slug: "jindo",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-3",
      title: "진도군 소식지",
      description: "바다의 기적과 유서 깊은 예향 진도의 소식을 알립니다"
    },
    page_contents: [
      { id: "cj1", sub_page_id: "page-j1", body: "세계적인 바다 갈라짐 현상인 '진도 신비의 바닷길 축제'가 외국인 관광객을 포함한 역대 최대 인파가 몰린 가운데 성대하게 펼쳐졌습니다.", sort_order: 1 },
      { id: "cj2", sub_page_id: "page-j1", body: "진도 회동리와 모도 사이 약 2km의 바다가 조수 간만의 차로 열리는 장관을 보기 위해 수만 명의 관광객이 횃불을 들고 바닷길을 걸으며 소원을 비는 등 잊지 못할 추억을 새겼습니다.", sort_order: 2 },
      { id: "cj3", sub_page_id: "page-j1", body: "올해 축제 하이라이트:\n• 글로벌 민속 예술 페스티벌 동시 진행\n• 야간 바닷길 미디어파사드 연출\n• 진도 특산품(홍주, 울금) 시음 부스 확대", sort_order: 3 }
    ]
  },
  {
    id: "page-j2",
    newsletter_id: "newsletter-3",
    title: "천연기념물 제53호 진돗개 명품화 사업 속도",
    page_number: 2,
    category: "문화재 정보",
    municipality_slug: "jindo",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-3",
      title: "진도군 소식지",
      description: "바다의 기적과 유서 깊은 예향 진도의 소식을 알립니다"
    },
    page_contents: [
      { id: "cj4", sub_page_id: "page-j2", body: "대한민국 대표 천연기념물인 진돗개의 품종 표준 보존과 세계적인 위상 강화를 위해 진도군에 대규모 '진돗개 테마파크 교육 연수원'이 신축 개관했습니다.", sort_order: 1 },
      { id: "cj5", sub_page_id: "page-j2", body: "연수원에서는 진돗개의 우수한 인지 지능 연구, 복종 훈련 체험, 해외 브리더 초청 학술 세미나 등을 운영하여 진돗개를 전 세계 애견인들에게 널리 홍보할 예정입니다.", sort_order: 2 }
    ]
  },
  {
    id: "page-j3",
    newsletter_id: "newsletter-3",
    title: "명량대첩의 격랑, 울돌목 해상케이블카 누적 탑승객 200만 돌파",
    page_number: 3,
    category: "도정 소식",
    municipality_slug: "jindo",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-3",
      title: "진도군 소식지",
      description: "바다의 기적과 유서 깊은 예향 진도의 소식을 알립니다"
    },
    page_contents: [
      { id: "cj6", sub_page_id: "page-j3", body: "임진왜란 명량대첩의 거센 물살이 흐르는 역사적 격전지 울돌목 상공을 가로지르는 해상케이블카가 누적 탑승객 200만 명을 돌파하며 대표 랜드마크로 자리매김했습니다.", sort_order: 1 },
      { id: "cj7", sub_page_id: "page-j3", body: "공중에 매달린 투명한 유리 바닥 너머로 휘몰아치는 울돌목의 거대한 회오리 물살을 발아래에서 실시간으로 조망할 수 있어, 스릴과 역사 교육을 동시에 선사하는 독보적인 코스로 자리 잡았습니다.", sort_order: 2 }
    ]
  }
];

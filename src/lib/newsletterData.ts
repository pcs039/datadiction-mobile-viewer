export interface Newsletter {
  id: string;
  title: string;
  description: string;
  created_at?: string;
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
}

export const mockNewsletterPages: SubPage[] = [
  {
    id: "page-1",
    newsletter_id: "newsletter-1",
    title: "구글 딥마인드, 차세대 다중언어 AI 모델 발표",
    page_number: 1,
    category: "인공지능 뉴스",
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "DataDiction Tech Weekly",
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
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "DataDiction Tech Weekly",
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
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "DataDiction Tech Weekly",
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
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "DataDiction Tech Weekly",
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
    created_at: "2026-06-14T12:00:00Z",
    newsletters: {
      id: "newsletter-1",
      title: "DataDiction Tech Weekly",
      description: "매주 전하는 글로벌 테크 & AI 핵심 트렌드 소식지"
    },
    page_contents: [
      { id: "c11", sub_page_id: "page-5", body: "최근 발표된 글로벌 개발자 서베이 리포트에 따르면, Backend-as-a-Service(BaaS) 플랫폼 중 Supabase가 88%의 만족도를 달성하며 압도적인 1위를 지켜냈습니다.", sort_order: 1 },
      { id: "c12", sub_page_id: "page-5", body: "가장 주된 이유로는 PostgreSQL 본연의 강력한 릴레이션 지원과 간결하고 일관된 JS SDK 및 편리한 마이그레이션 도구가 꼽혔습니다. 개발자 10명 중 9명은 차기 프로젝트에 도입할 의향을 비췄습니다.", sort_order: 2 }
    ]
  }
];

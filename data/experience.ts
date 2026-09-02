export interface ExperienceProject {
  id: string;
  title: string;
  audience: string;
  summary: string;
  stack: string[];
  contribution: string[];
  caseStudies: string[];
  products?: { title: string; description: string; features: string[] }[];
}

export const career = {
  company: "㈜폴리큐브",
  role: "Frontend Developer",
  period: "2025.10–현재",
  summary: "광고·리워드 WebView 서비스와 사내 공통 기능, 운영 도구를 개발하고 있습니다.",
};

// 고객사명·내부 namespace는 공개 승인을 받기 전까지 이 데이터에 넣지 않습니다.
export const experienceProjects: ExperienceProject[] = [
  {
    id: "reward-content",
    title: "고객향 리워드·콘텐츠 WebView 서비스",
    audience: "대형 포인트 앱의 일반 사용자",
    summary: "미션, 출석, 보상, 가챠, 쿠폰, 콘텐츠와 광고를 제공하는 고객향 WebView 서비스 2종을 개발했습니다.",
    stack: ["React", "TypeScript", "Stackflow", "Three.js", "Panda CSS", "Vitest", "WebView Bridge"],
    contribution: [
      "preload와 복수 소비자가 호출하는 동일 API를 key별 in-flight Promise로 공유하고, 데이터 성격별 runtime cache를 적용했습니다.",
      "동일 조건의 이전·이후 커밋을 로컬에서 재현해 콘텐츠의 중복 fetch가 줄어드는지 검증했습니다.",
      "콘텐츠 응답은 재사용하되 변경 가능한 보상·미션 상태는 동시 요청만 공유하고 완료 후 재조회는 유지했습니다.",
      "서비스 워커가 제어하지 않는 iOS WebView에 revision 기반 Window CacheStorage와 HTTP 캐시 fallback을 구성하고, 실제 재진입 로그에서 모델 응답의 재사용을 확인했습니다.",
      "Native callback 누락으로 남는 pending에 앱 복귀 기준 복구 타이머를 적용하고, timeout 뒤 callback이 현재 결과 listener에 다시 전달되지 않도록 했습니다.",
    ],
    caseStudies: ["api-request-sharing-cache", "ios-webview-model-cache", "native-ad-lifecycle-config"],
  },
  {
    id: "common-interface",
    title: "사내 공통 광고 실행·WebView 인터페이스",
    audience: "고객향 앱을 개발하는 사내 개발자",
    summary: "여러 앱이 사용하는 Native·SSP Bridge, 광고 배너 runtime과 Config 계약을 개발했습니다.",
    stack: ["TypeScript", "React", "Native Bridge", "Config", "Vitest"],
    contribution: [
      "QA용 interface test 앱에서 검증하던 Native·SSP Bridge를 공통 패키지로 분리했습니다.",
      "iOS·Android·Web runtime 감지, 명령 전달과 callback 차이를 공통 인터페이스로 정규화했습니다.",
      "공통 패키지는 runtime·command·callback 계약을 담당하고, 보상과 화면 상태는 각 앱이 소유하도록 책임을 나눴습니다.",
      "기존 광고 실행 계약의 fallback을 후보 ID와 개별 target을 가진 그래프로 확장했습니다.",
      "누락 참조·순환 관계·확률 합계·provider별 필수 target을 공통 parser와 Admin 저장 단계에서 검증했습니다.",
      "런타임의 기존 Config 읽기는 유지하면서 신규 Admin 저장 계약을 schemaVersion: 1로 분리했습니다. 자동 마이그레이션까지 제공한 것은 아닙니다.",
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
  {
    id: "customer-events",
    title: "고객사 광고·게임형 이벤트 서비스",
    audience: "고객사 포인트 앱의 일반 사용자",
    summary: "포인트 앱 WebView에서 동작하는 광고·리워드·게임형 이벤트 서비스 5종을 개발했습니다.",
    stack: ["Preact", "TypeScript", "Vite", "JSP", "WebView"],
    contribution: [
      "기존 JSP 진입점을 유지하면서 UI·API·광고·Bridge 로직을 Vite 기반 서비스 entry로 분리했습니다.",
      "공통 layout과 runtime을 사용하고 서비스별 게임·asset·entry를 나누는 multi-entry 구조를 구성했습니다.",
      "CTA·가챠·게임 단계에 분산된 광고 정책을 type / probability / fallback Config로 분리했습니다.",
      "원격 Config나 storage 접근 실패에도 cache 또는 기본 schedule로 사용자 흐름을 이어가는 복구 경로를 구현했습니다.",
      "중첩 popup에서 Android back event가 WebView 종료로 바로 전달되지 않도록 LIFO handler stack을 적용했습니다.",
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
  {
    id: "operations",
    title: "사내 운영 도구",
    audience: "서비스 운영자와 광고 데이터 담당자",
    summary: "설정 변경의 실수를 제어하는 Config Admin과, provider별 파일을 함께 살펴보는 브라우저 기반 광고 분석 도구를 구현했습니다.",
    stack: ["React", "TypeScript", "JSON", "XLSX", "Client-side processing"],
    contribution: [
      "설정 편집 UI와 저장 계약을 분리해, 입력 검증과 실제 저장 단계의 안전장치를 함께 다뤘습니다.",
      "광고 분석 도구는 이틀간 구현한 내부 도구입니다. 장기간 운영한 광고 분석 플랫폼으로 표현하지 않습니다.",
    ],
    products: [
      { title: "공통 서비스 Config Admin", description: "서비스 Config 조회·생성·수정과 JSON·광고 Config 시각 편집을 제공했습니다.", features: ["schema·확률 합계 검증과 조회 전 저장 차단", "dirty-state 보호·중복 요청 lock·production 저장 확인", "POST 성공 후 PATCH 실패를 부분 성공으로 구분"] },
      { title: "광고 데이터 분석 도구", description: "3개 광고 provider의 XLSX를 브라우저에서 파싱하고 column을 공통 모델로 정규화했습니다.", features: ["노출·클릭·수익·CTR·eCPM·fill rate 계산", "서비스·플랫폼·지면·날짜 필터와 차트·상세표·PDF 보고서", "원본 파일을 서버에 업로드하지 않는 client-side 처리"] },
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
];

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
  summary:
    "광고·리워드 WebView 서비스와 사내 공통 기능, 운영 도구를 개발하고 있습니다.",
};

// 고객사명·내부 namespace는 공개 승인을 받기 전까지 이 데이터에 넣지 않습니다.
export const experienceProjects: ExperienceProject[] = [
  {
    id: "reward-content",
    title: "고객향 리워드·콘텐츠 WebView 서비스",
    audience: "대형 포인트 앱의 일반 사용자",
    summary:
      "미션, 출석, 보상, 가챠, 쿠폰, 콘텐츠와 광고를 제공하는 고객향 WebView 서비스 2종을 개발했습니다.",
    stack: [
      "React",
      "TypeScript",
      "Stackflow",
      "Three.js",
      "Panda CSS",
      "Vitest",
      "WebView Bridge",
    ],
    contribution: [
      "사전 로딩과 여러 컴포넌트에서 발생한 같은 API 요청은 진행 중인 Promise를 공유하도록 했습니다. 응답 캐시는 데이터의 변경 주기에 따라 적용했습니다.",
      "동일 조건의 이전·이후 커밋을 로컬에서 재현해 콘텐츠를 중복 조회하는 횟수가 줄어드는지 검증했습니다.",
      "콘텐츠 응답은 재사용하되 변경 가능한 보상·미션 상태는 동시 요청만 공유하고 완료 후 재조회는 유지했습니다.",
      "서비스 워커가 제어하지 않는 iOS WebView에 revision 기반 Window CacheStorage와 HTTP 캐시 대체 경로를 구성하고, 실제 재진입 로그에서 모델 응답의 재사용을 확인했습니다.",
      "네이티브 콜백이 누락돼 대기 상태가 남으면, 앱 복귀 시점부터 복구 타이머를 시작하도록 했습니다. 타임아웃 뒤 도착한 콜백은 현재 요청의 결과 리스너에 다시 전달하지 않도록 했습니다.",
    ],
    caseStudies: [
      "api-request-sharing-cache",
      "ios-webview-model-cache",
      "native-ad-lifecycle-config",
    ],
  },
  {
    id: "common-interface",
    title: "사내 공통 광고 실행·WebView 인터페이스",
    audience: "고객향 앱을 개발하는 사내 개발자",
    summary:
      "여러 앱이 함께 사용하는 네이티브·SSP 브리지와 광고 배너 실행 기능, Config 형식을 개발했습니다.",
    stack: ["TypeScript", "React", "Native Bridge", "Config", "Vitest"],
    contribution: [
      "QA용 인터페이스 테스트 앱에서 검증하던 네이티브·SSP 브리지를 공통 패키지로 분리했습니다.",
      "iOS·Android·웹 실행 환경을 감지하고, 명령 전달과 콜백의 차이를 공통 인터페이스로 정규화했습니다.",
      "실행 환경 감지와 명령·콜백 형식은 공통 패키지에서 관리하고, 보상과 화면 상태는 각 앱에서 처리하도록 나눴습니다.",
      "다음 광고 후보로 넘어가는 구성을 후보 ID와 개별 target을 가진 그래프로 확장했습니다.",
      "누락 참조·순환 관계·확률 합계·광고 제공사별 필수 target을 공통 파서와 관리자 화면의 저장 단계에서 검증했습니다.",
      "런타임은 기존 Config를 계속 읽고, 새 Admin은 schemaVersion: 1 형식만 저장하도록 했습니다. 기존 설정을 자동 변환하는 기능은 포함하지 않았습니다.",
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
  {
    id: "customer-events",
    title: "고객사 광고·게임형 이벤트 서비스",
    audience: "고객사 포인트 앱의 일반 사용자",
    summary:
      "포인트 앱 WebView에서 동작하는 광고·리워드·게임형 이벤트 서비스 5종을 개발했습니다.",
    stack: ["Preact", "TypeScript", "Vite", "JSP", "WebView"],
    contribution: [
      "기존 JSP 진입점을 유지하면서 UI·API·광고·브리지 로직을 Vite 기반 서비스 진입점으로 분리했습니다.",
      "공통 레이아웃과 런타임을 사용하고 서비스별 게임·리소스·진입점을 나누는 다중 진입점 구조를 구성했습니다.",
      "CTA·가챠·게임 단계에 분산된 광고 정책을 type / probability / fallback Config로 분리했습니다.",
      "원격 Config나 저장소 접근에 실패해도 캐시 또는 기본 스케줄로 사용자 흐름을 이어가는 복구 경로를 구현했습니다.",
      "팝업이 중첩됐을 때 Android 뒤로가기 이벤트가 곧바로 WebView를 종료하지 않도록 LIFO 핸들러 스택을 적용했습니다.",
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
  {
    id: "operations",
    title: "사내 운영 도구",
    audience: "서비스 운영자와 광고 데이터 담당자",
    summary:
      "설정값을 검증하는 관리자 화면과, 광고 제공사별 데이터를 비교하는 브라우저 분석 도구를 만들었습니다.",
    stack: ["React", "TypeScript", "JSON", "XLSX", "Client-side processing"],
    contribution: [
      "설정 편집 UI와 저장 형식을 분리해, 입력값을 검증하고 저장 단계에서도 오류를 막도록 했습니다.",
      "3개 광고 제공사의 서로 다른 데이터를 비교하기 위한 브라우저 기반 내부 분석 도구를 구현했습니다.",
    ],
    products: [
      {
        title: "공통 서비스 Config Admin",
        description:
          "서비스 Config 조회·생성·수정과 JSON·광고 Config 시각 편집을 제공했습니다.",
        features: [
          "스키마·확률 합계 검증과 조회 전 저장 차단",
          "저장하지 않은 변경 사항 보호 · 중복 요청 방지 · 운영 환경 저장 전 확인",
          "POST 성공 후 PATCH 실패를 부분 성공으로 구분",
        ],
      },
      {
        title: "광고 데이터 분석 도구",
        description:
          "3개 광고 제공사의 XLSX를 브라우저에서 파싱하고 열을 공통 모델로 정규화했습니다.",
        features: [
          "노출·클릭·수익·CTR·eCPM·fill rate 계산",
          "서비스·플랫폼·지면·날짜 필터와 차트·상세표·PDF 보고서",
          "원본 파일을 서버에 업로드하지 않고 브라우저에서 처리",
        ],
      },
    ],
    caseStudies: ["native-ad-lifecycle-config"],
  },
];

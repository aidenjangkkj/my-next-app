export interface ProjectDetail {
  id: string;
  title: string;
  category: "selected" | "archive";
  period?: string;
  role?: string;
  summary: string;
  problem?: string;
  contribution: string[];
  result: string[];
  limitations: string[];
  techStack: string[];
  github?: string;
  demo?: string;
  relatedCaseStudies: string[];
  links?: { label: string; href: string }[];
}

const archiveDefaults = {
  category: "archive" as const,
  summary: "이전에 학습과 실험을 위해 만든 개인 프로젝트입니다.",
  contribution: [],
  result: [],
  limitations: [],
  techStack: [],
  relatedCaseStudies: [],
};

export const projects: ProjectDetail[] = [
  {
    id: "dashboard",
    title: "Emissions Dashboard",
    category: "selected",
    role: "개인 프로젝트 · 대시보드 UI와 데이터 흐름 구현",
    summary: "국가·기업별 샘플 배출량을 여러 차트로 살펴볼 수 있는 대시보드입니다.",
    problem: "배출량의 추이·구성·목표를 여러 관점으로 보여주면서, 데이터 조회와 메모 저장의 로딩·실패 상태를 구분할 필요가 있었습니다.",
    contribution: [
      "월별 추이, 에너지원 비중, 누적 막대, Top N, 목표 대비 실제 차트를 구성하고 단위 변환과 기간·목표 설정 UI를 연결했습니다.",
      "Zustand에서 데이터·UI·환율 설정 상태를 나누고, 조회 오류와 저장 오류를 별도로 관리했습니다.",
      "메모 저장의 낙관적 갱신·실패 시 롤백·토스트 재시도 경로와 섹션별 스켈레톤을 구현했습니다.",
      "환율 Route Handler에 외부 API 조회와 실패 시 USD/KRW 기본값 반환을 구현했습니다.",
    ],
    result: [
      "다섯 종류의 차트와 국가·기업 상세 화면을 갖춘 공개 데모를 구성했습니다.",
      "지연과 저장 실패를 발생시키는 샘플 API로 로딩·저장·오류 UI를 실험할 수 있게 했습니다.",
    ],
    limitations: [
      "배출량은 샘플 데이터를 사용하고, 메모는 메모리에 임시 저장합니다. 실서비스 데이터 수집과 서버 영구 저장은 포함하지 않았습니다.",
      "환율 API 실패 시 기본값을 사용하므로 실제 환율이나 세금 계산의 정확성을 보장하지 않습니다.",
      "운영 규모·성능 개선 수치와 전체 UI 흐름의 실행 결과는 별도로 검증하지 않았습니다.",
    ],
    techStack: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS", "Zustand", "Recharts"],
    github: "https://github.com/aidenjangkkj/dashboard",
    demo: "https://dashboard-omega-beige-25.vercel.app/",
    relatedCaseStudies: [],
  },
  {
    id: "TripApp",
    title: "TripApp v2",
    category: "selected",
    role: "개인 프로젝트 · 일정 편집 UI와 생성 API 구현",
    summary: "여행 일정을 생성하고, 지도에서 확인하며 순서와 장소를 바꿀 수 있는 플래너입니다.",
    problem: "모델 응답을 그대로 화면에 사용하는 대신 구조를 검증하고, 좌표가 없는 장소를 보강하며, 생성 후에도 사용자가 일정을 수정할 수 있어야 했습니다.",
    contribution: [
      "Gemini를 호출하는 일정 생성 Route Handler에서 Zod로 입력과 출력 구조를 검증하고, 응답에서 JSON 구간을 추출해 다시 파싱하는 처리를 구현했습니다.",
      "장소의 누락 좌표를 지오코딩 API로 보강하고 Mapbox의 장소 표시·선택 강조·장소 간 연결선으로 시각화했습니다.",
      "dnd-kit으로 일정 순서 변경을 구현하고, 개별 재추천의 로딩·오류·미리보기·교체 흐름을 구성했습니다.",
      "대안 요청 API에 세 개의 후보를 검증하는 스키마와 후보 선택 UI를 구현했습니다.",
    ],
    result: [
      "입력 → 일정 생성 → 지도 확인 → 항목 편집으로 이어지는 화면과 API 코드를 공개했습니다.",
      "일정 전체를 다시 만드는 대신 항목 단위로 재추천 결과를 확인하고 교체하는 흐름을 구성했습니다.",
    ],
    limitations: [
      "지도에는 장소 좌표를 순서대로 잇는 선을 표시합니다. 실제 길찾기나 교통수단별 경로 계산은 포함하지 않았습니다.",
      "JSON 구간 추출은 잘못된 JSON 문법을 일반적으로 복구하는 기능이 아닙니다. 생성 내용과 장소 좌표의 사실성도 별도 확인이 필요합니다.",
      "Gemini·Mapbox 키와 외부 API 상태에 의존합니다. 현재 배포의 유료 API 호출·생성 품질·전체 편집 흐름은 실행 검증하지 않았습니다.",
    ],
    techStack: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS", "Gemini API", "Mapbox GL JS", "Zod", "dnd-kit"],
    github: "https://github.com/aidenjangkkj/trip-app-v2",
    demo: "https://trip-app-v2.vercel.app/",
    relatedCaseStudies: [],
  },
  {
    id: "rn-webbridge",
    title: "RN WebBridge Demo",
    category: "selected",
    role: "개인 프로젝트 · React Native WebView와 네이티브 API 연동",
    summary: "WebView 브리지의 요청·응답과 광고 ID 조회를 분리해 실험한 React Native·Expo 앱입니다.",
    problem: "웹 화면에서 네이티브 정보를 요청하는 통신 경계와, OS 권한·조회 실패에 따라 결과가 달라지는 광고 ID 처리를 확인하고자 했습니다.",
    contribution: [
      "일반 WebView, 브리지, 광고 ID 조회를 세 개의 탭 화면으로 분리했습니다.",
      "requestInfo의 응답 타입을 명시하고 네트워크 상태·난수를 네이티브 패널에 반영한 뒤 브리지 응답으로 반환했습니다.",
      "iOS ATT 상태 확인·필요 시 권한 요청·거부 분기와 광고 ID 조회 실패·결과 가리기 UI를 구현했습니다.",
      "Expo 설정에 iOS 권한 설명과 Android AD_ID 권한을 추가하고, EAS preview APK 빌드 프로필을 구성했습니다.",
    ],
    result: [
      "네이티브 정보 요청과 응답을 확인하는 브리지 화면, 광고 ID 상태를 확인하는 별도 화면을 공개 코드로 남겼습니다.",
      "브리지 응답 타입과 권한 상태에 따른 처리 흐름을 각각 확인할 수 있도록 했습니다.",
    ],
    limitations: [
      "이 저장소에는 웹 측 소스가 포함되어 있지 않아, 양쪽 타입 공유와 전체 요청·응답 흐름은 여기서 확인할 수 없습니다.",
      "Android의 추적 제한 판정은 null 여부만 확인합니다. 그 외의 광고 ID 제한 상태는 별도로 판정하지 않습니다.",
      "실기기 권한·광고 ID 반환·APK 설치는 재검증하지 않았습니다. 회사 프로젝트의 광고 SDK 구현 사례와는 별개의 개인 실험입니다.",
    ],
    techStack: ["React Native", "Expo", "TypeScript", "React Native WebView", "webview-bridge", "expo-network", "expo-tracking-transparency", "NativeWind"],
    github: "https://github.com/aidenjangkkj/RN_ADID_Bridge",
    relatedCaseStudies: [],
  },
  {
    ...archiveDefaults,
    id: "my-next-app",
    title: "Portfolio & Board",
    role: "개인 포트폴리오 개발·유지보수",
    summary: "경력 사례와 개인 프로젝트를 정리하고 Firebase 게시판·블로그를 운영하는 포트폴리오입니다.",
    problem: "경력 사례와 개인 실험을 구분하고, 프로젝트 설명과 링크를 일관된 데이터로 관리할 공간이 필요했습니다.",
    contribution: ["Next.js Pages Router 기반 페이지와 Firebase 연동 게시판·블로그를 구성했습니다."],
    result: ["경력 사례와 대표·이전 프로젝트를 나누어 탐색할 수 있는 포트폴리오를 구성했습니다."],
    techStack: ["Next.js 16 (Pages Router)", "React 19", "TypeScript", "Firebase", "Tailwind CSS"],
    github: "https://github.com/aidenjangkkj/my-next-app",
    demo: "https://jang-portfolio-one-chi.vercel.app/",
  },
  {
    ...archiveDefaults,
    id: "trademark-search-spa",
    title: "Trademark Search SPA",
  },
  {
    ...archiveDefaults,
    id: "community-mvp",
    title: "Community MVP",
    github: "https://github.com/aidenjangkkj/community-mvp",
  },
  {
    ...archiveDefaults,
    id: "rpg-text-adventure",
    title: "RPG Text Adventure",
    github: "https://github.com/aidenjangkkj/rpg-text-adventure",
  },
  {
    ...archiveDefaults,
    id: "review",
    title: "Review",
    github: "https://github.com/aidenjangkkj/review",
  },
  {
    ...archiveDefaults,
    id: "my-chat-app",
    title: "My Chat App",
    github: "https://github.com/aidenjangkkj/my-chat-app",
  },
  {
    ...archiveDefaults,
    id: "my-chat-server",
    title: "My Chat Server",
    github: "https://github.com/aidenjangkkj/my-chat-server",
  },
  {
    ...archiveDefaults,
    id: "Gamelist",
    title: "Gamelist",
    github: "https://github.com/aidenjangkkj/Gamelist",
  },
  {
    ...archiveDefaults,
    id: "food-appp",
    title: "Food App",
    github: "https://github.com/aidenjangkkj/food-appp",
  },
  {
    ...archiveDefaults,
    id: "del-electron-app",
    title: "Delivery Electron App",
  },
  {
    ...archiveDefaults,
    id: "del-frontend",
    title: "Delivery Frontend",
    github: "https://github.com/aidenjangkkj/del-frontend",
  },
  {
    ...archiveDefaults,
    id: "Responsive",
    title: "Responsive Web",
    github: "https://github.com/aidenjangkkj/Responsive",
  },
  {
    ...archiveDefaults,
    id: "DEG",
    title: "DEG",
    github: "https://github.com/aidenjangkkj/DEG",
  },
];

export const selectedProjects = projects.filter(({ category }) => category === "selected");
export const archivedProjects = projects.filter(({ category }) => category === "archive");

export const getProjectById = (id: string): ProjectDetail | undefined =>
  projects.find((project) => project.id === id);

export const getProjectStaticPaths = (): { params: { id: string } }[] =>
  projects.map(({ id }) => ({ params: { id } }));

export function getProjectPageData(id: unknown): { props: { project: ProjectDetail } } | { notFound: true } {
  const project = typeof id === "string" ? getProjectById(id) : undefined;
  return project ? { props: { project } } : { notFound: true };
}

export function getProjectLinks(project: ProjectDetail): { label: string; href: string }[] {
  return [
    { label: "GitHub", href: project.github ?? "" },
    { label: "데모 보기", href: project.demo ?? "" },
    ...(project.links ?? []),
  ].filter(({ label, href }) => {
    if (!label.trim() || !href.trim()) return false;
    try {
      const { protocol } = new URL(href);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  });
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  github: string;
  demo: string;
  image: string;
}

export type ProjectSummary = Pick<ProjectDetail, "id" | "title" | "description" | "image">;

const projects: ProjectDetail[] = [
  {
    id: "my-next-app",
    title: "My Next App (Portfolio & Board)",
    description: "Next.js 기반 포트폴리오 + 게시판 웹앱.",
    longDescription:
      "Next.js 13(App Router)로 제작한 개인 포트폴리오/게시판. Firebase Firestore 기반 CRUD, Zustand로 UI/데이터 스토어 분리, Tailwind로 반응형 UI와 접근성을 강화했습니다.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Zustand"],
    github: "https://github.com/aidenjangkkj/my-next-app",
    demo: "https://my-next-app-one-chi.vercel.app/", // TODO: 실제 배포 URL
    image: "/images/projects/my-next-app.svg", // TODO: 실제 썸네일
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "차트 중심의 대시보드. 성능 최적화와 스켈레톤 UI 적용.",
    longDescription:
      "다중 차트가 포함된 메트릭 대시보드. useMemo/가상화로 렌더 비용을 줄였고, 로딩 상태를 스켈레톤 컴포넌트로 표준화했습니다. Zustand로 UI/설정/데이터 스토어를 분리 설계.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Recharts"],
    github: "https://github.com/aidenjangkkj/dashboard",
    demo: "https://dashboard-omega-beige-25.vercel.app/",
    image: "/images/projects/dashboard.svg",
  },
  {
    id: "community-mvp",
    title: "Community MVP",
    description: "가벼운 커뮤니티/게시판 최소기능제품.",
    longDescription:
      "게시글/댓글/프로필 같은 필수 기능만 담은 커뮤니티 MVP. 폴더 구조, 타입 설계, 폼 유효성 검증 등 기본기를 단단히 하는 데 초점.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/aidenjangkkj/community-mvp",
    demo: "",
    image: "/images/projects/community-mvp.svg",
  },
  {
    id: "rpg-text-adventure",
    title: "RPG Text Adventure",
    description: "AI 기반 텍스트 어드벤처 게임.",
    longDescription:
      "Next.js + LLM을 활용해 분기형 스토리/전투/버프/세이브를 지원하는 텍스트 RPG. 상태는 Zustand로 관리하며, 프롬프트/룰 설계로 일관된 세계관을 유지합니다.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "LLM API"],
    github: "https://github.com/aidenjangkkj/rpg-text-adventure",
    demo: "https://rpg-text-adventure.vercel.app/",
    image: "/images/projects/rpg-text-adventure.svg",
  },
  {
    id: "review",
    title: "Review Tools",
    description: "리뷰 분석 및 자동 응답 실험용 스크립트.",
    longDescription:
      "리뷰 텍스트 전처리, 감성/키워드 분석, 템플릿 기반 자동 응답을 실험하는 유틸리티. CLI 중심으로 빠르게 반복 실험하기 위한 구조.",
    techStack: ["Node.js", "JavaScript"],
    github: "https://github.com/aidenjangkkj/review",
    demo: "",
    image: "/images/projects/review.svg",
  },
  {
    id: "my-chat-app",
    title: "My Chat App",
    description: "실시간 채팅 클라이언트.",
    longDescription:
      "Socket.io 기반 실시간 채팅 UI. 메시지 스트림, 읽음 처리, 타이핑 인디케이터 등 기본 기능을 TypeScript로 견고하게 구현했습니다.",
    techStack: ["React", "TypeScript", "Socket.io", "Tailwind CSS"],
    github: "https://github.com/aidenjangkkj/my-chat-app",
    demo: "",
    image: "/images/projects/my-chat-app.svg",
  },
  {
    id: "my-chat-server",
    title: "My Chat Server",
    description: "실시간 채팅 서버 (Socket.io).",
    longDescription:
      "채팅방/사용자 세션/이벤트 브로드캐스트를 담당하는 Node.js 서버. 다중 룸, 인증 훅, 메시지 보존 전략 등을 실험합니다.",
    techStack: ["Node.js", "TypeScript", "Socket.io", "Express"],
    github: "https://github.com/aidenjangkkj/my-chat-server",
    demo: "",
    image: "/images/projects/my-chat-server.svg",
  },
  {
    id: "TripApp",
    title: "TripApp (React)",
    description: "AI + 지도 연동 여행 일정 생성기.",
    longDescription:
      "사용자 입력을 바탕으로 일정 JSON을 생성하고, 장소/경로를 지도에 표시합니다. 좌표 파싱, 마커/폴리라인, 일자별 타임라인 UI를 제공합니다.",
    techStack: ["React", "JavaScript", "Google Maps API", "LLM API"],
    github: "https://github.com/aidenjangkkj/TripApp",
    demo: "",
    image: "/images/projects/tripapp.svg",
  },
  {
    id: "Gamelist",
    title: "Gamelist (SpringBoot CRUD)",
    description: "게임 목록 관리 CRUD 백엔드.",
    longDescription:
      "Spring Boot + JPA로 CRUD API를 제공. 계층화된 구조(Controller/Service/Repository)와 예외/검증/DTO 매핑을 정리했습니다.",
    techStack: ["Java", "Spring Boot", "JPA", "MySQL"],
    github: "https://github.com/aidenjangkkj/Gamelist",
    demo: "",
    image: "/images/projects/gamelist.svg",
  },
  {
    id: "food-appp",
    title: "Food App (React Native)",
    description: "배달 플랫폼 프로토타입(모바일).",
    longDescription:
      "역할 분리 UI(점주/고객), 메뉴/장바구니/주문 흐름, Firebase 인증/Firestore 연동을 갖춘 RN 앱. 추후 Electron 확장과 실시간 동기화를 고려한 구조.",
    techStack: ["React Native", "Expo", "Firebase"],
    github: "https://github.com/aidenjangkkj/food-appp",
    demo: "",
    image: "/images/projects/food-appp.svg",
  },
  {
    id: "del-electron-app",
    title: "Delivery Electron App",
    description: "주문 수신·출력용 Electron 데스크톱.",
    longDescription:
      "주문과 연동되는 데스크톱 클라이언트. 시리얼 포트를 통한 영수증 프린터 출력, 주문 알림/처리 플로우를 제공합니다.",
    techStack: ["Electron", "JavaScript", "SerialPort"],
    github: "https://github.com/aidenjangkkj/del-electron-app",
    demo: "",
    image: "/images/projects/del-electron-app.svg",
  },
  {
    id: "del-frontend",
    title: "Delivery Frontend (Web)",
    description: "배달 서비스 웹 프론트엔드.",
    longDescription:
      "점주 대시보드/주문 현황/메뉴 관리 등 웹 화면. React 기반 상태 관리와 Firebase/백엔드 API 연동으로 실시간 주문 흐름을 지원합니다.",
    techStack: ["React", "JavaScript", "Tailwind CSS", "Firebase"],
    github: "https://github.com/aidenjangkkj/del-frontend",
    demo: "",
    image: "/images/projects/del-frontend.svg",
  },
  {
    id: "Responsive",
    title: "Responsive Web",
    description: "반응형 레이아웃 연습.",
    longDescription:
      "모바일 퍼스트로 그리드/타이포 스케일/접근성(시맨틱 태그, 키보드 포커스)을 점검하며 반응형 컴포넌트를 정리했습니다.",
    techStack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/aidenjangkkj/Responsive",
    demo: "",
    image: "/images/projects/responsive.svg",
  },
  {
    id: "DEG",
    title: "DEG (2D Game by Python)",
    description: "파이썬 2D 게임.",
    longDescription:
      "Pygame으로 2D 게임 루프/스프라이트/충돌 처리 및 각종 로직을 구현하며 게임 아키텍처 기초를 정리했습니다.",
    techStack: ["Python", "Pygame"],
    github: "https://github.com/aidenjangkkj/DEG",
    demo: "",
    image: "/images/projects/deg.svg",
  },
];

export const projectSummaries: ProjectSummary[] = projects.map(
  ({ id, title, description, image }) => ({ id, title, description, image }),
);

export const projectDictionary = projects.reduce<Record<string, ProjectDetail>>((acc, project) => {
  acc[project.id] = project;
  return acc;
}, {});

export const getProjectById = (id: string): ProjectDetail | undefined => projectDictionary[id];

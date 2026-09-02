export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  postId: string;
  relatedProjectIds: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "api-request-sharing-cache",
    title: "API 중복 호출 최적화",
    summary: "같은 요청은 공유하고, 같은 응답을 재사용할지는 데이터의 성격으로 나눴습니다.",
    postId: "CUVhkjAaSRgVCZ7UtpDb",
    relatedProjectIds: ["reward-content"],
  },
  {
    slug: "ios-webview-model-cache",
    title: "Service Worker와 Cache Storage로 정적 리소스 캐싱하기",
    summary: "캐시가 있을 것이라는 가정 대신, 응답을 어디에서 재사용했는지 관측하고 fallback을 구성했습니다.",
    postId: "LTXMexwiS1ALARfmq8JC",
    relatedProjectIds: ["reward-content"],
  },
  {
    slug: "native-ad-lifecycle-config",
    title: "WebView 광고 callback 누락과 Config 오류 처리",
    summary: "광고를 실행하는 경계에는 복구 타이머를, 정책을 저장하는 경계에는 계약 검증을 두었습니다.",
    postId: "KBqgU4z8g8cw0hTYYTdS",
    relatedProjectIds: ["reward-content", "common-interface", "customer-events", "operations"],
  },
];

export const getCaseStudyBySlug = (slug: string) => caseStudies.find((item) => item.slug === slug);
export const getCaseStudyByPostId = (id: string | undefined) => caseStudies.find((item) => item.postId === id);
export const getCaseStudyHref = (study: CaseStudy) => `/blog/${encodeURIComponent(study.postId)}`;

export function getCaseStudyPageData(slug: unknown): { redirect: { destination: string; permanent: true } } | { notFound: true } {
  const study = typeof slug === "string" ? getCaseStudyBySlug(slug) : undefined;
  return study
    ? { redirect: { destination: getCaseStudyHref(study), permanent: true } }
    : { notFound: true };
}

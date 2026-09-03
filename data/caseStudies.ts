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
    summary:
      "같은 요청은 공유하고, 같은 응답을 재사용할지는 데이터의 성격으로 나눴습니다.",
    postId: "CUVhkjAaSRgVCZ7UtpDb",
    relatedProjectIds: ["reward-content"],
  },
  {
    slug: "ios-webview-model-cache",
    title: "Service Worker와 Cache Storage로 정적 리소스 캐싱하기",
    summary:
      "서비스 워커가 페이지를 제어하지 않는 환경에도 별도 캐시 경로를 만들고, 응답이 재사용되는지 확인했습니다.",
    postId: "LTXMexwiS1ALARfmq8JC",
    relatedProjectIds: ["reward-content"],
  },
  {
    slug: "native-ad-lifecycle-config",
    title: "WebView 광고 callback 누락과 Config 오류 처리",
    summary:
      "광고 응답이 누락되면 대기 상태를 복구하고, 잘못된 설정은 저장 전에 막도록 했습니다.",
    postId: "KBqgU4z8g8cw0hTYYTdS",
    relatedProjectIds: [
      "reward-content",
      "common-interface",
      "customer-events",
      "operations",
    ],
  },
];

export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find((item) => item.slug === slug);
export const getCaseStudyByPostId = (id: string | undefined) =>
  caseStudies.find((item) => item.postId === id);
export const getCaseStudyHref = (study: CaseStudy) =>
  `/blog/${encodeURIComponent(study.postId)}`;

export function getCaseStudyPageData(
  slug: unknown,
): { redirect: { destination: string; permanent: true } } | { notFound: true } {
  const study = typeof slug === "string" ? getCaseStudyBySlug(slug) : undefined;
  return study
    ? { redirect: { destination: getCaseStudyHref(study), permanent: true } }
    : { notFound: true };
}

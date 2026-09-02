export const DEFAULT_SITE_URL = "https://jang-portfolio-one-chi.vercel.app";
export const DEFAULT_DESCRIPTION = "프론트엔드 개발자 장석환의 경력, 프로젝트와 개발 기록입니다.";

export function getCanonicalUrl(path = "/", siteUrl = process.env.NEXT_PUBLIC_SITE_URL) {
  let origin = DEFAULT_SITE_URL;
  try {
    const url = new URL(siteUrl?.trim() || DEFAULT_SITE_URL);
    if (["http:", "https:"].includes(url.protocol) && !url.username && !url.password) origin = url.origin;
  } catch {
    // A missing or malformed deployment setting must not produce an invalid canonical.
  }
  const pathname = path.startsWith("/") && !path.startsWith("//") ? path.split(/[?#]/)[0] : "/";
  return new URL(pathname || "/", origin).href;
}

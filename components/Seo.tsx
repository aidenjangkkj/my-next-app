import Head from "next/head";
import { DEFAULT_DESCRIPTION, getCanonicalUrl } from "@/lib/seo";

interface SeoProps { title?: string; description?: string; path?: string; noindex?: boolean; article?: boolean }
export default function Seo({ title = "장석환 | Frontend Developer", description = DEFAULT_DESCRIPTION, path = "/", noindex = false, article = false }: SeoProps) {
  const canonical = getCanonicalUrl(path);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={canonical} key="canonical" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} key="robots" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={canonical} key="og:url" />
      <meta property="og:type" content={article ? "article" : "website"} key="og:type" />
      <meta property="og:locale" content="ko_KR" key="og:locale" />
      <meta property="og:site_name" content="장석환 · Frontend Developer" key="og:site_name" />
      <meta name="twitter:card" content="summary" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
    </Head>
  );
}

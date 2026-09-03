import type { AppProps } from "next/app";
import SiteLayout from "@/components/layout/SiteLayout";
import Seo from "@/components/Seo";
import "@/styles/globals.css";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SiteLayout>
      <Seo
        path={router.asPath}
        noindex={
          router.pathname.startsWith("/admin") || router.pathname === "/404"
        }
      />
      <Component {...pageProps} />
    </SiteLayout>
  );
}

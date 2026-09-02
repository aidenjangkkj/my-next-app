import Link from "next/link";
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
      <Navigation />
      <div id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">{children}</div>
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="page-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-900">장석환 · Frontend Developer</p>
          <nav aria-label="연락 및 외부 링크" className="flex flex-wrap gap-5 text-sm font-semibold">
            <a href="https://github.com/aidenjangkkj" target="_blank" rel="noopener noreferrer" className="text-link">GitHub <span className="sr-only">새 탭</span></a>
            <Link href="/blog" className="text-link">글</Link><Link href="/contact" className="text-link">연락하기</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

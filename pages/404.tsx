import Link from "next/link";
import Seo from "@/components/Seo";
export default function NotFound() {
  return (
    <main className="page-shell py-24">
      <Seo
        title="페이지를 찾을 수 없습니다 | 장석환"
        description="주소를 확인하거나 기술 사례 목록에서 작업을 찾아보세요."
        path="/404"
        noindex
      />
      <p className="eyebrow">404</p>
      <h1 className="page-heading mt-4">페이지를 찾을 수 없습니다</h1>
      <p className="mt-5 text-slate-600">
        주소가 변경됐거나 존재하지 않는 페이지입니다.
      </p>
      <Link href="/case-studies" className="button-primary mt-8">
        기술 사례 보기
      </Link>
    </main>
  );
}

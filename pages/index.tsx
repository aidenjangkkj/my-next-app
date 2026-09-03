import Link from "next/link";
import Seo from "@/components/Seo";
import CaseStudyCard from "@/components/CaseStudyCard";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { caseStudies } from "@/data/caseStudies";
import { career, experienceProjects } from "@/data/experience";
import { selectedProjects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <Seo />
      <section className="page-shell pb-16 pt-16 sm:pb-20 sm:pt-24">
        <h1 className="max-w-4xl text-[2.1rem] font-bold leading-[1.4] tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.3]">
          프론트엔드 개발자 장석환입니다.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {career.company}에서 광고·리워드 WebView 서비스와 사내 공통
          광고·WebView 기능을 개발하고 있습니다.
        </p>
        <p className="mt-5 text-sm text-slate-500">
          {career.period} · React · TypeScript
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/blog" className="button-primary">
            주요 글 보기{" "}
            <span aria-hidden="true" className="ml-3">
              →
            </span>
          </Link>
          <Link href="/experience" className="button-secondary">
            경력 보기
          </Link>
          <a
            href="https://github.com/aidenjangkkj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 text-sm font-semibold text-slate-600 hover:text-indigo-700"
          >
            GitHub{" "}
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
            <span className="sr-only">새 탭</span>
          </a>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50/60 py-16 sm:py-20">
        <div className="page-shell">
          <SectionHeading title="글" href="/blog" linkLabel="글 전체 보기" />
          {caseStudies.map((item, index) => (
            <CaseStudyCard key={item.slug} caseStudy={item} index={index} />
          ))}
        </div>
      </section>
      <section className="page-shell py-16 sm:py-20">
        <SectionHeading
          title="경력"
          href="/experience"
          linkLabel="경력 자세히 보기"
        />
        <div className="grid gap-x-10 sm:grid-cols-2">
          {experienceProjects.map((item) => (
            <article key={item.id} className="border-t border-slate-200 py-7">
              <p className="text-xs font-medium text-slate-500">
                {item.audience}
              </p>
              <h3 className="mt-3 text-lg font-bold">
                <Link
                  href={`/experience#${item.id}`}
                  className="hover:text-indigo-700"
                >
                  {item.title} <span aria-hidden="true">→</span>
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="page-shell border-t border-slate-200 py-16 sm:py-20">
        <SectionHeading
          title="개인 프로젝트"
          href="/projects"
          linkLabel="개인 프로젝트 보기"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {selectedProjects.map((item) => (
            <ProjectCard project={item} key={item.id} />
          ))}
        </div>
      </section>
      <section className="page-shell pb-20">
        <div className="rounded-lg bg-slate-950 px-7 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-bold">연락</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            채용이나 협업 문의는 연락 폼으로 보내주세요.
          </p>
          <div className="mt-7 flex flex-wrap gap-6 text-sm font-semibold">
            <a
              href="https://github.com/aidenjangkkj"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              공개 코드 보기<span className="sr-only"> 새 탭</span>
            </a>
            <Link href="/blog" className="underline underline-offset-4">
              기술 기록 읽기
            </Link>
            <Link href="/contact" className="underline underline-offset-4">
              연락하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

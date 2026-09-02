import Link from "next/link";
import { getCaseStudyHref, type CaseStudy } from "@/data/caseStudies";

export default function CaseStudyCard({ caseStudy, index }: { caseStudy: CaseStudy; index: number }) {
  return (
    <article className="border-t border-slate-200 py-8">
      <div className="grid gap-4 md:grid-cols-[4rem_1fr]">
        <span aria-hidden="true" className="font-mono text-xl text-slate-400">0{index + 1}</span>
        <div>
          <p className="mb-3 text-xs font-semibold text-indigo-700">업무 사례</p>
          <h3 className="max-w-2xl text-xl font-bold leading-relaxed tracking-tight sm:text-2xl">
            <Link href={getCaseStudyHref(caseStudy)} className="hover:text-indigo-700">
              {caseStudy.title}{" "}
              <span className="whitespace-nowrap text-indigo-600" aria-hidden="true">↗</span>
            </Link>
          </h3>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">{caseStudy.summary}</p>
        </div>
      </div>
    </article>
  );
}

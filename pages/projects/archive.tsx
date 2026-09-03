import Link from "next/link";
import Seo from "@/components/Seo";
import { archivedProjects, getProjectLinks } from "@/data/projects";

export default function Archive() {
  return (
    <main className="page-shell py-14 sm:py-20">
      <Seo
        title="이전 프로젝트 | 장석환 Frontend Developer"
        description="이전에 학습과 실험을 위해 만든 개인 프로젝트를 모았습니다."
        path="/projects/archive"
      />
      <Link href="/projects" className="text-link text-sm">
        ← 프로젝트 목록으로
      </Link>
      <h1 className="page-heading mt-6">이전 프로젝트</h1>
      <p className="mt-5 max-w-2xl leading-8 text-slate-600">
        이전에 학습과 실험을 위해 만든 개인 프로젝트를 모았습니다.
      </p>
      <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
        {archivedProjects.map((project) => (
          <li
            key={project.id}
            className="grid gap-3 py-6 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <h2 className="font-bold">
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:text-indigo-700"
                >
                  {project.title}
                </Link>
              </h2>
              {project.period && (
                <p className="mt-2 text-xs text-slate-500">{project.period}</p>
              )}
            </div>
            {project.techStack.length > 0 && (
              <p className="text-sm leading-7 text-slate-500">
                {project.techStack.join(" · ")}
              </p>
            )}
            <div className="flex flex-wrap items-start gap-4 md:col-start-3">
              {getProjectLinks(project)
                .filter((link) => link.label === "GitHub")
                .map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link text-sm"
                    aria-label={`${project.title} ${link.label} 새 탭`}
                  >
                    {link.label} ↗
                  </a>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

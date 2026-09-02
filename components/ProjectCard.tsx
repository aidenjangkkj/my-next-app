import Link from "next/link";
import type { ProjectDetail } from "@/data/projects";

export default function ProjectCard({ project }: { project: ProjectDetail }) {
  return <article className="flex flex-col rounded-lg border border-slate-200 p-6"><p className="eyebrow">개인 프로젝트</p><h3 className="mt-5 text-xl font-bold"><Link href={`/projects/${project.id}`} className="hover:text-indigo-700">{project.title} <span aria-hidden="true" className="text-indigo-600">↗</span></Link></h3><p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{project.summary}</p><p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">{project.techStack.slice(0, 4).join(" · ")}</p></article>;
}

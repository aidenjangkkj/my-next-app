import Link from "next/link";
import Seo from "@/components/Seo";
import ProjectCard from "@/components/ProjectCard";
import { selectedProjects, archivedProjects } from "@/data/projects";

export default function Projects() {
  return <main className="page-shell py-14 sm:py-20"><Seo title="개인 프로젝트 | 장석환 Frontend Developer" description="직접 만든 개인 프로젝트입니다. 주요 기능과 구현 과정을 정리했습니다." path="/projects" /><header className="max-w-3xl"><h1 className="page-heading mt-4">개인 프로젝트</h1><p className="mt-6 text-lg leading-8 text-slate-600">직접 만든 개인 프로젝트입니다. 주요 기능과 구현 과정을 정리했습니다.</p></header><section className="mt-12" aria-labelledby="selected-title"><h2 id="selected-title" className="mb-6 text-lg font-bold">대표 프로젝트</h2><div className="grid gap-5 md:grid-cols-3">{selectedProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></section><section className="mt-14 border-t border-slate-200 py-8"><h2 className="text-lg font-bold">이전 프로젝트</h2><p className="mt-3 leading-7 text-slate-600">이전에 작업한 개인 프로젝트 {archivedProjects.length}개도 함께 모았습니다.</p><Link href="/projects/archive" className="text-link mt-5 inline-block font-semibold">이전 프로젝트 목록 보기 <span aria-hidden="true">→</span></Link></section></main>;
}

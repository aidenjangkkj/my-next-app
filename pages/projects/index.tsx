import Link from "next/link";
import Seo from "@/components/Seo";
import ProjectCard from "@/components/ProjectCard";
import { selectedProjects, archivedProjects } from "@/data/projects";

export default function Projects() {
  return <main className="page-shell py-14 sm:py-20"><Seo title="개인 프로젝트 | 장석환 Frontend Developer" description="데이터 대시보드, AI 여행 일정과 Native·Web Bridge를 다룬 선별 개인 프로젝트입니다. 공개 코드에서 확인한 기여와 한계를 정리했습니다." path="/projects" /><header className="max-w-3xl"><p className="eyebrow">Personal Projects</p><h1 className="page-heading mt-4">공개 코드로 이어지는 세 가지 작업</h1><p className="mt-6 text-lg leading-8 text-slate-600">업무 경력과 구분한 개인 프로젝트입니다. 현재 공개 코드에서 확인한 구현과 검증하지 못한 범위를 함께 기록했습니다.</p></header><section className="mt-12" aria-labelledby="selected-title"><h2 id="selected-title" className="mb-6 text-lg font-bold">Selected Personal Projects</h2><div className="grid gap-5 md:grid-cols-3">{selectedProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></section><section className="mt-14 border-t border-slate-200 py-8"><h2 className="text-lg font-bold">Archive</h2><p className="mt-3 leading-7 text-slate-600">이전 작업 {archivedProjects.length}개는 간단한 목록으로 보관했습니다. 확인되지 않은 기능과 오래된 데모는 대표 성과에서 제외했습니다.</p><Link href="/projects/archive" className="text-link mt-5 inline-block font-semibold">이전 프로젝트 목록 보기 <span aria-hidden="true">→</span></Link></section></main>;
}

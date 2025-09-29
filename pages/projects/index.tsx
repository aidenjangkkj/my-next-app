import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import type { ProjectSummary } from "@/data/projects";
import Navigation from "@/components/Navigation";
import "../../app/globals.css";

const Projects: FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("프로젝트 목록을 불러오지 못했습니다.");
      }

      const data: ProjectSummary[] = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(
        err instanceof Error
          ? err.message
          : "알 수 없는 이유로 프로젝트 정보를 가져오지 못했어요.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return (
    <div>
      <Head>
        <title>Projects - My Portfolio</title>
        <meta
          name="description"
          content="Explore recent projects that highlight problem solving, accessibility, and modern web tooling."
        />
      </Head>
      <Navigation />
      <main className="pt-24 pb-16 px-6 bg-gray-100 text-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <p className="mb-10 text-gray-600">
            프로젝트를 선택해 세부 기술 스택과 구현 사례를 확인해 보세요.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3" aria-live="polite">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow-md animate-pulse"
                  aria-hidden
                >
                  <div className="mb-4 h-40 w-full rounded-lg bg-gray-200" />
                  <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="mx-auto max-w-xl rounded-lg bg-red-50 p-6 text-left text-red-700">
              <p className="font-semibold">프로젝트 정보를 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm">{error}</p>
              <button
                type="button"
                onClick={loadProjects}
                className="mt-4 rounded bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                다시 시도하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3" aria-live="polite">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex h-full flex-col rounded-lg bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={400}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="mb-4 text-sm text-gray-600">{project.description}</p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="mt-auto inline-flex items-center text-indigo-600 font-semibold hover:underline"
                  >
                    View Project →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;

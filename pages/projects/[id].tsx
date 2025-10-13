import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { ProjectDetail } from "@/data/projects";
import Navigation from "@/components/Navigation";
import "../../app/globals.css";


const ProjectDetailPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const loadProject = async () => {
      try {
        setStatus("loading");
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data: ProjectDetail = await response.json();
        setProject(data);
        setStatus("success");
      } catch (err) {
        console.error("Error fetching project:", err);
        setStatus("error");
      }
    };

    void loadProject();
  }, [router.isReady, id]);

  const pageTitle =
    status === "success" && project
      ? `${project.title} - My Portfolio`
      : "Projects - My Portfolio";
  const pageDescription =
    status === "success" && project
      ? project.description
      : "Browse individual project details including tech stack and live demos.";

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center bg-gray-100 pt-24 text-gray-900">
        <div className="w-full max-w-4xl px-6">
          {status === "loading" && (
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <p className="text-gray-600">
                프로젝트 정보를 불러오는 중입니다...
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              className="rounded-lg bg-red-50 p-6 text-center text-red-700 shadow-md"
              role="alert"
            >
              <p className="font-semibold">프로젝트 정보를 찾을 수 없습니다.</p>
              <p className="mt-2 text-sm">
                주소를 다시 확인하거나 프로젝트 목록에서 다른 항목을 선택해
                주세요.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-flex items-center justify-center rounded bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                프로젝트 목록으로 이동
              </Link>
            </div>
          )}

          {status === "success" && project && (
            <article className="rounded-lg bg-white p-8 text-center shadow-md">
              <Image
                src={project.image}
                alt={project.title}
                width={960}
                height={540}
                className="mb-6 h-auto w-full rounded-lg object-cover"
                priority
              />
              <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
              <p className="mb-6 text-gray-700">{project.longDescription}</p>
              <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
              <ul className="mb-6 flex flex-wrap justify-center gap-3 text-sm text-gray-700">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-gray-800 px-4 py-2 font-semibold text-white transition hover:bg-gray-700"
                >
                  GitHub
                </a>
                {project.demo && project.demo.trim().length > 0 && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Live Demo
                  </a>
                )}
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded border border-indigo-200 px-4 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  프로젝트 목록 보기
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;

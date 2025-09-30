import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import type { ProjectSummary } from "@/data/projects";
import type { GitHubProject, GitHubProjectError } from "@/lib/github";
import Navigation from "@/components/Navigation";
import "../../app/globals.css";

const Projects: FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([]);
  const [githubErrors, setGithubErrors] = useState<GitHubProjectError[]>([]);
  const [isGithubConfigured, setIsGithubConfigured] = useState(true);
  const [isGithubLoading, setIsGithubLoading] = useState(true);
  const [githubMessage, setGithubMessage] = useState<string | null>(null);

  // ✅ projects 한 번만 선언
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

  useEffect(() => {
    const loadGithubProjects = async () => {
      try {
        setIsGithubLoading(true);
        setGithubMessage(null);
        setGithubErrors([]);

        const response = await fetch("/api/github/projects");
        if (!response.ok) {
          throw new Error("GitHub 프로젝트 정보를 불러오지 못했습니다.");
        }

        const payload: {
          configured?: boolean;
          projects?: GitHubProject[];
          errors?: GitHubProjectError[];
          message?: string;
        } = await response.json();

        const configured = Boolean(payload.configured);
        setIsGithubConfigured(configured);
        setGithubProjects(payload.projects ?? []);

        if (payload.errors && payload.errors.length > 0) {
          setGithubErrors(payload.errors);
        }

        if (payload.message) {
          setGithubMessage(payload.message);
        }
      } catch (err) {
        console.error("Error fetching GitHub projects:", err);
        setGithubMessage(
          err instanceof Error
            ? err.message
            : "알 수 없는 이유로 GitHub 프로젝트 정보를 가져오지 못했어요.",
        );
        // 토큰 미설정일 수 있으니 configured는 일단 true로 유지
        setIsGithubConfigured(true);
      } finally {
        setIsGithubLoading(false);
      }
    };

    void loadGithubProjects();
  }, []);

  const formattedGithubErrors = useMemo(() => {
    if (githubErrors.length === 0) return null;
    return githubErrors
      .map((item) => `• ${item.slug}: ${item.message}`)
      .join("\n");
  }, [githubErrors]);

  const updatedAtFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  return (
    <div>
      <Head>
        <title>프로젝트 · 포트폴리오</title>
        <meta
          name="description"
          content="Explore recent projects that highlight problem solving, accessibility, and modern web tooling."
        />
      </Head>
      <Navigation />
      <main className="pt-24 pb-16 px-6 bg-gray-100 text-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">개인 프로젝트</h2>
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
            <div
              role="alert"
              className="mx-auto max-w-xl rounded-lg bg-red-50 p-6 text-left text-red-700"
            >
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
                    프로젝트 보기 →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* <section className="mx-auto mt-16 max-w-6xl rounded-2xl bg-white/80 p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">GitHub 프로젝트</h2>
            <p className="mt-2 text-gray-600">
              GitHub 저장소를 불러와 실시간으로 업데이트되는 작업 현황을 확인하세요.
            </p>
          </div>

          {isGithubLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-live="polite">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={`github-skeleton-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
                  aria-hidden
                >
                  <div className="mb-4 h-40 w-full rounded-lg bg-gray-200" />
                  <div className="mb-2 h-6 w-1/2 rounded bg-gray-200" />
                  <div className="mb-1 h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !isGithubConfigured ? (
            <div className="rounded-xl border border-dashed border-indigo-400 bg-indigo-50 p-6 text-indigo-700">
              <p className="font-semibold">GitHub 프로젝트 연동이 비활성화되어 있습니다.</p>
              <p className="mt-2 text-sm leading-relaxed">
                .env.local 파일에{" "}
                <code className="rounded bg-white px-1 py-0.5">GITHUB_PROJECTS</code> 값을 추가하고,
                필요하다면{" "}
                <code className="rounded bg-white px-1 py-0.5">GITHUB_ACCESS_TOKEN</code> 또는
                <code className="rounded bg-white px-1 py-0.5">GITHUB_TOKEN</code> 을 설정하면 바로
                프로젝트가 표시됩니다.
              </p>
              {githubMessage && <p className="mt-3 text-sm">{githubMessage}</p>}
            </div>
          ) : githubMessage && githubProjects.length === 0 ? (
            <div
              role="alert"
              className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 text-yellow-800"
            >
              <p className="font-semibold">GitHub 프로젝트를 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm leading-relaxed">{githubMessage}</p>
            </div>
          ) : githubProjects.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              <p>지정된 저장소가 없습니다. .env.local 파일의 GITHUB_PROJECTS 값을 확인해 주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-live="polite">
              {githubProjects.map((project) => (
                <article
                  key={project.slug}
                  className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <Image
                      src={project.image}
                      alt={`${project.name} Open Graph banner`}
                      width={1200}
                      height={630}
                      className="mb-4 h-40 w-full rounded-lg object-cover"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-2xl font-semibold text-gray-900">{project.name}</h3>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                        ⭐ {project.stars.toLocaleString("ko-KR")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {project.description ?? "설명이 제공되지 않은 저장소입니다."}
                    </p>

                    {(project.topics.length > 0 || project.languages.length > 0) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.topics.map((topic) => (
                          <span
                            key={`${project.slug}-topic-${topic}`}
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            #{topic}
                          </span>
                        ))}
                        {project.languages.map((language) => (
                          <span
                            key={`${project.slug}-lang-${language}`}
                            className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="font-semibold text-gray-700">최근 커밋</dt>
                      <dd className="mt-1 text-gray-600">
                        {updatedAtFormatter.format(new Date(project.updatedAt))}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">포크</dt>
                      <dd className="mt-1 text-gray-600">
                        {project.forks.toLocaleString("ko-KR")}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                      GitHub 열기
                    </a>
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                      >
                        데모 보기
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {formattedGithubErrors && (
            <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {formattedGithubErrors}
            </pre>
          )}
        </section> */}
      </main>
    </div>
  );
};

export default Projects;

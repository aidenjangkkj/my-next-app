export interface GitHubProject {
  slug: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  topics: string[];
  languages: string[];
  updatedAt: string;
  image: string;
}

export interface GitHubProjectError {
  slug: string;
  message: string;
}

export interface GitHubProjectsResult {
  configured: boolean;
  projects: GitHubProject[];
  errors: GitHubProjectError[];
}

const parseProjectSlugs = (rawSlugs: string | undefined): string[] => {
  if (!rawSlugs) {
    return [];
  }

  return rawSlugs
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => slug.length > 0);
};

const buildHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "my-next-app",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_ACCESS_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const fetchGitHubProjects = async (): Promise<GitHubProjectsResult> => {
  const slugs = parseProjectSlugs(process.env.GITHUB_PROJECTS);

  if (slugs.length === 0) {
    return {
      configured: false,
      projects: [],
      errors: [],
    };
  }

  const headers = buildHeaders();
  const projectPromises = slugs.map(async (slug) => {
    const [owner, repo] = slug.split("/");

    if (!owner || !repo) {
      return {
        type: "error" as const,
        slug,
        message: "`GITHUB_PROJECTS` 값은 `owner/repository` 형식을 따라야 합니다.",
      };
    }

    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
      });

      if (repoResponse.status === 404) {
        return {
          type: "error" as const,
          slug,
          message: "GitHub 저장소를 찾을 수 없습니다.",
        };
      }

      if (!repoResponse.ok) {
        const responseText = await repoResponse.text();
        return {
          type: "error" as const,
          slug,
          message: `GitHub API 요청이 실패했습니다. (status: ${repoResponse.status}) ${responseText}`,
        };
      }

      const repoData = await repoResponse.json();
      const languages: string[] = [];

      try {
        const languageResponse = await fetch(repoData.languages_url as string, {
          headers,
        });

        if (languageResponse.ok) {
          const languageJson = (await languageResponse.json()) as Record<string, number>;
          languages.push(...Object.keys(languageJson));
        }
      } catch (languageError) {
        console.error(`언어 정보를 불러오는 중 오류 발생 (${slug}):`, languageError);
      }

      const project: GitHubProject = {
        slug,
        name: repoData.name as string,
        description: (repoData.description as string | null) ?? null,
        url: repoData.html_url as string,
        homepage: (repoData.homepage as string | null) || null,
        stars: Number(repoData.stargazers_count ?? 0),
        forks: Number(repoData.forks_count ?? 0),
        topics: Array.isArray(repoData.topics) ? (repoData.topics as string[]) : [],
        languages,
        updatedAt: repoData.pushed_at as string,
        image: `https://opengraph.githubassets.com/1/${slug}`,
      };

      return {
        type: "project" as const,
        project,
      };
    } catch (error) {
      console.error(`GitHub 프로젝트를 불러오는 중 오류 발생 (${slug}):`, error);
      return {
        type: "error" as const,
        slug,
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  });

  const settled = await Promise.all(projectPromises);
  const projects: GitHubProject[] = [];
  const errors: GitHubProjectError[] = [];

  settled.forEach((result) => {
    if (result.type === "project") {
      projects.push(result.project);
    } else {
      errors.push({ slug: result.slug, message: result.message });
    }
  });

  return {
    configured: true,
    projects,
    errors,
  };
};

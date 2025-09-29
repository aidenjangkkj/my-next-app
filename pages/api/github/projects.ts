import type { NextApiRequest, NextApiResponse } from "next";
import { fetchGitHubProjects } from "@/lib/github";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const result = await fetchGitHubProjects();

    if (!result.configured) {
      res.status(200).json({
        configured: false,
        projects: [],
        errors: [],
        message:
          "GitHub 프로젝트 연동이 아직 설정되지 않았습니다. .env.local 파일에 GITHUB_PROJECTS 값을 추가하세요.",
      });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("GitHub 프로젝트 API 요청 실패:", error);
    res.status(500).json({
      configured: true,
      projects: [],
      errors: [],
      message:
        error instanceof Error
          ? error.message
          : "GitHub 프로젝트 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.",
    });
  }
}

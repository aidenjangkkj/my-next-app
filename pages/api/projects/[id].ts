import { NextApiRequest, NextApiResponse } from 'next';

const projectData: Record<string, { title: string; description: string; techStack: string[]; github: string; demo: string; image: string }> = {
  "1": {
    title: "Project 1",
    description: "A detailed description of Project 1. Built using Next.js and Tailwind CSS.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/yourrepo/project1",
    demo: "https://project1-demo.com",
    image: "/images/project1.png"
  },
  "2": {
    title: "Project 2",
    description: "A detailed description of Project 2. Built using TypeScript and Node.js.",
    techStack: ["TypeScript", "Node.js", "Express"],
    github: "https://github.com/yourrepo/project2",
    demo: "https://project2-demo.com",
    image: "/images/project2.png"
  },
  "3": {
    title: "Project 3",
    description: "A detailed description of Project 3. Built using React and Firebase.",
    techStack: ["React", "Firebase", "Tailwind CSS"],
    github: "https://github.com/yourrepo/project3",
    demo: "https://project3-demo.com",
    image: "/images/project3.png"
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  console.log("Requested ID:", projectId);

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  const project = projectData[projectId];

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.status(200).json(project);
}

// ✅ 개별 프로젝트 API 엔드포인트 추가 완료!
// - /api/projects/[id] 요청 시 해당 프로젝트 데이터 반환
// - 잘못된 ID 요청 시 404 에러 처리
// - 이제 http://localhost:3000/api/projects/1 에 접속해서 테스트 가능
// 추가 수정이 필요하면 알려주세요! 🚀
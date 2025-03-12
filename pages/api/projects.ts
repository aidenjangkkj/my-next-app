import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json([
      {
        id: "1",
        title: "Project 1",
        description: "A brief description of Project 1. Built using Next.js and Tailwind CSS.",
        image: "/images/project1.png",
      },
      {
        id: "2",
        title: "Project 2",
        description: "A brief description of Project 2. Built using TypeScript and Node.js.",
        image: "/images/project2.png",
      },
      {
        id: "3",
        title: "Project 3",
        description: "A brief description of Project 3. Built using React and Firebase.",
        image: "/images/project3.png",
      }
    ]);
  }
  
  // ✅ API 엔드포인트 추가 완료!
  // - 프로젝트 데이터를 제공하는 /api/projects 엔드포인트 추가
  // - 이제 /api/projects 에 접속하면 JSON 데이터를 반환함
  // - 추가 수정이 필요하면 알려주세요! 🚀
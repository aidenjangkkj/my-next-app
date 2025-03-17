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

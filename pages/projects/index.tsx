import Head from 'next/head';
import Link from 'next/link';
import { FC, useState, useEffect } from 'react';
import '../../app/globals.css';
const Projects: FC = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <Head>
        <title>Projects - My Portfolio</title>
        <meta name="description" content="Explore my projects built with modern web technologies." />
      </Head>
      <header className="p-4 bg-gray-800 text-white fixed w-full top-0 shadow-lg">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl font-bold">
            <Link href="/">My Portfolio</Link>
          </h1>
          <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>
      </header>
      <main className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="mb-4">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-indigo-600 font-semibold mt-2 block"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;

// ✅ 프로젝트 데이터를 API에서 불러오도록 변경
// - /api/projects 엔드포인트에서 데이터 가져옴
// - useEffect를 사용하여 페이지 로딩 시 데이터 요청
// 추가 수정이 필요하면 알려주세요! 🚀

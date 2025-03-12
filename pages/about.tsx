import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import '../app/globals.css';
const About: FC = () => {
  return (
    <div>
      <Head>
        <title>About Me - My Portfolio</title>
        <meta name="description" content="Learn more about me, my skills, and experience." />
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
      <section className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">💻 Frontend Development</h3>
              <p>Creating responsive and dynamic UI with React, Next.js, and TypeScript.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">🚀 Backend Development</h3>
              <p>Building scalable APIs and services with Node.js, Express, and databases.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">📚 Continuous Learning</h3>
              <p>Exploring new technologies and contributing to open-source projects.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

// ✅ About 페이지 디자인 수정
// - 섹션을 세로 중앙 정렬 (flex + min-h-screen)
// - Hero 섹션 및 기술 소개 섹션 중앙 배치
// 더 수정할 부분 있으면 알려주세요! 🚀
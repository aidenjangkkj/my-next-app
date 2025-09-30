import Head from 'next/head';
import { FC } from 'react';
import '../app/globals.css';
import Navigation from '@/components/Navigation';

const About: FC = () => {
  return (
    <div>
      <Head>
        <title>소개 - 나의 포트폴리오</title>
        <meta name="description" content="저에 대해, 제 기술과 경험에 대해 알아보세요." />
      </Head>
      <Navigation></Navigation>
      <section className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">제가 하는 일</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">💻 프론트엔드 개발</h3>
              <p>React, Next.js, TypeScript, TailwindCSS 로 반응형·동적 UI를 만듭니다.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">🚀 백엔드 개발</h3>
              <p>Node.js, FireBase, DBMS를 활용해 확장 가능한 API와 서비스를 구축합니다.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">📱 크로스 플랫폼 개발</h3>
              <p>React Native와 Flutter,Electron을 활용해 모바일과 데스크톱에서 동작하는 앱을 제작합니다.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">📚 지속적인 학습</h3>
              <p>항상 새로운 기술과 부족한 부분을 탐구하고 공부합니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

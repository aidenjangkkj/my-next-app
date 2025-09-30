import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import Navigation from "../components/Navigation";
import "../app/globals.css";

const Home: FC = () => {
  return (
    <div>
      <Head>
        <title>포트폴리오 웹사이트</title>
        <meta
          name="description"
          content="Welcome to my portfolio site built with Next.js"
        />
      </Head>
      <Navigation />
      <main className="p-8 flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-4xl font-bold mb-4">
          안녕하세요, 장석환 입니다. 👋
        </h2>
        <p className="text-lg mb-6 max-w-2xl text-center">
          현대적인 웹 애플리케이션을 개발하는 열정적인 프론트엔드 개발자입니다.
          제 프로젝트를 확인해 보시고 언제든 편하게 연락 주세요!
        </p>
        <div className="space-x-4">
          <Link href="/projects">
            <button className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-100">
              프로젝트 보기
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-6 py-2 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600">
              연락하기
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;

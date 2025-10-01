import Link from "next/link";
import { FC } from "react";

const Navigation: FC = () => {
  return (
    <header className="p-4 bg-gray-800 text-white fixed w-full top-0 shadow-lg z-50">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">
          <Link href="/">나의 포트폴리오</Link>
        </h1>
        <div className="space-x-4">
          <Link href="/">홈</Link>
          <Link href="/about">소개</Link>
          <Link href="/projects">프로젝트</Link>
          <Link href="/contact">연락하기</Link>
          <Link href="/board">게시판</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

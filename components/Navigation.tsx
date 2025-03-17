import Link from "next/link";
import { FC } from "react";

const Navigation: FC = () => {
  return (
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
          <Link href="/board">Board</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import Navigation from "../components/Navigation";
import "../app/globals.css";

const Home: FC = () => {
  return (
    <div>
      <Head>
        <title>My Portfolio</title>
        <meta
          name="description"
          content="Welcome to my portfolio site built with Next.js"
        />
      </Head>
      <Navigation />
      <main className="p-8 flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Hello, I'm [Your Name] 👋</h2>
        <p className="text-lg mb-6 max-w-2xl text-center">
          I’m a passionate developer building modern web applications. Check out
          my projects and feel free to reach out!
        </p>
        <div className="space-x-4">
          <Link href="/projects">
            <button className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-100">
              View My Projects
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-6 py-2 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600">
              Contact Me
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;

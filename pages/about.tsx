import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import '../app/globals.css';
import Navigation from '@/components/Navigation';
const About: FC = () => {
  return (
    <div>
      <Head>
        <title>About Me - My Portfolio</title>
        <meta name="description" content="Learn more about me, my skills, and experience." />
      </Head>
      <Navigation></Navigation>
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
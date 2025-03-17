import Head from 'next/head';
import Link from 'next/link';
import { FC, useState, useEffect } from 'react';
import '../../app/globals.css';
import Navigation from '@/components/Navigation';
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
      <Navigation></Navigation>
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

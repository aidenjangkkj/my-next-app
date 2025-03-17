import Head from "next/head";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../../app/globals.css";
import Navigation from "@/components/Navigation";

const ProjectDetail: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<{
    title: string;
    description: string;
    techStack: string[];
    github: string;
    demo: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (router.isReady && id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`);
          if (!response.ok) throw new Error("Project not found");
          const data = await response.json();
          setProject(data);
        } catch (error) {
          console.error("Error fetching project:", error);
          setProject(null);
        }
      };
      fetchProject();
    }
  }, [router.isReady, id]);

  if (!project) {
    return (
      <p className="text-center mt-20 text-gray-600">Loading project details...</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <Head>
        <title>{project.title} - My Portfolio</title>
        <meta name="description" content={project.description} />
      </Head>
      <Navigation></Navigation>
      <main className="flex flex-col items-center justify-center w-full">
        <div className="max-w-4xl bg-white p-6 rounded-lg shadow-md text-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-lg mb-6"
          />
          <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
          <p className="mb-4">{project.description}</p>
          <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
          <ul className="list-disc list-inside mb-4">
            {project.techStack.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
          <div className="flex space-x-4 justify-center">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700"
            >
              GitHub
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700"
            >
              Live Demo
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
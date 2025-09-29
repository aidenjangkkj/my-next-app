export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  github: string;
  demo: string;
  image: string;
}

export type ProjectSummary = Pick<ProjectDetail, "id" | "title" | "description" | "image">;

const projects: ProjectDetail[] = [
  {
    id: "next-portfolio",
    title: "Responsive Portfolio",
    description: "Landing page that showcases developer skills with responsive layouts and accessibility in mind.",
    longDescription:
      "A personal portfolio built with Next.js and Tailwind CSS. It focuses on fast load times, semantic markup, and accessible navigation across desktop and mobile devices.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/yourrepo/next-portfolio",
    demo: "https://yourdomain.com/portfolio",
    image: "/images/project-portfolio.svg",
  },
  {
    id: "firebase-dashboard",
    title: "Firebase Dashboard",
    description: "Admin dashboard for monitoring Firestore collections and authentication events in real time.",
    longDescription:
      "A real-time dashboard that visualises Firebase usage metrics and allows administrators to manage Firestore documents with optimistic UI updates.",
    techStack: ["Next.js", "Firebase", "React Query", "Tailwind CSS"],
    github: "https://github.com/yourrepo/firebase-dashboard",
    demo: "https://yourdomain.com/firebase-dashboard",
    image: "/images/project-dashboard.svg",
  },
  {
    id: "design-system",
    title: "UI Design System",
    description: "Reusable component library with documentation and live playground for designers and engineers.",
    longDescription:
      "A shared design system that includes typography, colour palettes, and interactive components documented with Storybook for teams to adopt consistently.",
    techStack: ["React", "TypeScript", "Storybook", "Tailwind CSS"],
    github: "https://github.com/yourrepo/design-system",
    demo: "https://yourdomain.com/design-system",
    image: "/images/project-design-system.svg",
  },
];

export const projectSummaries: ProjectSummary[] = projects.map(
  ({ id, title, description, image }) => ({ id, title, description, image }),
);

export const projectDictionary = projects.reduce<Record<string, ProjectDetail>>((acc, project) => {
  acc[project.id] = project;
  return acc;
}, {});

export const getProjectById = (id: string): ProjectDetail | undefined => projectDictionary[id];

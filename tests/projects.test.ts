import assert from "node:assert/strict";
import test from "node:test";
import * as projectData from "../data/projects.ts";

test("exports unique project IDs and keeps the three selected projects separate from the archive", () => {
  assert.ok(Array.isArray(projectData.projects), "projects must be exported");
  assert.ok(Array.isArray(projectData.selectedProjects), "selectedProjects must be exported");
  assert.ok(Array.isArray(projectData.archivedProjects), "archivedProjects must be exported");
  const ids = projectData.projects.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(projectData.selectedProjects.map(({ id }) => id), ["dashboard", "TripApp", "rn-webbridge"]);
  assert.ok(projectData.selectedProjects.every(({ category }) => category === "selected"));
  assert.ok(projectData.archivedProjects.every(({ category }) => category === "archive"));
  assert.equal(projectData.selectedProjects.length + projectData.archivedProjects.length, ids.length);
  for (const id of ["my-chat-app", "my-chat-server", "food-appp", "del-electron-app", "del-frontend"]) {
    assert.ok(projectData.archivedProjects.some((project) => project.id === id));
    assert.ok(!projectData.selectedProjects.some((project) => project.id === id));
  }
});

test("selected projects contain an evidence-oriented detail narrative without invented periods", () => {
  assert.ok(Array.isArray(projectData.selectedProjects), "selectedProjects must be exported");
  for (const project of projectData.selectedProjects) {
    for (const field of ["title", "period", "role", "summary", "problem"] as const) {
      assert.ok(project[field].trim(), `${project.id}.${field} must not be empty`);
    }
    for (const field of ["contribution", "result", "limitations", "techStack"] as const) {
      assert.ok(project[field].length > 0, `${project.id}.${field} must not be empty`);
      assert.ok(project[field].every((value) => value.trim()));
    }
    assert.deepEqual(project.relatedCaseStudies, [], "personal projects are not evidence for company case studies");
  }
});

test("corrects the portfolio stack and includes only confirmed selected demo URLs", () => {
  const portfolio = projectData.getProjectById("my-next-app");
  assert.ok(portfolio);
  assert.ok(portfolio.techStack.includes("Next.js 16 (Pages Router)"));
  assert.ok(portfolio.techStack.includes("React 19"));
  assert.ok(!portfolio.techStack.includes("Zustand"));
  assert.equal(portfolio.demo, "https://jang-portfolio-one-chi.vercel.app/");
  assert.equal(projectData.getProjectById("dashboard")?.demo, "https://dashboard-omega-beige-25.vercel.app/");
  assert.equal(projectData.getProjectById("TripApp")?.demo, "https://trip-app-v2.vercel.app/");
  assert.equal(projectData.getProjectById("rn-webbridge")?.demo, undefined);
  assert.equal(projectData.getProjectById("rpg-text-adventure")?.demo, undefined);
});

test("returns only labeled HTTP(S) project links and omits empty or unsafe links", () => {
  assert.equal(typeof projectData.getProjectLinks, "function", "getProjectLinks must be exported");
  const project = projectData.getProjectById("dashboard");
  assert.ok(project);
  assert.deepEqual(projectData.getProjectLinks({
    ...project,
    github: " ",
    demo: "javascript:alert(1)",
    links: [
      { label: "Source", href: "https://github.com/example/project" },
      { label: "Docs", href: "http://example.com/docs" },
      { label: "Blank", href: "" },
      { label: " ", href: "https://example.com" },
      { label: "Relative", href: "/projects" },
      { label: "Invalid", href: "https://" },
      { label: "Data", href: "data:text/html,test" },
    ],
  }), [
    { label: "Source", href: "https://github.com/example/project" },
    { label: "Docs", href: "http://example.com/docs" },
  ]);
  assert.deepEqual(projectData.getProjectLinks({ ...project, github: undefined, demo: undefined, links: undefined }), []);
  assert.deepEqual(projectData.getProjectLinks(project), [
    { label: "GitHub", href: project.github },
    { label: "Demo", href: project.demo },
  ]);
});

test("uses exact safe lookups and returns 404 data for unknown or malformed route IDs", () => {
  for (const id of ["missing", "constructor", "__proto__", "toString", "../../etc/passwd", "dashboard/", "Dashboard"]) {
    assert.equal(projectData.getProjectById(id), undefined, `${id} must not resolve`);
  }
  assert.equal(typeof projectData.getProjectPageData, "function", "getProjectPageData must be exported");
  for (const id of [undefined, null, 0, {}, ["dashboard"], "", "missing", "constructor", "__proto__", "toString", "../dashboard"]) {
    assert.deepEqual(projectData.getProjectPageData(id), { notFound: true });
  }
  const project = projectData.getProjectById("TripApp");
  assert.ok(project);
  assert.deepEqual(projectData.getProjectPageData("TripApp"), { props: { project } });
});

test("generates static paths for both selected and archived project details", () => {
  assert.equal(typeof projectData.getProjectStaticPaths, "function", "getProjectStaticPaths must be exported");
  assert.deepEqual(projectData.getProjectStaticPaths(), projectData.projects.map(({ id }) => ({ params: { id } })));
  assert.ok(projectData.getProjectStaticPaths().some(({ params }) => params.id === "my-next-app"));
  assert.ok(projectData.getProjectStaticPaths().some(({ params }) => params.id === "rn-webbridge"));
});

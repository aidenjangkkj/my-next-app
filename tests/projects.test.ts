import assert from "node:assert/strict";
import test from "node:test";
import * as projectData from "../data/projects.ts";

test("exports unique project IDs and keeps the two selected projects separate from the archive", () => {
  assert.ok(Array.isArray(projectData.projects), "projects must be exported");
  assert.ok(
    Array.isArray(projectData.selectedProjects),
    "selectedProjects must be exported",
  );
  assert.ok(
    Array.isArray(projectData.archivedProjects),
    "archivedProjects must be exported",
  );
  const ids = projectData.projects.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    projectData.selectedProjects.map(({ id }) => id),
    ["dashboard", "TripApp"],
  );
  assert.ok(
    projectData.selectedProjects.every(
      ({ category }) => category === "selected",
    ),
  );
  assert.ok(
    projectData.archivedProjects.every(
      ({ category }) => category === "archive",
    ),
  );
  assert.equal(projectData.projects.length, 16);
  assert.equal(projectData.archivedProjects.length, 14);
  assert.equal(
    projectData.selectedProjects.length + projectData.archivedProjects.length,
    ids.length,
  );
  for (const id of [
    "rn-webbridge",
    "my-chat-app",
    "my-chat-server",
    "food-appp",
    "del-electron-app",
    "del-frontend",
  ]) {
    assert.ok(
      projectData.archivedProjects.some((project) => project.id === id),
    );
    assert.ok(
      !projectData.selectedProjects.some((project) => project.id === id),
    );
  }
});

test("selected projects and the archived native demo keep their detail narrative without inventing unavailable periods", () => {
  assert.ok(
    Array.isArray(projectData.selectedProjects),
    "selectedProjects must be exported",
  );
  for (const project of projectData.projects.filter(({ id }) =>
    ["dashboard", "TripApp", "rn-webbridge"].includes(id),
  )) {
    for (const field of ["title", "role", "summary", "problem"] as const) {
      assert.ok(
        project[field]?.trim(),
        `${project.id}.${field} must not be empty`,
      );
    }
    for (const field of [
      "contribution",
      "result",
      "limitations",
      "techStack",
    ] as const) {
      assert.ok(
        project[field].length > 0,
        `${project.id}.${field} must not be empty`,
      );
      assert.ok(project[field].every((value) => value.trim()));
    }
    assert.deepEqual(
      project.relatedCaseStudies,
      [],
      "personal projects are not evidence for company case studies",
    );
  }
  assert.doesNotMatch(
    JSON.stringify(projectData.selectedProjects),
    /전체 화면의 동작은 추가 확인이 필요합니다|현재 데모의 유료 API 호출과 생성 품질, 전체 편집 흐름은 추가 확인이 필요합니다/,
  );
  assert.ok(
    projectData
      .getProjectById("dashboard")
      ?.limitations.includes(
        "실서비스 규모에서의 성능 지표는 측정하지 않았습니다.",
      ),
  );
  assert.ok(
    projectData
      .getProjectById("TripApp")
      ?.limitations.includes(
        "Gemini·Mapbox API 키·쿼터와 모델 응답에 따라 결과가 달라질 수 있습니다.",
      ),
  );
});

test("unavailable project details are omitted instead of publishing editorial placeholders", () => {
  for (const project of projectData.projects)
    assert.equal(
      project.period,
      undefined,
      `${project.id} has no confirmed period`,
    );
  for (const project of projectData.archivedProjects.filter(
    ({ id }) => !["rn-webbridge", "my-next-app"].includes(id),
  )) {
    assert.equal(
      project.summary,
      "이전에 학습과 실험을 위해 만든 개인 프로젝트입니다.",
    );
    assert.equal(project.role, undefined);
    assert.equal(project.problem, undefined);
    assert.deepEqual(project.techStack, []);
    assert.deepEqual(project.limitations, []);
  }
  assert.deepEqual(projectData.getProjectById("my-next-app")?.limitations, []);
  assert.doesNotMatch(
    JSON.stringify(projectData.projects),
    /기록 미확인|재검증 전|보증하지 않습니다|해석하지 않습니다|성과나 방문자 지표는 제시하지|별도로 검증하지 않았습니다|실행 검증하지 않았습니다|재검증하지 않았습니다/,
  );
});

test("corrects the portfolio stack and includes only confirmed selected demo URLs", () => {
  const portfolio = projectData.getProjectById("my-next-app");
  assert.ok(portfolio);
  assert.ok(portfolio.techStack.includes("Next.js 16 (Pages Router)"));
  assert.ok(portfolio.techStack.includes("React 19"));
  assert.ok(!portfolio.techStack.includes("Zustand"));
  assert.equal(portfolio.demo, "https://jang-portfolio-one-chi.vercel.app/");
  assert.equal(
    projectData.getProjectById("dashboard")?.demo,
    "https://dashboard-omega-beige-25.vercel.app/",
  );
  assert.equal(
    projectData.getProjectById("TripApp")?.demo,
    "https://trip-app-v2.vercel.app/",
  );
  assert.equal(projectData.getProjectById("rn-webbridge")?.demo, undefined);
  assert.equal(
    projectData.getProjectById("rn-webbridge")?.github,
    "https://github.com/aidenjangkkj/RN_ADID_Bridge",
  );
  assert.ok(
    projectData
      .getProjectById("rn-webbridge")
      ?.limitations.includes(
        "실기기에서 권한 요청, 광고 ID 조회, APK 설치가 끝까지 동작하는지는 추가 확인이 필요합니다. 회사 광고 SDK와는 별개로 만든 개인 실험입니다.",
      ),
  );
  assert.equal(
    projectData.getProjectById("rpg-text-adventure")?.demo,
    undefined,
  );
});

test("returns only labeled HTTP(S) project links and omits empty or unsafe links", () => {
  assert.equal(
    typeof projectData.getProjectLinks,
    "function",
    "getProjectLinks must be exported",
  );
  const project = projectData.getProjectById("dashboard");
  assert.ok(project);
  assert.deepEqual(
    projectData.getProjectLinks({
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
    }),
    [
      { label: "Source", href: "https://github.com/example/project" },
      { label: "Docs", href: "http://example.com/docs" },
    ],
  );
  assert.deepEqual(
    projectData.getProjectLinks({
      ...project,
      github: undefined,
      demo: undefined,
      links: undefined,
    }),
    [],
  );
  assert.deepEqual(projectData.getProjectLinks(project), [
    { label: "GitHub", href: project.github },
    { label: "데모 보기", href: project.demo },
  ]);
});

test("uses exact safe lookups and returns 404 data for unknown or malformed route IDs", () => {
  for (const id of [
    "missing",
    "constructor",
    "__proto__",
    "toString",
    "../../etc/passwd",
    "dashboard/",
    "Dashboard",
  ]) {
    assert.equal(
      projectData.getProjectById(id),
      undefined,
      `${id} must not resolve`,
    );
  }
  assert.equal(
    typeof projectData.getProjectPageData,
    "function",
    "getProjectPageData must be exported",
  );
  for (const id of [
    undefined,
    null,
    0,
    {},
    ["dashboard"],
    "",
    "missing",
    "constructor",
    "__proto__",
    "toString",
    "../dashboard",
  ]) {
    assert.deepEqual(projectData.getProjectPageData(id), { notFound: true });
  }
  const project = projectData.getProjectById("TripApp");
  assert.ok(project);
  assert.deepEqual(projectData.getProjectPageData("TripApp"), {
    props: { project },
  });
});

test("generates static paths for both selected and archived project details", () => {
  assert.equal(
    typeof projectData.getProjectStaticPaths,
    "function",
    "getProjectStaticPaths must be exported",
  );
  assert.deepEqual(
    projectData.getProjectStaticPaths(),
    projectData.projects.map(({ id }) => ({ params: { id } })),
  );
  assert.ok(
    projectData
      .getProjectStaticPaths()
      .some(({ params }) => params.id === "my-next-app"),
  );
  assert.ok(
    projectData
      .getProjectStaticPaths()
      .some(({ params }) => params.id === "rn-webbridge"),
  );
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  caseStudies,
  getCaseStudyPageData,
  getCaseStudyHref,
  getCaseStudyByPostId,
} from "../data/caseStudies.ts";
import { experienceProjects } from "../data/experience.ts";
import { projects } from "../data/projects.ts";
import { getCanonicalUrl } from "../lib/seo.ts";
import {
  escapeHtml,
  validateContactInput,
  CONTACT_LIMITS,
} from "../lib/contact.ts";

test("featured articles contain only compact link metadata and valid career links", () => {
  assert.equal(caseStudies.length, 3);
  assert.equal(new Set(caseStudies.map((item) => item.slug)).size, 3);
  assert.equal(experienceProjects.length, 4);
  const projectIds = new Set(experienceProjects.map((item) => item.id));
  for (const item of caseStudies) {
    assert.deepEqual(Object.keys(item).sort(), [
      "postId",
      "relatedProjectIds",
      "slug",
      "summary",
      "title",
    ]);
    assert.ok(item.title && item.summary && item.postId);
    assert.doesNotMatch(
      `${item.title} ${item.summary}`,
      /\d+\s*(?:회|초|ms|%)/,
    );
    assert.ok(item.relatedProjectIds.every((id) => projectIds.has(id)));
  }
  const slugs = new Set(caseStudies.map((item) => item.slug));
  for (const project of experienceProjects)
    assert.ok(project.caseStudies.every((slug) => slugs.has(slug)));
  for (const project of projects)
    assert.ok(project.relatedCaseStudies.every((slug) => slugs.has(slug)));
  assert.doesNotMatch(
    JSON.stringify([caseStudies, experienceProjects]),
    /H\.Point|hpoint|OCB|@polycube|placement.?id|https?:\/\/|[a-f0-9]{40}|TODO|lorem ipsum/i,
  );
  assert.doesNotMatch(JSON.stringify(experienceProjects), /이틀간/);
  assert.ok(
    experienceProjects
      .find((item) => item.id === "operations")
      ?.contribution.includes(
        "3개 광고 제공사의 서로 다른 데이터를 비교하기 위한 브라우저 기반 내부 분석 도구를 구현했습니다.",
      ),
  );
});

test("CI validates master changes without a deployment workflow or secrets", () => {
  const workflowPath = new URL("../.github/workflows/ci.yml", import.meta.url);
  assert.ok(existsSync(workflowPath));
  assert.equal(
    existsSync(
      new URL("../.github/workflows/deploy-vercel.yml", import.meta.url),
    ),
    false,
  );
  const workflow = readFileSync(workflowPath, "utf8");
  assert.match(workflow, /^name: CI$/m);
  assert.match(workflow, /^  push:\n    branches: \[master\]$/m);
  assert.match(workflow, /^  pull_request:\n    branches: \[master\]$/m);
  assert.match(workflow, /^  workflow_dispatch:$/m);
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.match(
    workflow,
    /^  check:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15$/m,
  );
  assert.match(workflow, /uses: actions\/checkout@v4/);
  assert.match(workflow, /uses: actions\/setup-node@v4/);
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /cache: npm/);
  assert.deepEqual(
    [...workflow.matchAll(/^\s*- run: (.+)$/gm)].map(([, command]) => command),
    [
      "npm ci",
      "npm test",
      "npm run lint",
      "npm run build",
      "npm run test:static",
    ],
  );
  assert.doesNotMatch(workflow, /vercel|deploy|secrets/i);
});

test("legacy case study slugs redirect permanently to CMS articles and invalid slugs return 404", () => {
  for (const study of caseStudies) {
    assert.deepEqual(getCaseStudyPageData(study.slug), {
      redirect: { destination: `/blog/${study.postId}`, permanent: true },
    });
  }
  const first = caseStudies[0];
  for (const slug of [
    "missing",
    "__proto__",
    "constructor",
    undefined,
    null,
    [first.slug],
  ]) {
    assert.deepEqual(getCaseStudyPageData(slug), { notFound: true });
  }
});

test("all featured articles link to their unique published CMS posts", () => {
  assert.deepEqual(
    caseStudies.map(({ slug, postId, title }) => [slug, postId, title]),
    [
      [
        "api-request-sharing-cache",
        "CUVhkjAaSRgVCZ7UtpDb",
        "API 중복 호출 최적화",
      ],
      [
        "ios-webview-model-cache",
        "LTXMexwiS1ALARfmq8JC",
        "Service Worker와 Cache Storage로 정적 리소스 캐싱하기",
      ],
      [
        "native-ad-lifecycle-config",
        "KBqgU4z8g8cw0hTYYTdS",
        "WebView 광고 callback 누락과 Config 오류 처리",
      ],
    ],
  );
  assert.equal(
    new Set(caseStudies.map((study) => study.postId)).size,
    caseStudies.length,
  );
  for (const study of caseStudies) {
    assert.equal(getCaseStudyHref(study), `/blog/${study.postId}`);
    assert.equal(getCaseStudyByPostId(study.postId), study);
  }
  assert.equal(getCaseStudyByPostId("unknown"), undefined);
  assert.equal(getCaseStudyByPostId(undefined), undefined);
});

test("canonical uses the configured origin and strips search/hash without accepting external paths", () => {
  assert.equal(
    getCanonicalUrl(
      "/projects/demo?ref=nav#part",
      "https://portfolio.example/base/",
    ),
    "https://portfolio.example/projects/demo",
  );
  assert.equal(
    getCanonicalUrl("/", " "),
    "https://jang-portfolio-one-chi.vercel.app/",
  );
  assert.equal(
    getCanonicalUrl("/blog", "javascript:alert(1)"),
    "https://jang-portfolio-one-chi.vercel.app/blog",
  );
  assert.equal(
    getCanonicalUrl("//evil.example/path", "https://portfolio.example"),
    "https://portfolio.example/",
  );
  assert.equal(
    getCanonicalUrl("/blog", "https://user:password@portfolio.example"),
    "https://jang-portfolio-one-chi.vercel.app/blog",
  );
});

const validContact = {
  name: "장석환",
  email: "applicant@example.org",
  message: "포트폴리오 문의",
  website: "",
};
test("contact validates unknown input, lengths, email and honeypot", () => {
  assert.deepEqual(validateContactInput(validContact), {
    ok: true,
    value: validContact,
  });
  for (const input of [
    null,
    [],
    "text",
    { ...validContact, name: 12 },
    { ...validContact, name: " " },
    { ...validContact, name: "name\r\nheader" },
    { ...validContact, email: "not-mail" },
    { ...validContact, website: "bot" },
  ]) {
    assert.equal(validateContactInput(input).ok, false);
  }
  for (const field of ["name", "email", "message"] as const) {
    assert.equal(
      validateContactInput({
        ...validContact,
        [field]: "a".repeat(CONTACT_LIMITS[field] + 1),
      }).ok,
      false,
    );
  }
  assert.equal(
    validateContactInput({
      ...validContact,
      name: "a".repeat(CONTACT_LIMITS.name),
      message: "a".repeat(CONTACT_LIMITS.message),
    }).ok,
    true,
  );
});

test("contact HTML escapes every dynamic HTML delimiter", () => {
  assert.equal(
    escapeHtml(`<a title="x">'&</a>`),
    "&lt;a title=&quot;x&quot;&gt;&#39;&amp;&lt;/a&gt;",
  );
  assert.equal(escapeHtml("한글\n본문"), "한글\n본문");
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".next/server/pages");
const read = (route) =>
  fs.readFileSync(path.join(root, `${route}.html`), "utf8");
const home = read("index");
assert.match(home, /<html[^>]*lang="ko"/);
assert.match(home, /프론트엔드 개발자 장석환입니다\./);
assert.doesNotMatch(
  home,
  /Frontend Engineering|Product Reliability|실행 경계를 다루는 방식|선택의 맥락|무엇을 바꿨는지뿐 아니라/,
);
assert.match(home, /㈜폴리큐브/);
assert.doesNotMatch(
  home,
  /숫자와 함께 확인한 검증 범위|동일 운세 콘텐츠 fetch|광고 callback 누락 복구/,
);
for (const id of [
  "CUVhkjAaSRgVCZ7UtpDb",
  "LTXMexwiS1ALARfmq8JC",
  "KBqgU4z8g8cw0hTYYTdS",
])
  assert.ok(home.includes(`href="/blog/${id}"`), `featured CMS article ${id}`);
assert.doesNotMatch(home, /href="\/case-studies(?:\/|"|\?)/);
assert.doesNotMatch(
  home,
  /근거 ·|로컬 전후 재현|코드·테스트 검증|\d+\s*(?:회|초|ms)(?![A-Za-z])/,
);
const canonicalOf = (html) =>
  new URL(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "");
const projectCanonical = canonicalOf(read("projects/dashboard"));
assert.equal(projectCanonical.origin, canonicalOf(home).origin);
assert.equal(projectCanonical.pathname, "/projects/dashboard");
assert.doesNotMatch(read("experience"), /3회에서 1회|1회→0회|10초/);
const listing = read("projects");
const archive = read("projects/archive");
const projectIds = [
  "reward-pocket",
  "dashboard",
  "TripApp",
  "rn-webbridge",
  "my-next-app",
  "trademark-search-spa",
  "community-mvp",
  "rpg-text-adventure",
  "review",
  "my-chat-app",
  "my-chat-server",
  "Gamelist",
  "food-appp",
  "del-electron-app",
  "del-frontend",
  "Responsive",
  "DEG",
];
const archiveIds = projectIds.slice(3);
assert.equal(archiveIds.length, 14);
for (const id of projectIds) {
  const html = read(`projects/${id}`);
  assert.equal(
    /<dt[^>]*>기간|기록 미확인|재검증 전|보증하지 않습니다|해석하지 않습니다/.test(
      html,
    ),
    false,
    `unavailable metadata omitted: ${id}`,
  );
  assert.match(html, /프로젝트 목록으로/, `return link: ${id}`);
}
assert.match(listing, /대표 프로젝트/);
assert.match(listing, /이전 프로젝트/);
for (const id of archiveIds)
  assert.ok(archive.includes(`href="/projects/${id}"`), `archive link: ${id}`);
for (const id of archiveIds.filter(
  (id) => !["rn-webbridge", "my-next-app"].includes(id),
)) {
  const html = read(`projects/${id}`);
  assert.doesNotMatch(
    html,
    /<dt[^>]*>(?:역할|기술)|<h2[^>]*>(?:문제|검증 범위와 한계)|<dl\b/,
    `empty archive sections omitted: ${id}`,
  );
}
assert.doesNotMatch(archive, /기록 미확인/);
for (const id of ["rn-webbridge", "my-next-app"]) {
  assert.match(read(`projects/${id}`), /<h2[^>]*>문제/);
  assert.match(read(`projects/${id}`), /<dt[^>]*>기술/);
}
assert.match(read("projects/dashboard"), /데모 보기/);
for (const html of [home, listing]) {
  assert.match(html, /class="grid gap-5 md:grid-cols-2"/);
  for (const id of ["reward-pocket", "dashboard", "TripApp"])
    assert.ok(html.includes(`href="/projects/${id}"`), `selected ${id}`);
  for (const id of archiveIds)
    assert.ok(
      !html.includes(`href="/projects/${id}"`),
      `archive ${id} excluded`,
    );
}
for (const id of ["reward-pocket", "dashboard", "TripApp"])
  assert.doesNotMatch(
    read(`projects/${id}`),
    /전체 화면의 동작은 추가 확인이 필요합니다|현재 데모의 유료 API 호출과 생성 품질, 전체 편집 흐름은 추가 확인이 필요합니다/,
  );
assert.match(
  read("projects/rn-webbridge"),
  /실기기에서 권한 요청, 광고 ID 조회, APK 설치가 끝까지 동작하는지는 추가 확인이 필요합니다/,
);
assert.doesNotMatch(
  listing,
  /\/api\/(?:github\/)?projects|프로젝트 정보를 불러오는 중/,
);
assert.doesNotMatch(
  read("projects/trademark-search-spa"),
  /href="(?:\s*|undefined|null)"|>GitHub<|>데모 보기/,
);
assert.doesNotMatch(read("projects/rn-webbridge"), />데모 보기/);
assert.match(read("projects/dashboard"), /Emissions Dashboard/);

const manifest = JSON.parse(
  fs.readFileSync(".next/prerender-manifest.json", "utf8"),
);
for (const id of projectIds)
  assert.ok(manifest.routes[`/projects/${id}`], `SSG /projects/${id}`);
assert.equal(manifest.dynamicRoutes["/projects/[id]"].fallback, false);
assert.equal(manifest.dynamicRoutes["/case-studies/[slug]"], undefined);
assert.ok(
  Object.keys(manifest.routes).every(
    (route) => !route.startsWith("/case-studies"),
  ),
  "legacy case studies must not generate static article bodies",
);
const pagesManifest = JSON.parse(
  fs.readFileSync(".next/server/pages-manifest.json", "utf8"),
);
assert.ok(
  pagesManifest["/case-studies/[slug]"],
  "legacy article redirect route exists",
);
const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith(".html")) htmlFiles.push(file);
  }
}
walk(root);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  assert.match(html, /<title\b[^>]*>[^<]+<\/title>/, file);
  assert.match(html, /<meta name="description" content="[^"]+"/, file);
  assert.equal(
    (html.match(/name="description"/g) ?? []).length,
    1,
    `single description ${file}`,
  );
  assert.match(html, /<link rel="canonical" href="https?:\/\/[^"?]+"/, file);
  assert.equal(
    (html.match(/rel="canonical"/g) ?? []).length,
    1,
    `single canonical ${file}`,
  );
  assert.doesNotMatch(html, /<a\b[^>]*>\s*<button\b/, file);
  assert.doesNotMatch(
    html,
    /H\.Point|@hpoint|polycube-platform|OCB|[a-f0-9]{40}/,
    file,
  );
}
const contact = read("contact");
for (const id of ["contact-name", "contact-email", "contact-message"]) {
  assert.ok(contact.includes(`for="${id}"`));
  assert.ok(contact.includes(`id="${id}"`));
}
assert.match(contact, /role="status"/);
assert.match(contact, /aria-live="polite"/);
console.log(
  `Static HTML checks passed: ${htmlFiles.length} pages; CMS article links, legacy redirect route, selected/archive, SSG, metadata, contact semantics.`,
);

const bridgeDetail = read("projects/reward-pocket");
assert.match(bridgeDetail, /Reward Pocket/);
assert.match(bridgeDetail, /demos\/reward-pocket\/index.html\?host=1/);
const demoHtml = fs.readFileSync("public/demos/reward-pocket/index.html", "utf8");
assert.match(demoHtml, /src="\/demos\/reward-pocket\/assets\//);
console.log("Bridge demo entry and portfolio links verified.");

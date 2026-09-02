import assert from "node:assert/strict";
import test from "node:test";
import { isActiveNavigationItem, navigationItems } from "../lib/navigation.ts";

test("matches the home route exactly and nested sections by prefix", () => {
  assert.equal(isActiveNavigationItem("/", "/"), true);
  assert.equal(isActiveNavigationItem("/projects/demo", "/"), false);
  assert.equal(isActiveNavigationItem("/blog/post-1", "/blog"), true);
  assert.equal(isActiveNavigationItem("/contact", "/blog"), false);
  assert.equal(isActiveNavigationItem("/case-studies/native-ad-lifecycle-config?from=home#scope", "/case-studies"), true);
  assert.equal(isActiveNavigationItem("/projects?view=selected", "/projects"), true);
  assert.equal(isActiveNavigationItem("/projects-old", "/projects"), false);
});

test("writing unifies case studies and blog posts under one navigation item", () => {
  assert.deepEqual(navigationItems.map(({ label }) => label), ["홈", "경력", "개인 프로젝트", "글"]);
  assert.equal(isActiveNavigationItem("/case-studies/api-request-sharing-cache?from=home#scope", "/blog"), true);
  assert.equal(isActiveNavigationItem("/case-studies", "/blog"), true);
  assert.equal(isActiveNavigationItem("/case-studies-old", "/blog"), false);
});

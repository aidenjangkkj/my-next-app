import assert from "node:assert/strict";
import test from "node:test";
import { isActiveNavigationItem } from "../lib/navigation.ts";

test("matches the home route exactly and nested sections by prefix", () => {
  assert.equal(isActiveNavigationItem("/", "/"), true);
  assert.equal(isActiveNavigationItem("/projects/demo", "/"), false);
  assert.equal(isActiveNavigationItem("/blog/post-1", "/blog"), true);
  assert.equal(isActiveNavigationItem("/contact", "/blog"), false);
});

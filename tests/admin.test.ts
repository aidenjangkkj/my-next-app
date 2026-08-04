import assert from "node:assert/strict";
import test from "node:test";
import { getAdminAccessState } from "../lib/admin.ts";

test("reports each administrator access state predictably", () => {
  assert.equal(getAdminAccessState(true, false, false), "checking");
  assert.equal(getAdminAccessState(false, false, false), "signed-out");
  assert.equal(getAdminAccessState(false, true, false), "forbidden");
  assert.equal(getAdminAccessState(false, true, true), "allowed");
});

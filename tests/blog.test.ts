import assert from "node:assert/strict";
import test from "node:test";
import {
  createExcerpt,
  fromDateTimeLocal,
  mapBlogPost,
  sortBlogPosts,
  toDateTimeLocal,
  validatePostInput,
} from "../lib/blog.ts";

const timestamp = (value: string) => ({ toDate: () => new Date(value) });

test("maps a legacy post with optional dates", () => {
  assert.deepEqual(
    mapBlogPost("post-1", {
      title: "  제목  ",
      content: "본문",
      createdAt: timestamp("2026-08-01T03:00:00.000Z"),
    }),
    {
      id: "post-1",
      title: "제목",
      content: "본문",
      createdAt: "2026-08-01T03:00:00.000Z",
      updatedAt: null,
    },
  );
});

test("sorts missing publication dates last", () => {
  const posts = [
    { id: "none", title: "없음", content: "", createdAt: null, updatedAt: null },
    { id: "old", title: "과거", content: "", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: null },
    { id: "new", title: "최근", content: "", createdAt: "2026-08-01T00:00:00.000Z", updatedAt: null },
  ];
  assert.deepEqual(sortBlogPosts(posts).map(({ id }) => id), ["new", "old", "none"]);
});

test("validates title, content, and publication date", () => {
  assert.equal(validatePostInput({ title: " ", content: "본문", createdAt: "2026-08-01T12:00" }), "제목을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: " ", createdAt: "2026-08-01T12:00" }), "내용을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: "본문", createdAt: "invalid" }), "올바른 작성일을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: "본문", createdAt: "2026-08-01T12:00" }), null);
});

test("round-trips a local datetime value", () => {
  const date = new Date(2026, 7, 1, 12, 30);
  assert.equal(toDateTimeLocal(date), "2026-08-01T12:30");
  assert.equal(fromDateTimeLocal("2026-08-01T12:30")?.getTime(), date.getTime());
});

test("creates a plain-text excerpt", () => {
  assert.equal(createExcerpt("# 제목\n\n**강조된 본문**입니다.", 12), "제목 강조된 본문입니다…");
});

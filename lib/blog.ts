export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PostFormValues {
  title: string;
  content: string;
  createdAt: string;
}

type TimestampLike = { toDate: () => Date };

function toIsoString(value: unknown) {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const date = (value as TimestampLike).toDate();
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function mapBlogPost(
  id: string,
  data: Record<string, unknown>,
): BlogPost {
  return {
    id,
    title:
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : "제목 없음",
    content: typeof data.content === "string" ? data.content : "",
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export function sortBlogPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    if (!a.createdAt) return b.createdAt ? 1 : 0;
    if (!b.createdAt) return -1;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function validatePostInput(values: PostFormValues) {
  if (!values.title.trim()) return "제목을 입력해 주세요.";
  if (!values.content.trim()) return "내용을 입력해 주세요.";
  if (!fromDateTimeLocal(values.createdAt)) {
    return "올바른 작성일을 입력해 주세요.";
  }
  return null;
}

export function toDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocal(value: string) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? date : null;
}

export function createExcerpt(markdown: string, maxLength = 120) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`#>*_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength).trim()}…`
    : plainText;
}

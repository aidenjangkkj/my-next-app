import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { doc, getDoc } from "firebase/firestore";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Navigation from "@/components/Navigation";
import { createExcerpt, mapBlogPost, type BlogPost } from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import "../../app/globals.css";

interface BlogPostPageProps {
  post: BlogPost | null;
  error: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
});

export default function BlogPostPage({ post, error }: BlogPostPageProps) {
  const description = post
    ? createExcerpt(post.content, 150) || post.title
    : "기술 블로그 게시글";

  return (
    <div>
      <Head>
        <title>{post ? `${post.title} · 기술 블로그` : "기술 블로그"}</title>
        <meta name="description" content={description} />
      </Head>
      <Navigation />
      <main className="min-h-screen bg-white px-6 pb-20 pt-28 text-gray-900">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="rounded-sm text-sm font-semibold text-indigo-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
          >
            ← 기술 블로그 목록
          </Link>

          {error || !post ? (
            <div className="mt-10 rounded-xl bg-red-50 p-6 text-red-700" role="alert">
              <p className="font-semibold">게시글을 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm">{error ?? "잠시 후 다시 시도해 주세요."}</p>
            </div>
          ) : (
            <>
              <header className="mt-10 border-b border-gray-200 pb-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                  <time dateTime={post.createdAt ?? undefined}>
                    작성일: {post.createdAt
                      ? dateFormatter.format(new Date(post.createdAt))
                      : "작성일 미정"}
                  </time>
                  {post.updatedAt && (
                    <time dateTime={post.updatedAt}>
                      수정일: {dateFormatter.format(new Date(post.updatedAt))}
                    </time>
                  )}
                </div>
              </header>

              <div className="mt-10">
                <MarkdownRenderer content={post.content} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<BlogPostPageProps> = async (
  context,
) => {
  const id = context.params?.id;
  if (typeof id !== "string") return { notFound: true };

  try {
    const postSnapshot = await getDoc(doc(getFirebaseDb(), "posts", id));
    if (!postSnapshot.exists()) return { notFound: true };

    return {
      props: {
        post: mapBlogPost(postSnapshot.id, postSnapshot.data()),
        error: null,
      },
    };
  } catch (error) {
    console.error("공개 블로그 게시글을 불러오는 중 오류 발생:", error);
    context.res.statusCode = 503;
    return {
      props: {
        post: null,
        error: "잠시 후 다시 시도해 주세요.",
      },
    };
  }
};

import Seo from "@/components/Seo";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { doc, getDoc } from "firebase/firestore";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  createExcerpt,
  formatBlogDateTime,
  mapBlogPost,
  type BlogPost,
} from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import { getCaseStudyByPostId } from "@/data/caseStudies";
import { experienceProjects } from "@/data/experience";

interface BlogPostPageProps {
  post: BlogPost | null;
  error: string | null;
}

export default function BlogPostPage({ post, error }: BlogPostPageProps) {
  const study = getCaseStudyByPostId(post?.id);
  const description = post
    ? createExcerpt(post.content, 150) || post.title
    : "기술 블로그 게시글";

  return (
    <div>
      <Seo
        title={
          post
            ? `${post.title} | 장석환 Frontend Developer`
            : "글을 불러오지 못했습니다 | 장석환"
        }
        description={description}
        path={post ? `/blog/${encodeURIComponent(post.id)}` : "/blog"}
        noindex={Boolean(error)}
        article
      />
      <main className="min-h-screen bg-white px-6 pb-20 pt-16 text-gray-900">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="rounded-sm text-sm font-semibold text-indigo-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
          >
            ← 글 목록
          </Link>

          {error || !post ? (
            <div
              className="mt-10 rounded-xl bg-red-50 p-6 text-red-700"
              role="alert"
            >
              <p className="font-semibold">게시글을 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm">
                {error ?? "잠시 후 다시 시도해 주세요."}
              </p>
            </div>
          ) : (
            <>
              <header className="mt-10 border-b border-gray-200 pb-8">
                <p className="mb-4 text-sm font-semibold text-indigo-700">
                  {study ? "업무 사례" : "개발 기록"}
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                  <time dateTime={post.createdAt ?? undefined}>
                    작성일: {formatBlogDateTime(post.createdAt)}
                  </time>
                  {post.updatedAt && (
                    <time dateTime={post.updatedAt}>
                      수정일: {formatBlogDateTime(post.updatedAt)}
                    </time>
                  )}
                </div>
              </header>

              <div className="mt-10">
                <MarkdownRenderer content={post.content} />
              </div>
              {study && (
                <nav
                  className="mt-14 border-t border-slate-200 pt-8"
                  aria-label="관련 경력 프로젝트"
                >
                  <h2 className="text-lg font-semibold">관련 경력 프로젝트</h2>
                  <ul className="mt-4 space-y-3">
                    {experienceProjects
                      .filter((project) =>
                        study.relatedProjectIds.includes(project.id),
                      )
                      .map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/experience#${project.id}`}
                            className="text-link leading-7"
                          >
                            {project.title} <span aria-hidden="true">→</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </nav>
              )}
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

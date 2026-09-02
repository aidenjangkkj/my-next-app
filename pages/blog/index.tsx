import Seo from "@/components/Seo";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import {
  createExcerpt,
  mapBlogPost,
  sortBlogPosts,
  type BlogPost,
} from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import { getCaseStudyByPostId } from "@/data/caseStudies";

interface BlogPageProps {
  posts: BlogPost[];
  error: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

export default function Blog({ posts, error }: BlogPageProps) {
  return (
    <div>
      <Seo title="글 | 장석환 Frontend Developer" description="업무에서 해결한 문제와 검증 결과, 개발 과정에서 배운 기술을 함께 기록합니다." path="/blog" noindex={Boolean(error)} />
      <main className="page-shell pb-20 pt-16 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-gray-200 pb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Notes from building
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              문제를 해결하며 쓴 글
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              업무에서 내린 선택과 검증 결과, 개발하면서 배운 기술을 함께 기록합니다.
              업무 사례에는 적용 범위와 한계를, 개발 기록에는 개념과 구현 과정을 담았습니다.
            </p>
          </header>

          <ol className="divide-y divide-gray-200" aria-label="업무 사례와 개발 기록">
              {posts.map((post) => (
                <li key={`post-${post.id}`}>
                  <article className="py-9">
                    <p className="mb-2 text-sm font-semibold text-indigo-700">
                      {getCaseStudyByPostId(post.id) ? "업무 사례" : "개발 기록"}
                    </p>
                    <time
                      dateTime={post.createdAt ?? undefined}
                      className="text-sm font-medium text-gray-500"
                    >
                      {post.createdAt
                        ? dateFormatter.format(new Date(post.createdAt))
                        : "작성일 미정"}
                    </time>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight">
                      <Link
                        href={`/blog/${post.id}`}
                        className="rounded-sm transition hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 leading-7 text-gray-600">
                      {createExcerpt(post.content) || "내용이 없습니다."}
                    </p>
                  </article>
                </li>
              ))}
          </ol>
          {error ? (
            <div className="mt-8 rounded-lg bg-red-50 p-6 text-red-700" role="alert">
              <p className="font-semibold">글 목록을 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">
              아직 등록된 글이 없습니다.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async (
  context,
) => {
  try {
    const snapshot = await getDocs(collection(getFirebaseDb(), "posts"));
    const posts = sortBlogPosts(
      snapshot.docs.map((postDocument) =>
        mapBlogPost(postDocument.id, postDocument.data()),
      ),
    );

    return { props: { posts, error: null } };
  } catch (error) {
    console.error("공개 블로그 목록을 불러오는 중 오류 발생:", error);
    context.res.statusCode = 503;
    return {
      props: {
        posts: [],
        error: "잠시 후 다시 시도해 주세요.",
      },
    };
  }
};

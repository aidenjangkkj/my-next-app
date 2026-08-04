import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import {
  createExcerpt,
  mapBlogPost,
  sortBlogPosts,
  type BlogPost,
} from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import "../../app/globals.css";

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
      <Head>
        <title>기술 블로그 · 포트폴리오</title>
        <meta
          name="description"
          content="프로젝트에서 배운 기술과 문제 해결 과정을 기록하는 개인 기술 블로그입니다."
        />
      </Head>
      <Navigation />
      <main className="min-h-screen bg-gray-50 px-6 pb-20 pt-28 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-gray-200 pb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Notes from building
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              기술 블로그
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              포트폴리오 프로젝트를 만들며 만난 문제와 선택, 배운 기술을
              재사용할 수 있는 기록으로 남깁니다.
            </p>
          </header>

          {error ? (
            <div className="mt-10 rounded-xl bg-red-50 p-6 text-red-700" role="alert">
              <p className="font-semibold">블로그 글을 불러오지 못했습니다.</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
              아직 공개된 글이 없습니다.
            </div>
          ) : (
            <ol className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post.id}>
                  <article className="py-9">
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
          )}
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
